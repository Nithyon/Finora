@echo off
REM Finora Backend - Automated Deployment to HuggingFace Spaces
REM This batch script automates the entire deployment process

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo.
echo   GG  FINORA BACKEND - AUTOMATED DEPLOYMENT
echo  GGGG   to HuggingFace Spaces
echo GG      
echo.
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org
    pause
    exit /b 1
)

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com
    pause
    exit /b 1
)

echo.
echo Ready to deploy your Finora Backend!
echo.

REM Run the Python deployment script
python "%~dp0deploy-backend-auto.py"

if errorlevel 1 (
    echo.
    echo ERROR: Deployment script failed
    pause
    exit /b 1
)

echo.
echo SUCCESS: Deployment script completed!
echo.
pause
