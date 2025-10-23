'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { BankAccount } from '@/app/utils/virtualBankService';

interface Transaction {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  paymentMethod: string;
  accountId?: string;
}

const CATEGORIES = [
  '🛒 Groceries',
  '🎬 Entertainment',
  '🚗 Transport',
  '⚡ Utilities',
  '🍽️ Dining',
  '🛍️ Shopping',
  '⛽ Gas',
  '🏥 Healthcare',
  '📚 Education',
  '🏠 Rent',
  '💼 Salary',
  '💰 Bonus',
  '📦 Other',
];

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Payment'];

export default function AddTransactionPage() {
  const router = useRouter();
  const { user, addTransaction } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [virtualAccounts, setVirtualAccounts] = useState<BankAccount[]>([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '🛒 Groceries',
    description: '',
    amount: '',
    type: 'expense' as 'expense' | 'income',
    paymentMethod: 'Credit Card',
    accountId: '',
  });

  // Load virtual accounts from localStorage
  useEffect(() => {
    if (user?.id) {
      const accountsKey = `finora_bank_accounts_${user.id}`;
      const savedAccounts = localStorage.getItem(accountsKey);
      if (savedAccounts) {
        try {
          const accounts = JSON.parse(savedAccounts);
          setVirtualAccounts(accounts);
          // Set default account to first one if available
          if (accounts.length > 0 && !formData.accountId) {
            setFormData(prev => ({ ...prev, accountId: accounts[0].id }));
          }
        } catch (e) {
          console.error('Error loading accounts:', e);
        }
      }
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    if (!user?.id) {
      alert('Please log in first');
      return;
    }

    setLoading(true);

    try {
      // Extract category name (remove emoji if present)
      const categoryName = formData.category.includes(' ') 
        ? formData.category.split(' ').slice(1).join(' ')
        : formData.category;

      const transaction = {
        id: Date.now(),
        user_id: user.id,
        account_id: formData.accountId || 1, // Use selected account or default
        amount: parseFloat(formData.amount),
        transaction_type: formData.type,
        category: categoryName,
        description: formData.description,
        date: formData.date,
        created_at: new Date().toISOString(),
      };

      console.log('Saving transaction:', transaction);

      // Store in localStorage as fallback
      const key = `finora_transactions_${user.id}`;
      const existing = localStorage.getItem(key);
      const transactions = existing ? JSON.parse(existing) : [];
      transactions.push(transaction);
      localStorage.setItem(key, JSON.stringify(transactions));
      
      console.log('Transaction saved to localStorage');

      // Call addTransaction if it exists in context
      if (addTransaction) {
        try {
          await addTransaction(transaction);
          console.log('Transaction added via context');
        } catch (err) {
          console.log('Context addTransaction failed (OK - using localStorage):', err);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/spending');
      }, 1500);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">💰 Add Transaction</h1>
        <p className="text-purple-200 text-sm">Record a new spending or income transaction</p>
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
          <p className="text-green-200">✅ Transaction added successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Transaction Type */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <label className="block text-sm font-medium text-white mb-3">Transaction Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-red-400">💸 Expense</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-green-400">💵 Income</span>
            </label>
          </div>
        </div>

        {/* Account Selection */}
        {virtualAccounts.length > 0 && (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <label htmlFor="account" className="block text-sm font-medium text-white mb-2">
              Virtual Account
            </label>
            <select
              id="account"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">Select an account...</option>
              {virtualAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName} ({account.accountType}) - ₹{account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <label className="block text-sm font-medium text-white mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <label className="block text-sm font-medium text-white mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on? (e.g., Weekly groceries, Uber ride)"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            rows={3}
          />
        </div>

        {/* Amount */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <label className="block text-sm font-medium text-white mb-2">Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Payment Method */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <label className="block text-sm font-medium text-white mb-2">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Adding...' : '✅ Add Transaction'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            ← Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
