# SpendSmart AI – Complete Full-Stack Personal Finance Platform

A standalone, production-structured **MERN + Python Machine Learning** personal finance application built with **React.js, Tailwind CSS, Recharts, Node.js, Express.js, MongoDB Atlas (Mongoose), JWT + bcrypt authentication, and a Python Flask + Scikit-Learn microservice**.

---

## 1. Complete Project Folder Structure

```text
spendsmart-ai/
├── README.md                                 # Complete Windows & Cross-Platform Setup Guide
├── PROJECT_DOCUMENTATION.md                  # Schemas, Aggregations & API Reference
├── start_windows.bat                         # One-click Windows launcher for all 3 services
├── backend/                                  # Node.js + Express.js + Mongoose REST API (Port 5000)
│   ├── .env.example                          # Backend environment variables template
│   ├── package.json                          # Express, Mongoose, bcryptjs, jsonwebtoken, cors, dotenv
│   ├── server.js                             # Express entry point mounting all routes
│   ├── config/
│   │   └── db.js                             # MongoDB Atlas connection & index initialization
│   ├── middleware/
│   │   ├── auth.js                           # JWT Bearer token verification middleware
│   │   └── errorHandler.js                   # Centralized Mongoose validation & error handler
│   ├── models/
│   │   ├── User.js                           # 'users' model (bcrypt hashing + unique email index)
│   │   ├── Transaction.js                    # 'transactions' model (ObjectId ref + compound indexes)
│   │   ├── Budget.js                         # 'budgets' model (monthly & category caps)
│   │   ├── Insight.js                        # 'insights' model (anomalies & saving alerts)
│   │   ├── RecurringSchedule.js              # 'recurringschedules' model (rent, subscriptions, EMIs)
│   │   ├── SavingsGoal.js                    # 'savingsgoals' model (targets & contributions)
│   │   └── BillReminder.js                   # 'billreminders' model (due dates & payment status)
│   ├── routes/
│   │   ├── authRoutes.js                     # POST /register, POST /login, GET /me, PUT /profile
│   │   ├── transactionRoutes.js              # Full CRUD + search/filters + POST /import-csv
│   │   ├── budgetRoutes.js                   # Full CRUD + 80% warning & 100% exceeded calculation
│   │   ├── insightRoutes.js                  # Full CRUD + ObjectId population + resolve toggle
│   │   ├── recurringRoutes.js                # Full CRUD + pause/resume/cancel + auto-generate tx
│   │   ├── goalRoutes.js                     # Full CRUD + add contribution + completion estimator
│   │   ├── billRoutes.js                     # Full CRUD + mark paid & auto-record expense
│   │   ├── aiAssistantRoutes.js              # Grounded conversational Q&A over MongoDB records
│   │   └── mongoAnalyticsRoutes.js           # 5 MongoDB Aggregation Pipelines + .explain() stats
│   └── seed/
│       └── seedData.js                       # Seeds demo users & 6 months of realistic records
├── frontend/                                 # React 18 + Vite + Tailwind CSS + Recharts (Port 5173)
│   ├── .env.example                          # Frontend environment variables template
│   ├── index.html                            # HTML entry template
│   ├── package.json                          # React, Recharts, Lucide-React, Tailwind, Vite
│   ├── postcss.config.js                     # PostCSS config
│   ├── tailwind.config.js                    # Tailwind CSS config
│   ├── vite.config.js                        # Vite dev server & /api proxy to localhost:5000
│   └── src/
│       ├── main.jsx                          # React DOM entry point
│       ├── index.css                         # Tailwind CSS base/components/utilities
│       ├── App.jsx                           # Complete 10-module commercial fintech UI
│       └── api/
│           └── apiClient.js                  # REST & ML API client with JWT header injection
├── ml-service/                               # Python + Flask + Pandas + Scikit-Learn API (Port 5001)
│   ├── .env.example                          # ML service environment variables template
│   ├── app.py                                # /api/predict-expenses & /api/analyze-anomalies
│   └── requirements.txt                      # flask, flask-cors, pandas, numpy, scikit-learn
└── postman/
    └── SpendSmart_AI_Postman_Collection.json # Ready-to-import Postman API test collection
```

---

## 2. Complete Windows Setup Instructions (Step-by-Step)

### Prerequisites on Windows 10 / 11
1. **Node.js (v18 or v20 LTS)**: Download and install from `https://nodejs.org/` (verify with `node -v` and `npm -v`).
2. **Python (v3.10 to v3.12)**: Download from `https://www.python.org/downloads/windows/` (make sure to check **"Add python.exe to PATH"** during installation).
3. **MongoDB Atlas Account (Free M0 Cluster)** or **MongoDB Community Server**:
   - Create a free cluster at `https://www.mongodb.com/cloud/atlas`, click **Connect → Drivers**, and copy your connection string (`mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/spendsmart_ai?retryWrites=true&w=majority`).
   - In MongoDB Atlas **Network Access**, click **Add IP Address** and allow your current IP (or `0.0.0.0/0` for development).

---

### Step 1: Extract the ZIP Archive
Right-click `spendsmart-ai-fullstack.zip` in Windows File Explorer and click **Extract All...** into a folder such as `C:\Projects\spendsmart-ai`.

---

### Step 2: Configure & Start the Node.js + Express + MongoDB Backend (Terminal 1)

Open **PowerShell** or **Command Prompt (CMD)** inside the extracted folder:

```bat
cd backend
copy .env.example .env
```

Open `backend\.env` in Notepad or VS Code and paste your MongoDB Atlas URI:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/spendsmart_ai?retryWrites=true&w=majority
JWT_SECRET=spendsmart_ai_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:5001
```

Now install dependencies, seed the database, and start the backend server:
```bat
npm install
npm run seed
npm run dev
```
- The backend server will start on **`http://localhost:5000`**.
- `npm run seed` populates two demo accounts:
  - **Aarav Sharma (6 Months Data)**: `aarav@spendsmart.ai` / Password: `SpendSmart@123`
  - **Priya Patel (2 Months Data)**: `priya@spendsmart.ai` / Password: `Priya@123`

---

### Step 3: Configure & Start the Python Flask ML Service (Terminal 2)

Open a **second** PowerShell or Command Prompt window:

**Using Windows Command Prompt (CMD):**
```bat
cd ml-service
copy .env.example .env
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Using Windows PowerShell:**
```powershell
cd ml-service
Copy-Item .env.example .env
python -m venv venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
- The Python Flask ML forecasting server will run on **`http://localhost:5001`**.

---

### Step 4: Configure & Start the React Frontend (Terminal 3)

Open a **third** PowerShell or Command Prompt window:

```bat
cd frontend
copy .env.example .env
npm install
npm run dev
```
- Open your browser to **`http://localhost:5173`**.
- *(Tip: After completing `npm install` and `pip install` once, you can simply double-click `start_windows.bat` in the root folder to launch all three services at once!)*
