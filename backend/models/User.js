const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP'],
      default: 'INR'
    },
    monthlyIncomeTarget: {
      type: Number,
      default: 90000,
      min: [0, 'Monthly income target cannot be negative']
    },
    savingsGoalPct: {
      type: Number,
      default: 25,
      min: [0, 'Savings goal percentage cannot be below 0'],
      max: [90, 'Savings goal percentage cannot exceed 90']
    },
    customCategories: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, name: 'idx_user_email_unique' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
