'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { finoraAPI, User, Account, Transaction, Budget, Goal } from '@/lib/api/finora-api';

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

  useEffect(() => {
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
      refreshAll(user.id);
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
