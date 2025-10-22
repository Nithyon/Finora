'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';

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
  const { budgets, loading } = useApp();
  const [showModal, setShowModal] = useState(false);

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
            
            return (
              <div key={budget.id} className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{budget.category}</p>
                      <p className="text-xs text-[#7a7d97]">₹{budget.spent.toLocaleString('en-IN')} of ₹{budget.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${isOverBudget ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                    ₹{Math.max(0, budget.amount - budget.spent).toLocaleString('en-IN')} left
                  </p>
                </div>
                <div className="w-full bg-[#2d3748] rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isOverBudget ? 'bg-[#ef4444]' : 'bg-gradient-to-r from-[#0066cc] to-[#5500cc]'
                    }`}
                    style={{width: `${Math.min(percent, 100)}%`}}
                  />
                </div>
                <p className="text-xs text-[#7a7d97] mt-2">{Math.round(Math.min(percent, 100))}% used</p>
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

