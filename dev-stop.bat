@echo off
echo Stopping all FinTrack-ML services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im bun.exe >nul 2>&1  
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im nodemon.exe >nul 2>&1
echo All services stopped!
