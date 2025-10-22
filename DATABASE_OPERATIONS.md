# Finora Database Operations Documentation

## Overview

Finora is a budget tracking application that uses **REST APIs with FastAPI backend** and **SQLite database** instead of direct SQL queries. This document explains how data operations (CREATE, READ, UPDATE, DELETE) are performed in the application.

---

## Architecture Overview

```
Frontend (Next.js/React)
    ↓ (HTTP Requests)
Backend API (FastAPI)
    ↓ (SQLAlchemy ORM)
Database (SQLite)
```

### Key Components:
- **Frontend**: Next.js app with React Context API for state management
- **Backend**: FastAPI REST API running on HuggingFace Spaces
- **Database**: SQLite with SQLAlchemy ORM for data persistence
- **Storage**: localStorage for client-side persistence of budget preferences

---

## Database Schema

### Tables in the System:

```
Users
├── id (Primary Key)
├── name
├── email
├── created_at

Accounts
├── id (Primary Key)
├── user_id (Foreign Key → Users)
├── name
├── account_type
├── balance
├── created_at

Transactions
├── id (Primary Key)
├── user_id (Foreign Key → Users)
├── account_id (Foreign Key → Accounts)
├── amount
├── transaction_type (income/expense)
├── category
├── description
├── date
├── created_at

Budgets
├── id (Primary Key)
├── user_id (Foreign Key → Users)
├── category
├── amount
├── period (weekly/monthly/yearly)
├── spent
├── remaining
├── created_at

Goals
├── id (Primary Key)
├── user_id (Foreign Key → Users)
├── name
├── target_amount
├── current_amount
├── deadline
├── status
├── created_at

Categories (Reference Table)
├── id
├── name
├── icon
```

---

## CRUD Operations - REST API Commands

### 1. CREATE Operations

#### 1.1 Create User
**HTTP Request:**
```
POST /users
Content-Type: application/json

{
  "name": "Demo User",
  "email": "demo@finora.app"
}
```

**Frontend Code (TypeScript):**
```typescript
async createUser(name: string, email: string): Promise<User> {
  return this.request<User>('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
}
```

**Backend Code (Python/FastAPI):**
```python
@app.post("/users", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    db_user = User(username=user.username, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

**Equivalent SQL Operation:**
```sql
INSERT INTO Users (name, email, created_at)
VALUES ('Demo User', 'demo@finora.app', NOW())
```

---

#### 1.2 Create Account
**HTTP Request:**
```
POST /users/{user_id}/accounts
Content-Type: application/json

{
  "name": "Checking Account",
  "account_type": "Savings",
  "balance": 50000
}
```

**Frontend Usage (app/accounts/page.tsx):**
```typescript
const createAccount = async (userId: number, name: string, type: string) => {
  const account = await finoraAPI.createAccount(userId, name, type, 50000);
  // Update UI with new account
};
```

**Equivalent SQL:**
```sql
INSERT INTO Accounts (user_id, name, account_type, balance, created_at)
VALUES (1, 'Checking Account', 'Savings', 50000, NOW())
```

---

#### 1.3 Create Transaction
**HTTP Request:**
```
POST /transactions
Content-Type: application/json

