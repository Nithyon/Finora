@echo off
REM ========================================
REM Finora Java Analytics Service Launcher
REM ========================================
REM Prerequisites: Java 17 and Maven installed
REM ========================================

echo.
echo ========================================
echo   Finora Analytics Service
echo ========================================
echo.

REM Check Java
java --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java 17 not found!
    echo.
    echo Follow setup: JAVA_SETUP_MANUAL.md
    echo.
    pause
    exit /b 1
)

REM Check Maven
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven not found!
    echo.
    echo Follow setup: JAVA_SETUP_MANUAL.md
    echo.
    pause
    exit /b 1
)

echo Verified: Java and Maven installed
echo.

REM Go to backend-java
cd /d "%~dp0backend-java"

echo Building project...
call mvn clean package -q
if errorlevel 1 (
    echo Build FAILED!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Starting Analytics Service
echo ========================================
echo   URL: http://localhost:8081
echo   Health: http://localhost:8081/api/analytics/health
echo.
echo   Press Ctrl+C to stop
echo ========================================
echo.

call mvn spring-boot:run

pause
