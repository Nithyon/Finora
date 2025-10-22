// @/app/utils/analyticsClient.ts
// Service to communicate with Java Analytics Microservice

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  byCategory: { [key: string]: number };
  transactionCount: number;
  month: string;
  year: string;
}

export interface SpendingForecast {
  predictedMonthlySpending: { [key: string]: number };
  averageMonthlyExpense: number;
  recommendation: string;
  trends: { [key: string]: any };
}

export interface CategoryBreakdown {
  category: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  trend: string;
  recentTransactions: string[];
}

export interface BudgetTracking {
  budgetLimit: number;
  currentSpending: number;
  remaining: number;
  percentageUsed: number;
  status: "healthy" | "warning" | "exceeded";
}

const ANALYTICS_API = process.env.NEXT_PUBLIC_ANALYTICS_API || "http://localhost:8081";

class AnalyticsService {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${ANALYTICS_API}/api/analytics/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return response.ok;
    } catch (error) {
      console.warn("Analytics service unavailable:", error);
      return false;
    }
  }

  async getMonthlySummary(
    userId: number,
    month: string = "10",
    year: string = "2025"
  ): Promise<MonthlySummary> {
    try {
      const response = await fetch(
        `${ANALYTICS_API}/api/analytics/monthly-summary/${userId}?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
      throw error;
    }
  }

  async getSpendingForecast(userId: number): Promise<SpendingForecast> {
    try {
      const response = await fetch(
        `${ANALYTICS_API}/api/analytics/spending-forecast/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching spending forecast:", error);
      throw error;
    }
  }

  async getCategoryBreakdown(
    userId: number,
    month: string = "10",
    year: string = "2025"
  ): Promise<CategoryBreakdown[]> {
    try {
      const response = await fetch(
        `${ANALYTICS_API}/api/analytics/category-breakdown/${userId}?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching category breakdown:", error);
      throw error;
    }
  }

  async getSpendingInsights(userId: number): Promise<{ [key: string]: any }> {
    try {
      const response = await fetch(
        `${ANALYTICS_API}/api/analytics/insights/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw error;
    }
  }

  async getMonthlyComparison(userId: number): Promise<{ [key: string]: any }> {
    try {
      const response = await fetch(
        `${ANALYTICS_API}/api/analytics/comparison/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching comparison:", error);
      throw error;
    }
  }

  async getBudgetTracking(userId: number): Promise<BudgetTracking> {
    try {
      const response = await fetch(
        `${ANALYTICS_API}/api/analytics/budget-tracking/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching budget tracking:", error);
      throw error;
    }
  }
}

export default new AnalyticsService();
