'use client';

import { useState, useEffect } from 'react';
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

export default function SpendingPage() {
  const { transactions, loading } = useApp();
  const [categorySpending, setCategorySpending] = useState<Array<{ name: string; amount: number; percent: number; icon: string }>>([]);

  // Calculate spending by category
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setCategorySpending([]);
      return;
    }

    const expensesByCategory: Record<string, number> = {};
    
    transactions.forEach(tx => {
      if (tx.transaction_type === 'expense') {
        const category = tx.category || 'Other';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + tx.amount;
      }
    });

    const total = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    
    const spending = Object.entries(expensesByCategory)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
        icon: categoryIcons[name] || categoryIcons.Default,
      }))
      .sort((a, b) => b.amount - a.amount);

    setCategorySpending(spending);
  }, [transactions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const totalSpent = categorySpending.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-white">Finora</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-6">
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Spending 💰</h2>
          <p className="text-sm text-[#a8aac5]">This month breakdown</p>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold text-white mb-4">By Category</h3>
          <div className="space-y-3">
            {categorySpending.length > 0 ? (
              categorySpending.map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-semibold text-white">{cat.name}</p>
                      <p className="text-sm font-bold text-[#10b981]">₹{cat.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="w-full bg-[#2d3748] rounded-full h-2">
                      <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full" style={{width: `${cat.percent}%`}} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#7a7d97]">No expenses yet</p>
            )}
          </div>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Total Spending</h3>
          <p className="text-3xl font-bold text-white mb-2">₹{totalSpent.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          <p className="text-sm text-[#a8aac5]">This month to date</p>
        </div>
      </main>
    </div>
  );
}
