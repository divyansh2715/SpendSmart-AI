const express = require('express');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const BillReminder = require('../models/BillReminder');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/ai-assistant/ask - Answers user financial questions using actual MongoDB records
router.post('/ask', protect, async (req, res, next) => {
  try {
    const { question, month } = req.body;
    const targetMonth = month || '2026-11';
    const q = (question || '').toLowerCase();

    const [txs, budget, goals, bills] = await Promise.all([
      Transaction.find({ userId: req.user._id }).sort({ date: -1 }),
      Budget.findOne({ userId: req.user._id, month: targetMonth }),
      SavingsGoal.find({ userId: req.user._id }),
      BillReminder.find({ userId: req.user._id })
    ]);

    const monthTxs = txs.filter((t) => t.month === targetMonth);
    const monthIncome = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const monthExpense = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const catTotals = {};
    monthTxs.filter((t) => t.type === 'expense').forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

    let answer = '';
    if (q.includes('bill') || q.includes('due') || q.includes('pending')) {
      const pending = bills.filter((b) => b.status !== 'paid');
      const totalPending = pending.reduce((s, b) => s + b.amount, 0);
      answer = pending.length
        ? `You have ${pending.length} pending bill(s) totaling ₹${totalPending.toLocaleString('en-IN')}: ${pending
            .map((b) => `${b.title} (₹${b.amount.toLocaleString('en-IN')}, due ${b.dueDate})`)
            .join(', ')}.`
        : 'All your tracked bills are currently marked as paid!';
    } else if (q.includes('goal') || q.includes('target')) {
      answer = goals.length
        ? goals
            .map((g) => {
              const rem = Math.max(0, g.targetAmount - g.currentAmount);
              const mos = g.monthlyCommitment > 0 ? Math.ceil(rem / g.monthlyCommitment) : 0;
              return `${g.name}: ₹${g.currentAmount.toLocaleString('en-IN')} / ₹${g.targetAmount.toLocaleString('en-IN')} saved (${mos} months est. remaining).`;
            })
            .join(' | ')
        : 'You have not created any savings goals yet.';
    } else {
      const topCat = sortedCats[0] ? `${sortedCats[0][0]} (₹${sortedCats[0][1].toLocaleString('en-IN')})` : 'None';
      answer = `In ${targetMonth}, your recorded income is ₹${monthIncome.toLocaleString('en-IN')} and expenses are ₹${monthExpense.toLocaleString('en-IN')} (Net Savings: ₹${(
        monthIncome - monthExpense
      ).toLocaleString('en-IN')}). Your highest spending category is ${topCat}.`;
    }

    res.json({
      success: true,
      question,
      answer,
      recordsAnalyzed: {
        transactions: txs.length,
        goals: goals.length,
        bills: bills.length,
        hasBudget: Boolean(budget)
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
