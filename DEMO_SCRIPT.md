# FINORA - 5 Minute Demo Explanation Transcript
## PBL II Project Demonstration
**Screen Recording Guide with Complete Technical Explanation**

---

## [00:00-00:30] INTRODUCTION & PROJECT OVERVIEW

"Hello, I'm demonstrating Finora, a personal finance management application built with modern web technologies. Finora helps users track spending, manage budgets, set financial goals, and get AI-powered financial insights.

The application is built with a full-stack architecture:
- **Frontend**: Next.js 14 with React (TypeScript)
- **Backend**: FastAPI with Python
- **Database**: SQLite with SQLAlchemy ORM
- **Deployment**: Vercel (Frontend) and Docker (Backend)

Let me walk you through the complete flow: from user input, through the frontend interface, backend processing, and final output."

---

## [00:30-01:30] FRONTEND ARCHITECTURE & USER INPUT

### [SHOW IN VS CODE: `/app` folder structure]

"Starting with the frontend, we have a Next.js 14 application with TypeScript. The project uses a component-based architecture.

### Key Frontend Components:

**1. Input Layer - Where users enter data:**
- **Dashboard** (`app/page.tsx`) - displays financial overview
- **Add Transaction** (`app/spending/page.tsx`) - users input spending details
- **Budget Settings** (`app/personalize-plan/page.tsx`) - set monthly budget targets
- **Goals page** (`app/reflect/page.tsx`) - create financial goals
- **Spending Tracker** (`app/spending/page.tsx`) - record daily expenses

**2. State Management - React Context API:**
Located in: `src/lib/context/AppContext.tsx`
- AppContext manages global app state
- Stores: user authentication, transactions, accounts, budgets
- Real-time updates across all pages
- Automatically syncs with backend API

**3. UI Components:**
- **BottomNavbar** (`components/layout/BottomNavbar.tsx`) - 6-item navigation
- **Modal dialogs** - data entry forms
- **Charts and visualizations** - data display
- **Category-based organization** - intuitive grouping

### User Flow Example - Adding a Transaction:

```
1. User taps 'Spending' tab (💳 icon)
   → Navigates to /spending page
   
2. Clicks 'Add Transaction' button
   → Modal opens with input fields
   
3. User enters:
   - Amount: ₹500
   - Category: 🍽️ Food
   - Date: 2025-10-22
   - Account: Checking
   - Description: Lunch
   
4. Clicks 'Save' button
   → Frontend calls: await addTransaction({...})
   
5. Request sent to backend:
   POST https://nithiyon-finora-backend.hf.space/transactions
   
6. Backend validates and stores
   
7. Response returned with transaction ID
   
8. UI updates immediately:
   - Transaction added to list
   - Spending total updated
   - Budget remaining calculated
```

### Frontend Data Flow:

```
User Input (Form)
    ↓
React State Update
    ↓
API Call (fetch POST)
    ↓
AppContext Update
    ↓
Component Re-render
    ↓
User sees updated data
```

---

## [01:30-02:45] BACKEND PROCESSING & API LAYER

### [SHOW IN VS CODE: `/backend` folder structure]

"Now let's look at the backend. We're using FastAPI, a modern Python framework that's incredibly fast and provides automatic API documentation.

### Backend Architecture - 3 Layers:

#### Layer 1: API Endpoints (FastAPI Routes)
**Location:** `backend/main.py` (519 lines)

**Transaction Endpoints:**
```python
@app.post("/transactions", response_model=TransactionSchema)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    '''Create a new transaction'''
    # Validates input
    # Creates record in database
    # Returns transaction with ID

@app.get("/users/{user_id}/transactions")
def get_transactions(user_id: int, filters: dict = None):
    '''Get all transactions for a user with optional filtering'''
    # Filters by category, date range, type
    # Returns list of transactions

@app.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: int, updates: dict):
    '''Update existing transaction'''
    # Validates new data
    # Updates in database
    # Recalculates budget

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):
    '''Delete transaction'''
    # Removes from database
    # Updates budget summary
```

**Other Endpoints:**
- Budget: `POST/GET/PUT /users/{user_id}/budgets`
- Goals: `POST/GET/PUT /users/{user_id}/goals`
- Accounts: `POST/GET /users/{user_id}/accounts`
- User: `POST/GET /users`
- Chat: `POST /chat` (AI financial advice)

