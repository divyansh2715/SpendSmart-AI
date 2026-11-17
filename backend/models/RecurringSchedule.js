const mongoose = require('mongoose');

const recurringScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Schedule title is required'],
      trim: true,
      maxlength: 120
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be positive']
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense'
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'],
      default: 'UPI'
    },
    frequency: {
      type: String,
      enum: ['monthly', 'weekly', 'yearly'],
      default: 'monthly'
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
      default: 5
    },
    nextDueDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active'
    },
    autoGenerate: {
      type: Boolean,
      default: true
    },
    lastGeneratedDate: {
      type: String,
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

recurringScheduleSchema.index({ userId: 1, status: 1, nextDueDate: 1 }, { name: 'idx_recurring_user_status_due' });

module.exports = mongoose.model('RecurringSchedule', recurringScheduleSchema);
