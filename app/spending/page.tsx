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
    
    transactions.forEach((tx: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] pb-32">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-white">Finora</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
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
                        <p className="text-xs text-[#7a7d97]">{cat.percent.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-[#10b981]">₹{cat.amount.toLocaleString('en-IN')}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#2d3748] rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full transition-all"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 text-center">
                <p className="text-[#7a7d97]">No expenses yet</p>
                <p className="text-sm text-[#a8aac5] mt-2">Start tracking your spending to see insights here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27]/95 backdrop-blur border-t border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2 text-[#7a7d97] hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="text-xs font-semibold">Budget</span>
          </Link>

          <div className="flex flex-col items-center gap-1 px-4 py-2 text-[#0066cc]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-semibold">Spending</span>
          </div>

          <Link href="/accounts" className="flex flex-col items-center gap-1 px-4 py-2 text-[#7a7d97] hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
            <span className="text-xs font-semibold">Accounts</span>
          </Link>

          <Link href="/chat" className="flex flex-col items-center gap-1 px-4 py-2 text-[#7a7d97] hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-semibold">Chat</span>
          </Link>

          <Link href="/reflect" className="flex flex-col items-center gap-1 px-4 py-2 text-[#7a7d97] hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-semibold">Reflect</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
