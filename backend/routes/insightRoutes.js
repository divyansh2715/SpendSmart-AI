const express = require('express');
const Insight = require('../models/Insight');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/insights - List user insights with populated Transaction and Budget references
router.get('/', protect, async (req, res, next) => {
  try {
    const { month, type, isResolved } = req.query;
    const filter = { userId: req.user._id };
    if (month && month !== 'all') filter.month = month;
    if (type && type !== 'all') filter.type = type;
    if (isResolved !== undefined) filter.isResolved = isResolved === 'true';

    const insights = await Insight.find(filter)
      .populate('relatedTransactionId', 'title amount category date paymentMethod')
      .populate('relatedBudgetId', 'month overallLimit alertThresholdPct')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/insights - Create a custom or AI-generated insight document
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      relatedTransactionId,
      relatedBudgetId,
      month,
      type,
      severity,
      category,
      title,
      description,
      potentialSavings,
      predictedAmount,
      metadata
    } = req.body;

    const insight = await Insight.create({
      userId: req.user._id,
      relatedTransactionId: relatedTransactionId || null,
      relatedBudgetId: relatedBudgetId || null,
      month: month || new Date().toISOString().slice(0, 7),
      type,
      severity: severity || 'info',
      category: category || 'General',
      title,
      description,
      potentialSavings: Number(potentialSavings) || 0,
      predictedAmount: predictedAmount ? Number(predictedAmount) : null,
      metadata: metadata || {}
    });

    res.status(201).json({ success: true, data: insight });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/insights/:id/resolve - Toggle resolved status on an insight
router.patch('/:id/resolve', protect, async (req, res, next) => {
  try {
    const insight = await Insight.findOne({ _id: req.params.id, userId: req.user._id });
    if (!insight) {
      return res.status(404).json({ success: false, message: 'Insight not found' });
    }
    insight.isResolved = !insight.isResolved;
    await insight.save();
    res.json({ success: true, data: insight });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/insights/:id - Delete an insight document
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deleted = await Insight.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Insight not found' });
    }
    res.json({ success: true, message: 'Insight deleted', deletedId: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
