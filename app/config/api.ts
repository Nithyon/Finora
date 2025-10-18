/**
 * API Configuration for Finora
 * Handles environment-based API URLs
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (isDevelopment ? 'http://localhost:8000' : 'https://api.finora.app');

const config = {
  API_URL,
  TIMEOUT: 30000,
  
  // Endpoints
  endpoints: {
    // Users
    createUser: '/users',
    getUser: (id: number) => `/users/${id}`,
    
    // Accounts
    createAccount: (userId: number) => `/users/${userId}/accounts`,
    getAccounts: (userId: number) => `/users/${userId}/accounts`,
    getAccount: (id: number) => `/accounts/${id}`,
    
    // Transactions
    createTransaction: '/transactions',
    getTransactions: (userId: number) => `/users/${userId}/transactions`,
    getTransaction: (id: number) => `/transactions/${id}`,
    updateTransaction: (id: number) => `/transactions/${id}`,
    deleteTransaction: (id: number) => `/transactions/${id}`,
    
    // Budgets
    createBudget: (userId: number) => `/users/${userId}/budgets`,
    getBudgets: (userId: number) => `/users/${userId}/budgets`,
    updateBudget: (id: number) => `/budgets/${id}`,
    
    // Goals
    createGoal: (userId: number) => `/users/${userId}/goals`,
    getGoals: (userId: number) => `/users/${userId}/goals`,
    updateGoal: (id: number) => `/goals/${id}`,
    
    // Analytics
    getMonthlyAnalytics: (userId: number, month: string) => 
      `/users/${userId}/analytics/monthly?month=${month}`,
    
    // Categories
    getCategories: '/categories',
    classifyExpense: (description: string) => `/classify?description=${encodeURIComponent(description)}`,
    
    // Chatbot
    chat: '/chat',
    getBudgetAdvice: (income: number) => `/budget-advice?total_income=${income}`,
    
    // Health
    health: '/health',
  },
};

export default config;
