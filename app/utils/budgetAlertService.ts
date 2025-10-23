// Budget Alert Service - Monitors spending vs budget limits

export interface BudgetAlert {
  id: string;
  categoryName: string;
  categoryIcon: string;
  budgetLimit: number;
  currentSpending: number;
  percentageUsed: number;
  severity: 'info' | 'warning' | 'critical'; // 0-50%: info, 50-90%: warning, 90%+: critical
  message: string;
  timestamp: number;
}

export interface BudgetStatus {
  category: string;
  icon: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'healthy' | 'warning' | 'critical' | 'exceeded';
  shouldAlert: boolean;
}

class BudgetAlertService {
  /**
   * Check budget status for a transaction
   */
  static checkBudgetStatus(
    category: string,
    categoryIcon: string,
    budgetLimit: number,
    totalSpent: number
  ): BudgetStatus {
    const percentage = (totalSpent / budgetLimit) * 100;
    const remaining = budgetLimit - totalSpent;

    let status: 'healthy' | 'warning' | 'critical' | 'exceeded' = 'healthy';
    let shouldAlert = false;

    if (percentage >= 100) {
      status = 'exceeded';
      shouldAlert = true;
    } else if (percentage >= 90) {
      status = 'critical';
      shouldAlert = true;
    } else if (percentage >= 70) {
      status = 'warning';
      shouldAlert = true;
    }

    return {
      category,
      icon: categoryIcon,
      limit: budgetLimit,
      spent: totalSpent,
      remaining,
      percentage: Math.min(percentage, 100),
      status,
      shouldAlert,
    };
  }

  /**
   * Generate alert message based on budget status
   */
  static generateAlertMessage(budgetStatus: BudgetStatus): string {
    const { category, spent, limit, percentage, remaining } = budgetStatus;

    if (percentage >= 100) {
      return `🚨 CRITICAL: ${category} budget EXCEEDED! You've spent ₹${spent.toLocaleString('en-IN')} out of ₹${limit.toLocaleString('en-IN')} (${Math.round(percentage)}%). You're over by ₹${Math.abs(remaining).toLocaleString('en-IN')}!`;
    } else if (percentage >= 90) {
      return `⚠️ WARNING: ${category} budget almost exceeded! You've spent ₹${spent.toLocaleString('en-IN')} out of ₹${limit.toLocaleString('en-IN')} (${Math.round(percentage)}%). Only ₹${remaining.toLocaleString('en-IN')} remaining!`;
    } else if (percentage >= 70) {
      return `📊 NOTICE: ${category} spending is high. You've used ₹${spent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')} (${Math.round(percentage)}%). Only ₹${remaining.toLocaleString('en-IN')} left.`;
    }

    return `✅ ${category} spending is healthy. ₹${spent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')} (${Math.round(percentage)}%).`;
  }

  /**
   * Get severity color for alerts
   */
  static getSeverityColor(status: string): string {
    switch (status) {
      case 'exceeded':
        return 'from-red-500 to-red-600';
      case 'critical':
        return 'from-orange-500 to-red-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-green-500 to-emerald-600';
    }
  }

  /**
   * Get severity icon for alerts
   */
  static getSeverityIcon(status: string): string {
    switch (status) {
      case 'exceeded':
        return '🚨';
      case 'critical':
        return '⚠️';
      case 'warning':
        return '📊';
      default:
        return '✅';
    }
  }

  /**
   * Check all budgets against spending
   */
  static checkAllBudgets(
    budgetTargets: any[],
    transactions: any[]
  ): BudgetStatus[] {
    return budgetTargets.map(budget => {
      // Calculate total spent in this category
      const categoryTransactions = transactions.filter(
        tx => (tx.category || 'Other') === budget.category && tx.transaction_type === 'expense'
      );
      const totalSpent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      return this.checkBudgetStatus(
        budget.category,
        budget.icon,
        budget.amount,
        totalSpent
      );
    });
  }

  /**
   * Get only alerts that should be shown
   */
  static getActiveAlerts(budgetStatuses: BudgetStatus[]): BudgetStatus[] {
    return budgetStatuses.filter(status => status.shouldAlert);
  }

  /**
   * Store alert history in localStorage
   */
  static saveAlertHistory(userId: number, alerts: BudgetStatus[]) {
    const key = `finora_budget_alerts_${userId}`;
    const history = localStorage.getItem(key);
    const allAlerts = history ? JSON.parse(history) : [];

    // Add new alerts with timestamp
    const newAlerts = alerts.map(alert => ({
      ...alert,
      timestamp: Date.now(),
    }));

    // Keep only last 30 alerts
    const combined = [...allAlerts, ...newAlerts].slice(-30);
    localStorage.setItem(key, JSON.stringify(combined));
  }

  /**
   * Get alert history
   */
  static getAlertHistory(userId: number): BudgetStatus[] {
    const key = `finora_budget_alerts_${userId}`;
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
  }
}

export default BudgetAlertService;
