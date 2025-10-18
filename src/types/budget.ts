// ============================================
// BUDGET TYPES
// ============================================

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
}

export interface BudgetProgress {
  budget: Budget;
  percentage: number;
  remaining: number;
  daysLeft: number;
  isOverBudget: boolean;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  categories: BudgetProgress[];
}