{
  "user_id": 1,
  "account_id": 1,
  "amount": 5000,
  "transaction_type": "expense",
  "category": "Groceries",
  "description": "Weekly grocery shopping",
  "date": "2024-10-22"
}
```

**Frontend Code (app/spending/page.tsx):**
```typescript
const addTransaction = async (amount: number, category: string) => {
  const transaction = await useApp().addTransaction({
    user_id: userId,
    account_id: 1,
    amount,
    transaction_type: 'expense',
    category,
    description: `${category} expense`,
    date: new Date().toISOString().split('T')[0]
  });
};
```

**Backend Implementation:**
```python
@app.post("/transactions", response_model=TransactionSchema)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new transaction"""
    db_transaction = Transaction(
        user_id=transaction.user_id,
        account_id=transaction.account_id,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        category=transaction.category,
        description=transaction.description,
        date=transaction.date
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
```

**Equivalent SQL:**
```sql
INSERT INTO Transactions 
(user_id, account_id, amount, transaction_type, category, description, date, created_at)
VALUES (1, 1, 5000, 'expense', 'Groceries', 'Weekly grocery shopping', '2024-10-22', NOW())
```

---

#### 1.4 Create Budget
**HTTP Request:**
```
POST /users/{user_id}/budgets
Content-Type: application/json

{
  "category": "Rent",
  "amount": 25000,
  "period": "monthly"
}
```

**Frontend Code (app/personalize-plan/page.tsx):**
```typescript
const saveBudgetTarget = (category: string, amount: number) => {
  // Save to localStorage
  const targets = JSON.parse(localStorage.getItem('finora_budget_targets') || '{}');
  targets[category] = amount;
  localStorage.setItem('finora_budget_targets', JSON.stringify(targets));
  
  // Also create in backend
  await finoraAPI.createBudget(userId, category, amount);
};
```

**Equivalent SQL:**
```sql
INSERT INTO Budgets (user_id, category, amount, period, spent, remaining, created_at)
VALUES (1, 'Rent', 25000, 'monthly', 0, 25000, NOW())
```

---

#### 1.5 Create Goal
**HTTP Request:**
```
POST /users/{user_id}/goals
Content-Type: application/json

{
  "name": "Emergency Fund",
  "target_amount": 100000,
  "current_amount": 0,
  "deadline": "2025-12-31"
}
```

**Frontend Code:**
```typescript
const createGoal = async (name: string, targetAmount: number) => {
  const goal = await finoraAPI.createGoal(
    userId,
    name,
    targetAmount,
    "2025-12-31"
  );
};
```

**Equivalent SQL:**
```sql
INSERT INTO Goals (user_id, name, target_amount, current_amount, deadline, status, created_at)
VALUES (1, 'Emergency Fund', 100000, 0, '2025-12-31', 'in_progress', NOW())
```

---

### 2. READ Operations

#### 2.1 Get User
**HTTP Request:**
```
GET /users/{user_id}
```

**Frontend Code:**
```typescript
async getUser(userId: number): Promise<User> {
  return this.request<User>(`/users/${userId}`);
}
```

**Equivalent SQL:**
```sql
SELECT * FROM Users WHERE id = 1
```

---

#### 2.2 Get All Transactions
**HTTP Request:**
```
GET /users/{user_id}/transactions
GET /users/{user_id}/transactions?category=Groceries&start_date=2024-10-01&end_date=2024-10-31
```

**Frontend Code (app/spending/page.tsx):**
```typescript
const { appTransactions } = useApp(); // Fetched from backend

// With filters
const getFilteredTransactions = async (category?: string, dateRange?: any) => {
  const transactions = await finoraAPI.getTransactions(userId, {
    category,
    start_date: dateRange?.start,
    end_date: dateRange?.end,
    transaction_type: 'expense'
  });
};
```

**Backend Implementation:**
```python
@app.get("/users/{user_id}/transactions", response_model=List[TransactionSchema])
def get_transactions(
    user_id: int, 
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get transactions with optional filtering"""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)
    
    if category:
        query = query.filter(Transaction.category == category)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    return query.all()
```

**Equivalent SQL:**
```sql
SELECT * FROM Transactions 
WHERE user_id = 1 
  AND category = 'Groceries'
  AND date BETWEEN '2024-10-01' AND '2024-10-31'
ORDER BY date DESC
```

---

#### 2.3 Get All Accounts
**HTTP Request:**
```
GET /users/{user_id}/accounts
```

**Frontend Code (app/accounts/page.tsx):**
```typescript
useEffect(() => {
  const loadAccounts = async () => {
    const accounts = await finoraAPI.getAccounts(userId);
    setAccounts(accounts);
  };
  loadAccounts();
}, [userId]);
```

**Equivalent SQL:**
```sql
SELECT * FROM Accounts WHERE user_id = 1
```

---

#### 2.4 Get All Budgets
**HTTP Request:**
```
GET /users/{user_id}/budgets
GET /users/{user_id}/budgets?period=monthly&month=2024-10
```

**Frontend Code (app/page.tsx - Home):**
```typescript
const budgetTargets = localStorage.getItem('finora_budget_targets');
// Combined with backend data
const budgets = await finoraAPI.getBudgets(userId, 'monthly', '2024-10');
```

**Equivalent SQL:**
```sql
SELECT * FROM Budgets 
WHERE user_id = 1 
  AND period = 'monthly'
  AND date LIKE '2024-10%'
```

---

#### 2.5 Get All Goals
**HTTP Request:**
```
GET /users/{user_id}/goals
```

**Frontend Code (app/reflect/page.tsx):**
```typescript
useEffect(() => {
  const loadGoals = async () => {
    const goals = await finoraAPI.getGoals(userId);
    // Display goals with progress indicators
  };
}, [userId]);
```

**Equivalent SQL:**
```sql
SELECT * FROM Goals WHERE user_id = 1 ORDER BY deadline ASC
```

---

### 3. UPDATE Operations

#### 3.1 Update Transaction
**HTTP Request:**
```
PUT /transactions/{transaction_id}
Content-Type: application/json

