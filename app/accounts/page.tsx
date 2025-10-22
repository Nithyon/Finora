'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useState, useEffect } from 'react';

const accountIcons: Record<string, string> = {
  Checking: '🏦',
  Savings: '💼',
  'Savings Account': '💼',
  'Checking Account': '🏦',
  Default: '🏦',
};

export default function AccountsPage() {
  const { accounts, transactions, loading } = useApp();
  const [accountSpending, setAccountSpending] = useState<Record<number, number>>({});

  // Calculate spending per account
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setAccountSpending({});
      return;
    }

    const spending: Record<number, number> = {};
    transactions.forEach((tx: any) => {
      if (tx.transaction_type === 'expense' && tx.account_id) {
        spending[tx.account_id] = (spending[tx.account_id] || 0) + tx.amount;
      }
    });
    setAccountSpending(spending);
  }, [transactions]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
  const totalSpending = Object.values(accountSpending).reduce((sum: number, val: number) => sum + val, 0);

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

      <main className="max-w-md mx-auto px-4 pt-6">
        {/* Total Balance Summary Card */}
        <div className="bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-xl p-6 mb-8">
          <p className="text-xs font-bold text-[#e0e7ff] uppercase tracking-wider mb-2">Total Balance</p>
          <p className="text-4xl font-bold text-white mb-2">₹{totalBalance.toLocaleString('en-IN')}</p>
          <p className="text-sm text-[#e0e7ff]">Across all your accounts</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
            <p className="text-xs text-[#7a7d97] uppercase mb-2">Accounts</p>
            <p className="text-2xl font-bold text-white">{accounts.length}</p>
          </div>
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
            <p className="text-xs text-[#7a7d97] uppercase mb-2">Total Spending</p>
            <p className="text-2xl font-bold text-[#ef4444]">₹{totalSpending.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Your Accounts</h2>
            <Link href="/spending" className="text-xs text-[#0066cc] hover:text-[#0052a3]">
              View spending →
            </Link>
          </div>
          <div className="space-y-4">
            {accounts && accounts.length > 0 ? (
              accounts.map((acc: any) => {
                const icon = accountIcons[acc.account_type] || accountIcons.Default;
                const spending = accountSpending[acc.id] || 0;
                const healthPercent = acc.balance > 0 ? Math.min((spending / acc.balance) * 100, 100) : 0;
                
                return (
                  <div
                    key={acc.id}
                    className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 hover:border-[#0066cc] transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="font-bold text-white">{acc.name}</p>
                          <p className="text-xs text-[#7a7d97]">{acc.account_type}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-[#10b981]/20 text-[#10b981] text-xs font-semibold rounded">Connected</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-[#7a7d97] mb-1">Balance</p>
                          <p className="text-lg font-bold text-white">₹{acc.balance.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#7a7d97] mb-1">Spending</p>
                          <p className="text-lg font-bold text-[#ef4444]">₹{spending.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      
                      {/* Health indicator */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-[#a8aac5]">Account Health</p>
                          <p className="text-xs font-semibold text-[#0066cc]">{Math.round(100 - healthPercent)}% available</p>
                        </div>
                        <div className="w-full bg-[#2d3748] rounded-full h-2">
                          <div
                            className={`h-full rounded-full transition-all ${
                              healthPercent <= 50 ? 'bg-gradient-to-r from-[#10b981] to-[#059669]' :
                              healthPercent <= 75 ? 'bg-gradient-to-r from-[#f59e0b] to-[#f97316]' :
                              'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                            }`}
                            style={{ width: `${healthPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 text-center">
                <p className="text-[#7a7d97] mb-2">No accounts connected yet</p>
                <p className="text-sm text-[#a8aac5] mb-4">Connect a bank account to start tracking your balance and spending</p>
                <button className="bg-[#0066cc] hover:bg-[#0052a3] text-white text-sm font-semibold py-2 px-4 rounded-lg transition">
                  + Link New Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Connection Info */}
        <div className="bg-[#1a2855] border border-[#2d3748] rounded-lg p-4">
          <p className="text-xs text-[#a8aac5]">
            💡 Your account balances are connected to your spending tracking. Transactions from these accounts are automatically categorized and counted toward your budget.
          </p>
        </div>
      </main>
    </div>
  );
}
