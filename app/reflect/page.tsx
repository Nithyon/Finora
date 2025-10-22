'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  icon: string;
  source: 'custom' | 'budget';
}

export default function ReflectPage() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, name: 'Emergency Fund', target: 5000, current: 2500, icon: '🏠', source: 'custom' },
    { id: 2, name: 'Vacation', target: 3000, current: 1200, icon: '✈️', source: 'custom' },
    { id: 3, name: 'Car Down Payment', target: 10000, current: 4500, icon: '🚗', source: 'custom' },
  ]);
  const [budgetTargets, setBudgetTargets] = useState<BudgetTarget[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Load budget targets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finora_budget_targets');
    if (saved) {
      try {
        const targets = JSON.parse(saved);
        setBudgetTargets(targets);
        
        // Add budget targets as goals if they don't already exist
        const budgetGoals: Goal[] = targets.map((t: BudgetTarget) => ({
          id: 100 + t.id,
          name: t.category,
          target: t.amount,
          current: 0, // Budget targets don't have spending tracked here
          icon: t.icon,
          source: 'budget'
        }));
        
        // Don't duplicate - only add budget goals if user wants them visible
        // For now, we'll show them separately
      } catch (e) {
        console.error('Error loading budget targets:', e);
      }
    }
  }, []);

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

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Financial Goals Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-1">Financial Goals</h2>
          <p className="text-xs text-[#a8aac5] mb-4">Track your personal goals and financial targets</p>

          {/* Personal Goals */}
          {goals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#a8aac5] mb-3">Personal Goals</h3>
              <div className="space-y-3">
                {goals.map((goal) => {
                  const pct = (goal.current / goal.target) * 100;
                  return (
                    <div key={goal.id} className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 hover:border-[#0066cc] transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{goal.icon}</span>
                          <div>
                            <p className="font-bold text-white">{goal.name}</p>
                            <p className="text-xs text-[#7a7d97]">₹{goal.current.toLocaleString('en-IN')} of ₹{goal.target.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-[#0066cc]">{Math.round(pct)}%</p>
                      </div>
                      <div className="w-full bg-[#2d3748] rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full transition-all" 
                          style={{width:`${Math.min(pct, 100)}%`}}
                        ></div>
                      </div>
                      <p className="text-xs text-[#a8aac5] mt-2">₹{Math.max(0, goal.target - goal.current).toLocaleString('en-IN')} to go</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Budget Targets from Personalize Plan */}
          {budgetTargets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#a8aac5]">Budget Targets</h3>
                <Link href="/personalize-plan" className="text-xs text-[#0066cc] hover:text-[#0052a3]">
                  Edit →
                </Link>
              </div>
              <div className="space-y-3">
                {budgetTargets.map((target) => (
                  <div key={target.id} className="bg-[#1a2855] border border-[#2d3748] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{target.icon}</span>
                        <div>
                          <p className="font-semibold text-white text-sm">{target.category}</p>
                          <p className="text-xs text-[#7a7d97]">{target.group} • {target.frequency}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[#0066cc]">₹{target.amount.toLocaleString('en-IN')}</p>
                    </div>
                    {target.dueDate && (
                      <p className="text-xs text-[#a8aac5]">Due: {target.dueDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#0066cc]">{goals.length}</p>
            <p className="text-xs text-[#a8aac5] mt-1">Personal Goals</p>
          </div>
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#10b981]">{budgetTargets.length}</p>
            <p className="text-xs text-[#a8aac5] mt-1">Budget Targets</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
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
