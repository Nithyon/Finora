// Finora API Service - Connect to HuggingFace Backend
// Base URL: https://Nithiyon-finora-backend.hf.space

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nithiyon-finora-backend.hf.space';

// Types matching backend schemas
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  account_type: string;
  balance: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  amount: number;
  transaction_type: string;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Budget {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  period: string;
  spent: number;
  remaining: number;
  created_at: string;
}

export interface Goal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: string;
  created_at: string;
}

export interface MonthlyAnalytics {
  total_income: number;
  total_expenses: number;
  net_savings: number;
  top_categories: Array<{ category: string; amount: number; percentage: number }>;
  transactions_count: number;
  budget_utilization: number;
}

// API Service Class
class FinoraAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for API calls
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ============ USER ENDPOINTS ============
  
  async createUser(name: string, email: string): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });
  }

  async getUser(userId: number): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  // ============ ACCOUNT ENDPOINTS ============

  async createAccount(
    userId: number,
    name: string,
    accountType: string,
    initialBalance: number = 0
  ): Promise<Account> {
    return this.request<Account>(`/users/${userId}/accounts`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        account_type: accountType,
        balance: initialBalance,
      }),
    });
  }

  async getAccounts(userId: number): Promise<Account[]> {
    return this.request<Account[]>(`/users/${userId}/accounts`);
  }

  async getAccount(accountId: number): Promise<Account> {
    return this.request<Account>(`/accounts/${accountId}`);
  }

  // ============ TRANSACTION ENDPOINTS ============

  async createTransaction(data: {
    user_id: number;
    account_id: number;
    amount: number;
    transaction_type: 'income' | 'expense';
    category: string;
    description: string;
    date?: string;
  }): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        date: data.date || new Date().toISOString().split('T')[0],
      }),
    });
  }

  async getTransactions(
    userId: number,
    filters?: {
      category?: string;
      start_date?: string;
      end_date?: string;
      transaction_type?: string;
    }
  ): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.transaction_type) params.append('type', filters.transaction_type);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Transaction[]>(`/users/${userId}/transactions${query}`);
  }

  async getTransaction(transactionId: number): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${transactionId}`);
  }

  async updateTransaction(
    transactionId: number,
    data: Partial<{
      amount: number;
      category: string;
      description: string;
      date: string;
    }>
  ): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(transactionId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/transactions/${transactionId}`, {
      method: 'DELETE',
    });
  }

  // ============ BUDGET ENDPOINTS ============

  async createBudget(
    userId: number,
    category: string,
    amount: number,
    period: string = 'monthly'
  ): Promise<Budget> {
    return this.request<Budget>(`/users/${userId}/budgets`, {
      method: 'POST',
      body: JSON.stringify({ category, amount, period }),
    });
  }

  async getBudgets(
    userId: number,
    period?: string,
    month?: string
  ): Promise<Budget[]> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (month) params.append('month', month);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Budget[]>(`/users/${userId}/budgets${query}`);
  }

  async updateBudget(
    budgetId: number,
    data: Partial<{ amount: number; spent: number }>
  ): Promise<Budget> {
    return this.request<Budget>(`/budgets/${budgetId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============ GOAL ENDPOINTS ============

  async createGoal(
    userId: number,
    name: string,
    targetAmount: number,
    deadline: string
  ): Promise<Goal> {
    return this.request<Goal>(`/users/${userId}/goals`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        target_amount: targetAmount,
        current_amount: 0,
        deadline,
      }),
    });
  }

  async getGoals(userId: number): Promise<Goal[]> {
    return this.request<Goal[]>(`/users/${userId}/goals`);
  }

  async updateGoal(
    goalId: number,
    data: Partial<{ current_amount: number; status: string }>
  ): Promise<Goal> {
    return this.request<Goal>(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============ ANALYTICS ENDPOINTS ============

  async getMonthlyAnalytics(
    userId: number,
    month?: string
  ): Promise<MonthlyAnalytics> {
    const params = month ? `?month=${month}` : '';
    return this.request<MonthlyAnalytics>(
      `/users/${userId}/analytics/monthly${params}`
    );
  }

  // ============ CATEGORIES ENDPOINT ============

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories');
  }

  // ============ CLASSIFICATION ENDPOINT ============

  async classifyTransaction(description: string): Promise<{
    category: string;
    confidence: number;
    method: string;
  }> {
    return this.request<{ category: string; confidence: number; method: string }>(
      '/classify',
      {
        method: 'POST',
        body: JSON.stringify({ description }),
      }
    );
  }

  // ============ CHAT ENDPOINT ============

  async chat(message: string, userId?: number): Promise<{ response: string }> {
    return this.request<{ response: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    });
  }

  // ============ BUDGET ADVICE ENDPOINT ============

  async getBudgetAdvice(userId: number): Promise<{
    advice: string[];
    spending_summary: Record<string, number>;
    recommendations: string[];
  }> {
    return this.request(`/budget-advice?user_id=${userId}`);
  }
}

// Export singleton instance
export const finoraAPI = new FinoraAPI();

// Export class for testing
export default FinoraAPI;
