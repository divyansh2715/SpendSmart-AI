const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'spendsmart_ai_jwt_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// POST /api/auth/register - Create new User in 'users' collection
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, currency, monthlyIncomeTarget, savingsGoalPct } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      currency: currency || 'INR',
      monthlyIncomeTarget: Number(monthlyIncomeTarget) || 90000,
      savingsGoalPct: Number(savingsGoalPct) || 25
    });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyIncomeTarget: user.monthlyIncomeTarget,
        savingsGoalPct: user.savingsGoalPct,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login - Authenticate User with bcrypt & issue JWT
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyIncomeTarget: user.monthlyIncomeTarget,
        savingsGoalPct: user.savingsGoalPct
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - Read current authenticated User profile
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/profile - Update User profile settings
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, currency, monthlyIncomeTarget, savingsGoalPct } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, currency, monthlyIncomeTarget, savingsGoalPct },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
