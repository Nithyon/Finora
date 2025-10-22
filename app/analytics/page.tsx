'use client';

import React, { useEffect, useState } from 'react';
import analyticsService, {
  MonthlySummary,
  SpendingForecast,
  CategoryBreakdown,
  BudgetTracking,
} from '@/lib/api/analyticsService';
import { useApp } from '@/lib/context';

interface InsightData {
  message: string;
  status: string;
  totalTransactions?: number;
  highestSpendingDay?: string;
}

export default function AnalyticsPage() {
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState(false);

  // Data states
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [forecast, setForecast] = useState<SpendingForecast | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [budgetTracking, setBudgetTracking] = useState<BudgetTracking | null>(null);
  const [insights, setInsights] = useState<InsightData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [user?.id]);

  const loadAnalyticsData = async () => {
    if (!user?.id) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if service is available
      const available = await analyticsService.checkHealth();
      setServiceAvailable(available);

      if (!available) {
        setError('Analytics service is currently unavailable. Please ensure Java microservice is running on port 8081.');
        setLoading(false);
        return;
      }

      // Load all analytics data in parallel
      const [summary, forecastData, categories, budget, insightsData] = await Promise.all([
        analyticsService.getMonthlySummary(user.id),
        analyticsService.getSpendingForecast(user.id),
        analyticsService.getCategoryBreakdown(user.id),
        analyticsService.getBudgetTracking(user.id),
        analyticsService.getSpendingInsights(user.id),
      ]);

      setMonthlySummary(summary);
      setForecast(forecastData);
      setCategoryBreakdown(categories);
      setBudgetTracking(budget);
      setInsights(insightsData as InsightData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data. Make sure the Java analytics microservice is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Advanced Analytics</h1>
        <p className="text-purple-200 text-sm">
          {serviceAvailable
            ? 'Powered by Java Microservice'
            : 'Analytics service unavailable - Java microservice not running'}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-purple-200">Loading analytics...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200 font-semibold">⚠️ {error}</p>
          <button
            onClick={loadAnalyticsData}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && serviceAvailable && (
        <div className="space-y-6">
          {/* Monthly Summary Cards */}
          {monthlySummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Income */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-200 text-sm font-semibold mb-2">💰 Total Income</p>
                <p className="text-3xl font-bold text-green-400">₹{monthlySummary.totalIncome.toLocaleString()}</p>
                <p className="text-green-200/60 text-xs mt-2">{monthlySummary.month}/{monthlySummary.year}</p>
              </div>

              {/* Total Expense */}
              <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-200 text-sm font-semibold mb-2">💸 Total Expense</p>
                <p className="text-3xl font-bold text-red-400">₹{monthlySummary.totalExpense.toLocaleString()}</p>
                <p className="text-red-200/60 text-xs mt-2">
                  {monthlySummary.transactionCount} transactions
                </p>
              </div>

              {/* Net Income */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-purple-200 text-sm font-semibold mb-2">📈 Net Income</p>
                <p className={`text-3xl font-bold ${monthlySummary.netIncome >= 0 ? 'text-purple-400' : 'text-orange-400'}`}>
                  ₹{monthlySummary.netIncome.toLocaleString()}
                </p>
                <p className="text-purple-200/60 text-xs mt-2">
                  {((monthlySummary.netIncome / monthlySummary.totalIncome) * 100).toFixed(1)}% savings rate
                </p>
              </div>
            </div>
          )}

          {/* Budget Tracking */}
          {budgetTracking && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">💳 Budget Tracking</h2>
              
              <div className="space-y-4">
                {/* Budget Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-200">Monthly Budget</span>
                    <span className="text-white font-semibold">
                      ₹{budgetTracking.currentSpending.toLocaleString()} / ₹{budgetTracking.budgetLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        budgetTracking.status === 'healthy'
                          ? 'bg-green-500'
                          : budgetTracking.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(budgetTracking.percentageUsed, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Remaining</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      budgetTracking.status === 'healthy'
                        ? 'bg-green-500/20 text-green-300'
                        : budgetTracking.status === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    ₹{budgetTracking.remaining.toLocaleString()} ({budgetTracking.status})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {categoryBreakdown.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">📂 Spending by Category</h2>
              
              <div className="space-y-3">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="bg-slate-700/30 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-semibold">{category.category}</p>
                        <p className="text-gray-400 text-xs">{category.transactionCount} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{category.totalAmount.toLocaleString()}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            category.trend === 'increasing'
                              ? 'bg-red-500/20 text-red-300'
                              : category.trend === 'decreasing'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {category.trend === 'increasing' ? '📈' : category.trend === 'decreasing' ? '📉' : '➡️'}{' '}
                          {category.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{category.percentage.toFixed(1)}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spending Forecast */}
          {forecast && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔮 Spending Forecast</h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded p-4">
                  <p className="text-gray-300 text-sm mb-2">Average Monthly Spending</p>
                  <p className="text-3xl font-bold text-purple-400">₹{forecast.averageMonthlyExpense.toLocaleString()}</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                  <p className="text-blue-200 text-sm">💡 Recommendation</p>
                  <p className="text-white mt-2">{forecast.recommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          {insights && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">💭 Smart Insights</h2>
              
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded p-4">
                  <p className="text-white">{insights.message}</p>
                  {insights.totalTransactions && (
                    <p className="text-gray-400 text-sm mt-2">
                      Total Transactions Analyzed: {insights.totalTransactions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-center">
            <button
              onClick={loadAnalyticsData}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              🔄 Refresh Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
