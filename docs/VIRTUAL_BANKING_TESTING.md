# 🧪 Virtual Banking - Testing Guide

## Quick Test (5 minutes)

### Test 1: Create Virtual Account
```
1. Go to: /accounts
2. Tab: "🏦 Virtual" (should be selected)
3. Click: "➕ Create Virtual Account"
4. Fill form:
   - Account Name: "My First Account"
   - Type: "💳 Checking Account"
   - Initial Balance: 5000
5. Click: "✅ Create"
6. ✅ Expect: Pop-up with account number (FINORA-XXXX-XXXX-XXXX-XXXX)
7. ✅ Expect: Account card appears with ₹5,000 balance
```

### Test 2: Deposit Money
```
1. On account card, click: "💰 Deposit"
2. Enter amount: 1000
3. Click OK
4. ✅ Expect: Pop-up "Deposit successful! New balance: ₹6,000"
5. ✅ Expect: Card balance updates to ₹6,000
```

### Test 3: Withdraw Money
```
1. On account card, click: "💸 Withdraw"
2. Enter amount: 2000
3. Click OK
4. ✅ Expect: Pop-up "Withdrawal successful! New balance: ₹4,000"
5. ✅ Expect: Card balance updates to ₹4,000
```

### Test 4: Data Persistence
```
1. Refresh page (F5 or Cmd+R)
2. ✅ Expect: Account still visible with same balance
3. ✅ Expect: Transaction history preserved
```

### Test 5: Create Multiple Accounts
```
1. Click "➕ Create Virtual Account" again
2. Fill form:
   - Account Name: "My Savings"
   - Type: "🏦 Savings Account (4.5% APR)"
   - Initial Balance: 10000
3. Click "✅ Create"
4. Fill form again:
   - Account Name: "Investment"
   - Type: "📈 Investment Account (7% APR)"
   - Initial Balance: 20000
5. Click "✅ Create"
6. ✅ Expect: Three accounts visible
7. ✅ Expect: Total Balance shows ₹39,000 (5000+10000+20000 after withdrawals)
```

## Edge Cases to Test

### Test 6: Invalid Balance
```
1. Click "➕ Create Virtual Account"
2. Enter:
   - Account Name: "Test"
   - Type: Any
   - Initial Balance: -1000 (negative)
3. Click "✅ Create"
4. ✅ Expect: Alert "Please enter valid initial balance"
5. ✅ Expect: Form stays open
```

### Test 7: Withdraw More Than Balance
```
1. On account with ₹5,000, click "💸 Withdraw"
2. Enter: 10000
3. Click OK
4. ✅ Expect: Alert with error message
5. ✅ Expect: Balance unchanged
```

### Test 8: No Account Name
```
1. Click "➕ Create Virtual Account"
2. Leave Account Name empty
3. Fill other fields
4. Click "✅ Create"
5. ✅ Expect: Alert "Please enter account name"
```

### Test 9: Real Banks Tab
```
1. Click "🏛️ Real Banks" tab
2. ✅ Expect: Coming soon message
3. ✅ Expect: List of future features:
   - Plaid Integration (Bank accounts)
   - Credit Card Connections
   - Real-time Sync
   - Multi-bank Support
4. ✅ Expect: Note about using Virtual Accounts for now
```

## Advanced Tests

### Test 10: Account Summary Stats
```
1. Make deposits/withdrawals on an account
2. Card should show:
   - Income: ₹XXXX (all deposits)
   - Expenses: ₹XXXX (all withdrawals)
   - Txns: N (transaction count)
3. ✅ Expect: Numbers match your activity
```

### Test 11: Account Types
```
1. Create Checking account (0.5% APR)
2. Create Savings account (4.5% APR)
3. Create Investment account (7% APR)
4. ✅ Expect: Each shows correct rate in description
5. ✅ Expect: Different color gradients:
   - Checking: Blue
   - Savings: Green
   - Investment: Purple
```

