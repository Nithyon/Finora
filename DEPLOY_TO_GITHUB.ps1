#!/usr/bin/env pwsh
# ============================================
# FINORA DEPLOYMENT TO GITHUB & VERCEL
# ============================================
# This script deploys your Finora app to GitHub and Vercel
# 
# BEFORE RUNNING:
# 1. Create a GitHub repo at https://github.com/new
# 2. Name it: finora
# 3. Keep it PUBLIC
# 4. Click "Create repository"
# 5. Copy the HTTPS URL
# 6. Replace YOUR_GITHUB_REPO_URL below with your URL
# ============================================

# === CONFIGURATION ===
# If you forked or renamed, replace with your own HTTPS URL
$GITHUB_REPO_URL = "https://github.com/Nithyon/Finora.git"

if ($GITHUB_REPO_URL -eq "YOUR_GITHUB_REPO_URL") {
    Write-Host ""
    Write-Host "❌ ERROR: You need to set your GitHub repo URL!" -ForegroundColor Red
    Write-Host ""
    Write-Host "STEPS:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new"
    Write-Host "2. Enter 'finora' as repository name"
    Write-Host "3. Select 'Public'"
    Write-Host "4. Click 'Create repository'"
    Write-Host "5. Copy the HTTPS URL"
    Write-Host "6. Edit this file and replace YOUR_GITHUB_REPO_URL with your URL"
    Write-Host "7. Save and run this script again"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🚀 DEPLOYING FINORA TO GITHUB & VERCEL" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# === STEP 1: Add remote ===
Write-Host "[1/4] Setting up GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $GITHUB_REPO_URL
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add GitHub remote" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ GitHub remote added" -ForegroundColor Green

# === STEP 2: Rename branch ===
Write-Host ""
Write-Host "[2/4] Preparing branch for GitHub..." -ForegroundColor Yellow
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to rename branch" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Branch renamed to main" -ForegroundColor Green

# === STEP 3: Push to GitHub ===
Write-Host ""
Write-Host "[3/4] Pushing code to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This may take a minute..." -ForegroundColor Gray
Write-Host ""
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "This usually means:" -ForegroundColor Yellow
    Write-Host "- You didn't create the GitHub repo yet"
    Write-Host "- Your GitHub credentials aren't saved"
    Write-Host "- The URL is incorrect"
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "1. Create repo at https://github.com/new"
    Write-Host "2. Make sure it's PUBLIC"
    Write-Host "3. Copy the HTTPS URL exactly"
    Write-Host "4. Edit this script with the correct URL"
    Write-Host "5. Run again"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""
Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green

# === STEP 4: Display Vercel instructions ===
Write-Host ""
Write-Host "[4/4] Next steps for Vercel deployment..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ GITHUB DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Your code is now on GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Click 'New Project'" -ForegroundColor White
Write-Host "3. Click 'Import Git Repository'" -ForegroundColor White
Write-Host "4. Select your 'finora' repository" -ForegroundColor White
Write-Host "5. Click 'Import'" -ForegroundColor White
Write-Host ""
Write-Host "6. Vercel will ask for environment variables:" -ForegroundColor White
Write-Host "   Set: HUGGINGFACE_API_KEY=hf_YOUR_TOKEN_HERE" -ForegroundColor Gray
Write-Host "   Get token from: https://huggingface.co/settings/tokens" -ForegroundColor Gray
Write-Host ""
Write-Host "7. Click 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Deployment takes about 5 minutes" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your app will be live at:" -ForegroundColor Green
Write-Host "https://finora-YOUR_USERNAME.vercel.app" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
