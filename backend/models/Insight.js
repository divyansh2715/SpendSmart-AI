const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId ObjectId reference is required'],
      index: true
    },
    relatedTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null
    },
    relatedBudgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      default: null
    },
    month: {
      type: String,
      required: [true, 'Month (YYYY-MM) is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must follow YYYY-MM format']
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ['anomaly', 'saving_suggestion', 'budget_alert', 'ml_forecast'],
        message: 'Invalid insight type'
      }
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical', 'positive'],
      default: 'info'
    },
    category: {
      type: String,
      default: 'General'
    },
    title: {
      type: String,
      required: [true, 'Insight title is required'],
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: [true, 'Insight description is required'],
      trim: true,
      maxlength: 500
    },
    potentialSavings: {
      type: Number,
      default: 0,
      min: 0
    },
    predictedAmount: {
      type: Number,
      default: null
    },
    isResolved: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// Compound index for fast retrieval of insights by user, month, and type
insightSchema.index({ userId: 1, month: -1, type: 1 }, { name: 'idx_insight_user_month_type' });

module.exports = mongoose.model('Insight', insightSchema);
