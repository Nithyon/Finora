// app/utils/transactionService.ts
// Unified transaction calculations and utilities
// Single source of truth for all spending calculations

import { BankAccount } from './virtualBankService';

export interface Transaction {
  id: number;
  user_id: number;
  account_id?: string | number;
  amount: number;
  transaction_type: 'expense' | 'income';
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface SpendingAnalysis {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  byCategory: Record<string, number>;
  transactionCount: number;
  lastUpdated: string;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
  daysToExhaustion?: number;
}

export interface SpendingVelocity {
  dailyAverage: number;
  weeklyTotal: number;
  monthlyProjection: number;
  daysUntilExhausted: number;
  status: 'healthy' | 'warning' | 'critical';
}

class TransactionService {
  /**
   * Get all user transactions from multiple sources
   * Ensures unified data view across app
   */
  static getTransactions(
    userId: number,
    includeVirtualBank: boolean = true,
    includeRegular: boolean = true
  ): Transaction[] {
    const transactions: Transaction[] = [];

    try {
      // Load regular transactions
      if (includeRegular) {
        const regularKey = `finora_transactions_${userId}`;
        const saved = localStorage.getItem(regularKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          transactions.push(...(Array.isArray(parsed) ? parsed : []));
        }
      }

      // Load virtual bank transactions
      if (includeVirtualBank) {
        const bankKey = `finora_bank_transactions_${userId}`;
        const saved = localStorage.getItem(bankKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const bankTxns = parsed.map((tx: any): Transaction => ({
              id: tx.id ? parseInt(tx.id as string) : Date.now(),
              user_id: userId,
              account_id: tx.accountId,
              amount: tx.amount,
              transaction_type: (tx.type === 'deposit' ? 'income' : 'expense') as 'expense' | 'income',
              category: tx.description || 'Bank Transfer',
              description: tx.description || `Virtual Bank: ${tx.type}`,
              date: new Date(tx.timestamp).toISOString().split('T')[0],
              created_at: tx.timestamp,
            }));
            transactions.push(...bankTxns);
          }
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }

    return transactions;
  }

  /**
   * Get transactions for a specific month
   */
  static getTransactionsByMonth(
    transactions: Transaction[],
    year: number,
    month: number
  ): Transaction[] {
    return transactions.filter((tx) => {
      const date = new Date(tx.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  }

  /**
   * Get transactions within last N days
   */
  static getRecentTransactions(
    transactions: Transaction[],
    days: number
  ): Transaction[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= cutoff;
    });
  }

  /**
   * Calculate comprehensive spending analysis
   */
  static analyzeSpending(transactions: Transaction[]): SpendingAnalysis {
    const byCategory: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.transaction_type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      byCategory,
      transactionCount: transactions.length,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Calculate spending by category for current month
   */
  static getMonthlySpendingByCategory(
    transactions: Transaction[],
    year: number,
    month: number
  ): Record<string, number> {
    const monthTxns = this.getTransactionsByMonth(transactions, year, month);
    const analysis = this.analyzeSpending(monthTxns);
    return analysis.byCategory;
  }

  /**
   * Compare spending against budget
   */
  static compareBudget(
    transactions: Transaction[],
    budgets: Array<{ category: string; amount: number }>
  ): BudgetComparison[] {
    const analysis = this.analyzeSpending(transactions);

    return budgets.map((budget) => {
      const spent = analysis.byCategory[budget.category] || 0;
      const remaining = budget.amount - spent;
      const percentUsed = (spent / budget.amount) * 100;
      const isOverBudget = spent > budget.amount;

      // Calculate days to exhaustion if spending continues at current pace
      const daysPassed = this.getDaysSinceMonthStart();
      const dailyVelocity = spent / Math.max(daysPassed, 1);
      const daysToExhaustion = dailyVelocity > 0 ? budget.amount / dailyVelocity : undefined;

      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        remaining: Math.max(remaining, 0),
        percentUsed: Math.min(percentUsed, 100),
        isOverBudget,
        daysToExhaustion: daysToExhaustion ? Math.round(daysToExhaustion) : undefined,
      };
    });
  }

  /**
   * Calculate spending velocity for early warning
   */
  static getSpendingVelocity(
    transactions: Transaction[],
    budgets: Array<{ category: string; amount: number }>
  ): SpendingVelocity {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const today = new Date();
    const daysPassed = Math.max(1, Math.floor((today.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)));
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Get this month's transactions
    const monthTxns = this.getTransactionsByMonth(
      transactions,
      today.getFullYear(),
      today.getMonth() + 1
    );

    const analysis = this.analyzeSpending(monthTxns);
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    // Calculate daily average
    const dailyAverage = analysis.totalExpense / Math.max(daysPassed, 1);

    // Project to end of month
    const monthlyProjection = dailyAverage * daysInMonth;

    // Calculate days until budgeted amount is exhausted
    const monthlyBudgeted = totalBudget;
    const remaining = monthlyBudgeted - analysis.totalExpense;
    const daysToExhaustion = dailyAverage > 0 ? Math.floor(remaining / dailyAverage) : 365;

    // Determine status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    const percentUsed = (monthlyProjection / monthlyBudgeted) * 100;

    if (percentUsed > 100) {
      status = 'critical';
    } else if (percentUsed > 80) {
      status = 'warning';
    }

    return {
      dailyAverage: Math.round(dailyAverage * 100) / 100,
      weeklyTotal: Math.round(dailyAverage * 7 * 100) / 100,
      monthlyProjection: Math.round(monthlyProjection * 100) / 100,
      daysUntilExhausted: Math.max(0, daysToExhaustion),
      status,
    };
  }

  /**
   * Get total income for a period
   */
  static getTotalIncome(transactions: Transaction[]): number {
    return transactions
      .filter((tx) => tx.transaction_type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Get total expenses for a period
   */
  static getTotalExpenses(transactions: Transaction[]): number {
    return transactions
      .filter((tx) => tx.transaction_type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Get specific category spending
   */
  static getCategorySpending(transactions: Transaction[], category: string): number {
    return transactions
      .filter((tx) => tx.transaction_type === 'expense' && tx.category === category)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Get top spending categories
   */
  static getTopCategories(transactions: Transaction[], limit: number = 5): Array<{ category: string; amount: number; percentage: number }> {
    const analysis = this.analyzeSpending(transactions);
    const total = this.getTotalExpenses(transactions);

    return Object.entries(analysis.byCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }

  /**
   * Calculate overspending amount and percentage
   */
  static getOverspendingMetrics(
    transactions: Transaction[],
    budgets: Array<{ category: string; amount: number }>
  ): {
    isOverBudget: boolean;
    totalOverspend: number;
    percentOverBudget: number;
    affectedCategories: string[];
  } {
    const analysis = this.analyzeSpending(transactions);
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    let totalOverspend = 0;
    const affectedCategories: string[] = [];

    budgets.forEach((budget) => {
      const spent = analysis.byCategory[budget.category] || 0;
      if (spent > budget.amount) {
        totalOverspend += spent - budget.amount;
        affectedCategories.push(budget.category);
      }
    });

    return {
      isOverBudget: analysis.totalExpense > totalBudget,
      totalOverspend,
      percentOverBudget: totalBudget > 0 ? (totalOverspend / totalBudget) * 100 : 0,
      affectedCategories,
    };
  }

  /**
   * Calculate how much budget remains
   */
  static getRemainingBudget(
    transactions: Transaction[],
    budgets: Array<{ category: string; amount: number }>
  ): number {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = this.getTotalExpenses(transactions);
    return Math.max(0, totalBudget - totalSpent);
  }

  /**
   * Calculate available to assign (YNAB Rule 1)
   */
  static getAvailableToAssign(
    income: number,
    budgets: Array<{ amount: number }>
  ): number {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    return income - totalBudgeted;
  }

  /**
   * Helper: Get days since month start
   */
  private static getDaysSinceMonthStart(): number {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return Math.floor((today.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get transaction trend (increasing/decreasing/stable)
   */
  static getSpendingTrend(
    transactions: Transaction[]
  ): 'increasing' | 'decreasing' | 'stable' {
    const today = new Date();
    const thisMonth = this.getTransactionsByMonth(
      transactions,
      today.getFullYear(),
      today.getMonth() + 1
    );
    const lastMonth = this.getTransactionsByMonth(
      transactions,
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
      today.getMonth() === 0 ? 12 : today.getMonth()
    );

    const thisMonthTotal = this.getTotalExpenses(thisMonth);
    const lastMonthTotal = this.getTotalExpenses(lastMonth);

    if (lastMonthTotal === 0) return 'stable';

    const changePercent = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

    if (changePercent > 5) return 'increasing';
    if (changePercent < -5) return 'decreasing';
    return 'stable';
  }
}

export default TransactionService;
