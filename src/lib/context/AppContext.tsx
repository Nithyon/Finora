'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { finoraAPI, User, Account, Transaction, Budget, Goal } from '../api/finora-api';

// Define the shape of our app state
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

// Define context methods
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

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    accounts: [],
    transactions: [],
    budgets: [],
    goals: [],
    categories: [],
    currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    loading: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('finora_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setState(prev => ({ ...prev, user, loading: false }));
        
        // Load user data
        if (user.id) {
          refreshAll(user.id);
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadUser();
  }, []);

  // Refresh all data
  const refreshAll = async (userId: number) => {
    await Promise.all([
      refreshAccounts(userId),
      refreshTransactions(userId),
      refreshBudgets(userId),
      refreshGoals(userId),
      refreshCategories(),
    ]);
  };

  // Set user and save to localStorage
  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
    if (user) {
      localStorage.setItem('finora_user', JSON.stringify(user));
      refreshAll(user.id);
    } else {
      localStorage.removeItem('finora_user');
    }
  };

  // Refresh accounts
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

  // Refresh transactions
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

  // Refresh budgets
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

  // Refresh goals
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

  // Refresh categories
  const refreshCategories = async () => {
    try {
      const categories = await finoraAPI.getCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Add transaction
  const addTransaction = async (data: any): Promise<Transaction> => {
    if (!state.user) throw new Error('No user logged in');

    const transaction = await finoraAPI.createTransaction({
      user_id: state.user.id,
      ...data,
    });

    await refreshTransactions();
    await refreshBudgets(); // Update budgets after transaction
    return transaction;
  };

  // Update transaction
  const updateTransaction = async (id: number, data: any): Promise<Transaction> {
    const transaction = await finoraAPI.updateTransaction(id, data);
    await refreshTransactions();
    await refreshBudgets();
    return transaction;
  };

  // Delete transaction
  const deleteTransaction = async (id: number): Promise<void> => {
    await finoraAPI.deleteTransaction(id);
    await refreshTransactions();
    await refreshBudgets();
  };

  // Create budget
  const createBudget = async (category: string, amount: number): Promise<Budget> => {
    if (!state.user) throw new Error('No user logged in');

    const budget = await finoraAPI.createBudget(state.user.id, category, amount);
    await refreshBudgets();
    return budget;
  };

  // Update budget
  const updateBudget = async (id: number, data: any): Promise<Budget> => {
    const budget = await finoraAPI.updateBudget(id, data);
    await refreshBudgets();
    return budget;
  };

  // Create goal
  const createGoal = async (
    name: string,
    targetAmount: number,
    deadline: string
  ): Promise<Goal> {
    if (!state.user) throw new Error('No user logged in');

    const goal = await finoraAPI.createGoal(state.user.id, name, targetAmount, deadline);
    await refreshGoals();
    return goal;
  };

  // Update goal
  const updateGoal = async (id: number, data: any): Promise<Goal> => {
    const goal = await finoraAPI.updateGoal(id, data);
    await refreshGoals();
    return goal;
  };

  const contextValue: AppContextType = {
    ...state,
    setUser,
    refreshAccounts: () => refreshAccounts(),
    refreshTransactions: () => refreshTransactions(),
    refreshBudgets: () => refreshBudgets(),
    refreshGoals: () => refreshGoals(),
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

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
