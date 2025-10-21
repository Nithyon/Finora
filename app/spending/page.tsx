'use client';

import { useAuthProtected } from '@/app/hooks/useAuthProtected';

export default function SpendingPage() {
  useAuthProtected();

  const categories = [
    { name: 'Groceries', amount: 342.50, percent: 35, icon: '🛒' },
    { name: 'Entertainment', amount: 175.00, percent: 25, icon: '🎬' },
    { name: 'Transport', amount: 120.00, percent: 20, icon: '🚗' },
    { name: 'Utilities', amount: 85.95, percent: 20, icon: '⚡' },
  ];

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
          <p className="text-sm text-[#a8aac5]">October spending breakdown</p>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold text-white mb-4">By Category</h3>
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-4">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-semibold text-white">{cat.name}</p>
                    <p className="text-sm font-bold text-[#10b981]">${cat.amount.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-[#2d3748] rounded-full h-2">
                    <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full" style={{width: `${cat.percent}%`}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Total Spending</h3>
          <p className="text-3xl font-bold text-white mb-2">${categories.reduce((sum, c) => sum + c.amount, 0).toLocaleString('en', {minimumFractionDigits: 2})}</p>
          <p className="text-sm text-[#a8aac5]">This month to date</p>
        </div>
      </main>
    </div>
  );
}
