#!/usr/bin/env pwsh
# ============================================
# FINORA PROJECT RESTRUCTURE SCRIPT
# ============================================
# This script reorganizes the project for better workflow

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "📁 RESTRUCTURING FINORA PROJECT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# === STEP 1: Move feature components ===
Write-Host "[1/6] Moving feature components..." -ForegroundColor Yellow

# Transactions feature
if (Test-Path "components\AddTransactionForm.tsx") {
    Move-Item "components\AddTransactionForm.tsx" "src\features\transactions\components\" -Force
    Write-Host "  ✓ Moved AddTransactionForm" -ForegroundColor Green
}
if (Test-Path "components\TransactionList.tsx") {
    Move-Item "components\TransactionList.tsx" "src\features\transactions\components\" -Force
    Write-Host "  ✓ Moved TransactionList" -ForegroundColor Green
}

# Chat feature
if (Test-Path "components\HuggingFaceChatbot.tsx") {
    Move-Item "components\HuggingFaceChatbot.tsx" "src\features\chat\components\" -Force
    Write-Host "  ✓ Moved HuggingFaceChatbot" -ForegroundColor Green
}

# === STEP 2: Move layout components ===
Write-Host ""
Write-Host "[2/6] Moving layout components..." -ForegroundColor Yellow

if (Test-Path "components\Header.tsx") {
    Move-Item "components\Header.tsx" "src\components\layout\" -Force
    Write-Host "  ✓ Moved Header" -ForegroundColor Green
}
if (Test-Path "components\BottomNav.tsx") {
    Move-Item "components\BottomNav.tsx" "src\components\layout\" -Force
    Write-Host "  ✓ Moved BottomNav" -ForegroundColor Green
}

# === STEP 3: Move hooks ===
Write-Host ""
Write-Host "[3/6] Moving hooks..." -ForegroundColor Yellow

if (Test-Path "app\hooks\useAuthProtected.ts") {
    Move-Item "app\hooks\useAuthProtected.ts" "src\features\auth\hooks\" -Force
    Write-Host "  ✓ Moved useAuthProtected" -ForegroundColor Green
}

# === STEP 4: Move API files ===
Write-Host ""
Write-Host "[4/6] Moving API configuration..." -ForegroundColor Yellow

if (Test-Path "app\services\api.ts") {
    Move-Item "app\services\api.ts" "src\lib\api\client.ts" -Force
    Write-Host "  ✓ Moved API client" -ForegroundColor Green
}
if (Test-Path "app\config\api.ts") {
    Move-Item "app\config\api.ts" "src\lib\api\config.ts" -Force
    Write-Host "  ✓ Moved API config" -ForegroundColor Green
}

# === STEP 5: Move backend files ===
Write-Host ""
Write-Host "[5/6] Organizing backend..." -ForegroundColor Yellow

if (Test-Path "api\main.py") {
    Copy-Item "api\main.py" "backend\" -Force
    Write-Host "  ✓ Copied main.py" -ForegroundColor Green
}
if (Test-Path "api\chatbot.py") {
    Copy-Item "api\chatbot.py" "backend\services\chatbot_service.py" -Force
    Write-Host "  ✓ Copied chatbot service" -ForegroundColor Green
}
if (Test-Path "api\requirements.txt") {
    Copy-Item "api\requirements.txt" "backend\" -Force
    Write-Host "  ✓ Copied requirements" -ForegroundColor Green
}

# === STEP 6: Move documentation ===
Write-Host ""
Write-Host "[6/6] Organizing documentation..." -ForegroundColor Yellow

$docFiles = @(
    "BACKEND_GUIDE.md",
    "DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_CHECKLIST.md",
    "API.md",
    "UI_UX_DESIGN.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ RESTRUCTURE COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Update import paths in your files!" -ForegroundColor Yellow
Write-Host ""
Write-Host "New import examples:" -ForegroundColor White
Write-Host "  Import components from features or lib folders" -ForegroundColor Gray
Write-Host "  Use @ alias for clean imports" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review RESTRUCTURE.md for complete details" -ForegroundColor White
Write-Host "  2. Update import paths in affected files" -ForegroundColor White
Write-Host "  3. Run: npm run build" -ForegroundColor White
Write-Host "  4. Test the application" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
