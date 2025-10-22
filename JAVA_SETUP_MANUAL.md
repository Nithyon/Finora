# Manual Java Installation & Setup (Easiest Way)

## ⚡ Quick Links (Copy & Paste)

**Java 17 Download:**
https://www.oracle.com/java/technologies/downloads/#java17

**Maven 3.9.11 Download (Direct):**
https://archive.apache.org/dist/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.zip

---

## Step 1: Download Java 17

1. Go to: **https://www.oracle.com/java/technologies/downloads/#java17**
2. Click **"Windows x64 Installer"**
3. Accept terms and download (you may need to sign in - it's free)
4. File: `jdk-17_windows-x64_bin.exe`

## Step 2: Install Java

1. Run the downloaded `.exe` file
2. Click **"Next"** through all screens
3. Accept defaults
4. Click **"Finish"** when done
5. **Close and restart PowerShell/CMD completely**

## Step 3: Verify Java Install

Open new PowerShell and run:
```powershell
java --version
```

Should show:
```
java 17.x.x 2024-xx-xx LTS
```

If it says "not recognized", Java didn't install properly - try again.

## Step 4: Download Maven

1. Go to: **https://maven.apache.org/download.cgi**
2. Look for **"Binary zip archive"** under "Files" section
3. Click: **`apache-maven-3.9.11-bin.zip`**
   - Direct link: https://archive.apache.org/dist/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.zip
4. File will download (~10MB)
5. Right-click and **"Extract All"**
6. Extract to: **`C:\maven`** (or **`C:\Program Files\maven`**)
7. Should have: `C:\maven\bin\` and `C:\maven\lib\` folders

## Step 5: Add Maven to System PATH

**Windows 10/11:**
1. Press **Windows Key**
2. Type: **"env"** and click **"Edit the system environment variables"**
3. Click **"Environment Variables"** button at bottom
4. Under **"System variables"**, find and click **"Path"**
5. Click **"Edit"**
6. Click **"New"**
7. Add: `C:\maven\bin` (or wherever you extracted maven)
8. Click **OK** three times
9. **Close all PowerShell/CMD windows and open a new one**

## Step 6: Verify Maven Install

Open new PowerShell and run:
```powershell
mvn --version
```

Should show:
```
Apache Maven 3.9.x
Java version: 17.x.x
```

If either command fails, go back and check PATH setup.

## Step 7: Run the Java Service

```powershell
cd c:\Users\saini\Documents\finora\backend-java
mvn clean package
```

This takes **2-3 minutes first time** (downloads dependencies).

Then run:
```powershell
mvn spring-boot:run
```

Should show:
```
Started FinoraAnalyticsApplication in 5.234 seconds
Tomcat started on port(s): 8081 (http)
```

✅ **Service is running on: `http://localhost:8081`**

## Step 8: Test It Works

Open browser and go to:
```
http://localhost:8081/api/analytics/health
```

Should see:
```json
{"status": "UP"}
```

## Step 9: Update Frontend

The frontend automatically uses `http://localhost:8081` in development, so it should work immediately.

Go to: **https://finora-six.vercel.app/analytics**

Click the **Analytics (📊)** button and you should see data! ✅

---

## Troubleshooting

**"mvn: command not found"**
- Maven PATH not set correctly
- Close and open new PowerShell
- Check `C:\maven\bin` exists
- Try `C:\maven\bin\mvn --version` to verify

**"java: command not found"**
- Java didn't install
- Reinstall from step 2
- Make sure to close and reopen PowerShell after install

**"Port 8081 already in use"**
```powershell
netstat -ano | findstr :8081
```
Get PID and kill it:
```powershell
taskkill /PID <number> /F
```

**Build fails**
```powershell
mvn clean install -U
```
Then try `mvn spring-boot:run` again

---

## Need Help?

If stuck on any step, let me know the exact error message!
