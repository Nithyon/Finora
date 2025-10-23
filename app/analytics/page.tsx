'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useApp } from '@/lib/context';
import TransactionService, { Transaction } from '../utils/transactionService';
import GoalService, { Goal, GoalProgress } from '../utils/goalService';
import ChartUtils from '../utils/chartUtils';
import DemoDataService from '../utils/demoDataService';

export default function AnalyticsPage() {
  const { user, transactions: contextTransactions, refreshTransactions } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  });

  // Budgets
  const [budgets, setBudgets] = useState<Array<{ category: string; amount: number }>>([]);

  // Goals
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalProgresses, setGoalProgresses] = useState<GoalProgress[]>([]);

  // Chart data
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [budgetComparison, setBudgetComparison] = useState<any[]>([]);
  const [spendingTrend, setSpendingTrend] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [incomeVsExpense, setIncomeVsExpense] = useState<any>(null);
  const [velocity, setVelocity] = useState<any>(null);

  // Load all data
  useEffect(() => {
    if (!user?.id) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      // Refresh transactions from context
      if (refreshTransactions) {
        refreshTransactions().catch(err => console.error('Failed to refresh transactions:', err));
      }

      // Load transactions from context or localStorage
      let allTxns = contextTransactions && contextTransactions.length > 0 
        ? (contextTransactions as unknown as Transaction[])
        : TransactionService.getTransactions(user.id);
      
      // If no transactions exist, load demo data automatically
      if (!allTxns || allTxns.length === 0) {
        console.log('No transactions found, loading demo data...');
        DemoDataService.loadDemoDataToLocalStorage(user.id);
        allTxns = TransactionService.getTransactions(user.id);
      }
      
      setTransactions(allTxns);

      // Load budgets
      let budgetsKey = `finora_budget_targets_${user.id}`;
      let savedBudgets = localStorage.getItem(budgetsKey) || localStorage.getItem('finora_budget_targets');
      
      // If no budgets, use demo data budgets
      if (!savedBudgets) {
        const demoData = DemoDataService.generateCompleteDemoData(user.id);
        savedBudgets = JSON.stringify(demoData.budgets);
      }
      
      if (savedBudgets) {
        const parsed = JSON.parse(savedBudgets);
        const budgetArray = Array.isArray(parsed) ? parsed : [];
        setBudgets(budgetArray.map(b => ({
          category: b.category || b.name,
          amount: b.amount
        })));
      }

      // Load goals
      let savedGoals = GoalService.loadGoals(user.id);
      
      // If no goals, load from demo data
      if (!savedGoals || savedGoals.length === 0) {
        const demoData = DemoDataService.generateCompleteDemoData(user.id);
        savedGoals = (demoData.goals as unknown as Goal[]);
      }
      
      setGoals(savedGoals);

      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [user?.id, contextTransactions, refreshTransactions]);

  // Recalculate charts when data or month changes
  useEffect(() => {
    if (!transactions.length) return;

    try {
      // Get transactions for selected month
      const monthTxns = TransactionService.getTransactionsByMonth(
        transactions,
        selectedMonth.year,
        selectedMonth.month
      );

      // Update charts
      setSpendingByCategory(ChartUtils.getSpendingByCategory(monthTxns));
      setBudgetComparison(ChartUtils.getBudgetComparison(monthTxns, budgets));
      setSpendingTrend(ChartUtils.getSpendingTrend(transactions, 30));
      setTopCategories(ChartUtils.getTopSpendingCategories(monthTxns, 5));
      setIncomeVsExpense(ChartUtils.getIncomeVsExpense(monthTxns));
      setVelocity(ChartUtils.getSpendingVelocityGauge(monthTxns, budgets.reduce((sum, b) => sum + b.amount, 0)));

      // Update goal progress
      if (goals.length > 0) {
        const progresses = GoalService.getAllGoalsProgress(goals, transactions);
        setGoalProgresses(progresses);
      }
    } catch (err) {
      console.error('Error calculating analytics:', err);
    }
  }, [transactions, budgets, goals, selectedMonth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4 mx-auto"></div>
          <p className="text-purple-200">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Advanced Analytics</h1>
            <p className="text-green-400 text-xs">✅ LIVE - Charts Working - v2.0.0</p>
          </div>
        </div>
        <p className="text-purple-200 text-sm mt-2">Comprehensive spending analysis & goal tracking</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Month Selector */}
      <div className="mb-6 flex gap-2">
        <select
          value={selectedMonth.month}
          onChange={(e) => setSelectedMonth(prev => ({ ...prev, month: parseInt(e.target.value) }))}
          className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(2000, i).toLocaleString('en-IN', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth.year}
          onChange={(e) => setSelectedMonth(prev => ({ ...prev, year: parseInt(e.target.value) }))}
          className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      {/* Income vs Expense Summary */}
      {incomeVsExpense && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-200 text-sm font-semibold mb-2">💰 Income</p>
            <p className="text-2xl font-bold text-green-400">{ChartUtils.formatCurrency(incomeVsExpense.income)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-200 text-sm font-semibold mb-2">💸 Expense</p>
            <p className="text-2xl font-bold text-red-400">{ChartUtils.formatCurrency(incomeVsExpense.expense)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-purple-200 text-sm font-semibold mb-2">📈 Savings</p>
            <p className="text-2xl font-bold text-purple-400">{ChartUtils.formatCurrency(incomeVsExpense.savings)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-200 text-sm font-semibold mb-2">📊 Rate</p>
            <p className="text-2xl font-bold text-blue-400">{ChartUtils.formatPercentage(incomeVsExpense.savingsRate)}</p>
          </div>
        </div>
      )}

      {/* Spending Velocity Gauge */}
      {velocity && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Spending Velocity</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-200">Monthly Projection</span>
                <span className="text-white font-semibold">
                  {ChartUtils.formatCurrency(velocity.current)} / {ChartUtils.formatCurrency(velocity.max)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    velocity.status === 'healthy'
                      ? 'bg-green-500'
                      : velocity.status === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(velocity.percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                {velocity.status === 'healthy' ? '✅ On track' : velocity.status === 'warning' ? '⚠️ Watch spending' : '🚨 Over budget'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart - Spending by Category */}
        {spendingByCategory.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">📂 Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => ChartUtils.formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Spending Categories */}
        {topCategories.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">🏆 Top Spending Categories</h2>
            <div className="space-y-3">
              {topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-white">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{ChartUtils.formatCurrency(cat.amount)}</p>
                    <p className="text-gray-400 text-xs">{cat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Budget Comparison */}
      {budgetComparison.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">💳 Budget vs Actual</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="category" stroke="#a8aac5" />
              <YAxis stroke="#a8aac5" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => ChartUtils.formatCurrency(value as number)}
              />
              <Legend />
              <Bar dataKey="budget" stackId="a" fill="#0066cc" />
              <Bar dataKey="spent" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Spending Trend */}
      {spendingTrend.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">📈 Spending Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="date" stroke="#a8aac5" />
              <YAxis stroke="#a8aac5" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => ChartUtils.formatCurrency(value as number)}
              />
              <Legend />
              <Line type="monotone" dataKey="cumulative" stroke="#0066cc" name="Cumulative Spending" />
              <Line type="monotone" dataKey="spending" stroke="#ef4444" name="Daily Spending" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Goals Dashboard */}
      {goalProgresses.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">🎯 Goal Progress</h2>
          
          <div className="space-y-4">
            {goalProgresses.map((gp, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{gp.goal.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {ChartUtils.formatCurrency(gp.goal.currentAmount)} / {ChartUtils.formatCurrency(gp.goal.targetAmount)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    gp.status === 'healthy' ? 'bg-green-500/20 text-green-300' :
                    gp.status === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                    gp.status === 'critical' ? 'bg-red-500/20 text-red-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {gp.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        gp.status === 'healthy' ? 'bg-green-500' :
                        gp.status === 'warning' ? 'bg-yellow-500' :
                        gp.status === 'critical' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(gp.progressPercent, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{gp.progressPercent.toFixed(1)}% complete</p>
                </div>

                {/* Goal Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Days Left</p>
                    <p className="text-white font-semibold">{gp.daysRemaining}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Needed/Day</p>
                    <p className="text-white font-semibold">{ChartUtils.formatCurrency(gp.averageNeededPerDay)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">On Track</p>
                    <p className={gp.onTrack ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {gp.onTrack ? '✓' : '✗'}
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-200">
                  {gp.recommendation}
                </div>
              </div>
            ))}
          </div>

          <Link href="/reflect" className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm">
            Manage Goals →
          </Link>
        </div>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-12 text-center">
          <p className="text-gray-400 mb-4">No transactions yet</p>
          <Link href="/add-transaction" className="text-blue-400 hover:text-blue-300">
            Add your first transaction →
          </Link>
        </div>
      )}
    </div>
  );
}