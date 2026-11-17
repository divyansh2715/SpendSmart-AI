# SpendSmart AI – Complete Personal Finance Platform Documentation

## 1. Platform Overview & Customer-Facing Modules

**SpendSmart AI** is a full-stack personal finance management platform built with **React.js, Tailwind CSS, Recharts, Node.js, Express.js, MongoDB Atlas (Mongoose), and a Python Flask + Scikit-Learn ML microservice**.

### Sidebar Navigation & 10 Customer-Facing Modules
1. **Overview (`dashboard`)**: Displays Total Balance, Monthly Income, Monthly Expenses, Savings Rate, Monthly Financial Trends chart, Category-Wise Spending chart, Upcoming Bills widget, Savings Goal Progress widget, and Recent Transactions table.
2. **Transactions (`transactions`)**: Supports custom user-created categories, receipt/attachment file tracking, keyword search, payment method filter, date-range filter, CSV export, and validated CSV bulk import (`POST /api/transactions/import-csv`).
3. **Recurring Expenses (`recurring`)**: Manages monthly rent, subscriptions, loan EMIs, and recurring salary inflows with one-click automatic transaction generation (`POST /api/recurring/:id/generate`), Edit, Pause/Resume, and Cancel controls.
4. **Budgets (`budgets`)**: Configures overall monthly budget caps, warning thresholds (`80%` warning and `100%` exceeded alerts), and per-category budget limits.
5. **Savings Goals (`goals`)**: Tracks custom savings targets, logs contributions (`POST /api/goals/:id/contribute`), displays progress bars and remaining amounts, and estimates completion dates based on monthly savings commitments.
6. **Bill Reminders (`bills`)**: Tracks electricity, internet, rent, credit card, and EMI bills with due dates, upcoming payment summary cards, and a **Mark as Paid** action (`PATCH /api/bills/:id/pay`) that automatically records the corresponding expense transaction in MongoDB.
7. **Expense Calendar (`calendar`)**: Interactive monthly calendar grid displaying daily income/expense totals, highlighting high-spending days (`≥ ₹5,000`), and inspecting daily transactions and bills due.
8. **Reports & Analytics (`reports`)**: Generates Weekly, Monthly, and Yearly (FY 2026) income vs. expense comparisons, category-wise spending tables, CSV exports, and printable PDF financial statements.
9. **AI Finance Assistant (`ai_assistant`)**: Interactive conversational Q&A assistant (`POST /api/ai-assistant/ask`) that answers questions about unnecessary spending, pending bills, savings goals, and next-month Scikit-learn OLS expense forecasts using actual MongoDB records.
10. **Profile Settings (`profile`)**: Manages user profile details, custom categories, multi-user account switching, and secure JWT session sign-out.

## 2. MongoDB Atlas Collections, Relationships & Indexes

All database functionality operates internally in `backend/models/` with `ObjectId` references (`ref: 'User'`, `ref: 'Transaction'`, `ref: 'Budget'`, `ref: 'RecurringSchedule'`) and strict `{ userId: req.user._id }` isolation:

