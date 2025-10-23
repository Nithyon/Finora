'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import BudgetAlertComponent from '@/app/components/BudgetAlert';
import BudgetAlertService, { BudgetStatus } from '@/app/utils/budgetAlertService';
import { BankAccount } from '@/app/utils/virtualBankService';
import TransactionService from '@/app/utils/transactionService';

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
  const { transactions, loading, user, refreshTransactions } = useApp();
  const [categorySpending, setCategorySpending] = useState<CategoryWithBudget[]>([]);
  const [budgetTargets, setBudgetTargets] = useState<BudgetTarget[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetStatus[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [virtualAccounts, setVirtualAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [spendingVelocity, setSpendingVelocity] = useState<any>(null);

  // Refresh transactions when page loads
  useEffect(() => {
    if (refreshTransactions) {
      refreshTransactions().catch(err => console.error('Failed to refresh transactions:', err));
    }
  }, [refreshTransactions]);

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

  // Load virtual accounts from localStorage
  useEffect(() => {
    if (user?.id) {
      const accountsKey = `finora_bank_accounts_${user.id}`;
      const savedAccounts = localStorage.getItem(accountsKey);
      if (savedAccounts) {
        try {
          const accounts = JSON.parse(savedAccounts);
          setVirtualAccounts(accounts);
        } catch (e) {
          console.error('Error loading accounts:', e);
        }
      }
    }
  }, [user?.id]);

  // Ensure transactions are loaded from localStorage if not in context
  useEffect(() => {
    if (user?.id && (!transactions || transactions.length === 0)) {
      const localKey = `finora_transactions_${user.id}`;
      const localTransactions = localStorage.getItem(localKey);
      
      if (localTransactions) {
        try {
          const parsed = JSON.parse(localTransactions);
          console.log('Loaded transactions from localStorage:', parsed.length);
          // Note: This won't update the context directly, but the calculation below will use what's in context
        } catch (e) {
          console.error('Error parsing local transactions:', e);
        }
      }
    }
  }, [user?.id, transactions]);

  // Calculate spending by category and merge with budget targets
  useEffect(() => {
    let txToUse = transactions || [];
    
    // If no transactions from context, try localStorage
    if (txToUse.length === 0 && user?.id) {
      const localKey = `finora_transactions_${user.id}`;
      const localTransactions = localStorage.getItem(localKey);
      if (localTransactions) {
        try {
          txToUse = JSON.parse(localTransactions);
        } catch (e) {
          console.error('Error parsing local transactions:', e);
        }
      }
    }

    if (!txToUse || txToUse.length === 0) {
      setCategorySpending([]);
      return;
    }

    const expensesByCategory: Record<string, number> = {};
    
    txToUse.forEach((tx: any) => {
      // Filter by account if selected
      if (selectedAccountId !== 'all' && tx.account_id && tx.account_id !== selectedAccountId) {
        return;
      }
      
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

    // Check budget alerts
    if (budgetTargets.length > 0) {
      const alerts = BudgetAlertService.checkAllBudgets(budgetTargets, txToUse);
      setBudgetAlerts(alerts);
      
      // Save to history if user is logged in
      if (user?.id) {
        BudgetAlertService.saveAlertHistory(user.id, BudgetAlertService.getActiveAlerts(alerts));
      }
    }

    // Calculate spending velocity
    if (user?.id) {
      const allTransactions = TransactionService.getTransactions(user.id);
      const velocity = TransactionService.getSpendingVelocity(allTransactions, budgetTargets);
      setSpendingVelocity(velocity);
    }
  }, [transactions, budgetTargets, user?.id, selectedAccountId]);

  const handleDismissAlert = (categoryName: string) => {
    setDismissedAlerts(prev => new Set(prev).add(categoryName));
  };

  // Filter alerts to exclude dismissed ones
  const visibleAlerts = budgetAlerts.filter(alert => !dismissedAlerts.has(alert.category));

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const totalSpent = categorySpending.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">💳 Spending</h1>
            <p className="text-xs text-green-400">✅ LIVE - Track Expenses</p>
          </div>
          <Link href="/settings" className="text-[#7a7d97] hover:text-white transition" title="Settings">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Account Filter */}
        {virtualAccounts.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-purple-200 mb-2">📍 Filter by Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-medium focus:outline-none focus:border-purple-500 transition hover:border-purple-500"
            >
              <option value="all">All Accounts</option>
              {virtualAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName} ({account.accountType}) - ₹{account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Total Spending Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-6 shadow-xl">
          <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-2">📊 Total Spending This Month</p>
          <p className="text-5xl font-bold text-white mb-2">₹{totalSpent.toLocaleString('en-IN')}</p>
          <p className="text-sm text-blue-50 font-medium">Track spending across all categories</p>
        </div>

        {/* Spending Velocity Alert */}
        {spendingVelocity && (
          <div className={`rounded-2xl p-6 mb-6 border-2 backdrop-blur shadow-lg ${
            spendingVelocity.status === 'healthy' ? 'bg-emerald-500/15 border-emerald-500/40' :
            spendingVelocity.status === 'warning' ? 'bg-amber-500/15 border-amber-500/40' :
            'bg-rose-500/15 border-rose-500/40'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                  spendingVelocity.status === 'healthy' ? 'text-emerald-300' :
                  spendingVelocity.status === 'warning' ? 'text-amber-300' :
                  'text-rose-300'
                }`}>
                  {spendingVelocity.status === 'healthy' ? '✅ Healthy Pace' :
                   spendingVelocity.status === 'warning' ? '⚠️ Warning' :
                   '🚨 Critical'}
                </p>
                <p className="text-3xl font-bold text-white">₹{spendingVelocity.dailyAverage.toFixed(0)}/day</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70 font-medium">Days left</p>
                <p className={`text-3xl font-bold ${
                  spendingVelocity.status === 'healthy' ? 'text-emerald-300' :
                  spendingVelocity.status === 'warning' ? 'text-amber-300' :
                  'text-rose-300'
                }`}>
                  {spendingVelocity.daysUntilExhausted > 0 ? Math.floor(spendingVelocity.daysUntilExhausted) : '0'}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/90 font-medium">
              {spendingVelocity.status === 'healthy' 
                ? `✓ At ₹${spendingVelocity.weeklyTotal.toFixed(0)}/week, budget lasts the month`
                : spendingVelocity.status === 'warning'
                ? `⚠️ Spending ₹${spendingVelocity.weeklyTotal.toFixed(0)}/week - slow down!`
                : `🔴 Critical: ₹${spendingVelocity.weeklyTotal.toFixed(0)}/week will exhaust budget in ${Math.floor(spendingVelocity.daysUntilExhausted)} days!`
              }
            </p>
          </div>
        )}

        {/* Add Transaction Button */}
        <Link href="/add-transaction" className="block mb-8">
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg hover:shadow-xl text-lg">
            ➕ Add New Transaction
          </button>
        </Link>

        {/* Budget Alerts */}
        {visibleAlerts.length > 0 && (
          <div className="mb-8">
            <BudgetAlertComponent 
              alerts={visibleAlerts} 
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-purple-500 transition shadow-lg">
            <p className="text-xs font-bold text-purple-300 uppercase tracking-wide mb-2">📂 Categories</p>
            <p className="text-3xl font-bold text-white">{categorySpending.length}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-emerald-500 transition shadow-lg">
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-2">📈 Avg/Category</p>
            <p className="text-3xl font-bold text-emerald-400">
              ₹{categorySpending.length > 0 ? Math.round(totalSpent / categorySpending.length).toLocaleString('en-IN') : '0'}
            </p>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Spending by Category</h2>
          <div className="space-y-4">
            {categorySpending.length > 0 ? (
              categorySpending.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700 rounded-xl p-5 hover:border-purple-500 hover:shadow-lg transition backdrop-blur"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">{cat.percent.toFixed(1)}% of spending</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-emerald-400">₹{cat.amount.toLocaleString('en-IN')}</p>
                  </div>
                  
                  {/* Budget Progress (if budget exists) */}
                  {cat.budget !== undefined && (
                    <>
                      <div className="text-xs text-slate-300 mb-2 flex justify-between font-medium">
                        <span>Budget: ₹{cat.budget.toLocaleString('en-IN')}</span>
                        <span className={cat.remaining! >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {cat.remaining! >= 0 ? '✓' : '✗'} ₹{Math.abs(cat.remaining!).toLocaleString('en-IN')} {cat.remaining! >= 0 ? 'left' : 'over'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3 mb-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all font-bold ${
                            cat.budgetPercent! <= 80 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                            cat.budgetPercent! <= 100 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                            'bg-gradient-to-r from-rose-500 to-red-600'
                          }`}
                          style={{ width: `${Math.min(cat.budgetPercent!, 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Spending as % of Total */}
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 text-center shadow-lg">
                <p className="text-slate-300 font-bold text-lg">📭 No expenses yet</p>
                <p className="text-sm text-slate-400 mt-2 font-medium">Start tracking spending to see insights</p>
                <Link href="/personalize-plan" className="text-sm text-purple-400 hover:text-purple-300 mt-4 inline-block font-bold">
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
