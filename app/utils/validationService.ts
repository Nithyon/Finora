// app/utils/validationService.ts
// Comprehensive validation and error handling for financial data

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

class ValidationService {
  /**
   * Validate transaction amount
   */
  static validateAmount(amount: number, fieldName: string = 'Amount'): ValidationError[] {
    const errors: ValidationError[] = [];

    if (isNaN(amount)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        type: 'error'
      });
    }

    if (amount < 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot be negative`,
        type: 'error'
      });
    }

    if (amount === 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot be zero`,
        type: 'error'
      });
    }

    if (amount > 10000000) {
      errors.push({
        field: fieldName,
        message: `${fieldName} seems unusually high (>₹1 Crore)`,
        type: 'warning'
      });
    }

    return errors;
  }

  /**
   * Validate budget amount
   */
  static validateBudget(amount: number): ValidationError[] {
    const errors: ValidationError[] = [];

    if (isNaN(amount) || amount < 0) {
      errors.push({
        field: 'Budget',
        message: 'Budget must be a positive number',
        type: 'error'
      });
    }

    if (amount === 0) {
      errors.push({
        field: 'Budget',
        message: 'Budget cannot be zero',
        type: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate category name
   */
  static validateCategory(category: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!category || category.trim().length === 0) {
      errors.push({
        field: 'Category',
        message: 'Category name cannot be empty',
        type: 'error'
      });
    }

    if (category.length > 50) {
      errors.push({
        field: 'Category',
        message: 'Category name must be less than 50 characters',
        type: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate goal parameters
   */
  static validateGoal(name: string, targetAmount: number, deadline: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate name
    if (!name || name.trim().length === 0) {
      errors.push({
        field: 'Goal Name',
        message: 'Goal name cannot be empty',
        type: 'error'
      });
    }

    // Validate amount
    const amountErrors = this.validateAmount(targetAmount, 'Target Amount');
    errors.push(...amountErrors);

    // Validate deadline
    const deadlineDate = new Date(deadline);
    const today = new Date();

    if (isNaN(deadlineDate.getTime())) {
      errors.push({
        field: 'Deadline',
        message: 'Invalid deadline date',
        type: 'error'
      });
    }

    if (deadlineDate <= today) {
      errors.push({
        field: 'Deadline',
        message: 'Deadline must be in the future',
        type: 'error'
      });
    }

    // Check if deadline is too far
    const daysUntilDeadline = (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntilDeadline > 1095) { // 3 years
      warnings.push({
        field: 'Deadline',
        message: 'Deadline is more than 3 years away',
        type: 'warning'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate spending consistency
   */
  static validateSpendingConsistency(
    totalSpent: number,
    budgetedAmount: number,
    categorySpending: Record<string, number>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if total from categories matches total spent
    const categoryTotal = Object.values(categorySpending).reduce((a, b) => a + b, 0);
    if (Math.abs(categoryTotal - totalSpent) > 1) { // Allow 1 rupee rounding difference
      errors.push({
        field: 'Spending Data',
        message: 'Category spending totals do not match overall total. Data may be inconsistent.',
        type: 'warning'
      });
    }

    // Check for overspending
    if (totalSpent > budgetedAmount) {
      errors.push({
        field: 'Budget',
        message: `Over budget by ₹${(totalSpent - budgetedAmount).toLocaleString('en-IN')}`,
        type: 'warning'
      });
    }

    return errors;
  }

  /**
   * Validate account balance
   */
  static validateAccountBalance(balance: number): ValidationError[] {
    const errors: ValidationError[] = [];

    if (isNaN(balance)) {
      errors.push({
        field: 'Balance',
        message: 'Balance must be a valid number',
        type: 'error'
      });
    }

    if (balance < 0) {
      errors.push({
        field: 'Balance',
        message: 'Account has negative balance',
        type: 'warning'
      });
    }

    return errors;
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      errors.push({
        field: 'Email',
        message: 'Invalid email format',
        type: 'error'
      });
    }

    return errors;
  }

  /**
   * Validate income amount
   */
  static validateIncome(amount: number): ValidationError[] {
    const errors: ValidationError[] = [];

    if (isNaN(amount) || amount <= 0) {
      errors.push({
        field: 'Income',
        message: 'Monthly income must be a positive number',
        type: 'error'
      });
    }

    if (amount > 1000000000) {
      errors.push({
        field: 'Income',
        message: 'Income seems unusually high',
        type: 'warning'
      });
    }

    return errors;
  }

  /**
   * Check data integrity
   */
  static checkDataIntegrity(transactions: any[], budgets: any[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check for duplicate transactions
    const txIds = new Set();
    const duplicates = [];
    transactions.forEach(tx => {
      if (txIds.has(tx.id)) {
        duplicates.push(tx.id);
      }
      txIds.add(tx.id);
    });

    if (duplicates.length > 0) {
      errors.push({
        field: 'Transactions',
        message: `Found ${duplicates.length} duplicate transaction IDs`,
        type: 'warning'
      });
    }

    // Check for missing required fields
    transactions.forEach((tx, idx) => {
      if (!tx.amount || !tx.category || !tx.date) {
        errors.push({
          field: 'Transaction',
          message: `Transaction ${idx + 1} has missing required fields`,
          type: 'error'
        });
      }
    });

    // Check for orphaned budgets (no transactions)
    budgets.forEach(budget => {
      const hasTransactions = transactions.some(tx => tx.category === budget.category);
      if (!hasTransactions) {
        warnings.push({
          field: 'Budget',
          message: `Budget for "${budget.category}" has no transactions`,
          type: 'warning'
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate health report
   */
  static generateHealthReport(
    totalIncome: number,
    totalExpense: number,
    savingsRate: number,
    onTrackGoals: number,
    totalGoals: number,
    velocity: any
  ): string {
    let report = '';

    if (savingsRate >= 30) {
      report += '✓ Excellent savings rate\n';
    } else if (savingsRate >= 15) {
      report += '✓ Healthy savings rate\n';
    } else if (savingsRate >= 0) {
      report += '⚠ Low savings rate\n';
    } else {
      report += '✗ Negative savings (spending more than earning)\n';
    }

    if (velocity.status === 'healthy') {
      report += '✓ Healthy spending pace\n';
    } else if (velocity.status === 'warning') {
      report += '⚠ High spending velocity\n';
    } else {
      report += '✗ Critical spending pace\n';
    }

    if (totalGoals > 0) {
      const goalsPercent = (onTrackGoals / totalGoals) * 100;
      if (goalsPercent === 100) {
        report += '✓ All goals on track\n';
      } else if (goalsPercent >= 50) {
        report += '✓ Most goals on track\n';
      } else {
        report += '⚠ Several goals behind\n';
      }
    }

    return report;
  }
}

export default ValidationService;
