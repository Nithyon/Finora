"""
Pydantic schemas for API validation
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict


# User Schemas
class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Account Schemas
class AccountBase(BaseModel):
    name: str
    account_type: str  # "Savings", "Checking"
    balance: float = 0.0


class AccountCreate(AccountBase):
    pass


class Account(AccountBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    category_type: str  # "Bills", "Needs", "Wants", "Goals"
    emoji: str = "💰"
    color: str = "#3B82F6"


class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    description: str
    category_name: str
    transaction_type: str = "expense"  # "expense" or "income"
    notes: Optional[str] = None


class TransactionCreate(TransactionBase):
    account_id: int


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    category_name: Optional[str] = None
    notes: Optional[str] = None


class Transaction(TransactionBase):
    id: int
    user_id: int
    account_id: int
    category_id: Optional[int]
    date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# Budget Schemas
class BudgetBase(BaseModel):
    category_name: str
    month: str  # "2025-10"
    allocated: float


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    allocated: Optional[float] = None


class Budget(BudgetBase):
    id: int
    user_id: int
    category_id: int
    spent: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# Goal Schemas
class GoalBase(BaseModel):
    name: str
    emoji: str
    target_amount: float
    deadline: Optional[datetime] = None
    priority: str = "small"  # "large" or "small"


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = None


class Goal(GoalBase):
    id: int
    user_id: int
    current_amount: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# Chatbot Schemas
class ChatRequest(BaseModel):
    message: str = Field(..., max_length=500)
    user_context: Optional[Dict] = None


class ChatResponse(BaseModel):
    reply: str
    status: str
    timestamp: str


# Analytics Schemas
class SpendingByCategory(BaseModel):
    category: str
    amount: float
    percentage: float
    emoji: str
    color: str


class MonthlyAnalytics(BaseModel):
    total_income: float
    total_spent: float
    remaining: float
    spending_percent: float
    spending_by_category: List[SpendingByCategory]
    budget_status: Dict[str, float]
    insights: List[str]


class BudgetAdvice(BaseModel):
    rule: str
    description: str
    percentages: Dict[str, float]
    amounts: Dict[str, float]
    categories: Dict[str, List[str]]


# Classification Result
class ClassificationResult(BaseModel):
    category: str
    category_type: str
    emoji: str
    color: str
    confidence: float
