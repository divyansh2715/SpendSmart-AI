const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    note: { type: String, default: '' }
  },
  { _id: true }
);

const savingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
      maxlength: 100
    },
    category: {
      type: String,
      default: 'Emergency Fund'
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [500, 'Target amount must be at least 500']
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    monthlyCommitment: {
      type: Number,
      default: 5000,
      min: 100
    },
    targetDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active'
    },
    contributions: {
      type: [contributionSchema],
      default: []
    }
  },
  { timestamps: true }
);

savingsGoalSchema.index({ userId: 1, status: 1 }, { name: 'idx_goal_user_status' });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
