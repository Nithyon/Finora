# Finora Complete Testing Guide

## ✅ Feature Overview

Your Finora app now has:
1. ✅ **User Authentication** (Mock login)
2. ✅ **Add Transactions** with date, category, amount, description
3. ✅ **Budget Management** with alerts
4. ✅ **Spending Dashboard** with category breakdown
5. ✅ **Budget Alerts** (Warning, Critical, Exceeded)
6. ✅ **Advanced Analytics** (Java microservice)
7. ✅ **Mobile Responsive Design**

---

## 🚀 Step-by-Step Testing Flow

### Step 1: Login
**URL:** https://finora-six.vercel.app/login

1. Enter any email: `test@example.com`
2. Enter any password: `password123`
3. Click "Login"
4. You'll be redirected to home page

**What happens:**
- ✅ User object saved to localStorage (`finora_user`)
- ✅ Auth token created
- ✅ User context loaded

---

### Step 2: Add Budget (Optional but Recommended for Alerts)
**URL:** https://finora-six.vercel.app/budget

1. Click "Add Budget Target"
2. Fill in:
   - **Category**: Select a category (e.g., Groceries)
   - **Amount**: Set a budget (e.g., ₹1000)
   - **Frequency**: Monthly
   - **Icon**: Select an emoji
3. Click "Add Budget"

**What happens:**
- ✅ Budget saved to localStorage (`finora_budget_targets`)
- ✅ Will be used for alerts on spending page

---

### Step 3: Add Transactions
**URL:** https://finora-six.vercel.app/spending → Click "💰 Add New Transaction"

1. Fill form:
   - **Type**: Expense or Income (select Expense for testing alerts)
   - **Date**: Today (or any date)
   - **Category**: Groceries (if you set budget above)
   - **Description**: "Weekly groceries"
   - **Amount**: ₹300 (first transaction)
   - **Payment Method**: Credit Card

2. Click "✅ Add Transaction"
3. You'll be redirected to Spending page

**Repeat:**
- Add multiple transactions for same category
- Try: ₹300 → ₹400 → ₹300 = ₹1000 total (will trigger alerts)

**What happens:**
- ✅ Transaction saved to localStorage (`finora_transactions_${userId}`)
- ✅ Instantly visible on Spending page
- ✅ Budget alerts triggered on Spending page
- ✅ Spending calculation updates in real-time

---

### Step 4: View Spending Dashboard
**URL:** https://finora-six.vercel.app/spending

**You'll see:**
1. **Total Spending Summary** - Total spent this month
2. **Add New Transaction Button** - Quick access
3. **Budget Alerts Section** (if spending > 70% of budget):
   - 📊 NOTICE (70-90%)
   - ⚠️ WARNING (90-100%)
   - 🚨 CRITICAL (100%+)
4. **Statistics** - Number of categories, average per category
5. **Spending by Category** - Breakdown with icons and progress bars

**Expected Alert Progression:**
- 0-70% spending: ✅ Healthy (no alert)
- 70-90% spending: 📊 Notice alert appears
- 90-100% spending: ⚠️ Warning alert appears
- 100%+ spending: 🚨 Critical alert appears

---

### Step 5: View Analytics
**URL:** https://finora-six.vercel.app/analytics

**You'll see:**
1. **Monthly Summary** (if Java service has data)
   - Total Income
   - Total Expense
   - Net Income
   - Transaction count

2. **Spending Forecast** - ML predictions
3. **Category Breakdown** - Pie/donut charts
4. **Budget Tracking** - vs limits
5. **Insights** - Smart recommendations

**Note:** 
- Analytics data comes from Java microservice
- Should populate automatically with your transactions (may take a moment)

---

## 🔧 Troubleshooting

### Issue: Transactions not showing on Spending page
**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check if localStorage has data:
   ```javascript
   // In console, run:
   JSON.parse(localStorage.getItem('finora_transactions_YOUR_USER_ID'))
   ```
5. Verify you're logged in (check `finora_user` in localStorage)

