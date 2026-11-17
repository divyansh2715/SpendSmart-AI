const express = require('express');
const SavingsGoal = require('../models/SavingsGoal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/goals
router.get('/', protect, async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    next(err);
  }
});

// POST /api/goals
router.post('/', protect, async (req, res, next) => {
  try {
    const goal = await SavingsGoal.create({
      ...req.body,
      userId: req.user._id,
      targetAmount: Number(req.body.targetAmount),
      currentAmount: Number(req.body.currentAmount) || 0,
      monthlyCommitment: Number(req.body.monthlyCommitment) || 5000
    });
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
});

// POST /api/goals/:id/contribute - Add contribution to savings goal
router.post('/:id/contribute', protect, async (req, res, next) => {
  try {
    const { amount, date, note } = req.body;
    const goal = await SavingsGoal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ success: false, message: 'Savings goal not found' });

    const contribAmount = Number(amount);
    goal.currentAmount += contribAmount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    goal.contributions.push({
      amount: contribAmount,
      date: date || new Date().toISOString().slice(0, 10),
      note: note || 'Goal contribution'
    });

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
});

// PUT /api/goals/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const updated = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Savings goal not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/goals/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deleted = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Savings goal not found' });
    res.json({ success: true, deletedId: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
