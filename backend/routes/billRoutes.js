const express = require('express');
const BillReminder = require('../models/BillReminder');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/bills
router.get('/', protect, async (req, res, next) => {
  try {
    const bills = await BillReminder.find({ userId: req.user._id }).sort({ dueDate: 1 });
    res.json({ success: true, count: bills.length, data: bills });
  } catch (err) {
    next(err);
  }
});

// POST /api/bills
router.post('/', protect, async (req, res, next) => {
  try {
    const bill = await BillReminder.create({
      ...req.body,
      userId: req.user._id,
      amount: Number(req.body.amount)
    });
    res.status(201).json({ success: true, data: bill });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bills/:id/pay - Mark bill paid & record transaction in MongoDB
router.patch('/:id/pay', protect, async (req, res, next) => {
  try {
    const bill = await BillReminder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bill) return res.status(404).json({ success: false, message: 'Bill reminder not found' });

    if (bill.status === 'paid') {
      bill.status = 'pending';
      bill.paidAt = null;
      await bill.save();
      return res.json({ success: true, data: bill });
    }

    const payDate = new Date();
    const tx = await Transaction.create({
      userId: req.user._id,
      title: `Bill Paid: ${bill.title}`,
      amount: bill.amount,
      type: 'expense',
      category: bill.category || 'Utilities & Bills',
      paymentMethod: bill.paymentMethod || 'UPI',
      date: payDate,
      month: payDate.toISOString().slice(0, 7),
      isRecurring: Boolean(bill.isRecurringBill),
      notes: `Paid bill due on ${bill.dueDate}`
    });

    bill.status = 'paid';
    bill.paidAt = payDate;
    bill.paidTransactionId = tx._id;
    await bill.save();

    res.json({ success: true, data: bill, recordedTransaction: tx });
  } catch (err) {
    next(err);
  }
});

// PUT /api/bills/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const updated = await BillReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Bill reminder not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bills/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const deleted = await BillReminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Bill reminder not found' });
    res.json({ success: true, deletedId: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
