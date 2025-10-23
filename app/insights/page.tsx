'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import TransactionService from '@/app/utils/transactionService';
import GoalService from '@/app/utils/goalService';

export default function InsightsPage() {
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const transactions = TransactionService.getTransactions(user.id);
      const analysis = TransactionService.analyzeSpending(transactions);
      const velocity = TransactionService.getSpendingVelocity(transactions, []);
      const goals = GoalService.loadGoals(user.id);
      
      // Calculate insights
      const totalIncome = analysis.totalIncome;
      const totalExpense = analysis.totalExpense;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
      
      // Find top spending category
      const categories = Object.entries(analysis.byCategory)
        .map(([name, amount]) => ({ name, amount: amount as number }))
        .sort((a, b) => b.amount - a.amount);
      
      const topCategory = categories[0];
      
      // Calculate goal progress
      const goalProgresses = goals.map(goal => 
        GoalService.calculateGoalProgress(goal, transactions)
      );
      const completedGoals = goalProgresses.filter(gp => gp.status === 'completed').length;
      const goalsOnTrack = goalProgresses.filter(gp => gp.onTrack).length;
      const goalsBehind = goalProgresses.filter(gp => !gp.onTrack && gp.status !== 'completed').length;

      // Generate insights
      const insightMessages = [];

      // Savings rate insight
      if (savingsRate >= 30) {
        insightMessages.push({
          emoji: '🌟',
          title: 'Excellent Savings Rate',
          message: `You're saving ${savingsRate.toFixed(1)}% of income. Keep it up!`,
          type: 'positive'
        });
      } else if (savingsRate >= 15) {
        insightMessages.push({
          emoji: '👍',
          title: 'Healthy Savings',
          message: `You're saving ${savingsRate.toFixed(1)}% of income. Great progress!`,
          type: 'positive'
        });
      } else if (savingsRate >= 0) {
        insightMessages.push({
          emoji: '⚠️',
          title: 'Low Savings Rate',
          message: `You're saving ${savingsRate.toFixed(1)}% of income. Try to increase this.`,
          type: 'warning'
        });
      } else {
        insightMessages.push({
          emoji: '🚨',
          title: 'Spending More Than Earning',
          message: 'You\'re spending more than you earn. Review your budget.',
          type: 'critical'
        });
      }

      // Velocity insight
      if (velocity.status === 'critical') {
        insightMessages.push({
          emoji: '🚨',
          title: 'Budget Running Out Fast',
          message: `Budget will be exhausted in ${velocity.daysUntilExhausted} days at current pace`,
          type: 'critical'
        });
      } else if (velocity.status === 'warning') {
        insightMessages.push({
          emoji: '⚠️',
          title: 'High Spending Velocity',
          message: `You're spending ₹${velocity.weeklyTotal.toFixed(0)}/week. Watch your budget!`,
          type: 'warning'
        });
      } else {
        insightMessages.push({
          emoji: '✓',
          title: 'Healthy Spending Pace',
          message: `You're on pace at ₹${velocity.dailyAverage.toFixed(0)}/day average.`,
          type: 'positive'
        });
      }

      // Top category insight
      if (topCategory) {
        const topPercent = (topCategory.amount / totalExpense) * 100;
        insightMessages.push({
          emoji: '📊',
          title: 'Largest Expense Category',
          message: `${topCategory.name} is ${topPercent.toFixed(1)}% of your spending (₹${topCategory.amount.toLocaleString('en-IN')})`,
          type: 'neutral'
        });
      }

      // Goal insight
      if (goals.length > 0) {
        if (completedGoals > 0) {
          insightMessages.push({
            emoji: '🎉',
            title: `${completedGoals} Goal${completedGoals > 1 ? 's' : ''} Completed`,
            message: `You've achieved ${completedGoals} goal${completedGoals > 1 ? 's' : ''}. Amazing work!`,
            type: 'positive'
          });
        }
        if (goalsBehind > 0) {
          insightMessages.push({
            emoji: '📍',
            title: `${goalsBehind} Goal${goalsBehind > 1 ? 's' : ''} Behind Schedule`,
            message: `You have ${goalsBehind} goal${goalsBehind > 1 ? 's' : ''} that need attention.`,
            type: 'warning'
          });
        }
      }

      setInsights({
        totalIncome,
        totalExpense,
        savingsRate,
        topCategory,
        velocity,
        goals: {
          total: goals.length,
          completed: completedGoals,
          onTrack: goalsOnTrack,
          behind: goalsBehind
        },
        messages: insightMessages,
        categories
      });
    } catch (e) {
      console.error('Error calculating insights:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-white">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Finora</h1>
          <Link href="/settings" className="text-[#7a7d97] hover:text-white transition" title="Settings">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-1">Financial Insights</h2>
          <p className="text-xs text-[#a8aac5]">Personalized recommendations based on your spending</p>
        </div>

        {!insights || insights.messages.length === 0 ? (
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 text-center">
            <p className="text-[#7a7d97]">No data available yet</p>
            <p className="text-sm text-[#a8aac5] mt-2">Add transactions to get insights</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">₹{insights.totalIncome.toLocaleString('en-IN')}</p>
                <p className="text-xs text-[#7a7d97] mt-1">Income</p>
              </div>
              <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-400">₹{insights.totalExpense.toLocaleString('en-IN')}</p>
                <p className="text-xs text-[#7a7d97] mt-1">Expense</p>
              </div>
              <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${insights.savingsRate >= 15 ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                  {insights.savingsRate.toFixed(0)}%
                </p>
                <p className="text-xs text-[#7a7d97] mt-1">Save Rate</p>
              </div>
            </div>

            {/* Insights Messages */}
            <div className="space-y-3 mb-8">
              {insights.messages.map((msg: any, idx: number) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border-l-4 ${
                    msg.type === 'positive'
                      ? 'bg-green-500/10 border-green-500 text-green-300'
                      : msg.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500 text-yellow-300'
                      : msg.type === 'critical'
                      ? 'bg-red-500/10 border-red-500 text-red-300'
                      : 'bg-blue-500/10 border-blue-500 text-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{msg.emoji}</span>
                    <div>
                      <p className="font-semibold text-white">{msg.title}</p>
                      <p className="text-sm mt-1 opacity-90">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Spending Categories */}
            {insights.categories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-white mb-3">Top Spending Categories</h3>
                <div className="space-y-2">
                  {insights.categories.slice(0, 5).map((cat: any, idx: number) => (
                    <div key={idx} className="bg-[#141829] border border-[#2d3748] rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#a8aac5]">{idx + 1}. {cat.name}</span>
                        <span className="text-white font-semibold">
                          ₹{cat.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-[#2d3748] rounded h-1 mt-2">
                        <div
                          className="bg-gradient-to-r from-[#0066cc] to-[#5500cc] h-full rounded"
                          style={{
                            width: `${(cat.amount / insights.categories[0].amount) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals Status */}
            {insights.goals.total > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Goal Progress</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-[#10b981]">{insights.goals.completed}</p>
                    <p className="text-xs text-[#7a7d97] mt-1">Completed</p>
                  </div>
                  <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-[#0066cc]">{insights.goals.onTrack}</p>
                    <p className="text-xs text-[#7a7d97] mt-1">On Track</p>
                  </div>
                  <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-[#f59e0b]">{insights.goals.behind}</p>
                    <p className="text-xs text-[#7a7d97] mt-1">Behind</p>
                  </div>
                  <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-white">{insights.goals.total}</p>
                    <p className="text-xs text-[#7a7d97] mt-1">Total</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
