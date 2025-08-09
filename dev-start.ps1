# Simple restart script for FinTrack-ML services
Write-Host "Stopping all services..." -ForegroundColor Red
Get-Process -Name node,bun,nodemon,python,python3 -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Starting all services..." -ForegroundColor Green

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Project\fintrack-ml\backend'; Write-Host 'BACKEND STARTING...' -ForegroundColor Green; bun run dev"

# Start Frontend  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Project\fintrack-ml\frontend'; Write-Host 'FRONTEND STARTING...' -ForegroundColor Blue; bun run dev"

# Start ML Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Project\fintrack-ml\ml-service'; Write-Host 'ML SERVICE STARTING...' -ForegroundColor Magenta; python app.py"

Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173 or http://localhost:5174" -ForegroundColor Blue
Write-Host "Backend: http://localhost:5000" -ForegroundColor Green  
Write-Host "ML Service: http://localhost:5002" -ForegroundColor Magenta
