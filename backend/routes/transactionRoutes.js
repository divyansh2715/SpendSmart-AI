const express = require('express');
const Transaction = require('../models/Transaction');
const Insight = require('../models/Insight');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions
router.get('/', protect, async (req, res, next) => {
  try {
    const { search, type, category, paymentMethod, month, startDate, endDate, sortBy } = req.query;
    const filter = { userId: req.user._id };

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;
    if (paymentMethod && paymentMethod !== 'all') filter.paymentMethod = paymentMethod;
    if (month && month !== 'all') filter.month = month;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { notes: regex }, { category: regex }];
    }

    let sortOption = { date: -1, createdAt: -1 };
    if (sortBy === 'date_asc') sortOption = { date: 1 };
    if (sortBy === 'amount_desc') sortOption = { amount: -1 };
    if (sortBy === 'amount_asc') sortOption = { amount: 1 };

    const transactions = await Transaction.find(filter).sort(sortOption);
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions/import-csv - Bulk CSV import with validation
router.post('/import-csv', protect, async (req, res, next) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No CSV rows provided for import.' });
    }

    const validDocs = [];
    const errors = [];

    rows.forEach((row, index) => {
      const amt = Number(row.amount);
      const txDate = new Date(row.date);
      if (!row.title || !row.title.trim()) {
        errors.push({ row: index + 1, reason: 'Missing title' });
      } else if (isNaN(amt) || amt <= 0) {
        errors.push({ row: index + 1, reason: 'Amount must be a positive number' });
      } else if (isNaN(txDate.getTime())) {
        errors.push({ row: index + 1, reason: 'Invalid date format (use YYYY-MM-DD)' });
      } else if (!['income', 'expense'].includes((row.type || '').toLowerCase())) {
        errors.push({ row: index + 1, reason: 'Type must be income or expense' });
      } else {
        validDocs.push({
          userId: req.user._id,
          title: row.title.trim(),
          amount: amt,
          type: row.type.toLowerCase(),
          category: row.category || 'Others',
          paymentMethod: row.paymentMethod || 'UPI',
          date: txDate,
          month: txDate.toISOString().slice(0, 7),
          notes: row.notes || 'Imported via CSV'
        });
      }
    });

    const inserted = validDocs.length > 0 ? await Transaction.insertMany(validDocs) : [];
    res.status(201).json({
      success: true,
      importedCount: inserted.length,
      rejectedCount: errors.length,
      errors,
      data: inserted
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, amount, type, category, paymentMethod, date, notes, attachmentName, isRecurring } = req.body;
    const txDate = date ? new Date(date) : new Date();
    const monthStr = txDate.toISOString().slice(0, 7);

    const transaction = await Transaction.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      type,
      category,
      paymentMethod: paymentMethod || 'UPI',
      date: txDate,
      month: monthStr,
      notes: notes || '',
      attachmentName: attachmentName || '',
      isRecurring: Boolean(isRecurring)
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
});

// PUT /api/transactions/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const updatePayload = { ...req.body };
    if (updatePayload.date) {
      const d = new Date(updatePayload.date);
      if (!isNaN(d.getTime())) updatePayload.month = d.toISOString().slice(0, 7);
    }
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updatePayload,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    await Insight.deleteMany({ relatedTransactionId: transaction._id, userId: req.user._id });
    res.json({ success: true, message: 'Transaction deleted', deletedId: transaction._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