{
  "amount": 5500,
  "category": "Groceries",
  "description": "Weekly shopping - updated"
}
```

**Frontend Code:**
```typescript
const updateTransaction = async (transactionId: number, updates: any) => {
  const updated = await finoraAPI.updateTransaction(transactionId, updates);
  // Refresh spending data
};
```

**Backend Implementation:**
```python
@app.put("/transactions/{transaction_id}", response_model=TransactionSchema)
def update_transaction(transaction_id: int, transaction: TransactionUpdate, db: Session = Depends(get_db)):
    """Update an existing transaction"""
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction.amount is not None:
        db_transaction.amount = transaction.amount
    if transaction.category is not None:
        db_transaction.category = transaction.category
    if transaction.description is not None:
        db_transaction.description = transaction.description
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
```

**Equivalent SQL:**
```sql
UPDATE Transactions 
SET amount = 5500, 
    category = 'Groceries',
    description = 'Weekly shopping - updated'
WHERE id = 1
```

---

#### 3.2 Update Budget
**HTTP Request:**
```
PUT /budgets/{budget_id}
Content-Type: application/json

{
  "amount": 30000,
  "spent": 12000
}
```

**Frontend Code (app/personalize-plan/page.tsx):**
```typescript
const updateBudgetAmount = async (budgetId: number, newAmount: number) => {
  const updated = await finoraAPI.updateBudget(budgetId, { 
    amount: newAmount,
    spent: currentSpent
  });
};
```

**Equivalent SQL:**
```sql
UPDATE Budgets 
SET amount = 30000, 
    spent = 12000,
    remaining = 30000 - 12000
WHERE id = 1
```

---

#### 3.3 Update Goal
**HTTP Request:**
```
PUT /goals/{goal_id}
Content-Type: application/json

{
  "current_amount": 25000,
  "status": "in_progress"
}
```

**Equivalent SQL:**
```sql
UPDATE Goals 
SET current_amount = 25000,
    status = 'in_progress'
