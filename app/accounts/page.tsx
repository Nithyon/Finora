'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useState, useEffect } from 'react';
import VirtualBankService, { BankAccount, BankTransaction } from '@/app/utils/virtualBankService';

const ACCOUNT_TYPE_COLORS = {
  savings: 'from-green-500 to-emerald-600',
  checking: 'from-blue-500 to-cyan-600',
  investment: 'from-purple-500 to-pink-600',
};

const ACCOUNT_TYPE_ICONS = {
  savings: '🏦',
  checking: '💳',
  investment: '📈',
};

export default function AccountsPage() {
  const { user } = useApp();
  const [virtualAccounts, setVirtualAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'virtual' | 'real'>('virtual');

  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'checking' as 'savings' | 'checking' | 'investment',
    initialBalance: '',
  });

  // Load virtual accounts from localStorage
  useEffect(() => {
    if (user?.id) {
      const accountsKey = `finora_bank_accounts_${user.id}`;
      const transactionsKey = `finora_bank_transactions_${user.id}`;

      const savedAccounts = localStorage.getItem(accountsKey);
      const savedTransactions = localStorage.getItem(transactionsKey);

      if (savedAccounts) {
        try {
          setVirtualAccounts(JSON.parse(savedAccounts));
        } catch (e) {
          console.error('Error loading accounts:', e);
        }
      }

      if (savedTransactions) {
        try {
          setTransactions(JSON.parse(savedTransactions));
        } catch (e) {
          console.error('Error loading transactions:', e);
        }
      }
    }
  }, [user?.id]);

  // Save virtual accounts to localStorage
  useEffect(() => {
    if (user?.id && virtualAccounts.length > 0) {
      localStorage.setItem(`finora_bank_accounts_${user.id}`, JSON.stringify(virtualAccounts));
    }
  }, [virtualAccounts, user?.id]);

  // Save transactions to localStorage
  useEffect(() => {
    if (user?.id && transactions.length > 0) {
      localStorage.setItem(`finora_bank_transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user?.id]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountName.trim()) {
      alert('Please enter account name');
      return;
    }

    if (!formData.initialBalance || parseFloat(formData.initialBalance) < 0) {
      alert('Please enter valid initial balance');
      return;
    }

    if (!user?.id) {
      alert('Please log in first');
      return;
    }

    setLoading(true);

    try {
      const newAccount = VirtualBankService.createAccount(
        user.id,
        formData.accountName,
        formData.accountType,
        parseFloat(formData.initialBalance)
      );

      // If starting with balance, create an initial deposit transaction
      if (parseFloat(formData.initialBalance) > 0) {
        const { transaction } = VirtualBankService.deposit(
          newAccount,
          parseFloat(formData.initialBalance),
          'Account Opening Balance'
        );
        setTransactions([...transactions, transaction]);
      }

      setVirtualAccounts([...virtualAccounts, newAccount]);
      setShowCreateForm(false);
      setFormData({
        accountName: '',
        accountType: 'checking',
        initialBalance: '',
      });

      alert(`✅ Virtual account created successfully!\nAccount #: ${newAccount.accountNumber}`);
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = (accountId: string) => {
    const amount = prompt('Enter deposit amount:');
    if (!amount) return;

    const account = virtualAccounts.find(a => a.id === accountId);
    if (!account) return;

    try {
      const { account: updatedAccount, transaction } = VirtualBankService.deposit(
        account,
        parseFloat(amount),
        'Manual Deposit'
      );

      setVirtualAccounts(virtualAccounts.map(a => (a.id === accountId ? updatedAccount : a)));
      setTransactions([...transactions, transaction]);
      alert(`✅ Deposit successful! New balance: ₹${updatedAccount.balance}`);
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleWithdraw = (accountId: string) => {
    const amount = prompt('Enter withdrawal amount:');
    if (!amount) return;

    const account = virtualAccounts.find(a => a.id === accountId);
    if (!account) return;

    try {
      const { account: updatedAccount, transaction } = VirtualBankService.withdraw(
        account,
        parseFloat(amount),
        'Manual Withdrawal'
      );

      setVirtualAccounts(virtualAccounts.map(a => (a.id === accountId ? updatedAccount : a)));
      setTransactions([...transactions, transaction]);
      alert(`✅ Withdrawal successful! New balance: ₹${updatedAccount.balance}`);
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTotalBalance = () => {
    return virtualAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">💳 Accounts</h1>
            <p className="text-xs text-green-400">✅ LIVE - v2.0.0</p>
          </div>
          <Link href="/settings" className="text-[#7a7d97] hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('virtual')}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              activeTab === 'virtual'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            🏦 Virtual
          </button>
          <button
            onClick={() => setActiveTab('real')}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              activeTab === 'real'
                ? 'bg-green-600 text-white'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            🏛️ Real Banks
          </button>
        </div>

        {/* Virtual Accounts Tab */}
        {activeTab === 'virtual' && (
          <div>
            {/* Total Balance Card */}
            {virtualAccounts.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
                <p className="text-xs font-bold uppercase opacity-90 mb-2">Virtual Balance</p>
                <p className="text-4xl font-bold mb-2">₹{getTotalBalance().toLocaleString('en-IN')}</p>
                <p className="text-sm opacity-90">Across {virtualAccounts.length} account{virtualAccounts.length !== 1 ? 's' : ''}</p>
              </div>
            )}

            {/* Create Account Button */}
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition mb-6"
              >
                ➕ Create Virtual Account
              </button>
            ) : (
              <form onSubmit={handleCreateAccount} className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4">Create Virtual Account</h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={formData.accountName}
                    onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-400"
                  />

                  <select
                    value={formData.accountType}
                    onChange={e => setFormData({ ...formData, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white"
                  >
                    <option value="checking">💳 Checking Account</option>
                    <option value="savings">🏦 Savings Account (4.5% APR)</option>
                    <option value="investment">📈 Investment Account (7% APR)</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Initial Balance"
                    value={formData.initialBalance}
                    onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-400"
                    min="0"
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
                    >
                      ✅ Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Virtual Accounts List */}
            <div className="space-y-4">
              {virtualAccounts.length === 0 ? (
                <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-slate-700">
                  <p className="text-slate-400">No virtual accounts created yet</p>
                  <p className="text-sm text-slate-500 mt-2">💡 Virtual accounts are optional - use them to practice budgeting</p>
                </div>
              ) : (
                virtualAccounts.map(account => {
                  const summary = VirtualBankService.getAccountSummary(account, transactions);

                  return (
                    <div
                      key={account.id}
                      className={`bg-gradient-to-br ${ACCOUNT_TYPE_COLORS[account.accountType]} rounded-lg p-4 text-white shadow-lg`}
                    >
                      {/* Account Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{ACCOUNT_TYPE_ICONS[account.accountType]}</span>
                            <h3 className="font-bold text-lg">{account.accountName}</h3>
                          </div>
                          <p className="text-xs opacity-80">
                            {account.accountType === 'savings'
                              ? `Savings (${account.interestRate}% APR)`
                              : account.accountType === 'investment'
                              ? `Investment (${account.interestRate}% APR)`
                              : 'Checking'}
                          </p>
                        </div>
                        <p className="text-xs opacity-75 text-right">{account.accountNumber}</p>
                      </div>

                      {/* Balance */}
                      <div className="mb-3 pb-3 border-b border-white/20">
                        <p className="text-xs opacity-80">Balance</p>
                        <p className="text-3xl font-bold">₹{account.balance.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                        <div className="bg-white/10 rounded p-2 text-center">
                          <p className="opacity-80 text-xs">Income</p>
                          <p className="font-semibold">₹{summary.totalIncome.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <p className="opacity-80 text-xs">Expenses</p>
                          <p className="font-semibold">₹{summary.totalExpenses.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-white/10 rounded p-2 text-center">
                          <p className="opacity-80 text-xs">Txns</p>
                          <p className="font-semibold">{summary.transactionCount}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() => handleDeposit(account.id)}
                          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded transition text-sm"
                        >
                          💰 Deposit
                        </button>
                        <button
                          onClick={() => handleWithdraw(account.id)}
                          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded transition text-sm"
                        >
                          💸 Withdraw
                        </button>
                      </div>

                      {/* View Details & Transfer Links */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/accounts/${account.id}`}
                          className="text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded transition text-sm"
                        >
                          📊 Details
                        </Link>
                        <Link
                          href="/accounts/transfer"
                          className="text-center bg-purple-500/30 hover:bg-purple-500/40 text-white font-semibold py-2 rounded transition text-sm"
                        >
                          🔄 Transfer
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Real Banks Tab */}
        {activeTab === 'real' && (
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="text-center">
              <p className="text-2xl mb-3">🏛️</p>
              <h3 className="text-xl font-bold text-white mb-2">Real Bank Integration</h3>
              <p className="text-slate-400 mb-4">Coming soon! When we get funding, you&apos;ll be able to connect:</p>
              
              <div className="space-y-2 my-4 text-left">
                <p className="text-sm text-slate-300">✅ Plaid Integration (Bank accounts)</p>
                <p className="text-sm text-slate-300">✅ Credit Card Connections</p>
                <p className="text-sm text-slate-300">✅ Real-time Sync</p>
                <p className="text-sm text-slate-300">✅ Multi-bank Support</p>
              </div>

              <p className="text-xs text-slate-500 mt-6">
                💡 For now, use Virtual Accounts to practice budgeting, or manually add transactions in the Spending section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
