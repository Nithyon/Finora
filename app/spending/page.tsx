'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';

const categoryIcons: Record<string, string> = {
  Groceries: '🛒',
  Entertainment: '🎬',
  Transport: '🚗',
  Utilities: '⚡',
  Dining: '🍽️',
  Shopping: '🛍️',
  Gas: '⛽',
  Default: '💳',
};

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

interface CategoryWithBudget {
  name: string;
  icon: string;
  amount: number;
  percent: number;
  budget?: number;
  remaining?: number;
  budgetPercent?: number;
}

export default function SpendingPage() {
  const { transactions, loading } = useApp();
  const [categorySpending, setCategorySpending] = useState<CategoryWithBudget[]>([]);
  const [budgetTargets, setBudgetTargets] = useState<BudgetTarget[]>([]);

  // Load budget targets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finora_budget_targets');
    if (saved) {
      try {
        setBudgetTargets(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading budget targets:', e);
      }
    }
  }, []);

  // Calculate spending by category and merge with budget targets
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setCategorySpending([]);
      return;
    }

    const expensesByCategory: Record<string, number> = {};
    
    transactions.forEach((tx: any) => {
      if (tx.transaction_type === 'expense') {
        const category = tx.category || 'Other';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + tx.amount;
      }
    });

    const total = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    
    const spending = Object.entries(expensesByCategory)
      .map(([name, amount]) => {
        // Find matching budget target
        const target = budgetTargets.find(t => t.category === name);
        
        return {
          name,
          amount,
          percent: total > 0 ? (amount / total) * 100 : 0,
          icon: target?.icon || categoryIcons[name] || categoryIcons.Default,
          budget: target?.amount,
          remaining: target ? target.amount - amount : undefined,
          budgetPercent: target ? (amount / target.amount) * 100 : undefined,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    setCategorySpending(spending);
  }, [transactions, budgetTargets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const totalSpent = categorySpending.reduce((sum, c) => sum + c.amount, 0);

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

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Total Spending Summary Card */}
        <div className="bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-xl p-6 mb-8">
          <p className="text-xs font-bold text-[#e0e7ff] uppercase tracking-wider mb-2">Total Spending This Month</p>
          <p className="text-4xl font-bold text-white mb-2">₹{totalSpent.toLocaleString('en-IN')}</p>
          <p className="text-sm text-[#e0e7ff]">Track your spending across all categories</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
            <p className="text-xs text-[#7a7d97] mb-1">Categories</p>
            <p className="text-2xl font-bold text-white">{categorySpending.length}</p>
          </div>
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
            <p className="text-xs text-[#7a7d97] mb-1">Avg/Category</p>
            <p className="text-2xl font-bold text-[#10b981]">
              ₹{categorySpending.length > 0 ? Math.round(totalSpent / categorySpending.length).toLocaleString('en-IN') : '0'}
            </p>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {categorySpending.length > 0 ? (
              categorySpending.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 hover:border-[#0066cc] transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{cat.name}</h3>
                        <p className="text-xs text-[#7a7d97]">{cat.percent.toFixed(1)}% of total spending</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-[#10b981]">₹{cat.amount.toLocaleString('en-IN')}</p>
                  </div>
                  
                  {/* Budget Progress (if budget exists) */}
                  {cat.budget !== undefined && (
                    <>
                      <div className="text-xs text-[#a8aac5] mb-2 flex justify-between">
                        <span>Budget: ₹{cat.budget.toLocaleString('en-IN')}</span>
                        <span className={cat.remaining! >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                          {cat.remaining! >= 0 ? '✓' : '✗'} ₹{Math.abs(cat.remaining!).toLocaleString('en-IN')} {cat.remaining! >= 0 ? 'left' : 'over'}
                        </span>
                      </div>
                      <div className="w-full bg-[#2d3748] rounded-full h-2 mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${
                            cat.budgetPercent! <= 80 ? 'bg-gradient-to-r from-[#0066cc] to-[#5500cc]' :
                            cat.budgetPercent! <= 100 ? 'bg-gradient-to-r from-[#f59e0b] to-[#f97316]' :
                            'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                          }`}
                          style={{ width: `${Math.min(cat.budgetPercent!, 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Spending as % of Total */}
                  <div className="w-full bg-[#2d3748] rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-full transition-all"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 text-center">
                <p className="text-[#7a7d97]">No expenses yet</p>
                <p className="text-sm text-[#a8aac5] mt-2">Start tracking your spending to see insights here</p>
                <Link href="/personalize-plan" className="text-xs text-[#0066cc] hover:text-[#0052a3] mt-3 inline-block">
                  Set budget targets →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
