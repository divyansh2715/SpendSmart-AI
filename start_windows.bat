@echo off
echo ==========================================================
echo   Starting SpendSmart AI Full-Stack Personal Finance Suite
echo ==========================================================

echo [1/3] Starting Node.js + Express + MongoDB Backend (Port 5000)...
start "SpendSmart Backend API" cmd /k "cd backend && npm run dev"

echo [2/3] Starting Python Flask ML Service (Port 5001)...
start "SpendSmart ML Service" cmd /k "cd ml-service && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && python app.py"

echo [3/3] Starting React + Vite Frontend (Port 5173)...
start "SpendSmart React Frontend" cmd /k "cd frontend && npm run dev"

echo All services launched in separate terminal windows!
echo Open http://localhost:5173 in your browser.
pause
