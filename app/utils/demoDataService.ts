// app/utils/demoDataService.ts
// Generate realistic demo data for testing and development

import { Transaction } from './transactionService';

export interface DemoData {
  transactions: Transaction[];
  budgets: Array<{ category: string; amount: number }>;
  goals: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

class DemoDataService {
  /**
   * Generate realistic demo transactions for current month
   */
  static generateDemoTransactions(userId: number, count: number = 20): Transaction[] {
    const categories = ['Groceries', 'Rent', 'Transportation', 'Utilities', 'Entertainment', 'Dining Out', 'Shopping', 'Healthcare'];
    const descriptions: Record<string, string[]> = {
      'Groceries': ['Big Basket', 'DMart', 'Local Market', 'Reliance Fresh', 'More Supermarket'],
      'Rent': ['Monthly Rent Payment', 'Landlord Payment'],
      'Transportation': ['Uber', 'Auto Rikshaw', 'Bus Pass', 'Petrol', 'Train Ticket'],
      'Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Gas Bill'],
      'Entertainment': ['Netflix', 'Movie Ticket', 'Games', 'Books'],
      'Dining Out': ['Restaurant XYZ', 'Cafe', 'Food Delivery', 'Pizza Hut'],
      'Shopping': ['Amazon', 'Flipkart', 'Clothing Store', 'Shoes'],
      'Healthcare': ['Doctor', 'Pharmacy', 'Hospital', 'Medicine']
    };

    const transactions: Transaction[] = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStart = Math.ceil((startOfMonth.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate income
    const incomeTx: Transaction = {
      id: Date.now(),
      user_id: userId,
      amount: 50000,
      transaction_type: 'income',
      category: 'Salary',
      description: 'Monthly Salary',
      date: startOfMonth.toISOString().split('T')[0],
      created_at: startOfMonth.toISOString()
    };
    transactions.push(incomeTx);

    // Generate random expenses
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const categoryDescriptions = descriptions[category];
      const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
      
      // Random amount between ₹100 and ₹10,000
      let amount = Math.random() * 9900 + 100;
      
      // Adjust amounts by category
      if (category === 'Rent') amount = 20000 + Math.random() * 5000;
      if (category === 'Utilities') amount = 2000 + Math.random() * 2000;
      if (category === 'Transportation') amount = 500 + Math.random() * 1500;
      if (category === 'Groceries') amount = 2000 + Math.random() * 3000;
      if (category === 'Dining Out') amount = 300 + Math.random() * 800;
      
      amount = Math.round(amount);

      // Random day in current month
      const randomDay = Math.floor(Math.random() * (today.getDate() - 1)) + 1;
      const txDate = new Date(today.getFullYear(), today.getMonth(), randomDay);

      transactions.push({
        id: Date.now() + i,
        user_id: userId,
        amount,
        transaction_type: 'expense',
        category,
        description,
        date: txDate.toISOString().split('T')[0],
        created_at: txDate.toISOString()
      });
    }

    return transactions;
  }

  /**
   * Generate demo budgets matching categories
   */
  static generateDemoBudgets(): Array<{ category: string; amount: number }> {
    return [
      { category: 'Groceries', amount: 8000 },
      { category: 'Rent', amount: 20000 },
      { category: 'Transportation', amount: 3000 },
      { category: 'Utilities', amount: 4000 },
      { category: 'Entertainment', amount: 3000 },
      { category: 'Dining Out', amount: 4000 },
      { category: 'Shopping', amount: 5000 },
      { category: 'Healthcare', amount: 2000 }
    ];
  }

  /**
   * Generate demo goals
   */
  static generateDemoGoals(userId: number): Array<any> {
    const today = new Date();
    
    return [
      {
        id: `goal_${Date.now()}_1`,
        userId,
        name: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 35000,
        category: 'Savings',
        deadline: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0],
        priority: 'high',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: `goal_${Date.now()}_2`,
        userId,
        name: 'Vacation Trip',
        targetAmount: 50000,
        currentAmount: 15000,
        category: 'Travel',
        deadline: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()).toISOString().split('T')[0],
        priority: 'medium',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: `goal_${Date.now()}_3`,
        userId,
        name: 'Home Renovation',
        targetAmount: 200000,
        currentAmount: 75000,
        category: 'Home',
        deadline: new Date(today.getFullYear() + 2, today.getMonth(), today.getDate()).toISOString().split('T')[0],
        priority: 'low',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Generate complete demo dataset
   */
  static generateCompleteDemoData(userId: number): DemoData {
    return {
      transactions: this.generateDemoTransactions(userId),
      budgets: this.generateDemoBudgets(),
      goals: this.generateDemoGoals(userId)
    };
  }

  /**
   * Load demo data into localStorage
   */
  static loadDemoDataToLocalStorage(userId: number): void {
    const demoData = this.generateCompleteDemoData(userId);

    // Save transactions
    localStorage.setItem(
      `finora_transactions_${userId}`,
      JSON.stringify(demoData.transactions)
    );

    // Save budgets
    localStorage.setItem(
      `finora_budget_targets`,
      JSON.stringify(demoData.budgets)
    );

    // Save goals
    localStorage.setItem(
      `finora_goals_${userId}`,
      JSON.stringify(demoData.goals)
    );

    console.log('Demo data loaded successfully');
  }

  /**
   * Clear all demo data from localStorage
   */
  static clearDemoData(userId: number): void {
    localStorage.removeItem(`finora_transactions_${userId}`);
    localStorage.removeItem(`finora_budget_targets`);
    localStorage.removeItem(`finora_goals_${userId}`);
    localStorage.removeItem(`finora_bank_accounts_${userId}`);
    localStorage.removeItem(`finora_bank_transactions_${userId}`);
    console.log('Demo data cleared');
  }

  /**
   * Get summary statistics of demo data
   */
  static getSummaryStats(transactions: Transaction[], budgets: Array<{ category: string; amount: number }>): any {
    const income = transactions
      .filter(tx => tx.transaction_type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = transactions
      .filter(tx => tx.transaction_type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
      totalBudget,
      budgetUsed: (expenses / totalBudget) * 100,
      transactionCount: transactions.length,
      categoryCount: new Set(transactions.map(tx => tx.category)).size
    };
  }
}

export default DemoDataService;
