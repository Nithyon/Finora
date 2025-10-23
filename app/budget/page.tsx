'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import TransactionService from '@/app/utils/transactionService';

const categoryIcons: Record<string, string> = {
  Groceries: '🛒',
  Rent: '🏠',
  Transportation: '🚗',
  Utilities: '💡',
  Entertainment: '🎬',
  'Dining Out': '🍽️',
  Shopping: '🛍️',
  Savings: '💰',
  Default: '💳',
};

export default function BudgetPage() {
  const { budgets, loading, user } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [categoryMetrics, setCategoryMetrics] = useState<Record<string, any>>({});

  // Calculate velocity metrics for each category
  useEffect(() => {
    if (user?.id && budgets && budgets.length > 0) {
      try {
        const transactions = TransactionService.getTransactions(user.id);
        const metrics: Record<string, any> = {};

        budgets.forEach((budget) => {
          // Get category spending
          const categoryTransactions = transactions.filter(
            tx => tx.category === budget.category && tx.transaction_type === 'expense'
          );
          
          if (categoryTransactions.length > 0) {
            const dailyAvg = TransactionService.getCategorySpending(transactions, budget.category);
            const daysInMonth = 30;
            const daysPassed = new Date().getDate();
            const daysRemaining = daysInMonth - daysPassed;
            
            // Calculate metrics
            const avgPerDay = dailyAvg / daysPassed;
            const projectedTotal = avgPerDay * daysInMonth;
            const daysUntilBudgetHit = Math.max(0, (budget.amount - budget.spent) / avgPerDay);
            const onTrack = projectedTotal <= budget.amount;
            const trend = projectedTotal > budget.amount 
              ? 'overspending' 
              : projectedTotal > budget.amount * 0.8 
              ? 'warning' 
              : 'healthy';

            metrics[budget.category] = {
              avgPerDay: Math.round(avgPerDay),
              projectedTotal: Math.round(projectedTotal),
              daysUntilBudgetHit: Math.round(daysUntilBudgetHit),
              onTrack,
              trend,
              daysRemaining
            };
          }
        });

        setCategoryMetrics(metrics);
      } catch (e) {
        console.error('Error calculating metrics:', e);
      }
    }
  }, [user?.id, budgets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-white">Finora</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Budget Plan 📋</h2>
          <p className="text-sm text-[#a8aac5]">Monthly spending limits</p>
        </div>

        {budgets && budgets.length > 0 ? (
          budgets.map((budget) => {
            const percent = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const isOverBudget = budget.spent > budget.amount;
            const icon = categoryIcons[budget.category] || categoryIcons.Default;
            const metrics = categoryMetrics[budget.category];
            
            return (
              <div 
                key={budget.id} 
                className={`border rounded-lg p-4 mb-4 transition ${
                  isOverBudget 
                    ? 'bg-red-500/5 border-red-500/30'
                    : percent > 80
                    ? 'bg-yellow-500/5 border-yellow-500/30'
                    : 'bg-[#141829] border-[#2d3748]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{budget.category}</p>
                      <p className="text-xs text-[#7a7d97]">
                        ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isOverBudget ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                      {isOverBudget ? '🚨 Over' : '✓ OK'}
                    </p>
                    <p className="text-xs text-[#a8aac5]">
                      ₹{Math.max(0, budget.amount - budget.spent).toLocaleString('en-IN')} left
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#2d3748] rounded-full h-2 mb-3">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isOverBudget 
                        ? 'bg-[#ef4444]' 
                        : percent > 80
                        ? 'bg-[#f59e0b]'
                        : 'bg-gradient-to-r from-[#0066cc] to-[#5500cc]'
                    }`}
                    style={{width: `${Math.min(percent, 100)}%`}}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#7a7d97] mb-3">
                  <span>{Math.round(Math.min(percent, 100))}% used</span>
                  <span>{isOverBudget ? 'OVER BUDGET' : 'On track'}</span>
                </div>

                {/* Velocity Metrics */}
                {metrics && (
                  <div className="grid grid-cols-3 gap-2 p-2 bg-[#1a2855]/50 rounded">
                    <div>
                      <p className="text-xs text-[#7a7d97] mb-1">Avg/Day</p>
                      <p className="text-sm font-semibold text-white">₹{metrics.avgPerDay.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7a7d97] mb-1">Projected</p>
                      <p className={`text-sm font-semibold ${metrics.onTrack ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        ₹{metrics.projectedTotal.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7a7d97] mb-1">Days Left</p>
                      <p className={`text-sm font-semibold ${metrics.daysUntilBudgetHit > 5 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {Math.min(metrics.daysUntilBudgetHit, metrics.daysRemaining)} days
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {metrics && (
                  <div className="mt-2 text-xs">
                    {metrics.trend === 'overspending' && (
                      <p className="text-[#ef4444]">
                        ⚠️ At this pace, you'll exceed budget in {metrics.daysUntilBudgetHit} days
                      </p>
                    )}
                    {metrics.trend === 'warning' && (
                      <p className="text-[#f59e0b]">
                        📊 Watch out! On track to hit budget soon
                      </p>
                    )}
                    {metrics.trend === 'healthy' && (
                      <p className="text-[#10b981]">
                        ✓ Spending at a healthy pace - {metrics.daysRemaining} days left in month
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-[#7a7d97] py-8">No budgets yet. Create one to get started!</p>
        )}

        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition"
        >
          + Create New Budget
        </button>
      </main>
    </div>
  );
}

