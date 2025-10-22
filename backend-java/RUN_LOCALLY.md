# Run Java Analytics Service Locally

## Prerequisites Setup (First Time Only)

### Step 1: Install Java 17

**Windows:**
1. Go to: https://www.oracle.com/java/technologies/downloads/#java17
2. Download "Windows x64 Installer"
3. Run installer and follow steps
4. Click "Next" through all screens
5. Finish and restart PowerShell/CMD

**Verify Installation:**
```powershell
java --version
```
Should show: `java 17.x.x` or higher

---

### Step 2: Install Maven

**Windows (Easy):**
1. Go to: https://maven.apache.org/download.cgi
2. Download: `apache-maven-3.9.x-bin.zip` (Binary)
3. Extract to: `C:\maven` or `C:\Program Files\maven`
4. **Add to System PATH:**
   - Open: **Start Menu** → **Environment Variables**
   - Click **"Edit the system environment variables"**
   - Click **"Environment Variables"** button
   - Under **"System variables"**, find **"Path"**
   - Click **"Edit"**
   - Click **"New"**
   - Add: `C:\maven\bin` (or wherever you extracted)
   - Click **OK** three times
   - **Restart PowerShell/CMD**

**Verify Installation:**
```powershell
mvn --version
```
Should show Maven version 3.9+

---

## Run Analytics Service Locally

### Step 1: Navigate to backend-java
```powershell
cd c:\Users\saini\Documents\finora\backend-java
```

### Step 2: Build the project
```powershell
mvn clean package
```
This takes 2-3 minutes first time. Will download dependencies.

### Step 3: Run the service
```powershell
mvn spring-boot:run
```

**Should see output like:**
```
...
Started FinoraAnalyticsApplication in 5.234 seconds
Tomcat started on port(s): 8081 (http)
```

✅ **Service is now running on: `http://localhost:8081`**

---

## Update Frontend to Use Local Service

### Option A: Development (Easiest)
The frontend already defaults to `http://localhost:8081` in development!
- Just run your Next.js dev server normally
- It will automatically use the local Java service

### Option B: Production Build (Need env variable)
If building for production, add to `.env.local`:
```
NEXT_PUBLIC_ANALYTICS_API=http://localhost:8081
```

---

## Test the Service

Open browser and go to:
```
http://localhost:8081/health
```

Should respond with:
```json
{"status": "UP"}
```

---

## Stop the Service
In the PowerShell window, press: **Ctrl+C**

---

## Troubleshooting

### "Port 8081 already in use"
```powershell
netstat -ano | findstr :8081
```
Get the PID and kill it:
```powershell
taskkill /PID <PID> /F
```

### "Maven command not found"
- Check PATH is set correctly
- Restart PowerShell/CMD after setting PATH
- Verify: `mvn --version` works

### "Java command not found"
- Reinstall Java
- Add `C:\Program Files\Java\jdk-17\bin` to PATH

### Build fails with "Cannot find symbol"
```powershell
mvn clean install
```
Then try running again

---

## Next Steps

Once running locally:
1. ✅ Go to https://finora-six.vercel.app/analytics
2. ✅ Click Analytics button
3. ✅ Should see data loading (no more "Service unavailable")
4. ✅ All analytics features work!

Keep the terminal running while you test!
