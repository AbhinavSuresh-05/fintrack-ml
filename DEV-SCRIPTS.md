# FinTrack-ML Development Scripts

## 🚀 Starting All Services

### **Option 1: PowerShell Script (Recommended)**
```powershell
PS C:\Project\fintrack-ml> .\dev-start.ps1
```

### **Option 2: Batch File**
```powershell
PS C:\Project\fintrack-ml> .\dev-start.bat
```

Both scripts will:
- ✅ Stop all running Node.js, Bun, and Python processes
- ✅ Start Backend service in a new window (port 5000)
- ✅ Start Frontend service in a new window (port 5173/5174)
- ✅ Start ML service in a new window (port 5002)

## 🛑 Stopping Services

```powershell
PS C:\Project\fintrack-ml> .\dev-stop.bat
```

## 🏥 Health Check

```powershell
# Check Backend
PS C:\Project\fintrack-ml> Invoke-WebRequest http://localhost:5000/ping

# Check ML Service  
PS C:\Project\fintrack-ml> Invoke-WebRequest http://localhost:5002/ping
```

## 📋 NPM Scripts (Info Only)

```powershell
# These just show instructions
PS C:\Project\fintrack-ml> bun run dev    # Shows start instructions
PS C:\Project\fintrack-ml> bun run stop   # Shows stop instructions
PS C:\Project\fintrack-ml> bun run health # Shows health check instructions
```

## 📋 Manual Start (Alternative)

If you prefer to start services manually:

```powershell
# Terminal 1 - Backend
PS C:\Project\fintrack-ml\backend> bun run dev

# Terminal 2 - Frontend  
PS C:\Project\fintrack-ml\frontend> bun run dev

# Terminal 3 - ML Service
PS C:\Project\fintrack-ml\ml-service> python app.py
```

## 🌐 Service URLs

- **Frontend:** http://localhost:5173 or http://localhost:5174
- **Backend:** http://localhost:5000
- **ML Service:** http://localhost:5002

## 📊 API Health Checks

- **Backend:** http://localhost:5000/ping
- **ML Service:** http://localhost:5002/ping

## 🎯 **Quick Start Summary**

**To start everything:**
```powershell
PS C:\Project\fintrack-ml> .\dev-start.ps1
```

**To stop everything:**
```powershell
PS C:\Project\fintrack-ml> .\dev-stop.bat
```
