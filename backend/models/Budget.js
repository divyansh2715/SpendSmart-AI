const mongoose = require('mongoose');

const categoryLimitSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category name is required']
    },
    limit: {
      type: Number,
      required: [true, 'Category limit amount is required'],
      min: [100, 'Category budget limit must be at least 100']
    },
    alertThresholdPct: {
      type: Number,
      default: 80,
      min: 50,
      max: 100
    }
  },
  { _id: false }
);

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId ObjectId reference is required'],
      index: true
    },
    month: {
      type: String,
      required: [true, 'Budget month (YYYY-MM) is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
    },
    overallLimit: {
      type: Number,
      required: [true, 'Overall monthly budget limit is required'],
      min: [1000, 'Overall monthly limit must be at least 1000']
    },
    alertThresholdPct: {
      type: Number,
      default: 80,
      min: [50, 'Alert threshold must be at least 50%'],
      max: [100, 'Alert threshold cannot exceed 100%']
    },
    categoryLimits: {
      type: [categoryLimitSchema],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'At least one category budget limit must be defined'
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 250,
      default: ''
    }
  },
  { timestamps: true }
);

// Unique compound index ensuring one budget document per user per month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true, name: 'idx_user_month_unique' });

module.exports = mongoose.model('Budget', budgetSchema);
