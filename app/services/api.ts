/**
 * API Service - Handles all API calls to Finora backend
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import config from './api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.API_URL,
      timeout: config.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (request) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle errors
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // User methods
  async createUser(userData: { username: string; email: string }) {
    return this.client.post(config.endpoints.createUser, userData);
  }

  async getUser(id: number) {
    return this.client.get(config.endpoints.getUser(id));
  }

  // Account methods
  async createAccount(userId: number, accountData: any) {
    return this.client.post(config.endpoints.createAccount(userId), accountData);
  }

  async getAccounts(userId: number) {
    return this.client.get(config.endpoints.getAccounts(userId));
  }

  async getAccount(id: number) {
    return this.client.get(config.endpoints.getAccount(id));
  }

  // Transaction methods
  async createTransaction(userId: number, transactionData: any) {
    return this.client.post(
      `${config.endpoints.createTransaction}?user_id=${userId}`,
      { transaction: transactionData }
    );
  }

  async getTransactions(userId: number, params?: { month?: string; category?: string }) {
    const url = `${config.endpoints.getTransactions(userId)}`;
    return this.client.get(url, { params });
  }

  async getTransaction(id: number) {
    return this.client.get(config.endpoints.getTransaction(id));
  }

  async updateTransaction(id: number, data: any) {
    return this.client.put(config.endpoints.updateTransaction(id), data);
  }

  async deleteTransaction(id: number) {
    return this.client.delete(config.endpoints.deleteTransaction(id));
  }

  // Budget methods
  async createBudget(userId: number, budgetData: any) {
    return this.client.post(config.endpoints.createBudget(userId), budgetData);
  }

  async getBudgets(userId: number, month?: string) {
    const url = `${config.endpoints.getBudgets(userId)}`;
    return this.client.get(url, { params: month ? { month } : undefined });
  }

  async updateBudget(id: number, data: any) {
    return this.client.put(config.endpoints.updateBudget(id), data);
  }

  // Goal methods
  async createGoal(userId: number, goalData: any) {
    return this.client.post(config.endpoints.createGoal(userId), goalData);
  }

  async getGoals(userId: number) {
    return this.client.get(config.endpoints.getGoals(userId));
  }

  async updateGoal(id: number, data: any) {
    return this.client.put(config.endpoints.updateGoal(id), data);
  }

  // Analytics methods
  async getMonthlyAnalytics(userId: number, month: string) {
    return this.client.get(config.endpoints.getMonthlyAnalytics(userId, month));
  }

  // Category methods
  async getCategories() {
    return this.client.get(config.endpoints.getCategories);
  }

  async classifyExpense(description: string) {
    return this.client.post(config.endpoints.classifyExpense(description));
  }

  // Chatbot methods
  async chat(userId: number, message: string, userContext?: any) {
    return this.client.post(
      `${config.endpoints.chat}?user_id=${userId}`,
      {
        message,
        user_context: userContext,
      }
    );
  }

  async getBudgetAdvice(income: number) {
    return this.client.get(config.endpoints.getBudgetAdvice(income));
  }

  // Health check
  async healthCheck() {
    return this.client.get(config.endpoints.health);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