### Issue: Budget Alerts not showing
**Solution:**
1. Make sure you added a budget on /budget page
2. Add transactions for that category
3. Spending must be > 70% of budget to trigger alert
4. Refresh page if alert doesn't appear

### Issue: Analytics page says "service unavailable"
**Solution:**
1. Java service is running on Railway: `finora-production-0bb0.up.railway.app`
2. Check browser console for errors
3. Service should respond within 10 seconds
4. Try refreshing page

### Issue: Login not working
**Solution:**
1. Mock login works with ANY email/password format
2. Email must contain `@` symbol
3. Password can be anything
4. Check browser console for errors
5. Clear localStorage if stuck: `localStorage.clear()`

---

## 📊 Complete User Flow Example

```
1. Login with test@example.com / password123
   ↓
2. Go to Budget page
   ↓
3. Add Budget: Groceries ₹1000
   ↓
4. Go to Spending page
   ↓
5. Click "Add New Transaction"
   ↓
6. Add Transaction: Groceries ₹300
   ↓
7. Add Transaction: Groceries ₹400
   ↓
8. Add Transaction: Groceries ₹350
   ↓
9. View Spending page
   - See total: ₹1050
   - See alert: 🚨 CRITICAL - Budget exceeded!
   - See breakdown: Groceries 105% of ₹1000
   ↓
10. Go to Analytics page
   - See summary with ₹1050 spent
   - See insights and recommendations
   ↓
11. Add more transactions for other categories
   ↓
12. Go back to Spending to see alerts update
```

---

## 🎯 Feature Checklist

- [ ] Login works and saves user data
- [ ] Can add budget targets
- [ ] Can add transactions with all fields
- [ ] Transactions appear on spending page
- [ ] Budget alerts show when spending > 70%
- [ ] Alert severity changes with spending percentage
- [ ] Can dismiss alerts
- [ ] Spending page shows category breakdown
- [ ] Analytics page loads and displays data
- [ ] Data persists on page refresh
- [ ] Works on mobile devices

---

## 📱 Mobile Testing

1. Go to https://finora-six.vercel.app on mobile
2. All features should be responsive
3. Bottom navbar should be visible on all pages
4. Buttons should be easily tappable

---

## 🚀 Deployment Status

- **Frontend**: ✅ Live on Vercel (https://finora-six.vercel.app)
- **Java Analytics**: ✅ Live on Railway (finora-production-0bb0.up.railway.app)
- **FastAPI Backend**: ✅ Live on HuggingFace (nithiyon-finora-backend.hf.space)
- **Database**: ✅ H2 In-Memory (Railway) + localStorage (Vercel)

---

## 💾 Data Storage

All data persists using localStorage:
- `finora_user` - Current logged-in user
- `auth_token` - Auth token for API calls
- `finora_transactions_${userId}` - All transactions
- `finora_budget_targets` - Budget limits
- `finora_budget_alerts_${userId}` - Alert history

---

## 🔐 Security Notes

- This is a prototype/demo with mock authentication
- In production, use real auth (JWT, OAuth, etc.)
- localStorage is accessible to JavaScript (not secure for sensitive data)
- Use cookies with HttpOnly flag for production tokens

---

## ❓ FAQ

**Q: Why are transactions not showing immediately?**
A: They're saved to localStorage, which is synchronous. Check browser console for errors.

**Q: Can I delete transactions?**
A: Not yet - future feature. Clear localStorage manually if needed.

**Q: Does budget reset monthly?**
A: Currently no - it's perpetual. Will add monthly reset in next update.

**Q: Is the Java analytics real?**
A: Yes! It processes your transactions in real-time on Railway.

**Q: Can I use this on multiple devices?**
A: Each device has separate localStorage, so data doesn't sync. Use API in future.

---

## 📞 Support

If something doesn't work:
1. Check browser console (F12 → Console)
2. Clear localStorage: `localStorage.clear()`
3. Refresh page
4. Try incognito/private mode
5. Report error messages

