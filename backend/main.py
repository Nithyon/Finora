"""
Finora Budget Tracking App - Backend API
FastAPI server with endpoints for transactions, budgets, analytics, and AI chatbot
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import json

from models import (
    init_db, get_db, User, Account, Transaction, Category, Budget, Goal
)
from schemas import (
    User as UserSchema, UserCreate,
    Account as AccountSchema, AccountCreate,
    Transaction as TransactionSchema, TransactionCreate, TransactionUpdate,
    Budget as BudgetSchema, BudgetCreate, BudgetUpdate,
    Goal as GoalSchema, GoalCreate, GoalUpdate,
    ChatRequest, ChatResponse,
    MonthlyAnalytics, BudgetAdvice,
    ClassificationResult
)
from classifier import (
    classify_transaction, get_all_categories, classify_with_hf
)
from chatbot_enhanced import (
    finora_chat, chat_with_context, get_budget_advice
)

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Finora Budget Tracking API",
    description="AI-powered budget tracking and financial advice chatbot",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== USER ENDPOINTS ====================

@app.post("/users", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(username=user.username, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{user_id}", response_model=UserSchema)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ==================== ACCOUNT ENDPOINTS ====================

@app.post("/users/{user_id}/accounts", response_model=AccountSchema)
def create_account(user_id: int, account: AccountCreate, db: Session = Depends(get_db)):
    """Create a new account for user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_account = Account(
        user_id=user_id,
        name=account.name,
        account_type=account.account_type,
        balance=account.balance
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@app.get("/users/{user_id}/accounts", response_model=List[AccountSchema])
def get_user_accounts(user_id: int, db: Session = Depends(get_db)):
    """Get all accounts for user"""
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    return accounts


@app.get("/accounts/{account_id}", response_model=AccountSchema)
def get_account(account_id: int, db: Session = Depends(get_db)):
    """Get account by ID"""
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


# ==================== TRANSACTION ENDPOINTS ====================

@app.post("/transactions", response_model=TransactionSchema)
def create_transaction(
    user_id: int,
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """Create a new transaction with automatic categorization"""
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify account exists
    account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Classify transaction
    classification = classify_transaction(transaction.description, transaction.amount)
    
    # Create transaction
    db_transaction = Transaction(
        user_id=user_id,
        account_id=transaction.account_id,
        amount=transaction.amount,
        description=transaction.description,
        category_name=classification["category"],
        category_id=None,  # Set to category lookup if needed
        transaction_type=transaction.transaction_type,
        notes=transaction.notes
    )
    
    db.add(db_transaction)
    
    # Update account balance
    if transaction.transaction_type == "expense":
        account.balance -= transaction.amount
    else:
        account.balance += transaction.amount
    
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction


@app.get("/users/{user_id}/transactions", response_model=List[TransactionSchema])
def get_user_transactions(
    user_id: int,
    month: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get transactions for user (optionally filtered by month/category)"""
    
    query = db.query(Transaction).filter(Transaction.user_id == user_id)
    
    if month:
        # Format: "2025-10"
        start_date = datetime.strptime(f"{month}-01", "%Y-%m-%d")
        end_date = start_date + timedelta(days=31)
        query = query.filter(
            Transaction.date >= start_date,
            Transaction.date < end_date
        )
    
    if category:
        query = query.filter(Transaction.category_name == category)
    
    transactions = query.order_by(Transaction.date.desc()).all()
    return transactions


@app.get("/transactions/{transaction_id}", response_model=TransactionSchema)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Get transaction by ID"""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@app.put("/transactions/{transaction_id}", response_model=TransactionSchema)
def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Update fields
    if transaction_update.amount is not None:
        transaction.amount = transaction_update.amount
    if transaction_update.description is not None:
        transaction.description = transaction_update.description
    if transaction_update.category_name is not None:
        transaction.category_name = transaction_update.category_name
    if transaction_update.notes is not None:
        transaction.notes = transaction_update.notes
    
    db.commit()
    db.refresh(transaction)
    return transaction


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Delete a transaction"""
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(transaction)
    db.commit()
    return {"status": "deleted"}


# ==================== BUDGET ENDPOINTS ====================

@app.post("/users/{user_id}/budgets", response_model=BudgetSchema)
def create_budget(
    user_id: int,
    budget: BudgetCreate,
    db: Session = Depends(get_db)
):
    """Create a budget for a category/month"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_budget = Budget(
        user_id=user_id,
        category_name=budget.category_name,
        month=budget.month,
        allocated=budget.allocated
    )
    
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


@app.get("/users/{user_id}/budgets", response_model=List[BudgetSchema])
def get_user_budgets(
    user_id: int,
    month: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get budgets for user"""
    
    query = db.query(Budget).filter(Budget.user_id == user_id)
    
    if month:
        query = query.filter(Budget.month == month)
    
    budgets = query.all()
    return budgets


@app.put("/budgets/{budget_id}", response_model=BudgetSchema)
def update_budget(
    budget_id: int,
    budget_update: BudgetUpdate,
    db: Session = Depends(get_db)
):
    """Update a budget"""
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    if budget_update.allocated is not None:
        budget.allocated = budget_update.allocated
    
    db.commit()
    db.refresh(budget)
    return budget


# ==================== GOAL ENDPOINTS ====================

@app.post("/users/{user_id}/goals", response_model=GoalSchema)
def create_goal(
    user_id: int,
    goal: GoalCreate,
    db: Session = Depends(get_db)
):
    """Create a financial goal"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_goal = Goal(
        user_id=user_id,
        name=goal.name,
        emoji=goal.emoji,
        target_amount=goal.target_amount,
        deadline=goal.deadline,
        priority=goal.priority
    )
    
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@app.get("/users/{user_id}/goals", response_model=List[GoalSchema])
def get_user_goals(user_id: int, db: Session = Depends(get_db)):
    """Get goals for user"""
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    return goals


@app.put("/goals/{goal_id}", response_model=GoalSchema)
def update_goal(
    goal_id: int,
    goal_update: GoalUpdate,
    db: Session = Depends(get_db)
):
    """Update a goal"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    if goal_update.name is not None:
        goal.name = goal_update.name
    if goal_update.target_amount is not None:
        goal.target_amount = goal_update.target_amount
    if goal_update.current_amount is not None:
        goal.current_amount = goal_update.current_amount
    if goal_update.deadline is not None:
        goal.deadline = goal_update.deadline
    if goal_update.priority is not None:
        goal.priority = goal_update.priority
    
    db.commit()
    db.refresh(goal)
    return goal


# ==================== ANALYTICS ENDPOINTS ====================

@app.get("/users/{user_id}/analytics/monthly", response_model=MonthlyAnalytics)
def get_monthly_analytics(
    user_id: int,
    month: str = Query(..., description="Month in format YYYY-MM"),
    db: Session = Depends(get_db)
):
    """Get analytics for a specific month"""
    
    # Parse month
    try:
        start_date = datetime.strptime(f"{month}-01", "%Y-%m-%d")
        end_date = start_date + timedelta(days=31)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
    
    # Get transactions
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.date >= start_date,
        Transaction.date < end_date
    ).all()
    
    # Calculate totals
    total_income = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_spent = sum(t.amount for t in transactions if t.transaction_type == "expense")
    remaining = total_income - total_spent
    spending_percent = (total_spent / total_income * 100) if total_income > 0 else 0
    
    # Group by category
    spending_by_category_dict = {}
    for transaction in transactions:
        if transaction.transaction_type == "expense":
            category = transaction.category_name
            if category not in spending_by_category_dict:
                spending_by_category_dict[category] = 0
            spending_by_category_dict[category] += transaction.amount
    
    # Format spending by category
    spending_by_category = []
    all_categories = get_all_categories()
    category_map = {c["name"]: c for c in all_categories}
    
    for category, amount in spending_by_category_dict.items():
        cat_info = category_map.get(category, {})
        percentage = (amount / total_spent * 100) if total_spent > 0 else 0
        spending_by_category.append({
            "category": category,
            "amount": round(amount, 2),
            "percentage": round(percentage, 2),
            "emoji": cat_info.get("emoji", "💰"),
            "color": cat_info.get("color", "#3B82F6")
        })
    
    # Get budget status
    budgets = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.month == month
    ).all()
    
    budget_status = {}
    for budget in budgets:
        spent = spending_by_category_dict.get(budget.category_name, 0)
        budget_status[budget.category_name] = {
            "allocated": budget.allocated,
            "spent": round(spent, 2),
            "remaining": round(budget.allocated - spent, 2),
            "percent_used": round((spent / budget.allocated * 100) if budget.allocated > 0 else 0, 2)
        }
    
    # Generate insights
    insights = []
    if spending_percent > 90:
        insights.append("⚠️ You're spending 90%+ of your income. Consider cutting back on wants.")
    elif spending_percent > 100:
        insights.append("🚨 WARNING: You're overspending! Monthly expenses exceed income.")
    
    for category, status in budget_status.items():
        if status["percent_used"] > 100:
            insights.append(f"💡 {category} budget exceeded by £{abs(status['remaining']):.2f}")
        elif status["percent_used"] > 80:
            insights.append(f"⏰ {category} is 80%+ spent")
    
    return MonthlyAnalytics(
        total_income=round(total_income, 2),
        total_spent=round(total_spent, 2),
        remaining=round(remaining, 2),
        spending_percent=round(spending_percent, 2),
        spending_by_category=spending_by_category,
        budget_status=budget_status,
        insights=insights
    )


# ==================== CATEGORY ENDPOINTS ====================

@app.get("/categories")
def get_categories():
    """Get all available categories"""
    return get_all_categories()


@app.post("/classify", response_model=ClassificationResult)
async def classify_expense(description: str):
    """Classify an expense description into a category"""
    result = classify_transaction(description)
    return ClassificationResult(**result)


# ==================== CHATBOT ENDPOINTS ====================

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, user_id: int = 1):
    """Chat with Finora AI chatbot"""
    
    message = request.message
    user_context = request.user_context
    
    if not message or len(message) > 500:
        raise HTTPException(status_code=400, detail="Invalid message")
    
    response = await chat_with_context(str(user_id), message, user_context)
    
    return ChatResponse(**response)


@app.get("/budget-advice")
def get_advice(total_income: float):
    """Get budget allocation advice (50/30/20 rule)"""
    if total_income <= 0:
        raise HTTPException(status_code=400, detail="Total income must be positive")
    
    advice = get_budget_advice(total_income)
    return BudgetAdvice(**advice)




# ==================== ROOT ENDPOINT ====================

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Finora Budget Tracking API",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
