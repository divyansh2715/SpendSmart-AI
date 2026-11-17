const mongoose = require('mongoose');

const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId ObjectId reference is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Transaction amount must be greater than 0']
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: PAYMENT_METHODS,
        message: 'Invalid payment method'
      },
      default: 'UPI'
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now
    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: ''
    },
    attachmentName: {
      type: String,
      trim: true,
      default: ''
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecurringSchedule',
      default: null
    }
  },
  { timestamps: true }
);

transactionSchema.pre('validate', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    if (!isNaN(d.getTime())) {
      this.month = d.toISOString().slice(0, 7);
    }
  }
  next();
});

transactionSchema.index({ userId: 1, date: -1 }, { name: 'idx_user_date_desc' });
transactionSchema.index({ userId: 1, month: 1, type: 1 }, { name: 'idx_user_month_type' });
transactionSchema.index({ userId: 1, type: 1, category: 1, date: -1 }, { name: 'idx_user_type_category_date' });
transactionSchema.index({ title: 'text', notes: 'text', category: 'text' }, { name: 'idx_tx_fulltext' });

module.exports = mongoose.model('Transaction', transactionSchema);
