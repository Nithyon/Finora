'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import GoalService, { Goal, GoalProgress } from '@/app/utils/goalService';
import TransactionService from '@/app/utils/transactionService';

interface BudgetTarget {
  id: number;
  category: string;
  icon: string;
  group: 'Bills' | 'Needs' | 'Wants';
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';
  dueDate: string;
  repeat: boolean;
}

export default function ReflectPage() {
  const { user } = useApp();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalProgresses, setGoalProgresses] = useState<GoalProgress[]>([]);
  const [budgetTargets, setBudgetTargets] = useState<BudgetTarget[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load goals and calculate progress
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Load goals
      const loadedGoals = GoalService.loadGoals(user.id);
      setGoals(loadedGoals);

      // Calculate progress for each goal
      const transactions = TransactionService.getTransactions(user.id);
      const progresses = loadedGoals.map(goal => 
        GoalService.calculateGoalProgress(goal, transactions)
      );
      setGoalProgresses(progresses);

      // Load budget targets
      const saved = localStorage.getItem('finora_budget_targets');
      if (saved) {
        try {
          const targets = JSON.parse(saved);
          setBudgetTargets(targets);
        } catch (e) {
          console.error('Error loading budget targets:', e);
        }
      }
    } catch (e) {
      console.error('Error loading goals:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-white">Loading goals...</p>
      </div>
    );
  }

  const completedGoals = goalProgresses.filter(gp => gp.status === 'completed');
  const activeGoals = goalProgresses.filter(gp => gp.status !== 'completed');
  const healthyGoals = activeGoals.filter(gp => gp.onTrack);
  const atRiskGoals = activeGoals.filter(gp => !gp.onTrack);

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
        {/* Financial Goals Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-1">Financial Goals</h2>
          <p className="text-xs text-[#a8aac5] mb-4">Track progress and reach your targets</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#0066cc]">{activeGoals.length}</p>
              <p className="text-xs text-[#a8aac5] mt-1">Active</p>
            </div>
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#10b981]">{healthyGoals.length}</p>
              <p className="text-xs text-[#a8aac5] mt-1">On Track</p>
            </div>
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#10b981]">{completedGoals.length}</p>
              <p className="text-xs text-[#a8aac5] mt-1">Completed</p>
            </div>
          </div>

          {/* Active Goals */}
          {activeGoals.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#a8aac5] mb-3">Active Goals</h3>
              <div className="space-y-3">
                {activeGoals.map((progress) => {
                  const goal = progress.goal;
                  const daysLeftLabel = progress.daysRemaining > 0 
                    ? `${progress.daysRemaining} days left`
                    : 'Time expired';
                  
                  return (
                    <div 
                      key={goal.id} 
                      className={`rounded-lg p-4 border-2 transition ${
                        progress.onTrack 
                          ? 'bg-[#141829] border-[#2d3748] hover:border-[#0066cc]'
                          : 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-white">{goal.name}</h3>
                          <p className={`text-xs mt-1 ${
                            progress.onTrack ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {progress.status === 'completed' 
                              ? '✓ Completed!' 
                              : progress.status === 'healthy'
                              ? '✓ Healthy pace'
                              : progress.status === 'warning'
                              ? '⚠️ Behind schedule'
                              : '🚨 Critical'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#0066cc]">{Math.round(progress.progressPercent)}%</p>
                          <p className="text-xs text-[#a8aac5]">{daysLeftLabel}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#2d3748] rounded-full h-2 mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress.onTrack 
                              ? 'bg-gradient-to-r from-[#0066cc] to-[#5500cc]'
                              : 'bg-gradient-to-r from-red-500 to-orange-500'
                          }`}
                          style={{ width: `${Math.min(progress.progressPercent, 100)}%` }}
                        />
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#a8aac5]">
                        <div>
                          <p className="text-[#7a7d97]">Amount</p>
                          <p className="text-white font-semibold">₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-[#7a7d97]">Needed/Day</p>
                          <p className="text-white font-semibold">₹{Math.max(0, progress.averageNeededPerDay).toFixed(0)}</p>
                        </div>
                      </div>

                      {/* Recommendation */}
                      {progress.recommendation && (
                        <div className="mt-3 p-2 bg-[#1a2855] rounded text-xs text-[#a8aac5]">
                          <p className="text-[#0066cc] font-semibold mb-1">💡 Tip:</p>
                          <p>{progress.recommendation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 text-center mb-6">
              <p className="text-[#7a7d97]">No active goals yet</p>
              <p className="text-sm text-[#a8aac5] mt-2">Create your first goal to start tracking progress</p>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#10b981] mb-3">🎉 Completed ({completedGoals.length})</h3>
              <div className="space-y-2">
                {completedGoals.map((progress) => (
                  <div key={progress.goal.id} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="font-semibold text-white">{progress.goal.name}</p>
                    <p className="text-xs text-green-300 mt-1">✓ Goal completed!</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Targets */}
          {budgetTargets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#a8aac5]">Budget Targets</h3>
                <Link href="/personalize-plan" className="text-xs text-[#0066cc] hover:text-[#0052a3]">
                  Edit →
                </Link>
              </div>
              <div className="space-y-2">
                {budgetTargets.map((target) => (
                  <div key={target.id} className="bg-[#1a2855] border border-[#2d3748] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{target.icon}</span>
                        <p className="font-semibold text-white text-sm">{target.category}</p>
                      </div>
                      <p className="font-bold text-[#0066cc]">₹{target.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-xs text-[#7a7d97] mt-1">{target.group} • {target.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 fixed bottom-24 left-4 right-4 max-w-md mx-auto">
          <button 
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition"
          >
            {showAddGoal ? '✕ Cancel' : '+ Add New Goal'}
          </button>
          <Link 
            href="/personalize-plan"
            className="w-full bg-[#141829] hover:bg-[#1a2855] border border-[#2d3748] text-white py-3 rounded-lg font-semibold transition block text-center"
          >
            📋 Edit Budget Targets
          </Link>
        </div>
      </main>
    </div>
  );
}