### Test 12: View Details (Future)
```
1. Click "📊 View Details" on account
2. ✅ Expect: Detailed transaction page (when implemented)
3. Currently shows 404 (expected)
```

## Mobile Testing

### Test 13: Mobile Responsiveness
```
1. Open /accounts on mobile
2. ✅ Expect: Layout fits screen
3. ✅ Expect: Buttons are touchable
4. ✅ Expect: Cards are readable
5. ✅ Expect: Navigation bar at bottom
```

### Test 14: Create on Mobile
```
1. Click "➕ Create Virtual Account" on mobile
2. Fill form (should be mobile-optimized)
3. ✅ Expect: Keyboard doesn't hide form
4. ✅ Expect: Submit button is accessible
```

## Data Verification

### Test 15: Check localStorage
```
1. Go to /accounts
2. Create account with ₹1,000 initial balance
3. Open DevTools (F12)
4. Go to Application → Local Storage
5. ✅ Expect: Key `finora_bank_accounts_[userId]`
6. ✅ Expect: Value contains account data with ₹1,000 balance
7. ✅ Expect: Key `finora_bank_transactions_[userId]`
8. ✅ Expect: Value contains transaction array
```

### Test 16: Cross-Tab Sync
```
1. Open /accounts in Tab A
2. Open /accounts in Tab B
3. Create account in Tab A
4. ✅ Note: Tab B won't auto-update (localStorage limitation)
5. Refresh Tab B
6. ✅ Expect: Account appears in Tab B
7. Note: This is expected behavior (no cross-tab sync yet)
```

## Integration Tests

### Test 17: Link with Spending
```
1. Go to /spending page
2. Note current transactions
3. Go to /accounts
4. Deposit money to account
5. Go back to /spending
6. ✅ Currently: No automatic link (expected)
7. Note: Future: Can link account transactions to spending
```

### Test 18: User Login
```
1. Logout from app
2. Go to /accounts
3. ✅ Expect: May require login
4. Or: Empty state "Please log in first"
5. Login with test account
6. Go to /accounts
7. ✅ Expect: Create account works
8. Logout and login with different user
9. ✅ Expect: Different accounts (userId separation)
```

## Performance Tests

### Test 19: Many Accounts
```
1. Create 10+ accounts
2. ✅ Expect: Page loads quickly
3. ✅ Expect: No lag when scrolling
4. ✅ Expect: Buttons are responsive
```

### Test 20: Many Transactions
```
1. Create account
2. Add 100 deposits/withdrawals
3. ✅ Expect: Page still responsive
4. ✅ Expect: Stats calculate correctly
5. ✅ Note: May see performance at extreme scale
```

## Cleanup After Testing

### Clear Test Data
```
// In DevTools Console:
localStorage.removeItem('finora_bank_accounts_[userId]')
localStorage.removeItem('finora_bank_transactions_[userId]')
// Then refresh page
```

## Test Results Template

```
Test Case: [Name]
Status: ✅ PASS / ❌ FAIL / ⚠️ WARNING
Notes: [What you observed]
Steps to Reproduce: [If failed]
Expected: [What should happen]
Actual: [What actually happened]
```

## Known Limitations

### Current State (MVP)
- ❌ No interest calculation UI (logic exists)
- ❌ No transfers between accounts UI (logic exists)
- ❌ No account details page
- ❌ No statement export
- ❌ No cross-tab sync
- ⚠️ Data limited to localStorage (no cloud backup)

### Planned (When Funded)
- ✅ Real bank integration (Plaid)
- ✅ Credit card connections
- ✅ Cloud database backup
- ✅ Interest calculation scheduling
- ✅ Cross-device sync
- ✅ Statement generation

## Bugs to Report

If you find issues:
1. Note the test that failed
2. Steps to reproduce
3. Expected vs actual behavior
4. Device/browser info
5. Screenshot if possible
6. Create GitHub issue or contact support

---

**Testing Completed**: October 2025
**Test Environment**: Localhost + Production ready
**Status**: ✅ Ready for User Testing
