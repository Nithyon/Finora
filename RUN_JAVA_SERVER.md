# Run Java Analytics Server Locally

This is a **standalone Java HTTP server** - no Maven or Spring Boot needed!

## Step 1: Install Java 17

### Download from official source:
1. Go to: **https://www.oracle.com/java/technologies/downloads/**
2. Select **Java 17** 
3. Download **Windows x64 Installer**
4. Run the installer (next → next → finish)
5. **Restart your terminal/PowerShell**

### Verify Installation:
```powershell
java --version
```
Should show: `java 17.x.x`

## Step 2: Compile the Java Server

```powershell
cd c:\Users\saini\Documents\finora
javac AnalyticsServer.java
```

**Should create:** `AnalyticsServer.class`

## Step 3: Run the Server

```powershell
java AnalyticsServer
```

**Should show:**
```
========================================
  Analytics Service (Java)
========================================
  ✅ Server running on http://localhost:8081
  📊 Health: http://localhost:8081/api/analytics/health
  ...
```

✅ **Service is now running!**

## Step 4: Test It

Open browser and go to:
```
http://localhost:8081/api/analytics/health
```

Should see:
```json
{"status":"UP"}
```

## Step 5: Use in Frontend

Your frontend is already configured to use `http://localhost:8081` in development mode!

1. Go to: **https://finora-six.vercel.app/analytics**
2. Click the **Analytics (📊)** button
3. Should see data loading! ✅

## Stop the Server

Press **Ctrl+C** in the terminal

---

## Troubleshooting

### "javac: command not found"
- Java not installed or not in PATH
- Restart PowerShell after installing Java
- Verify: `java --version`

### "error: cannot find symbol" during compilation
- Make sure you're in the right directory: `c:\Users\saini\Documents\finora`
- Check the filename: `AnalyticsServer.java`

### "Port already in use"
- Something else is using port 8081
- Try: `netstat -ano | findstr :8081`
- Kill the process or restart your computer

### Still "Service unavailable" on frontend
- Make sure Java server is running
- Check you can access: `http://localhost:8081/api/analytics/health`
- Hard refresh browser: `Ctrl+Shift+R`

---

## Quick Reference

| Step | Command |
|------|---------|
| Compile | `javac AnalyticsServer.java` |
| Run | `java AnalyticsServer` |
| Test | Visit `http://localhost:8081/health` |
| Stop | `Ctrl+C` |

That's it! Pure Java, no frameworks needed. 🚀
