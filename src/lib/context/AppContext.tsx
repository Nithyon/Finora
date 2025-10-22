'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============ TYPE DEFINITIONS ============

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

// ============ API SERVICE (INLINED) ============

const API_BASE_URL = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://nithiyon-finora-backend.hf.space'
  : 'https://nithiyon-finora-backend.hf.space';

class FinoraAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

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

  async createUser(name: string, email: string): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });
  }

  async getUser(userId: number): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

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

  async getMonthlyAnalytics(
    userId: number,
    month?: string
  ): Promise<any> {
    const params = month ? `?month=${month}` : '';
    return this.request(`/users/${userId}/analytics/monthly${params}`);
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories');
  }

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

  async chat(message: string, userId?: number): Promise<{ response: string }> {
    return this.request<{ response: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    });
  }

  async getBudgetAdvice(userId: number): Promise<any> {
    return this.request(`/budget-advice?user_id=${userId}`);
  }
}

const finoraAPI = new FinoraAPI();

// ============ APP CONTEXT ============

interface AppState {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  categories: string[];
  currentMonth: string;
  loading: boolean;
}

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  refreshAccounts: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshBudgets: () => Promise<void>;
  refreshGoals: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  addTransaction: (data: any) => Promise<Transaction>;
  updateTransaction: (id: number, data: any) => Promise<Transaction>;
  deleteTransaction: (id: number) => Promise<void>;
  createBudget: (category: string, amount: number) => Promise<Budget>;
  updateBudget: (id: number, data: any) => Promise<Budget>;
  createGoal: (name: string, targetAmount: number, deadline: string) => Promise<Goal>;
  updateGoal: (id: number, data: any) => Promise<Goal>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    accounts: [],
    transactions: [],
    budgets: [],
    goals: [],
    categories: [],
    currentMonth: new Date().toISOString().slice(0, 7),
    loading: true,
  });

  const refreshAccounts = async (userId?: number) => {
    const uid = userId || state.user?.id;
    if (!uid) return;
    try {
      const accounts = await finoraAPI.getAccounts(uid);
      setState(prev => ({ ...prev, accounts }));
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const refreshTransactions = async (userId?: number) => {
    const uid = userId || state.user?.id;
    if (!uid) return;
    try {
      const transactions = await finoraAPI.getTransactions(uid);
      setState(prev => ({ ...prev, transactions }));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const refreshBudgets = async (userId?: number) => {
    const uid = userId || state.user?.id;
    if (!uid) return;
    try {
      const budgets = await finoraAPI.getBudgets(uid, 'monthly', state.currentMonth);
      setState(prev => ({ ...prev, budgets }));
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    }
  };

  const refreshGoals = async (userId?: number) => {
    const uid = userId || state.user?.id;
    if (!uid) return;
    try {
      const goals = await finoraAPI.getGoals(uid);
      setState(prev => ({ ...prev, goals }));
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const refreshCategories = async () => {
    try {
      const categories = await finoraAPI.getCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    const refreshAll = async (userId: number) => {
      setState(prev => ({ ...prev, loading: true }));
      await Promise.all([
        refreshAccounts(userId),
        refreshTransactions(userId),
        refreshBudgets(userId),
        refreshGoals(userId),
        refreshCategories(),
      ]);
      setState(prev => ({ ...prev, loading: false }));
    };

    const loadUser = async () => {
      const savedUser = localStorage.getItem('finora_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setState(prev => ({ ...prev, user, loading: false }));
          if (user.id) {
            await refreshAll(user.id);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          setState(prev => ({ ...prev, loading: false }));
        }
      } else {
        try {
          const newUser = await finoraAPI.createUser('Demo User', 'demo@finora.app');
          localStorage.setItem('finora_user', JSON.stringify(newUser));
          setState(prev => ({ ...prev, user: newUser }));
          await refreshAll(newUser.id);
        } catch (error) {
          console.error('Failed to create demo user:', error);
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };
    loadUser();
  }, []);

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
    if (user) {
      localStorage.setItem('finora_user', JSON.stringify(user));
      // Refresh all data for this user
      setState(prev => ({ ...prev, loading: true }));
      Promise.all([
        refreshAccounts(user.id),
        refreshTransactions(user.id),
        refreshBudgets(user.id),
        refreshGoals(user.id),
        refreshCategories(),
      ]).then(() => {
        setState(prev => ({ ...prev, loading: false }));
      });
    } else {
      localStorage.removeItem('finora_user');
    }
  };

  const addTransaction = async (data: any): Promise<Transaction> => {
    if (!state.user) throw new Error('No user logged in');
    const transaction = await finoraAPI.createTransaction({
      user_id: state.user.id,
      ...data,
    });
    await refreshTransactions();
    await refreshBudgets();
    return transaction;
  };

  const updateTransaction = async (id: number, data: any): Promise<Transaction> => {
    const transaction = await finoraAPI.updateTransaction(id, data);
    await refreshTransactions();
    await refreshBudgets();
    return transaction;
  };

  const deleteTransaction = async (id: number) => {
    await finoraAPI.deleteTransaction(id);
    await refreshTransactions();
    await refreshBudgets();
  };

  const createBudget = async (category: string, amount: number): Promise<Budget> => {
    if (!state.user) throw new Error('No user logged in');
    const budget = await finoraAPI.createBudget(state.user.id, category, amount);
    await refreshBudgets();
    return budget;
  };

  const updateBudget = async (id: number, data: any): Promise<Budget> => {
    const budget = await finoraAPI.updateBudget(id, data);
    await refreshBudgets();
    return budget;
  };

  const createGoal = async (name: string, targetAmount: number, deadline: string): Promise<Goal> => {
    if (!state.user) throw new Error('No user logged in');
    const goal = await finoraAPI.createGoal(state.user.id, name, targetAmount, deadline);
    await refreshGoals();
    return goal;
  };

  const updateGoal = async (id: number, data: any): Promise<Goal> => {
    const goal = await finoraAPI.updateGoal(id, data);
    await refreshGoals();
    return goal;
  };

  const contextValue: AppContextType = {
    ...state,
    setUser,
    refreshAccounts,
    refreshTransactions,
    refreshBudgets,
    refreshGoals,
    refreshCategories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    createBudget,
    updateBudget,
    createGoal,
    updateGoal,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
