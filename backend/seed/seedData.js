require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Insight = require('../models/Insight');
const RecurringSchedule = require('../models/RecurringSchedule');
const SavingsGoal = require('../models/SavingsGoal');
const BillReminder = require('../models/BillReminder');

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Transaction.deleteMany({}),
      Budget.deleteMany({}),
      Insight.deleteMany({}),
      RecurringSchedule.deleteMany({}),
      SavingsGoal.deleteMany({}),
      BillReminder.deleteMany({})
    ]);

    // 1. Create Demo User in 'users' collection
    const demoUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@spendsmart.ai',
      passwordHash: 'SpendSmart@123',
      currency: 'INR',
      monthlyIncomeTarget: 92000,
      savingsGoalPct: 25
    });

    // 2. Create 6 Months of Realistic Transactions in 'transactions' collection
    const rawTransactions = [
      // June 2026
      { title: 'Monthly Tech Corp Salary', amount: 88000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-06-01', isRecurring: true, notes: 'June salary credit' },
      { title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-06-03', isRecurring: true, notes: 'Monthly apartment rent' },
      { title: 'DMart Monthly Groceries', amount: 5200, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-06-06', isRecurring: true, notes: 'Household staples' },
      { title: 'Electricity & Fiber Internet', amount: 3400, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-06-10', isRecurring: true, notes: 'Utility bills' },
      { title: 'Petrol & Metro Recharge', amount: 3600, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-06-14', isRecurring: false, notes: 'Daily commute' },
      { title: 'Zomato & Weekend Cafe', amount: 4100, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-06-19', isRecurring: false, notes: 'Dining out' },
      { title: 'Myntra Summer Apparel', amount: 3200, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-06-23', isRecurring: false, notes: 'Clothing' },

      // July 2026
      { title: 'Monthly Tech Corp Salary', amount: 88000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-07-01', isRecurring: true, notes: 'July salary credit' },
      { title: 'UI/UX Freelance Sprint', amount: 14000, type: 'income', category: 'Freelance', paymentMethod: 'UPI', date: '2026-07-12', isRecurring: false, notes: 'Freelance client project' },
      { title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-07-03', isRecurring: true, notes: 'Monthly apartment rent' },
      { title: 'BigBasket & Fresh Produce', amount: 5500, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-07-07', isRecurring: true, notes: 'Groceries' },
      { title: 'AC Electricity Bill & Broadband', amount: 4200, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'Net Banking', date: '2026-07-11', isRecurring: true, notes: 'Summer electricity' },
      { title: 'Fuel & Cab Rides', amount: 3900, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-07-16', isRecurring: false, notes: 'Commute' },
      { title: 'Swiggy & Family Restaurant', amount: 4600, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-07-21', isRecurring: false, notes: 'Family dinner' },
      { title: 'Amazon Home Essentials', amount: 3800, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-07-25', isRecurring: false, notes: 'Kitchen appliances' },

      // August 2026
      { title: 'Monthly Tech Corp Salary', amount: 88000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-08-01', isRecurring: true, notes: 'August salary credit' },
      { title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-08-03', isRecurring: true, notes: 'Monthly apartment rent' },
      { title: 'Reliance Smart Groceries', amount: 5600, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-08-08', isRecurring: true, notes: 'Monthly groceries' },
      { title: 'Electricity, Gas & Mobile', amount: 3950, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-08-12', isRecurring: true, notes: 'Utility bills' },
      { title: 'Car Service & Fuel', amount: 4300, type: 'expense', category: 'Transportation', paymentMethod: 'Debit Card', date: '2026-08-17', isRecurring: false, notes: 'Routine maintenance' },
      { title: 'Dining Out & Coffee Shops', amount: 4900, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-08-22', isRecurring: false, notes: 'Weekend cafes' },
      { title: 'Rakhi Gifts & Ethnic Wear', amount: 4800, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-08-26', isRecurring: false, notes: 'Festival gifts' },

      // September 2026
      { title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-09-01', isRecurring: true, notes: 'September salary credit' },
      { title: 'Nifty 50 Index Dividend', amount: 4500, type: 'income', category: 'Investments', paymentMethod: 'Net Banking', date: '2026-09-10', isRecurring: false, notes: 'Quarterly dividend' },
      { title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-09-03', isRecurring: true, notes: 'Monthly apartment rent' },
      { title: 'Monthly Organic Groceries', amount: 5800, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-09-06', isRecurring: true, notes: 'Groceries' },
      { title: 'Power, Water & Broadband', amount: 3800, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-09-11', isRecurring: true, notes: 'Utility bills' },
      { title: 'Emergency Car Tyre Replacement', amount: 9400, type: 'expense', category: 'Transportation', paymentMethod: 'Credit Card', date: '2026-09-15', isRecurring: false, notes: 'Bridgestone tyres replacement (Anomaly)' },
      { title: 'Weekend Fine Dining & Zomato', amount: 5400, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-09-20', isRecurring: false, notes: 'Birthday dinner' },
      { title: 'Electronics & Ergonomic Mouse', amount: 4200, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-09-25', isRecurring: false, notes: 'Office accessories' },

      // October 2026
      { title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-10-01', isRecurring: true, notes: 'October salary credit' },
      { title: 'React Consulting Milestone', amount: 18000, type: 'income', category: 'Freelance', paymentMethod: 'Net Banking', date: '2026-10-14', isRecurring: false, notes: 'Frontend consulting' },
      { title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-10-03', isRecurring: true, notes: 'Monthly apartment rent' },
      { title: 'Supermarket & Dry Fruits', amount: 6300, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-10-07', isRecurring: true, notes: 'Festive groceries' },
      { title: 'Electricity & Postpaid Family Plan', amount: 3700, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-10-12', isRecurring: true, notes: 'Utility bills' },
      { title: 'Highway Toll & Petrol', amount: 4400, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-10-18', isRecurring: false, notes: 'Hometown trip' },
      { title: 'Restaurant & Sweet Shop Orders', amount: 6100, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-10-22', isRecurring: false, notes: 'Festive dining' },
      { title: 'Festive Smart TV & Gifts Purchase', amount: 11800, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-10-26', isRecurring: false, notes: 'Diwali sale electronics (Anomaly)' },

      // November 2026
      { title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-11-01', isRecurring: true, notes: 'November salary credit' },
      { title: 'Full-Stack Mentorship Stipend', amount: 12000, type: 'income', category: 'Freelance', paymentMethod: 'UPI', date: '2026-11-08', isRecurring: false, notes: 'Mentorship cohort' },
      { title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-11-03', isRecurring: true, notes: 'Monthly apartment rent' },
      { title: 'BigBasket & Organic Staples', amount: 6100, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-11-05', isRecurring: true, notes: 'Monthly groceries' },
      { title: 'Broadband, LPG Cylinder & Power', amount: 3900, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-11-09', isRecurring: true, notes: 'Utility bills' },
      { title: 'Fuel & Intercity Cab', amount: 4200, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-11-11', isRecurring: false, notes: 'Intercity travel' },
      { title: 'Zomato Gold & Weekend Dining', amount: 6850, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-11-13', isRecurring: false, notes: 'Approaching dining budget limit' },
      { title: 'Winter Jacket & Designer Sneaker', amount: 9600, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-11-14', isRecurring: false, notes: 'Exceeded monthly shopping budget' },
      { title: 'IMAX Movie Night & Bowling', amount: 2650, type: 'expense', category: 'Entertainment', paymentMethod: 'UPI', date: '2026-11-15', isRecurring: false, notes: 'Weekend outing' },
      { title: 'Annual Health Vitamin Panel', amount: 2400, type: 'expense', category: 'Healthcare', paymentMethod: 'Debit Card', date: '2026-11-16', isRecurring: false, notes: 'Preventive lab checkup' }
    ].map((tx) => ({
      ...tx,
      userId: demoUser._id,
      date: new Date(tx.date),
      month: tx.date.slice(0, 7)
    }));

    const insertedTransactions = await Transaction.insertMany(rawTransactions);

    // 3. Create Monthly Budgets in 'budgets' collection
    const categoryLimitsTemplate = [
      { category: 'Housing & Rent', limit: 18000, alertThresholdPct: 80 },
      { category: 'Food & Dining', limit: 7000, alertThresholdPct: 80 },
      { category: 'Groceries', limit: 6500, alertThresholdPct: 80 },
      { category: 'Transportation', limit: 5000, alertThresholdPct: 80 },
      { category: 'Utilities & Bills', limit: 4500, alertThresholdPct: 80 },
      { category: 'Shopping', limit: 6000, alertThresholdPct: 80 },
      { category: 'Entertainment', limit: 3000, alertThresholdPct: 80 },
      { category: 'Healthcare', limit: 3000, alertThresholdPct: 80 }
    ];

    const novBudget = await Budget.create({
      userId: demoUser._id,
      month: '2026-11',
      overallLimit: 52000,
      alertThresholdPct: 80,
      categoryLimits: categoryLimitsTemplate,
      notes: 'November 2026 active budget'
    });

    await Budget.create({
      userId: demoUser._id,
      month: '2026-10',
      overallLimit: 52000,
      alertThresholdPct: 80,
      categoryLimits: categoryLimitsTemplate,
      notes: 'October 2026 festive budget'
    });

    // 4. Create Linked Insights in 'insights' collection with ObjectId references
    const tyreTx = insertedTransactions.find((t) => t.title.includes('Tyre'));
    const tvTx = insertedTransactions.find((t) => t.title.includes('Smart TV'));
    const jacketTx = insertedTransactions.find((t) => t.title.includes('Winter Jacket'));

    await Insight.insertMany([
      {
        userId: demoUser._id,
        relatedTransactionId: tyreTx ? tyreTx._id : null,
        relatedBudgetId: null,
        month: '2026-09',
        type: 'anomaly',
        severity: 'warning',
        category: 'Transportation',
        title: 'Unusual Transportation Spike: Emergency Car Tyre Replacement',
        description: '₹9,400 spent on 2026-09-15 is 1.91x higher than your 6-month Transportation average of ₹4,917.',
        potentialSavings: 4483,
        metadata: { zScore: 2.04, ratio: 1.91 }
      },
      {
        userId: demoUser._id,
        relatedTransactionId: tvTx ? tvTx._id : null,
        relatedBudgetId: null,
        month: '2026-10',
        type: 'anomaly',
        severity: 'critical',
        category: 'Shopping',
        title: 'Festive Shopping Outlier: Smart TV & Gifts Purchase',
        description: '₹11,800 spent on 2026-10-26 is 1.89x above your historical Shopping mean of ₹6,233.',
        potentialSavings: 5567,
        metadata: { zScore: 1.68, ratio: 1.89 }
      },
      {
        userId: demoUser._id,
        relatedTransactionId: jacketTx ? jacketTx._id : null,
        relatedBudgetId: novBudget._id,
        month: '2026-11',
        type: 'budget_alert',
        severity: 'critical',
        category: 'Shopping',
        title: 'Shopping Budget Exceeded (160% Utilized)',
        description: 'November Shopping spend reached ₹9,600 against your ₹6,000 category limit. Pausing non-essential apparel purchases saves ₹3,600.',
        potentialSavings: 3600,
        metadata: { budgetLimit: 6000, actualSpent: 9600 }
      },
      {
        userId: demoUser._id,
        relatedTransactionId: null,
        relatedBudgetId: novBudget._id,
        month: '2026-11',
        type: 'saving_suggestion',
        severity: 'info',
        category: 'Food & Dining',
        title: 'Food & Dining Approaching Cap (97.9% Utilized)',
        description: 'You have spent ₹6,850 of your ₹7,000 Food & Dining budget. Cooking at home on weekends can save ~₹1,800/month (₹21,600/year).',
        potentialSavings: 1800,
        metadata: { rule: '80_percent_threshold_guard' }
      },
      {
        userId: demoUser._id,
        relatedTransactionId: null,
        relatedBudgetId: novBudget._id,
        month: '2026-12',
        type: 'ml_forecast',
        severity: 'positive',
        category: 'All Categories',
        title: 'Scikit-Learn OLS Expense Forecast for Dec 2026',
        description: 'Based on 6 months of MongoDB aggregation series (R² = 0.916), predicted December 2026 expenditure is ₹56,820 (±₹3,150).',
        potentialSavings: 0,
        predictedAmount: 56820,
        metadata: { model: 'LinearRegression', r2Score: 0.916, slope: 3254 }
      }
    ]);

    
    const priyaUser = await User.create({
      name: 'Priya Patel',
      email: 'priya@spendsmart.ai',
      passwordHash: 'Priya@123',
      currency: 'INR',
      monthlyIncomeTarget: 75000,
      savingsGoalPct: 20
    });

    await Transaction.insertMany([
      { userId: priyaUser._id, title: 'Cloud Systems Salary', amount: 75000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: new Date('2026-10-01'), month: '2026-10', isRecurring: true, notes: 'October salary credit' },
      { userId: priyaUser._id, title: '1BHK Studio Rent', amount: 14000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: new Date('2026-10-04'), month: '2026-10', isRecurring: true, notes: 'Monthly studio rent' },
      { userId: priyaUser._id, title: 'Cloud Systems Salary', amount: 75000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: new Date('2026-11-01'), month: '2026-11', isRecurring: true, notes: 'November salary credit' },
      { userId: priyaUser._id, title: '1BHK Studio Rent', amount: 14000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: new Date('2026-11-04'), month: '2026-11', isRecurring: true, notes: 'Monthly studio rent' }
    ]);

    await Budget.create({
      userId: priyaUser._id,
      month: '2026-11',
      overallLimit: 38000,
      alertThresholdPct: 80,
      categoryLimits: categoryLimitsTemplate,
      notes: 'Priya November 2026 budget'
    });

    
    await RecurringSchedule.insertMany([
      { userId: demoUser._id, title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', frequency: 'monthly', dayOfMonth: 1, nextDueDate: '2026-12-01', status: 'active', lastGeneratedDate: '2026-11-01' },
      { userId: demoUser._id, title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', frequency: 'monthly', dayOfMonth: 3, nextDueDate: '2026-12-03', status: 'active', lastGeneratedDate: '2026-11-03' },
      { userId: demoUser._id, title: 'Car Loan EMI (HDFC Bank)', amount: 8400, type: 'expense', category: 'EMI & Loans', paymentMethod: 'Net Banking', frequency: 'monthly', dayOfMonth: 20, nextDueDate: '2026-11-20', status: 'active', lastGeneratedDate: '2026-10-20' },
      { userId: demoUser._id, title: 'Netflix, Spotify & Google One Bundle', amount: 1199, type: 'expense', category: 'Subscriptions', paymentMethod: 'Credit Card', frequency: 'monthly', dayOfMonth: 18, nextDueDate: '2026-11-18', status: 'active', lastGeneratedDate: '2026-10-18' }
    ]);

    await SavingsGoal.insertMany([
      { userId: demoUser._id, name: '6-Month Emergency Liquid Fund', category: 'Emergency Fund', targetAmount: 300000, currentAmount: 215000, monthlyCommitment: 17000, targetDate: '2027-04-30', status: 'active' },
      { userId: demoUser._id, name: 'MacBook Pro M4 Upgrade', category: 'Tech & Career', targetAmount: 165000, currentAmount: 125000, monthlyCommitment: 10000, targetDate: '2027-03-15', status: 'active' },
      { userId: demoUser._id, name: 'Japan Spring Travel Fund', category: 'Travel & Leisure', targetAmount: 180000, currentAmount: 72000, monthlyCommitment: 12000, targetDate: '2027-08-01', status: 'active' }
    ]);

    await BillReminder.insertMany([
      { userId: demoUser._id, title: 'HDFC Regalia Credit Card Statement', category: 'Credit Card Bill', amount: 14250, dueDate: '2026-11-21', paymentMethod: 'Net Banking', status: 'pending' },
      { userId: demoUser._id, title: 'Car Loan EMI Installment #18', category: 'EMI & Loans', amount: 8400, dueDate: '2026-11-20', paymentMethod: 'Net Banking', status: 'pending' },
      { userId: demoUser._id, title: 'Airtel Black Fiber + Postpaid Bill', category: 'Utilities & Bills', amount: 1769, dueDate: '2026-11-25', paymentMethod: 'UPI', status: 'pending' }
    ]);

    console.log('[Seed Complete] Populated users, transactions (47 docs), budgets (2 docs), and insights (5 docs).');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
