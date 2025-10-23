// app/utils/chartUtils.ts
// Utilities for preparing data for chart visualization
// Used by analytics page and goal tracking dashboards

import TransactionService, { Transaction } from './transactionService';
import GoalService, { GoalProgress } from './goalService';

export interface PieChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface LineChartData {
  date: string;
  spending: number;
  budget: number;
  cumulative: number;
}

export interface BarChartData {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  icon: string;
}

export interface GoalChartData {
  name: string;
  current: number;
  target: number;
  percentage: number;
  daysRemaining: number;
  status: string;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#3b82f6',
  Rent: '#ef4444',
  Transportation: '#f59e0b',
  Utilities: '#8b5cf6',
  Entertainment: '#ec4899',
  'Dining Out': '#14b8a6',
  Shopping: '#f97316',
  Savings: '#10b981',
  Default: '#6b7280',
};

class ChartUtils {
  /**
   * Prepare data for spending by category pie chart
   */
  static getSpendingByCategory(
    transactions: Transaction[]
  ): PieChartData[] {
    const analysis = TransactionService.analyzeSpending(transactions);
    const total = TransactionService.getTotalExpenses(transactions);

    return Object.entries(analysis.byCategory)
      .map(([category, amount]) => ({
        name: category,
        value: Math.round(amount * 100) / 100,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Default,
      }))
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Prepare data for spending over time line chart
   */
  static getSpendingTrend(
    transactions: Transaction[],
    days: number = 30
  ): LineChartData[] {
    const data: LineChartData[] = [];
    const today = new Date();
    let cumulativeSpending = 0;
    let cumulativeBudget = 0;
    const dailyBudget = 1667; // Assume ₹50,000 monthly budget

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTransactions = transactions.filter((tx) => tx.date === dateStr && tx.transaction_type === 'expense');
      const daySpending = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      cumulativeSpending += daySpending;
      cumulativeBudget += dailyBudget;

      data.push({
        date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        spending: Math.round(daySpending * 100) / 100,
        budget: dailyBudget,
        cumulative: Math.round(cumulativeSpending * 100) / 100,
      });
    }

    return data;
  }

  /**
   * Prepare data for budget vs actual bar chart
   */
  static getBudgetComparison(
    transactions: Transaction[],
    budgets: Array<{ category: string; amount: number }>
  ): BarChartData[] {
    const analysis = TransactionService.analyzeSpending(transactions);

    return budgets.map((budget) => {
      const spent = analysis.byCategory[budget.category] || 0;
      const remaining = Math.max(0, budget.amount - spent);

      return {
        category: budget.category,
        budget: Math.round(budget.amount * 100) / 100,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        icon: CATEGORY_COLORS[budget.category] ? '✓' : '!',
      };
    });
  }

  /**
   * Prepare data for goal progress visualization
   */
  static getGoalProgressCharts(
    goalProgresses: GoalProgress[]
  ): GoalChartData[] {
    return goalProgresses.map((gp) => {
      let color = '#10b981'; // Green - healthy
      if (gp.status === 'warning') color = '#f59e0b'; // Amber
      if (gp.status === 'critical') color = '#ef4444'; // Red
      if (gp.status === 'completed') color = '#3b82f6'; // Blue

      return {
        name: gp.goal.name,
        current: Math.round(gp.goal.currentAmount * 100) / 100,
        target: Math.round(gp.goal.targetAmount * 100) / 100,
        percentage: Math.round(gp.progressPercent * 100) / 100,
        daysRemaining: gp.daysRemaining,
        status: gp.status,
        color,
      };
    });
  }

  /**
   * Prepare income vs expense comparison
   */
  static getIncomeVsExpense(
    transactions: Transaction[]
  ): { income: number; expense: number; savings: number; savingsRate: number } {
    const income = TransactionService.getTotalIncome(transactions);
    const expense = TransactionService.getTotalExpenses(transactions);
    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      income: Math.round(income * 100) / 100,
      expense: Math.round(expense * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      savingsRate: Math.round(savingsRate * 100) / 100,
    };
  }

  /**
   * Prepare month-to-month comparison
   */
  static getMonthComparison(
    transactions: Transaction[],
    months: number = 3
  ): Array<{ month: string; spending: number; budget: number; difference: number }> {
    const data: Array<{ month: string; spending: number; budget: number; difference: number }> = [];
    const today = new Date();
    const monthlyBudget = 50000; // Assume default budget

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

      const monthTransactions = TransactionService.getTransactionsByMonth(
        transactions,
        date.getFullYear(),
        date.getMonth() + 1
      );

      const spending = TransactionService.getTotalExpenses(monthTransactions);
      const difference = spending - monthlyBudget;

      data.push({
        month: monthStr,
        spending: Math.round(spending * 100) / 100,
        budget: monthlyBudget,
        difference: Math.round(difference * 100) / 100,
      });
    }

    return data;
  }

  /**
   * Get top spending categories for display
   */
  static getTopSpendingCategories(
    transactions: Transaction[],
    limit: number = 5
  ): Array<{ category: string; amount: number; percentage: number; color: string }> {
    const topCategories = TransactionService.getTopCategories(transactions, limit);

    return topCategories.map((cat) => ({
      ...cat,
      color: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Default,
      amount: Math.round(cat.amount * 100) / 100,
      percentage: Math.round(cat.percentage * 100) / 100,
    }));
  }

  /**
   * Prepare data for spending velocity gauge
   */
  static getSpendingVelocityGauge(
    transactions: Transaction[],
    budget: number
  ): {
    current: number;
    max: number;
    percentage: number;
    status: 'healthy' | 'warning' | 'critical';
  } {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysIntoMonth = Math.floor((today.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const monthTransactions = TransactionService.getTransactionsByMonth(
      transactions,
      today.getFullYear(),
      today.getMonth() + 1
    );

    const spent = TransactionService.getTotalExpenses(monthTransactions);
    const projectedMonthly = (spent / daysIntoMonth) * new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const percentage = (projectedMonthly / budget) * 100;
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (percentage > 100) status = 'critical';
    else if (percentage > 80) status = 'warning';

    return {
      current: Math.round(projectedMonthly * 100) / 100,
      max: Math.round(budget * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
      status,
    };
  }

  /**
   * Get category color
   */
  static getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.Default;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number): string {
    return `${Math.round(value * 100) / 100}%`;
  }

  /**
   * Get chart animation duration based on data size
   */
  static getAnimationDuration(dataSize: number): number {
    return Math.min(dataSize * 50, 1000);
  }
}

export default ChartUtils;