#### Layer 2: Business Logic (Services)
**Location:** `backend/services/` and `backend/models.py`

**What happens when transaction arrives:**

```python
# 1. Request received with JSON data
{
    "user_id": 1,
    "amount": 500,
    "category": "Food",
    "date": "2025-10-22",
    "account_id": 1,
    "description": "Lunch at restaurant"
}

# 2. Input Validation
- Is amount positive? ✓
- Does user exist? ✓
- Is category valid? ✓
- Is account owned by user? ✓

# 3. Create Transaction Object
new_transaction = Transaction(
    user_id=1,
    amount=500,
    category="Food",
    account_id=1,
    date="2025-10-22",
    description="Lunch at restaurant"
)

# 4. Save to database
db.add(new_transaction)
db.commit()

# 5. Calculate updates
month_spending = db.query(Transaction).filter(...).sum(amount)  # ₹2,500
budget_limit = db.query(Budget).filter(...).first().amount     # ₹5,000
remaining = 5000 - 2500  # ₹2,500

# 6. Return response
{
    "id": 42,
    "user_id": 1,
    "amount": 500,
    "category": "Food",
    "date": "2025-10-22",
    "status": "success",
    "budget_remaining": 2500
}
```

#### Layer 3: Database Operations (SQLAlchemy ORM)
**Location:** `backend/models.py`

Instead of writing raw SQL, we use SQLAlchemy ORM:

```python
# ORM Model Definition
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    amount = Column(Float)
    transaction_type = Column(String)  # "income" or "expense"
    category = Column(String)
    description = Column(String)
    date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

# What SQLAlchemy does internally:
# db.add(transaction) 
#   ↓ (converts to SQL)
# INSERT INTO transactions (user_id, amount, category, date) 
# VALUES (1, 500, 'Food', '2025-10-22')
#   ↓ (executes against SQLite)
# Returns transaction with ID 42
```

### API Request-Response Example:

**Frontend sends:**
```
POST /api/transactions HTTP/1.1
Host: nithiyon-finora-backend.hf.space
Content-Type: application/json

{
  "user_id": 1,
  "amount": 500,
  "category": "Food",
  "account_id": 1,
  "description": "Lunch"
}
```

**Backend responds:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "user_id": 1,
  "amount": 500,
  "category": "Food",
  "account_id": 1,
  "description": "Lunch",
  "date": "2025-10-22",
  "created_at": "2025-10-22T14:30:45.123Z"
}
```

**Frontend receives and:**
- Updates AppContext with new transaction
- Re-renders spending list
- Recalculates dashboard totals
- Shows success notification

---

## [02:45-04:00] DATABASE & DATA FLOW DEMONSTRATION

### [SHOW IN BROWSER: DevTools Network Tab]

"Let me show you the actual data flow through the system in real-time.

### Database Schema - SQLite Tables:

```
Users Table
├── id (Primary Key)
├── name
├── email
└── created_at

Accounts Table
├── id (Primary Key)
├── user_id (Foreign Key)
├── name
├── account_type
├── balance
└── created_at

Transactions Table
├── id (Primary Key)
├── user_id (Foreign Key)
├── account_id (Foreign Key)
├── amount
├── transaction_type (income/expense)
├── category
├── description
├── date
└── created_at

Budgets Table
├── id (Primary Key)
├── user_id (Foreign Key)
├── category
├── amount (monthly limit)
├── spent (month-to-date)
├── remaining (amount - spent)
├── period (monthly/yearly)
└── created_at

