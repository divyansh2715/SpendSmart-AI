const express = require('express');
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Insight = require('../models/Insight');
const { protect } = require('../middleware/auth');

const router = express.Router();

const DEFAULT_CATEGORY_LIMITS = [
  { category: 'Housing & Rent', limit: 18000, alertThresholdPct: 80 },
  { category: 'Food & Dining', limit: 7000, alertThresholdPct: 80 },
  { category: 'Groceries', limit: 6500, alertThresholdPct: 80 },
  { category: 'Transportation', limit: 5000, alertThresholdPct: 80 },
  { category: 'Utilities & Bills', limit: 4500, alertThresholdPct: 80 },
  { category: 'Shopping', limit: 6000, alertThresholdPct: 80 },
  { category: 'Entertainment', limit: 3000, alertThresholdPct: 80 },
  { category: 'Healthcare', limit: 3000, alertThresholdPct: 80 },
  { category: 'Education', limit: 3000, alertThresholdPct: 80 }
];

// GET /api/budgets - List all monthly budgets for the authenticated user
router.get('/', protect, async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ month: -1 });
    res.json({ success: true, count: budgets.length, data: budgets });
  } catch (err) {
    next(err);
  }
});

// GET /api/budgets/:month - Get or initialize budget for YYYY-MM + live MongoDB spend comparison
router.get('/:month', protect, async (req, res, next) => {
  try {
    const { month } = req.params;
    let budget = await Budget.findOne({ userId: req.user._id, month });

    if (!budget) {
      budget = await Budget.create({
        userId: req.user._id,
        month,
        overallLimit: 52000,
        alertThresholdPct: 80,
        categoryLimits: DEFAULT_CATEGORY_LIMITS,
        notes: `Auto-initialized budget for ${month}`
      });
    }

    // Aggregate actual expenses for this user and month from 'transactions'
    const spendAgg = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          month,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
          txCount: { $sum: 1 }
        }
      }
    ]);

    const spendMap = {};
    let totalSpent = 0;
    spendAgg.forEach((row) => {
      spendMap[row._id] = row.spent;
      totalSpent += row.spent;
    });

    const overallPct = budget.overallLimit > 0 ? Number(((totalSpent / budget.overallLimit) * 100).toFixed(1)) : 0;
    const alerts = [];

    if (overallPct >= 100) {
      alerts.push({
        level: 'critical',
        scope: 'Overall Monthly Budget',
        spent: totalSpent,
        limit: budget.overallLimit,
        percentage: overallPct,
        message: `Overall monthly spending (₹${totalSpent.toLocaleString('en-IN')}) exceeded the ₹${budget.overallLimit.toLocaleString('en-IN')} limit!`
      });
    } else if (overallPct >= budget.alertThresholdPct) {
      alerts.push({
        level: 'warning',
        scope: 'Overall Monthly Budget',
        spent: totalSpent,
        limit: budget.overallLimit,
        percentage: overallPct,
        message: `Overall spending has reached ${overallPct}% of your monthly budget (Threshold: ${budget.alertThresholdPct}%).`
      });
    }

    const categoryBreakdown = budget.categoryLimits.map((item) => {
      const spent = spendMap[item.category] || 0;
      const pct = item.limit > 0 ? Number(((spent / item.limit) * 100).toFixed(1)) : 0;
      const threshold = item.alertThresholdPct || budget.alertThresholdPct;

      if (pct >= 100) {
        alerts.push({
          level: 'critical',
          scope: item.category,
          spent,
          limit: item.limit,
          percentage: pct,
          message: `${item.category} spending (₹${spent.toLocaleString('en-IN')}) exceeded its ₹${item.limit.toLocaleString('en-IN')} budget!`
        });
      } else if (pct >= threshold) {
        alerts.push({
          level: 'warning',
          scope: item.category,
          spent,
          limit: item.limit,
          percentage: pct,
          message: `${item.category} reached ${pct}% of its ₹${item.limit.toLocaleString('en-IN')} limit.`
        });
      }

      return {
        category: item.category,
        limit: item.limit,
        spent,
        remaining: Math.max(0, item.limit - spent),
        overrun: Math.max(0, spent - item.limit),
        percentage: pct,
        status: pct >= 100 ? 'exceeded' : pct >= threshold ? 'warning' : 'healthy'
      };
    });

    res.json({
      success: true,
      data: {
        budget,
        totalSpent,
        overallPercentage: overallPct,
        categoryBreakdown,
        alerts
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/budgets - Create or upsert a monthly budget document
router.post('/', protect, async (req, res, next) => {
  try {
    const { month, overallLimit, alertThresholdPct, categoryLimits, notes } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month },
      {
        userId: req.user._id,
        month,
        overallLimit: Number(overallLimit),
        alertThresholdPct: Number(alertThresholdPct) || 80,
        categoryLimits: categoryLimits || DEFAULT_CATEGORY_LIMITS,
        notes: notes || ''
      },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
});

// PUT /api/budgets/:month - Update overall limit, threshold, or specific category limits
router.put('/:month', protect, async (req, res, next) => {
  try {
    const { overallLimit, alertThresholdPct, categoryLimits, notes } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month: req.params.month },
      { overallLimit, alertThresholdPct, categoryLimits, notes },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/budgets/:id - Delete a budget document by ObjectId
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Budget document not found' });
    }
    res.json({ success: true, message: 'Budget deleted successfully', deletedId: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
