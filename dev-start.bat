@echo off
echo FinTrack-ML Service Restart
echo ========================

echo Stopping all services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im bun.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
timeout /t 2 >nul

echo Starting all services...

echo Starting Backend...
start "FinTrack Backend" powershell -Command "cd 'C:\Project\fintrack-ml\backend'; Write-Host 'BACKEND STARTING...' -ForegroundColor Green; bun run dev"

timeout /t 2 >nul

echo Starting Frontend...
start "FinTrack Frontend" powershell -Command "cd 'C:\Project\fintrack-ml\frontend'; Write-Host 'FRONTEND STARTING...' -ForegroundColor Blue; bun run dev"

timeout /t 2 >nul

echo Starting ML Service...
start "FinTrack ML" powershell -Command "cd 'C:\Project\fintrack-ml\ml-service'; Write-Host 'ML SERVICE STARTING...' -ForegroundColor Magenta; python app.py"

echo.
echo All services started!
echo Frontend: http://localhost:5173 or http://localhost:5174
echo Backend: http://localhost:5000
echo ML Service: http://localhost:5002
