# 🧪 Finora Testing Guide

Complete guide for testing, validating, and running the Finora financial planning application.

---

## Quick Start - Testing the App

### 1. **Load Demo Data**
- Navigate to **Settings** (💬 Chat icon, then scroll down)
- Scroll down to **Developer** section
- Click **🧪 Testing & Validation**
- Click **📊 Load Realistic Demo Data**
- **Refresh the page** to see the data loaded

### 2. **Explore with Demo Data**
Once demo data is loaded, visit these pages to see everything working:

- **Home Page** (🏠) - See Budget Overview, Available to Assign
- **Spending** (💳) - See spending velocity alerts and category breakdown
- **Accounts** (🏦) - View account balances
- **Analytics** (📊) - See 5+ interactive charts and visualizations
- **Reflect/Goals** - See goal progress and recommendations
- **Insights** (Coming from Reflect) - Personalized financial recommendations

### 3. **Run Tests**
From the Dev/Test page:
- **Run Validation Tests** - Tests all input validation logic
- **Run Health Check** - Verifies data integrity and calculates statistics

### 4. **Clear Demo Data**
When done testing:
- Go back to Dev/Test page
- Click **🗑️ Clear All Demo Data**
- Refresh the page

---

## What Gets Tested

### ✅ Demo Data Contents

The demo data includes:
- **20+ Realistic Transactions** across 8 categories
- **5 Spending Categories** with monthly budgets
- **3 Long-term Goals** with progress tracking
- **Current Month Focus** - All transactions dated in current month
- **Realistic Amounts** - Category-specific ranges (Groceries 2-5k, Rent 20k, etc.)

### ✅ Validation Tests Verify

1. **Amount Validation**
   - ✓ Valid amounts accepted
   - ✓ Negative amounts rejected
   - ✓ Zero amounts rejected
   - ✓ Extremely large amounts rejected

2. **Budget Validation**
   - ✓ Valid budgets accepted
   - ✓ Negative budgets rejected
   - ✓ Zero budgets rejected

3. **Category Validation**
   - ✓ Valid category names accepted
   - ✓ Empty categories rejected
   - ✓ Excessively long names rejected

4. **Goal Validation**
   - ✓ Valid goals with future dates accepted
   - ✓ Invalid names rejected
   - ✓ Invalid amounts rejected
   - ✓ Past deadlines rejected

5. **Email Validation**
   - ✓ Valid email formats accepted
   - ✓ Invalid formats rejected

6. **Income Validation**
   - ✓ Valid income accepted
   - ✓ Negative income rejected

### ✅ Health Check Verifies

- **Data Integrity**
  - Duplicate transaction detection
  - Missing field detection
  - Orphaned data detection
  - Consistency checks

- **Financial Summary**
  - Total income calculation
  - Total expenses calculation
  - Current balance
  - Savings rate percentage
  - Budget tracking stats
  - Transaction count and categories

---

## Features to Validate Manually

### 1. **Budget Page** (🏠)
- [ ] Budget cards show correct targets and spending
- [ ] Color-coded status (Green/Yellow/Red)
- [ ] Velocity metrics display (Avg/day, Projected total, Days until budget)
- [ ] Smart status messages about spending pace

### 2. **Spending Page** (💳)
- [ ] Transactions display correctly
- [ ] Spending velocity calculations accurate
- [ ] Alerts appear for over-budget categories
- [ ] Category breakdown shows accurate totals
- [ ] Transaction filtering works

### 3. **Analytics Page** (📊)
- [ ] Month selector works
- [ ] Income/Expense/Savings cards update correctly
- [ ] Velocity gauge displays accurately
- [ ] All 5 chart types render:
  - Spending by category (pie/donut)
  - Income vs expenses (bar)
  - Monthly spending trend (line)
  - Goal progress (horizontal bar)
  - Budget utilization (stacked bar)

### 4. **Goals/Reflect Page** (🎯)
- [ ] Goal cards show progress
- [ ] Progress bars accurate
- [ ] Completion timelines calculated correctly
- [ ] Recommendations display (if applicable)
- [ ] Goal filtering works

### 5. **Insights Page** (NEW - Via Reflect)
- [ ] Key metrics display correctly
- [ ] Personalized insights generate
- [ ] Smart messages appear based on financial health
- [ ] Top spending categories show accurately
- [ ] Goal progress summary matches Goals page

### 6. **Home Page** (Updated)
- [ ] Available to Assign displays correctly
- [ ] Calculation matches: Income - Total Expenses
- [ ] Updates in real-time when data changes
- [ ] Color coding indicates financial status

---

## Key Calculations to Verify

### Spending Velocity
Formula: `Average Daily Spending = Total Month Spending / Days in Month`

Expected with demo data:
- Should show daily burn rate
- Should project monthly total if pace continues
- Should calculate days until budget exhaustion

### Available to Assign (YNAB Rule 1)
Formula: `Income - Total Expenses - Committed Goals`

Expected with demo data:
- Should be positive (income > expenses)
- Should update when transactions are added/removed

### Savings Rate
Formula: `Savings Rate = (Income - Expenses) / Income * 100`

Expected with demo data:
- Should display as percentage
- Benchmarks: 30%+ excellent, 15%+ healthy, <15% low

### Goal Progress
Formula: `Progress % = (Current Amount / Target Amount) * 100`

Expected with demo data:
- Emergency Fund: ~35%
- Vacation: ~30%
- Home Renovation: ~37.5%

---

## Troubleshooting

### Demo Data Not Showing
1. Check browser's localStorage isn't full
2. Clear browser cache if needed
3. Try refreshing page after loading demo data
4. Check browser console for errors

### Calculations Seem Wrong
1. Run "Run Health Check" to verify data integrity
2. Check if categories match between transactions and budgets
3. Verify transaction dates are in current month
4. Check localStorage directly in DevTools

### Tests Not Running
1. Ensure you're logged in
2. Check user ID is being detected
3. Clear browser console errors
4. Try clearing data and reloading

### Missing Data on Pages
1. Ensure demo data was actually loaded (check localStorage)
2. Try refreshing the page
3. Navigate between pages and back
4. Check browser console for JavaScript errors

---

## Developer Utilities Location

**Settings → Developer → 🧪 Testing & Validation**

Or directly visit: `/dev-test`

---

## Data Storage

Demo data is stored in localStorage under these keys:
```
finora_transactions_[user-id]
finora_budget_targets
finora_goals_[user-id]
finora_accounts
```

To manually clear: Settings → Developer → Clear All Demo Data

---

## Next Testing Steps

1. ✅ Load demo data
2. ✅ Run validation tests
3. ✅ Run health check
4. ✅ Manually verify each page
5. ✅ Test calculations match expected values
6. ⏳ Test edge cases (next session)
7. ⏳ Performance testing
8. ⏳ User acceptance testing

---

## Utilities Used

### Services
- **TransactionService** - Unified transaction calculations and analysis
- **GoalService** - Goal tracking and progress calculations
- **ChartUtils** - Chart data generation for visualizations
- **ValidationService** - Input validation and data integrity checks
- **DemoDataService** - Realistic test data generation

### Pages
- **Dev/Test Page** (`/dev-test`) - Testing hub
- **Insights Page** (`/insights`) - Personalized recommendations (via Reflect)
- **Settings Page** (`/settings`) - Developer link access

---

Generated: Session 3, Phase 2 - Testing Infrastructure
Last Updated: Current Session
Status: ✅ Complete - Ready for Testing
