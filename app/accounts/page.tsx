'use client';

import { useState } from 'react';

export default function AccountsPage() {

  const [accounts] = useState([
    { id: 1, name: 'Checking Account', balance: 2850.50, type: 'Checking', bank: 'Chase', icon: '🏦' },
    { id: 2, name: 'Savings Account', balance: 12000.00, type: 'Savings', bank: 'Bank of America', icon: '💼' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-white">Finora</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-6">
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Your Accounts 🏦</h2>
          <p className="text-sm text-[#a8aac5]">Manage your connected accounts</p>
        </div>

        <div className="space-y-4">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-[#141829] border border-[#2d3748] rounded-xl p-6 hover:border-[#3d4657] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{acc.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#7a7d97]">{acc.bank}</p>
                    <p className="text-lg font-bold text-white">{acc.name}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">✓ Connected</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#7a7d97] uppercase mb-1">Balance</p>
                  <p className="text-xl font-bold text-white">${acc.balance.toLocaleString('en', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7a7d97] uppercase mb-1">Type</p>
                  <p className="text-lg font-bold text-[#a8aac5]">{acc.type}</p>
                </div>
              </div>

              <button className="w-full text-sm font-semibold text-[#0066cc] hover:text-[#0052a3] py-2 px-3 rounded-lg hover:bg-[#1a1f3a] transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold py-3 px-4 rounded-lg transition-colors mt-8">
          + Link New Account
        </button>
      </main>
    </div>
  );
}
