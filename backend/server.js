require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const insightRoutes = require('./routes/insightRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
const goalRoutes = require('./routes/goalRoutes');
const billRoutes = require('./routes/billRoutes');
const aiAssistantRoutes = require('./routes/aiAssistantRoutes');
const mongoAnalyticsRoutes = require('./routes/mongoAnalyticsRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'SpendSmart AI Personal Finance Platform Backend',
    collections: [
      'users',
      'transactions',
      'budgets',
      'insights',
      'recurringschedules',
      'savingsgoals',
      'billreminders'
    ],
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/mongo-analytics', mongoAnalyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SpendSmart AI] Backend API Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
