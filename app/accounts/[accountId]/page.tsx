'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context';
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

type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'interest';

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useApp();

  const accountId = params.accountId as string;

  const [account, setAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    const accountsKey = `finora_bank_accounts_${user.id}`;
    const transactionsKey = `finora_bank_transactions_${user.id}`;

    try {
      const savedAccounts = localStorage.getItem(accountsKey);
      const savedTransactions = localStorage.getItem(transactionsKey);

      if (savedAccounts) {
        const accounts = JSON.parse(savedAccounts);
        const foundAccount = accounts.find((a: BankAccount) => a.id === accountId);
        setAccount(foundAccount || null);
      }

      if (savedTransactions) {
        const txns = JSON.parse(savedTransactions);
        setTransactions(txns);
      }
    } catch (e) {
      console.error('Error loading account:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, accountId, router]);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = transactions.filter(tx => tx.accountId === accountId);

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    setFilteredTransactions(filtered);
  }, [transactions, accountId, filterType, sortBy]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pb-24">
        <p className="text-white">Loading account...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center pb-24">
        <p className="text-white mb-4">Account not found</p>
        <Link href="/accounts" className="text-blue-400 hover:text-blue-300 underline">
          Back to Accounts
        </Link>
      </div>
    );
  }

  const accountTransactions = transactions.filter(tx => tx.accountId === accountId);
  const summary = VirtualBankService.getAccountSummary(account, accountTransactions);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '💰';
      case 'withdrawal':
        return '💸';
      case 'transfer':
        return '🔄';
      case 'interest':
        return '📈';
      default:
        return '💳';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'interest':
        return 'text-green-400';
      case 'withdrawal':
      case 'transfer':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer':
        return 'Transfer';
      case 'interest':
        return 'Interest';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/accounts" className="text-blue-400 hover:text-blue-300">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-white">Account Details</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Account Header Card */}
        <div className={`bg-gradient-to-br ${ACCOUNT_TYPE_COLORS[account.accountType]} rounded-xl p-6 text-white mb-6 shadow-lg`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{ACCOUNT_TYPE_ICONS[account.accountType]}</span>
                <h2 className="text-2xl font-bold">{account.accountName}</h2>
              </div>
              <p className="text-sm opacity-80">
                {account.accountType === 'savings'
                  ? `Savings Account (${account.interestRate}% APR)`
                  : account.accountType === 'investment'
                  ? `Investment Account (${account.interestRate}% APR)`
                  : 'Checking Account'}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              account.isActive ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
            }`}>
              {account.isActive ? 'Active' : 'Closed'}
            </span>
          </div>

          <div className="border-t border-white/20 pt-4">
            <p className="text-xs opacity-80 mb-1">Current Balance</p>
            <p className="text-4xl font-bold mb-3">₹{account.balance.toLocaleString('en-IN')}</p>
            <p className="text-xs opacity-75">Account #{account.accountNumber}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Total Income</p>
            <p className="text-xl font-bold text-green-400">₹{summary.totalIncome.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Total Expenses</p>
            <p className="text-xl font-bold text-red-400">₹{summary.totalExpenses.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Transactions</p>
            <p className="text-xl font-bold text-blue-400">{summary.transactionCount}</p>
          </div>
        </div>

        {/* Account Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Created</p>
            <p className="text-sm font-semibold text-white">
              {new Date(account.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Interest Rate</p>
            <p className="text-sm font-semibold text-white">{account.interestRate}% APR</p>
          </div>
        </div>

        {/* Transaction Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Filters</h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-2">Type</p>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'deposit', 'withdrawal', 'transfer', 'interest'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Sort</p>
              <div className="flex gap-2">
                {(['newest', 'oldest'] as const).map(sort => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition flex-1 ${
                      sortBy === sort
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">
            Transaction History {filteredTransactions.length > 0 && `(${filteredTransactions.length})`}
          </h3>

          {filteredTransactions.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
              <p className="text-slate-400">No transactions found</p>
              {filterType !== 'all' && (
                <p className="text-sm text-slate-500 mt-2">Try changing the filter</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getTransactionIcon(tx.type)}</span>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{getTransactionLabel(tx.type)}</p>
                        <p className="text-xs text-slate-400 mt-1">{tx.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'deposit' || tx.type === 'interest'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'interest' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Balance After */}
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500">
                      Balance after: ₹{tx.balanceAfter.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const amount = prompt('Enter deposit amount:');
                if (!amount || !account) return;
                try {
                  const { account: updatedAccount, transaction } = VirtualBankService.deposit(
                    account,
                    parseFloat(amount),
                    'Manual Deposit'
                  );
                  setAccount(updatedAccount);
                  setTransactions([...transactions, transaction]);
                  alert(`✅ Deposit successful! New balance: ₹${updatedAccount.balance}`);
                } catch (error) {
                  alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center transition"
            >
              💰 Deposit
            </button>
            <button
              onClick={() => {
                const amount = prompt('Enter withdrawal amount:');
                if (!amount || !account) return;
                try {
                  const { account: updatedAccount, transaction } = VirtualBankService.withdraw(
                    account,
                    parseFloat(amount),
                    'Manual Withdrawal'
                  );
                  setAccount(updatedAccount);
                  setTransactions([...transactions, transaction]);
                  alert(`✅ Withdrawal successful! New balance: ₹${updatedAccount.balance}`);
                } catch (error) {
                  alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center transition"
            >
              💸 Withdraw
            </button>
            <Link
              href="/accounts/transfer"
              className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded text-center transition"
            >
              🔄 Transfer Money
            </Link>
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Account Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Opening Balance</span>
              <span className="text-white font-semibold">₹{summary.totalIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Withdrawn</span>
              <span className="text-red-400 font-semibold">-₹{summary.totalExpenses.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
              <span className="text-slate-400 font-semibold">Current Balance</span>
              <span className="text-green-400 font-semibold text-lg">₹{account.balance.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
