const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Insight = require('../models/Insight');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * PIPELINE 1: Monthly Income, Expense & Net Savings Trend
 * Stages used: $match, $group, $sum, $project, $sort
 */
router.get('/pipeline/monthly-cashflow', protect, async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const pipeline = [
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$month',
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          txCount: { $sum: 1 },
          avgTransaction: { $avg: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          totalIncome: 1,
          totalExpense: 1,
          netSavings: { $subtract: ['$totalIncome', '$totalExpense'] },
          savingsRatePct: {
            $cond: [
              { $gt: ['$totalIncome', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: [{ $subtract: ['$totalIncome', '$totalExpense'] }, '$totalIncome'] },
                      100
                    ]
                  },
                  1
                ]
              },
              0
            ]
          },
          txCount: 1,
          avgTransaction: { $round: ['$avgTransaction', 0] }
        }
      },
      { $sort: { month: 1 } }
    ];

    const results = await Transaction.aggregate(pipeline);
    res.json({
      success: true,
      pipelineName: 'Monthly Cashflow & Savings Aggregation',
      operatorsUsed: ['$match', '$group', '$sum', '$project', '$sort'],
      pipelineQuery: pipeline,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PIPELINE 2: Category Spend vs. Budget Limit Comparison using $lookup and $unwind
 * Stages used: $match, $group, $sum, $lookup, $unwind, $project, $sort
 */
router.get('/pipeline/category-vs-budget', protect, async (req, res, next) => {
  try {
    const month = req.query.month || '2026-11';
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    const pipeline = [
      {
        $match: {
          userId: userObjectId,
          month,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: { category: '$category', userId: '$userId', month: '$month' },
          actualSpent: { $sum: '$amount' },
          txCount: { $sum: 1 },
          maxSingleTx: { $max: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'budgets',
          let: { uId: '$_id.userId', mStr: '$_id.month' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$userId', '$$uId'] }, { $eq: ['$month', '$$mStr'] }]
                }
              }
            }
          ],
          as: 'budgetDoc'
        }
      },
      { $unwind: { path: '$budgetDoc', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$budgetDoc.categoryLimits', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ['$budgetDoc.categoryLimits.category', '$_id.category'] },
              { $eq: [{ $ifNull: ['$budgetDoc.categoryLimits', null] }, null] }
            ]
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          month: '$_id.month',
          actualSpent: 1,
          txCount: 1,
          maxSingleTx: 1,
          budgetLimit: { $ifNull: ['$budgetDoc.categoryLimits.limit', 5000] },
          utilizationPct: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      '$actualSpent',
                      { $ifNull: ['$budgetDoc.categoryLimits.limit', 5000] }
                    ]
                  },
                  100
                ]
              },
              1
            ]
          }
        }
      },
      { $sort: { actualSpent: -1 } }
    ];

    const results = await Transaction.aggregate(pipeline);
    res.json({
      success: true,
      pipelineName: 'Category Spend Joined with Budget Limits ($lookup + $unwind)',
      operatorsUsed: ['$match', '$group', '$sum', '$lookup', '$unwind', '$project', '$sort'],
      pipelineQuery: pipeline,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PIPELINE 3: Anomaly Insights Joined with Source Transactions & User Profile ($lookup + $unwind)
 * Stages used: $match, $lookup, $unwind, $project, $sort
 */
router.get('/pipeline/anomaly-audit', protect, async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const pipeline = [
      {
        $match: {
          userId: userObjectId,
          type: 'anomaly'
        }
      },
      {
        $lookup: {
          from: 'transactions',
          localField: 'relatedTransactionId',
          foreignField: '_id',
          as: 'sourceTransaction'
        }
      },
      { $unwind: { path: '$sourceTransaction', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'ownerProfile'
        }
      },
      { $unwind: { path: '$ownerProfile', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          insightTitle: '$title',
          severity: 1,
          month: 1,
          potentialSavings: 1,
          transactionTitle: '$sourceTransaction.title',
          transactionAmount: '$sourceTransaction.amount',
          transactionCategory: '$sourceTransaction.category',
          paymentMethod: '$sourceTransaction.paymentMethod',
          transactionDate: '$sourceTransaction.date',
          userName: '$ownerProfile.name',
          userEmail: '$ownerProfile.email'
        }
      },
      { $sort: { transactionAmount: -1 } }
    ];

    const results = await Insight.aggregate(pipeline);
    res.json({
      success: true,
      pipelineName: 'Cross-Collection Anomaly Audit (insights -> transactions -> users)',
      operatorsUsed: ['$match', '$lookup', '$unwind', '$project', '$sort'],
      pipelineQuery: pipeline,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PIPELINE 4: Payment Mode & Recurring Cost Structure Analysis
 * Stages used: $match, $group, $sum, $avg, $max, $project, $sort
 */
router.get('/pipeline/payment-methods', protect, async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const pipeline = [
      {
        $match: {
          userId: userObjectId,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          totalSpend: { $sum: '$amount' },
          avgSpend: { $avg: '$amount' },
          maxSpend: { $max: '$amount' },
          txCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$_id',
          totalSpend: 1,
          avgSpend: { $round: ['$avgSpend', 0] },
          maxSpend: 1,
          txCount: 1
        }
      },
      { $sort: { totalSpend: -1 } }
    ];

    const results = await Transaction.aggregate(pipeline);
    res.json({
      success: true,
      pipelineName: 'Payment Method Velocity & Ticket Size Analysis',
      operatorsUsed: ['$match', '$group', '$sum', '$avg', '$max', '$project', '$sort'],
      pipelineQuery: pipeline,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PIPELINE 5: User 360° Financial Health Rollup across all 4 Collections
 * Stages used: $match, $lookup, $unwind, $group, $sum, $project, $sort
 */
router.get('/pipeline/user-360-rollup', protect, async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const pipeline = [
      { $match: { _id: userObjectId } },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'userId',
          as: 'allTransactions'
        }
      },
      {
        $lookup: {
          from: 'budgets',
          localField: '_id',
          foreignField: 'userId',
          as: 'allBudgets'
        }
      },
      {
        $lookup: {
          from: 'insights',
          localField: '_id',
          foreignField: 'userId',
          as: 'allInsights'
        }
      },
      { $unwind: { path: '$allTransactions', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          currency: { $first: '$currency' },
          lifetimeIncome: {
            $sum: {
              $cond: [{ $eq: ['$allTransactions.type', 'income'] }, '$allTransactions.amount', 0]
            }
          },
          lifetimeExpense: {
            $sum: {
              $cond: [{ $eq: ['$allTransactions.type', 'expense'] }, '$allTransactions.amount', 0]
            }
          },
          totalTransactions: { $sum: 1 },
          budgetsConfiguredCount: { $first: { $size: '$allBudgets' } },
          activeInsightsCount: { $first: { $size: '$allInsights' } }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          currency: 1,
          lifetimeIncome: 1,
          lifetimeExpense: 1,
          lifetimeNetSavings: { $subtract: ['$lifetimeIncome', '$lifetimeExpense'] },
          totalTransactions: 1,
          budgetsConfiguredCount: 1,
          activeInsightsCount: 1
        }
      },
      { $sort: { lifetimeNetSavings: -1 } }
    ];

    const results = await User.aggregate(pipeline);
    res.json({
      success: true,
      pipelineName: 'User 360° Multi-Collection Rollup (users + transactions + budgets + insights)',
      operatorsUsed: ['$match', '$lookup', '$unwind', '$group', '$sum', '$project', '$sort'],
      pipelineQuery: pipeline,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * INDEXING DEMONSTRATION ENDPOINT: Runs .explain("executionStats") on indexed query
 */
router.get('/indexes/explain', protect, async (req, res, next) => {
  try {
    const userIndexes = await User.collection.indexes();
    const txIndexes = await Transaction.collection.indexes();
    const budgetIndexes = await Budget.collection.indexes();
    const insightIndexes = await Insight.collection.indexes();

    const explainResult = await Transaction.find({
      userId: req.user._id,
      type: 'expense'
    })
      .sort({ date: -1 })
      .explain('executionStats');

    res.json({
      success: true,
      collectionsIndexes: {
        users: userIndexes,
        transactions: txIndexes,
        budgets: budgetIndexes,
        insights: insightIndexes
      },
      sampleQueryExecutionStats: explainResult.executionStats || explainResult
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
