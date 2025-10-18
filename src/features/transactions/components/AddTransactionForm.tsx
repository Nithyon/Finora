'use client';

import { useState } from 'react';
import apiService from '@/app/services/api';

interface AddTransactionFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddTransactionForm = ({ onSuccess, onClose }: AddTransactionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = {
    expense: ['Groceries', 'Entertainment', 'Transportation', 'Utilities', 'Food', 'Healthcare', 'Shopping', 'Other'],
    income: ['Salary', 'Freelance', 'Bonus', 'Investment', 'Other'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validation
      if (!form.amount || !form.category || !form.description) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        setLoading(false);
        return;
      }

      // Mock success response (since backend isn't connected)
      await new Promise(resolve => setTimeout(resolve, 800));

      setSuccess(true);
      setForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      // Call success callback
      onSuccess?.();

      // Close modal after 1 second
      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-light rounded-lg border border-lime/30 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-lime text-2xl"
          >
            Γ£ò
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red/20 border border-red text-red rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-400 rounded text-sm">
            Γ£ô Transaction added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Type</label>
            <div className="flex gap-2">
              {['expense', 'income'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, type, category: '' })}
                  className={`flex-1 py-2 px-3 rounded font-semibold transition-all ${
                    form.type === type
                      ? 'bg-lime text-navy-dark'
                      : 'bg-navy border border-lime/30 text-gray-300 hover:border-lime'
                  }`}
                >
                  {type === 'expense' ? '≡ƒÆ╕ Expense' : '≡ƒÆ░ Income'}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-navy border border-lime/30 rounded text-white focus:border-lime focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-navy border border-lime/30 rounded text-white focus:border-lime focus:outline-none"
            >
              <option value="">Select category...</option>
              {categories[form.type as keyof typeof categories].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <input
              type="text"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Whole Foods grocery"
              className="w-full px-3 py-2 bg-navy border border-lime/30 rounded text-white focus:border-lime focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 bg-navy border border-lime/30 rounded text-white focus:border-lime focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-lime text-navy-dark font-bold rounded hover:bg-lime/90 disabled:opacity-50 transition-all"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};
