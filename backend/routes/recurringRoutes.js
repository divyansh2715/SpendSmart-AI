const express = require('express');
const RecurringSchedule = require('../models/RecurringSchedule');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/recurring - List user's recurring schedules
router.get('/', protect, async (req, res, next) => {
  try {
    const schedules = await RecurringSchedule.find({ userId: req.user._id }).sort({ nextDueDate: 1 });
    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (err) {
    next(err);
  }
});

// POST /api/recurring - Create new recurring schedule
router.post('/', protect, async (req, res, next) => {
  try {
    const schedule = await RecurringSchedule.create({
      ...req.body,
      userId: req.user._id,
      amount: Number(req.body.amount)
    });
    res.status(201).json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
});

// PUT /api/recurring/:id - Edit recurring schedule
router.put('/:id', protect, async (req, res, next) => {
  try {
    const updated = await RecurringSchedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/recurring/:id/status - Pause, Resume, or Cancel recurring schedule
router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await RecurringSchedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/recurring/:id/generate - Automatically generate transaction for due schedule & advance nextDueDate
router.post('/:id/generate', protect, async (req, res, next) => {
  try {
    const schedule = await RecurringSchedule.findOne({ _id: req.params.id, userId: req.user._id });
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    const dueStr = schedule.nextDueDate || new Date().toISOString().slice(0, 10);
    const txDate = new Date(dueStr);

    const generatedTx = await Transaction.create({
      userId: req.user._id,
      title: `${schedule.title} (Auto-Recurring)`,
      amount: schedule.amount,
      type: schedule.type,
      category: schedule.category,
      paymentMethod: schedule.paymentMethod,
      date: txDate,
      month: dueStr.slice(0, 7),
      isRecurring: true,
      recurringScheduleId: schedule._id,
      notes: `Auto-generated from ${schedule.frequency} schedule`
    });

    // Advance nextDueDate
    const nextDate = new Date(txDate);
    if (schedule.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (schedule.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
    else nextDate.setMonth(nextDate.getMonth() + 1);

    schedule.lastGeneratedDate = dueStr;
    schedule.nextDueDate = nextDate.toISOString().slice(0, 10);
    await schedule.save();

    res.status(201).json({
      success: true,
      schedule,
      generatedTransaction: generatedTx
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recurring/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deleted = await RecurringSchedule.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.json({ success: true, deletedId: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
