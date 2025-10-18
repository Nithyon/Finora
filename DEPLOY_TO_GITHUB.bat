@echo off
REM ============================================
REM FINORA DEPLOYMENT TO GITHUB & VERCEL
REM ============================================
REM This script deploys your Finora app to GitHub and Vercel
REM 
REM BEFORE RUNNING:
REM 1. Create a GitHub repo at https://github.com/new
REM 2. Name it: finora
REM 3. Keep it PUBLIC
REM 4. Click "Create repository"
REM 5. Copy the HTTPS URL (looks like: https://github.com/YOUR_USERNAME/finora.git)
REM 6. Paste the URL below where it says YOUR_GITHUB_REPO_URL
REM ============================================

setlocal enabledelayedexpansion

REM === CONFIGURATION ===
REM PASTE YOUR GITHUB REPO URL HERE:
set GITHUB_REPO_URL=YOUR_GITHUB_REPO_URL

if "%GITHUB_REPO_URL%"=="YOUR_GITHUB_REPO_URL" (
    echo.
    echo ❌ ERROR: You need to set your GitHub repo URL!
    echo.
    echo STEPS:
    echo 1. Go to https://github.com/new
    echo 2. Enter "finora" as repository name
    echo 3. Select "Public"
    echo 4. Click "Create repository"
    echo 5. Copy the HTTPS URL
    echo 6. Edit this file and replace YOUR_GITHUB_REPO_URL with your URL
    echo 7. Save and run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo 🚀 DEPLOYING FINORA TO GITHUB & VERCEL
echo ============================================
echo.

REM === STEP 1: Add remote and verify git ===
echo [1/4] Setting up GitHub remote...
git remote remove origin 2>nul
git remote add origin %GITHUB_REPO_URL%
if errorlevel 1 (
    echo ❌ Failed to add GitHub remote
    pause
    exit /b 1
)
echo ✅ GitHub remote added

REM === STEP 2: Rename branch to main ===
echo.
echo [2/4] Preparing branch for GitHub...
git branch -M main
if errorlevel 1 (
    echo ❌ Failed to rename branch
    pause
    exit /b 1
)
echo ✅ Branch renamed to main

REM === STEP 3: Push to GitHub ===
echo.
echo [3/4] Pushing code to GitHub...
echo.
echo This may take a minute...
echo.
git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ Failed to push to GitHub
    echo.
    echo This usually means:
    echo - You didn't create the GitHub repo yet
    echo - Your GitHub credentials aren't saved
    echo - The URL is incorrect
    echo.
    echo Try:
    echo 1. Create repo at https://github.com/new
    echo 2. Make sure it's PUBLIC
    echo 3. Copy the HTTPS URL exactly
    echo 4. Edit this script with the correct URL
    echo 5. Run again
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Code pushed to GitHub successfully!

REM === STEP 4: Display Vercel deployment instructions ===
echo.
echo [4/4] Next steps for Vercel deployment...
echo.
echo ============================================
echo ✅ GITHUB DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo 🎉 Your code is now on GitHub!
echo.
echo NEXT: Deploy to Vercel
echo ============================================
echo.
echo 1. Go to https://vercel.com
echo 2. Click "New Project"
echo 3. Click "Import Git Repository"
echo 4. Select your "finora" repository
echo 5. Click "Import"
echo.
echo 6. Vercel will ask for environment variables:
echo    Set: HUGGINGFACE_API_KEY=hf_YOUR_TOKEN_HERE
echo    Get token from: https://huggingface.co/settings/tokens
echo.
echo 7. Click "Deploy"
echo.
echo ⏱️  Deployment takes about 5 minutes
echo.
echo Your app will be live at:
echo https://finora-YOUR_USERNAME.vercel.app
echo.
echo ============================================
echo.

pause
