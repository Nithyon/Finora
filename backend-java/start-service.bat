@echo off
REM Start Java Analytics Service
REM Prerequisites: Java 17 and Maven installed and in PATH

echo.
echo ========================================
echo   Finora Analytics Service Launcher
echo ========================================
echo.

REM Check if Maven is installed
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH
    echo.
    echo Follow setup steps in: backend-java/RUN_LOCALLY.md
    echo.
    pause
    exit /b 1
)

REM Check if Java is installed
java --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo.
    echo Follow setup steps in: backend-java/RUN_LOCALLY.md
    echo.
    pause
    exit /b 1
)

REM Navigate to backend-java directory
cd /d "%~dp0"
echo Starting Analytics Service from: %cd%
echo.

REM Build if needed
echo Building project...
mvn clean package -q
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

REM Run the service
echo.
echo ========================================
echo   Service Starting...
echo ========================================
echo   Access at: http://localhost:8081
echo   Health check: http://localhost:8081/health
echo.
echo   Press Ctrl+C to stop
echo ========================================
echo.

mvn spring-boot:run

pause
