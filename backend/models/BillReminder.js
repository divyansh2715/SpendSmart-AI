const mongoose = require('mongoose');

const billReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Bill title is required'],
      trim: true,
      maxlength: 120
    },
    category: {
      type: String,
      required: true,
      default: 'Utilities & Bills'
    },
    amount: {
      type: Number,
      required: [true, 'Bill amount is required'],
      min: [1, 'Bill amount must be positive']
    },
    dueDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Due date is required']
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'],
      default: 'UPI'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    isRecurringBill: {
      type: Boolean,
      default: true
    },
    paidAt: {
      type: Date,
      default: null
    },
    paidTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

billReminderSchema.index({ userId: 1, status: 1, dueDate: 1 }, { name: 'idx_bill_user_status_due' });

module.exports = mongoose.model('BillReminder', billReminderSchema);