| Collection | Mongoose Model | Key Fields & Relationships | Compound & Single-Field Indexes |
| :--- | :--- | :--- | :--- |
| **`users`** | `models/User.js` | `name`, `email` (unique), `passwordHash` (`bcrypt`), `currency`, `monthlyIncomeTarget`, `savingsGoalPct`, `customCategories` | `{ email: 1 }` (Unique) |
| **`transactions`** | `models/Transaction.js` | `userId` (`ref: 'User'`), `title`, `amount`, `type`, `category`, `paymentMethod`, `date`, `month`, `attachmentName`, `isRecurring`, `recurringScheduleId` | `{ userId: 1, date: -1 }`, `{ userId: 1, month: 1, type: 1 }`, `{ userId: 1, type: 1, category: 1, date: -1 }`, `$text` index |
| **`budgets`** | `models/Budget.js` | `userId` (`ref: 'User'`), `month`, `overallLimit`, `alertThresholdPct`, `categoryLimits` | `{ userId: 1, month: 1 }` (Compound Unique) |
| **`insights`** | `models/Insight.js` | `userId` (`ref: 'User'`), `relatedTransactionId` (`ref: 'Transaction'`), `relatedBudgetId` (`ref: 'Budget'`), `type`, `severity`, `potentialSavings` | `{ userId: 1, month: -1, type: 1 }` |
| **`recurringschedules`** | `models/RecurringSchedule.js` | `userId` (`ref: 'User'`), `title`, `amount`, `type`, `category`, `frequency`, `dayOfMonth`, `nextDueDate`, `status` (`active`/`paused`/`cancelled`) | `{ userId: 1, status: 1, nextDueDate: 1 }` |
| **`savingsgoals`** | `models/SavingsGoal.js` | `userId` (`ref: 'User'`), `name`, `category`, `targetAmount`, `currentAmount`, `monthlyCommitment`, `targetDate`, `contributions` | `{ userId: 1, status: 1 }` |
| **`billreminders`** | `models/BillReminder.js` | `userId` (`ref: 'User'`), `title`, `category`, `amount`, `dueDate`, `paymentMethod`, `status` (`pending`/`paid`), `paidTransactionId` (`ref: 'Transaction'`) | `{ userId: 1, status: 1, dueDate: 1 }` |

## 3. REST API Endpoints Summary

| Module | Endpoints | Description |
| :--- | :--- | :--- |
| **Authentication** | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile` | JWT Bearer authentication, `bcrypt` password hashing, and user profile updates |
| **Transactions & CSV** | `GET /api/transactions`, `POST /api/transactions`, `POST /api/transactions/import-csv`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id` | User-scoped transaction CRUD, custom categories, attachment metadata, and validated CSV bulk import |
| **Recurring Expenses** | `GET /api/recurring`, `POST /api/recurring`, `PUT /api/recurring/:id`, `PATCH /api/recurring/:id/status`, `POST /api/recurring/:id/generate`, `DELETE /api/recurring/:id` | Create, edit, pause/resume/cancel schedules, and auto-generate due transactions |
| **Budgets** | `GET /api/budgets/:month`, `POST /api/budgets`, `PUT /api/budgets/:month`, `DELETE /api/budgets/:id` | Monthly and category budget caps with real-time 80% warning and 100% exceeded alerts |
| **Savings Goals** | `GET /api/goals`, `POST /api/goals`, `POST /api/goals/:id/contribute`, `PUT /api/goals/:id`, `DELETE /api/goals/:id` | Savings goal CRUD, contribution logging, and completion estimation |
| **Bill Reminders** | `GET /api/bills`, `POST /api/bills`, `PATCH /api/bills/:id/pay`, `PUT /api/bills/:id`, `DELETE /api/bills/:id` | Bill reminder CRUD and 1-click payment settlement (auto-creating expense transactions) |
| **AI Finance Assistant** | `POST /api/ai-assistant/ask`, `POST http://localhost:5001/api/predict-expenses` | Grounded natural-language financial Q&A and Scikit-learn OLS expense forecasting |
| **Internal Aggregations** | `GET /api/mongo-analytics/pipeline/*`, `GET /api/mongo-analytics/indexes/explain` | Internal MongoDB aggregation pipelines (`$match`, `$group`, `$sum`, `$lookup`, `$unwind`, `$project`, `$sort`) |

## 4. Local Installation & Execution Guide

```bash
# 1. Extract Archive & Start Express + MongoDB Backend (Port 5000)
unzip spendsmart-ai-fullstack.zip -d spendsmart-ai
cd spendsmart-ai/backend
cp .env.example .env
# Edit .env and set MONGODB_URI to your MongoDB Atlas connection string
npm install
npm run seed   # Seeds users, transactions, budgets, insights, recurring schedules, goals, and bills
npm run dev

# 2. Start Python Flask & Scikit-Learn ML Service (Port 5001)
cd ../ml-service
pip install -r requirements.txt
python app.py

# 3. Start React + Tailwind CSS Frontend (Port 5173)
cd ../frontend
npm install
npm run dev
```