WHERE id = 1
```

---

### 4. DELETE Operations

#### 4.1 Delete Transaction
**HTTP Request:**
```
DELETE /transactions/{transaction_id}
```

**Frontend Code (app/spending/page.tsx):**
```typescript
const deleteTransaction = async (transactionId: number) => {
  const result = await finoraAPI.deleteTransaction(transactionId);
  // Refresh spending list
};
```

**Backend Implementation:**
```python
@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Delete a transaction"""
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}
```

**Equivalent SQL:**
```sql
DELETE FROM Transactions WHERE id = 1
```

---

#### 4.2 Delete Goal
**HTTP Request:**
```
DELETE /goals/{goal_id}
```

**Equivalent SQL:**
```sql
DELETE FROM Goals WHERE id = 1
```

---

## Data Flow Examples

### Example 1: Adding a Spending Transaction

```
User Input (app/spending/page.tsx)
    ↓
handleAddTransaction()
    ↓
POST /transactions
    ↓
Backend validation (FastAPI)
    ↓
INSERT INTO Transactions (SQLAlchemy ORM)
    ↓
SQLite Database
    ↓
Response with created transaction
    ↓
Update React Context (AppContext)
    ↓
Re-render UI with new transaction
```

**Full Code Flow:**

**Frontend:**
```typescript
// File: app/spending/page.tsx
const handleAddTransaction = async (amount: number, category: string) => {
  const newTransaction = await addTransaction({
    user_id: user.id,
    account_id: 1,
    amount,
    transaction_type: 'expense',
    category,
    description: `${category} expense`,
    date: new Date().toISOString().split('T')[0]
  });
  
  // AppContext automatically refreshes and updates UI
};
```

**Backend:**
```python
# File: backend/main.py
@app.post("/transactions")
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = Transaction(
        user_id=transaction.user_id,
        account_id=transaction.account_id,
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        category=transaction.category,
        description=transaction.description,
        date=transaction.date
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
```

---

### Example 2: Viewing Budget Dashboard

```
User navigates to Home (app/page.tsx)
    ↓
useEffect hook triggers
    ↓
AppContext.refreshTransactions() + refreshBudgets()
    ↓
GET /users/{user_id}/transactions
GET /users/{user_id}/budgets
    ↓
Backend queries database (SQLAlchemy)
    ↓
SELECT * FROM Transactions WHERE user_id = ?
SELECT * FROM Budgets WHERE user_id = ?
    ↓
Return JSON response
    ↓
Update React Context state
    ↓
Calculate totals, spent amounts
    ↓
Render dashboard with budget cards
```

---

## Client-Side Storage (localStorage)

In addition to backend database operations, Finora uses **localStorage** for:

### Budget Targets (localStorage)
```typescript
// Save budget targets
const targets = {
  "Rent": 25000,
  "Groceries": 15000,
  "Transportation": 5000
};
localStorage.setItem('finora_budget_targets', JSON.stringify(targets));

// Retrieve budget targets
const saved = localStorage.getItem('finora_budget_targets');
const targets = JSON.parse(saved || '{}');
```

**Usage in app/personalize-plan/page.tsx:**
```typescript
const loadBudgetTargets = () => {
  const saved = localStorage.getItem('finora_budget_targets');
  if (saved) {
    const targets = JSON.parse(saved);
    // Apply to UI
  }
};

const saveBudgetTarget = (category: string, amount: number) => {
  const current = JSON.parse(localStorage.getItem('finora_budget_targets') || '{}');
  current[category] = amount;
  localStorage.setItem('finora_budget_targets', JSON.stringify(current));
};
```

---

## API Endpoints Summary

### User Management
| Method | Endpoint | Operation | Equivalent SQL |
|--------|----------|-----------|-----------------|
| POST | `/users` | CREATE | INSERT INTO Users |
| GET | `/users/{user_id}` | READ | SELECT FROM Users |

### Accounts
| Method | Endpoint | Operation | Equivalent SQL |
|--------|----------|-----------|-----------------|
| POST | `/users/{user_id}/accounts` | CREATE | INSERT INTO Accounts |
| GET | `/users/{user_id}/accounts` | READ | SELECT FROM Accounts |
| GET | `/accounts/{account_id}` | READ | SELECT FROM Accounts |

### Transactions
| Method | Endpoint | Operation | Equivalent SQL |
|--------|----------|-----------|-----------------|
| POST | `/transactions` | CREATE | INSERT INTO Transactions |
| GET | `/users/{user_id}/transactions` | READ | SELECT FROM Transactions |
| GET | `/transactions/{transaction_id}` | READ | SELECT FROM Transactions |
| PUT | `/transactions/{transaction_id}` | UPDATE | UPDATE Transactions |
| DELETE | `/transactions/{transaction_id}` | DELETE | DELETE FROM Transactions |

### Budgets
| Method | Endpoint | Operation | Equivalent SQL |
|--------|----------|-----------|-----------------|
| POST | `/users/{user_id}/budgets` | CREATE | INSERT INTO Budgets |
| GET | `/users/{user_id}/budgets` | READ | SELECT FROM Budgets |
| PUT | `/budgets/{budget_id}` | UPDATE | UPDATE Budgets |

### Goals
| Method | Endpoint | Operation | Equivalent SQL |
|--------|----------|-----------|-----------------|
| POST | `/users/{user_id}/goals` | CREATE | INSERT INTO Goals |
| GET | `/users/{user_id}/goals` | READ | SELECT FROM Goals |
| PUT | `/goals/{goal_id}` | UPDATE | UPDATE Goals |
| DELETE | `/goals/{goal_id}` | DELETE | DELETE FROM Goals |

---

## Technology Stack

### Frontend (Client-Side)
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **State Management**: React Context API (AppContext)
- **HTTP Client**: Fetch API
- **Storage**: localStorage for budget preferences

### Backend (Server-Side)
- **Framework**: FastAPI (Python)
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Deployment**: HuggingFace Spaces
- **URL**: `https://nithiyon-finora-backend.hf.space`

### Database
- **Type**: SQLite
- **Hosted at**: Backend (HuggingFace Spaces)
- **Auto-created**: On first run

---

## Error Handling

### Frontend Error Handling
```typescript
try {
  const transaction = await addTransaction({...});
} catch (error) {
  console.error('Failed to add transaction:', error);
  // Display error to user
}
```

### Backend Error Handling
```python
@app.post("/transactions")
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    try:
        # Validation
        if transaction.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be positive")
        
        # Create record
        db_transaction = Transaction(...)
        db.add(db_transaction)
        db.commit()
        return db_transaction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
```

---

## Summary

| Operation | Method | Protocol | Location |
|-----------|--------|----------|----------|
| CREATE | POST | REST API | Backend → Database |
| READ | GET | REST API | Backend ← Database |
| UPDATE | PUT | REST API | Backend → Database |
| DELETE | DELETE | REST API | Backend → Database |

Instead of direct SQL commands, Finora uses **REST APIs with JSON payloads** for all data operations. The backend (FastAPI) receives these REST requests, validates them, and uses **SQLAlchemy ORM** to execute equivalent SQL operations on the SQLite database.