Goals Table
├── id (Primary Key)
├── user_id (Foreign Key)
├── name
├── target_amount
├── current_amount
├── deadline
├── status
└── created_at
```

### Complete Data Flow Demonstration:

#### Scenario 1: User Adds ₹500 Food Expense

**Frontend JavaScript:**
```javascript
// File: app/spending/page.tsx
const handleAddTransaction = async () => {
  const newTransaction = {
    user_id: 1,
    account_id: 1,
    amount: 500,
    category: "Food",
    description: "Lunch at restaurant",
    date: "2025-10-22"
  };
  
  try {
    const response = await fetch(
      'https://nithiyon-finora-backend.hf.space/transactions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      }
    );
    
    const createdTx = await response.json();
    // Update React state
    setTransactions([...transactions, createdTx]);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Network Tab shows:**
```
POST /transactions
Status: 201 Created
Payload: 138 bytes
Response: 256 bytes
Time: 145ms
```

**Backend Python:**
```python
# File: backend/main.py
@app.post("/transactions")
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # 1. Validate
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    # 2. Create object
    db_transaction = Transaction(
        user_id=transaction.user_id,
        account_id=transaction.account_id,
        amount=transaction.amount,
        category=transaction.category,
        description=transaction.description,
        date=transaction.date
    )
    
    # 3. Save to database
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    # 4. Return
    return db_transaction
```

**SQLite Database:**
```sql
-- SQLAlchemy executes:
INSERT INTO transactions 
(user_id, account_id, amount, category, description, date, created_at)
VALUES (1, 1, 500, 'Food', 'Lunch at restaurant', '2025-10-22', datetime('now'))

-- New row created with ID 42
-- Database now contains:
id  | user_id | amount | category | date
42  | 1       | 500    | Food     | 2025-10-22
```

**Frontend receives response:**
```json
{
  "id": 42,
  "user_id": 1,
  "amount": 500,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2025-10-22",
  "created_at": "2025-10-22T14:30:45Z"
}
```

#### Scenario 2: User Views Dashboard

**Frontend makes GET request:**
```javascript
// Load all data on dashboard mount
useEffect(() => {
  const loadData = async () => {
    const transactions = await fetch(
      `/api/transactions?user_id=1&month=2025-10`
    );
    const budgets = await fetch(`/api/budgets?user_id=1`);
    const accounts = await fetch(`/api/accounts?user_id=1`);
    // ... set state with data
  };
  loadData();
}, [userId]);
```

**Backend receives requests:**
```python
@app.get("/users/{user_id}/transactions")
def get_transactions(user_id: int, db: Session = Depends(get_db)):
    # Query database
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id
    ).all()
    
    # Equivalent SQL:
    # SELECT * FROM transactions WHERE user_id = 1
    
    return transactions
```

**Database processes query:**
```sql
-- SQLite executes:
SELECT * FROM transactions WHERE user_id = 1 ORDER BY date DESC

-- Returns:
id  | user_id | amount | category | date       | created_at
42  | 1       | 500    | Food     | 2025-10-22 | 2025-10-22 14:30:45
41  | 1       | 1200   | Transport| 2025-10-22 | 2025-10-22 10:15:30
40  | 1       | 3200   | Rent     | 2025-10-21 | 2025-10-21 08:00:00
... (42 more rows for this month)
```

**Backend returns JSON:**
```json
[
  {
    "id": 42,
    "user_id": 1,
    "amount": 500,
    "category": "Food",
    "date": "2025-10-22",
    ...
  },
  {
    "id": 41,
    "user_id": 1,
    "amount": 1200,
    "category": "Transport",
    "date": "2025-10-22",
    ...
  },
  ...
]
```

**Frontend processes:**
```javascript
// Calculate totals
const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
// Result: ₹28,450

// Group by category
const byCategory = {
  "Food": ₹5,200,
  "Transport": ₹3,500,
  "Rent": ₹12,000,
  "Entertainment": ₹2,750,
  "Shopping": ₹2,500,
  "Utilities": ₹2,500
};

// Calculate budget status
const budget = 50000;
const remaining = budget - totalSpent;  // ₹21,550
const percentage = (totalSpent / budget) * 100;  // 56.9%
```

#### Scenario 3: User Updates a Transaction

**Frontend sends:**
```
PUT /transactions/42
{
  "amount": 550,
  "category": "Food"
}
```

**Backend executes:**
```python
@app.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: int, data: dict, db: Session = Depends(get_db)):
    # Find transaction
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    # Update fields
    tx.amount = 550
    tx.category = "Food"
    
    # Save to database
    db.commit()
    db.refresh(tx)
    
    # SQL: UPDATE transactions SET amount=550 WHERE id=42
    
    return tx
```

#### Scenario 4: User Deletes a Transaction

**Frontend sends:**
```
DELETE /transactions/42
```

**Backend executes:**
```python
@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    # Find and delete
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    db.delete(tx)
    db.commit()
    
    # SQL: DELETE FROM transactions WHERE id=42
    
    return {"message": "Transaction deleted"}
```

---

## [04:00-04:45] OUTPUT & VISUALIZATION LAYER

### [SHOW IN BROWSER: Live Finora App]

"Now let's see what the user actually sees - the beautiful output that brings all this data to life.

### Page 1: Dashboard (Home Page)

**What's displayed:**
```
┌─────────────────────────────────────┐
│         💰 FINORA BUDGET APP        │
├─────────────────────────────────────┤
│ Ready to Assign: ₹21,550            │
│ ═══════════════ Progress Bar        │
├─────────────────────────────────────┤
│  Budget Categories (Cards):         │
│  ┌────────────────────────────────┐ │
│  │ 🏠 Rent: ₹12,000/₹12,000 (100%)│ │
│  │ [████████████████████] YELLOW  │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 🍽️ Food: ₹5,200/₹6,000 (86%)   │ │
│  │ [███████████████░░░░] YELLOW   │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 🚗 Transport: ₹3,500/₹5,000(70%)│ │
│  │ [██████████░░░░░░░░░] GREEN    │ │
│  └────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Spending Overview: ₹28,450/₹50,000  │
│ ════════════════════════░░░░░░░░░░░ │
│ [View Breakdown →]                  │
├─────────────────────────────────────┤
│ 🏠 🎯 💳 🏦 💬 ⚙️  (Bottom Nav)       │
└─────────────────────────────────────┘
```

**Data Sources:**
- **Balance**: Sum of all accounts from Accounts table
- **Budget progress**: Calculated from Budgets & Transactions tables
- **Color coding**:
  - 🟢 Green: 0-50% spent
  - 🟡 Yellow: 50-90% spent
  - 🔴 Red: 90%+ spent

### Page 2: Spending Page

**What's displayed:**
```
┌─────────────────────────────────────┐
│         💳 SPENDING TRACKER         │
├─────────────────────────────────────┤
│ Showing October 2025                │
│ Total: ₹28,450                      │
├─────────────────────────────────────┤
│ Recent Transactions:                │
│                                     │
│ 🍽️ Food - ₹500                      │
│   Lunch at restaurant               │
│   Today at 2:30 PM                  │
│   [Edit] [Delete]                   │
│                                     │
│ 🚗 Transport - ₹1,200               │
│   Fuel & parking                    │
│   Today at 10:15 AM                 │
│   [Edit] [Delete]                   │
│                                     │
│ 🏠 Rent - ₹12,000                   │
│   Monthly rent payment              │
│   Oct 21                            │
│   [Edit] [Delete]                   │
│                                     │
│ ... (40+ more transactions)         │
│                                     │
│ [Load More] or [Scroll]             │
└─────────────────────────────────────┘
```

**Data displayed:**
- Emoji icon + amount (from Transactions table)
- Description (from Transactions.description)
- Date & time (formatted from Transactions.date)
- Edit/Delete buttons (call API endpoints)

### Page 3: Budget Settings (Personalize Plan)

**What's displayed:**
```
┌─────────────────────────────────────┐
│      🎯 PERSONALIZE YOUR PLAN       │
├─────────────────────────────────────┤
│ Bills Category                      │
│ ┌─────────────────────────────────┐ │
│ │ 🏠 Rent                         │ │
│ │ Budget: ₹12,000/month           │ │
│ │ Due: Last day of month          │ │
│ │ [Edit] [Change]                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ Utilities                     │ │
│ │ Budget: ₹3,000/month            │ │
│ │ Due: 1st of month               │ │
│ │ [Edit] [Change]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Needs Category                      │
│ ┌─────────────────────────────────┐ │
│ │ 🍽️ Groceries                    │ │
│ │ Budget: ₹6,000/month            │ │
│ │ [Edit] [Change]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Total Monthly Commitment:           │
│ ₹28,500                             │
├─────────────────────────────────────┤
│ Bottom Nav: 🏠 🎯 💳 🏦 💬 ⚙️        │
└─────────────────────────────────────┘
```

**When user edits a budget:**
```javascript
// User clicks "Edit" → Modal opens
// Modal shows input field with current amount
// User changes ₹12,000 → ₹13,000
// Clicks "Save"

// Frontend:
PUT /budgets/1 { "amount": 13000 }

// Backend:
UPDATE budgets SET amount = 13000 WHERE id = 1

// Frontend receives: { "id": 1, "amount": 13000, ... }
// UI updates showing new amount
// Total commitment recalculated: ₹29,500
```

### Page 4: Accounts Page

**What's displayed:**
```
┌─────────────────────────────────────┐
│         🏦 MY ACCOUNTS              │
├─────────────────────────────────────┤
│ Checking Account                    │
│ ┌─────────────────────────────────┐ │
│ │ Balance: ₹25,000                │ │
│ │ Spent this month: ₹12,450       │ │
│ │ Health: Excellent (50% used)    │ │
│ │ [View Details]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Savings Account                     │
│ ┌─────────────────────────────────┐ │
│ │ Balance: ₹85,000                │ │
│ │ Spent this month: ₹0            │ │
│ │ Health: Perfect                 │ │
│ │ [View Details]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Total Balance: ₹110,000             │
└─────────────────────────────────────┘
```

**Data Sources:**
- Account names from Accounts table
- Balance calculated from Accounts.balance
- Spending calculated from Transactions WHERE category matches account

### Page 5: Goals Page

**What's displayed:**
```
┌─────────────────────────────────────┐
│         🎯 FINANCIAL GOALS          │
├─────────────────────────────────────┤
│ Goals Progress                      │
│                                     │
│ Emergency Fund                      │
│ Target: ₹100,000                    │
│ Current: ₹25,000 (25%)              │
│ [████░░░░░░░░░░░░░░░] Progress      │
│ Deadline: Dec 31, 2025              │
│ [Edit Goal]                         │
│                                     │
│ Dream Vacation                      │
│ Target: ₹75,000                     │
│ Current: ₹12,000 (16%)              │
│ [██░░░░░░░░░░░░░░░░░] Progress      │
│ Deadline: Jun 30, 2026              │
│ [Edit Goal]                         │
│                                     │
│ New Car                             │
│ Target: ₹500,000                    │
│ Current: ₹5,000 (1%)                │
│ [░░░░░░░░░░░░░░░░░░░] Progress      │
│ Deadline: Dec 31, 2027              │
│ [Edit Goal]                         │
└─────────────────────────────────────┘
```

### Page 6: Settings Page

**What's displayed:**
```
┌─────────────────────────────────────┐
│         ⚙️ SETTINGS                  │
├─────────────────────────────────────┤
│ Account                             │
│ Logged in as: demo@finora.app       │
│ [Change Password] [Edit Profile]    │
│                                     │
│ Preferences                         │
│ □ Weekly Spending Report            │
│ ☑ Budget Alerts                     │
│ ☑ Goal Reminders                    │
│ □ Dark Mode                         │
│                                     │
│ Currency: ₹ (INR)                   │
│ Language: English                   │
│ [Change Settings]                   │
│                                     │
│ [Logout] [Delete Account]           │
└─────────────────────────────────────┘
```

### Real-time Updates in Action:

**Scenario: User adds transaction while dashboard open**
```
1. User on Dashboard page
2. Navigates to Spending page
3. Adds ₹500 transaction
4. Clicks Save
5. API call returns success
6. User navigates back to Dashboard
7. Dashboard has AUTOMATICALLY updated:
   - Total: ₹28,950 (was ₹28,450)
   - Budget remaining: ₹21,050 (was ₹21,550)
   - Food category: Now ₹5,700 (was ₹5,200)

This happens because AppContext refreshes all data on every navigation!
```

---

## [04:45-05:00] TECHNOLOGY STACK SUMMARY & CONCLUSION

### Technology Stack Overview:

**Frontend Stack:**
```
┌─────────────────────────────────────┐
│      NEXT.JS 14 + REACT 18          │
│   TypeScript for Type Safety        │
├─────────────────────────────────────┤
│  Components (Reusable UI)           │
│  Pages (Routes)                     │
│  Services (API Calls)               │
│  Hooks (State Management)           │
│  Context API (Global State)         │
├─────────────────────────────────────┤
│     TAILWIND CSS (Styling)          │
│  Mobile-First Responsive            │
│  Dark Theme (Blue/Purple)           │
├─────────────────────────────────────┤
│    DEPLOYMENT: VERCEL               │
│  Auto-deploy on git push            │
│  URL: finora-six.vercel.app         │
└─────────────────────────────────────┘
```

**Backend Stack:**
```
┌─────────────────────────────────────┐
│      FASTAPI (Python)               │
│   Modern, Fast, Auto-Docs           │
├─────────────────────────────────────┤
│  REST API Endpoints                 │
│  Request Validation                 │
│  Error Handling                     │
│  CORS Support                       │
├─────────────────────────────────────┤
│   SQLALCHEMY ORM                    │
│   Database Abstraction              │
│   Automatic SQL Generation          │
│   Relationship Management           │
├─────────────────────────────────────┤
│    SQLITE DATABASE                  │
│   File-based, No Setup              │
│   ACID Compliance                   │
│   Indexed Queries                   │
├─────────────────────────────────────┤
│  DEPLOYMENT: DOCKER + HUGGINGFACE   │
│  Containerized Python App           │
│  URL: nithiyon-finora-backend.hf.space
└─────────────────────────────────────┘
```

### Architecture Diagram:

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │      FRONTEND (Next.js React TypeScript)         │   │
│  │  ┌──────────────┐  ┌──────────────────────────┐ │   │
│  │  │  Pages       │  │ Components               │ │   │
│  │  │ • Dashboard  │  │ • BottomNavbar          │ │   │
│  │  │ • Spending   │  │ • Modals                │ │   │
│  │  │ • Budget     │  │ • Charts                │ │   │
│  │  │ • Accounts   │  │ • Cards                 │ │   │
│  │  │ • Chat       │  │ • Forms                 │ │   │
│  │  │ • Goals      │  │ • Inputs                │ │   │
│  │  │ • Settings   │  │                         │ │   │
│  │  └──────────────┘  └──────────────────────────┘ │   │
│  │          │                                       │   │
│  │  ┌──────────────────────────────────────┐       │   │
│  │  │   CONTEXT API (Global State)         │       │   │
│  │  │ • User data                          │       │   │
│  │  │ • Transactions                       │       │   │
│  │  │ • Budgets                            │       │   │
│  │  │ • Accounts                           │       │   │
│  │  │ • Goals                              │       │   │
│  │  │ • Auto-refresh on mount              │       │   │
│  │  └──────────────────────────────────────┘       │   │
│  └──────────────────────────────────────────────────┘   │
│           │                                              │
│           │ HTTP Requests (JSON)                         │
│           │ Vercel CDN                                   │
│           ↓                                              │
└─────────────────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
        ┌────────────┴──────────────┐
        │                           │
        ↓                           ↓
┌───────────────────┐      ┌──────────────────┐
│  FASTAPI SERVER   │      │  STATIC FILES    │
│ HuggingFace Spaces│      │  Vercel CDN      │
│                   │      │                  │
│ ┌──────────────┐  │      └──────────────────┘
│ │ API Routes   │  │
│ │ • Users      │  │
│ │ • Accounts   │  │
│ │ • Txns       │  │
│ │ • Budgets    │  │
│ │ • Goals      │  │
│ │ • Chat       │  │
│ └──────────────┘  │
│        │          │
│ ┌──────────────┐  │
│ │ SQLAlchemy   │  │
│ │ ORM Layer    │  │
│ └──────────────┘  │
│        │          │
│ ┌──────────────┐  │
│ │ SQLite DB    │  │
│ │ (file.db)    │  │
│ └──────────────┘  │
└───────────────────┘
```

### Key Features Demonstrated:

✅ **Full CRUD Operations**
- CREATE: Add transactions, budgets, goals
- READ: Display dashboards, lists, reports
- UPDATE: Edit transactions, budget amounts
- DELETE: Remove transactions, goals

✅ **Real-time Data Synchronization**
- Context API updates UI immediately
- Changes persist to database
- Automatic refresh on page navigation

✅ **Complex Data Relationships**
- Users own Accounts
- Accounts contain Transactions
- Transactions tagged with Categories
- Budgets set limits per Category
- Goals track progress

✅ **Multi-layer Validation**
- Frontend: Real-time input validation
- Backend: Type checking with Pydantic
- Database: Constraints and relationships

✅ **Responsive Mobile-First UI**
- Works on all screen sizes
- Touch-friendly navigation
- Fast load times
- Beautiful dark theme

### Development Highlights:

🔧 **Modern Technologies**
- TypeScript for type safety
- Async/await for clean code
- REST API best practices
- ORM for database abstraction

🚀 **Performance**
- Next.js SSR optimization
- Indexed database queries
- Automatic API documentation (Swagger)
- Docker containerization

📱 **User Experience**
- Intuitive 6-item bottom navigation
- Quick-access budget overview
- Real-time spending alerts
- Beautiful data visualizations

☁️ **Cloud Deployment**
- Frontend on Vercel (automatic deployment)
- Backend on HuggingFace Spaces (containerized)
- SQLite database (automatic persistence)
- Zero-cost hosting

### Conclusion:

"Finora successfully demonstrates a complete full-stack web application using industry-standard technologies:

1. **Clean Separation of Concerns** - Frontend handles UI, backend handles logic
2. **Type Safety** - TypeScript and Pydantic ensure data integrity
3. **Scalable Architecture** - Easy to add features and scale
4. **Professional Deployment** - Automated CI/CD pipeline
5. **Real-World Relevance** - Solves actual financial tracking problem
6. **User-Centric Design** - Beautiful, intuitive interface

The entire data flow from user input → frontend processing → API communication → backend validation → database storage → data retrieval → UI rendering demonstrates core concepts in full-stack web development."

---

## SCREEN RECORDING CHECKLIST:

### Preparation:
- [ ] Open Finora app in Chrome/Firefox
- [ ] Open VS Code with project
- [ ] Open DevTools (F12)
- [ ] Open Backend code in second VS Code window
- [ ] Clear browser cache
- [ ] Test all features work
- [ ] Record in 1080p if possible
- [ ] Use external microphone for clear audio

### Recording Flow (Exactly 5 minutes):

**0:00-0:30 (30 sec)** - Read Introduction
- Show Finora app homepage
- Show project in GitHub

**0:30-1:30 (60 sec)** - Frontend Architecture
- Show `app/` folder in VS Code
- Show `src/components/` folder
- Show `src/lib/context/AppContext.tsx`
- Show BottomNavbar.tsx component
- Click through app pages quickly

**1:30-2:45 (75 sec)** - Backend Architecture
- Show `backend/main.py` in VS Code
- Show API endpoints in code
- Show `backend/models.py`
- Show database relationships
- Show `backend/requirements.txt`

**2:45-4:00 (75 sec)** - API Demonstration
- Open DevTools Network tab
- Add a new transaction
- Show POST request/response in Network tab
- Add transaction shows in real-time
- Explain JSON structure
- Show the transaction in database (if visible)

**4:00-4:45 (45 sec)** - Live Output
- Navigate to Dashboard page → show output
- Navigate to Spending page → show output
- Navigate to Budget page → show output
- Navigate to Accounts page → show output
- Navigate to Goals page → show output
- Navigate to Settings page → show output

**4:45-5:00 (15 sec)** - Conclusion
- Show project structure tree
- Mention tech stack
- Thank you

### Do's and Don'ts:

**DO:**
- ✅ Speak clearly and naturally
- ✅ Point at screen while explaining
- ✅ Show code without reading it word-for-word
- ✅ Highlight important parts with cursor
- ✅ Use examples like "₹500 transaction"
- ✅ Show actual working features

**DON'T:**
- ❌ Don't read slides or PowerPoint
- ❌ Don't go too fast
- ❌ Don't explain every single line
- ❌ Don't show errors or incomplete code
- ❌ Don't talk about testing/deployment details
- ❌ Don't use technical jargon without explanation

---

**Total Duration: Exactly 5 minutes when presented at natural speaking pace**

This transcript provides complete technical details, code examples, visual diagrams, and exact timing for your screen recording. Practice once with a timer to get the pacing right!
