'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BudgetTarget {
  id: number;
  category: string;
  icon: string;
  group: 'Bills' | 'Needs' | 'Wants';
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';
  dueDate: string;
  repeat: boolean;
  nextMonth?: number;
}

export default function PersonalizePlanPage() {
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetTarget | null>(null);
  const [amount, setAmount] = useState('0');
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Yearly' | 'Custom'>('Monthly');
  const [dueDate, setDueDate] = useState('Last Day of the Month');
  const [repeat, setRepeat] = useState(true);

  const [targets, setTargets] = useState<BudgetTarget[]>([
    { id: 1, category: 'Rent', icon: '🏠', group: 'Bills', amount: 0, frequency: 'Monthly', dueDate: 'Last Day of the Month', repeat: true },
    { id: 2, category: 'Utilities', icon: '⚡', group: 'Bills', amount: 0, frequency: 'Monthly', dueDate: '1st', repeat: true },
    { id: 3, category: 'Insurance', icon: '📋', group: 'Bills', amount: 0, frequency: 'Monthly', dueDate: '1st', repeat: true },
    { id: 4, category: 'TV streaming', icon: '📺', group: 'Bills', amount: 0, frequency: 'Monthly', dueDate: '1st', repeat: true },
    { id: 5, category: 'Personal care', icon: '💇', group: 'Needs', amount: 0, frequency: 'Monthly', dueDate: 'Last Day of the Month', repeat: true },
    { id: 6, category: 'Medical expenses', icon: '⚕️', group: 'Needs', amount: 0, frequency: 'Monthly', dueDate: 'Last Day of the Month', repeat: true },
    { id: 7, category: 'Hobbies', icon: '🌈', group: 'Wants', amount: 0, frequency: 'Monthly', dueDate: 'Last Day of the Month', repeat: true },
    { id: 8, category: 'Shopping', icon: '🛍️', group: 'Wants', amount: 0, frequency: 'Monthly', dueDate: 'Last Day of the Month', repeat: true },
    { id: 9, category: 'Travel', icon: '✈️', group: 'Wants', amount: 0, frequency: 'Monthly', dueDate: 'Last Day of the Month', repeat: true },
  ]);

  const totalCost = targets.reduce((sum, t) => sum + t.amount, 0);

  const handleAmountInput = (value: string) => {
    setAmount(value);
  };

  const openAmountInput = (target: BudgetTarget) => {
    setSelectedCategory(target);
    setAmount(target.amount.toString());
    setFrequency(target.frequency);
    setDueDate(target.dueDate);
    setRepeat(target.repeat);
    setShowAmountInput(true);
  };

  const groupedTargets = {
    Bills: targets.filter(t => t.group === 'Bills'),
    Needs: targets.filter(t => t.group === 'Needs'),
    Wants: targets.filter(t => t.group === 'Wants'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-[#0066cc]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-white flex-1 text-center">Edit Plan</h1>
          <button className="text-[#0066cc] font-semibold">Next</button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-32 pt-6">
        {/* Cost Summary */}
        <div className="text-center mb-8">
          <p className="text-5xl font-bold text-white mb-2">₹{parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-lg text-[#a8aac5]">Cost to Be Me</p>
        </div>

        {/* Monthly Targets Card */}
        <div className="bg-[#141829] border border-[#2d3748] rounded-xl p-6 mb-6">
          <p className="text-sm text-[#7a7d97] uppercase tracking-wider mb-2">Monthly Targets</p>
          <p className="text-2xl font-bold text-white">₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-[#a8aac5] mt-2">Enter your monthly income</p>
          <input
            type="text"
            placeholder="₹0.00"
            className="w-full bg-[#0a0e27] border border-[#2d3748] rounded-lg px-3 py-2 text-[#a8aac5] mt-3 focus:border-[#0066cc] focus:outline-none"
          />
        </div>

        {/* Info Card */}
        <div className="bg-[#1a2855] border border-[#2d3748] rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <span className="text-3xl flex-shrink-0">💬</span>
            <div>
              <p className="text-white font-bold mb-1">What does it cost to be you?</p>
              <p className="text-sm text-[#a8aac5]">Your targets add up to one simple number—everything you plan to spend and save each month.</p>
            </div>
          </div>
        </div>

        {/* Budget Categories by Group */}
        {Object.entries(groupedTargets).map(([group, items]) => (
          <div key={group} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{group}</h2>
              <button className="w-8 h-8 rounded-full bg-[#2d3748] hover:bg-[#3d4757] flex items-center justify-center text-[#7a7d97]">
                <span className="text-lg">+</span>
              </button>
            </div>
            <div className="bg-[#141829] border border-[#2d3748] rounded-xl overflow-hidden">
              {items.map((target, idx) => (
                <div key={target.id}>
                  <button
                    onClick={() => openAmountInput(target)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#1a1f3a] transition text-left border-b border-[#2d3748] last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{target.icon}</span>
                      <p className="font-bold text-white">{target.category}</p>
                    </div>
                    <p className="text-[#0066cc] font-bold">
                      {target.amount > 0 ? `Add Target` : `Add Target`}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Amount Input Modal */}
      {showAmountInput && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-[#141829] border-t border-[#2d3748] rounded-t-2xl p-6">
            {/* Header */}
            <Link href="/" className="inline-block mb-4 text-white hover:text-[#0066cc]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h3 className="text-xl font-bold text-white mb-6">
              {selectedCategory.icon} {selectedCategory.category}
            </h3>

            {/* Frequency Selector */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                {(['Weekly', 'Monthly', 'Yearly', 'Custom'] as const).map(freq => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      frequency === freq
                        ? 'bg-[#0066cc] text-white'
                        : 'border border-[#2d3748] text-[#7a7d97] hover:text-white'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Display & Input */}
            <div className="text-center mb-8">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountInput(e.target.value)}
                placeholder="0"
                className="w-full text-5xl font-bold text-[#10b981] font-mono text-center bg-transparent border-b-2 border-[#10b981] focus:outline-none focus:border-[#0066cc] placeholder-[#4a4a5a] pb-2"
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-4 mb-6">
              {/* Due Date */}
              <div className="bg-[#1a1f3a] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <p className="font-bold text-white">Due on</p>
                  </div>
                </div>
                <p className="text-[#0066cc] font-bold">{dueDate}</p>
              </div>

              {/* Repeat */}
              <div className="bg-[#1a1f3a] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔄</span>
                  <p className="font-bold text-white">Repeat</p>
                </div>
                <button
                  onClick={() => setRepeat(!repeat)}
                  className={`relative w-12 h-6 rounded-full transition ${repeat ? 'bg-[#0066cc]' : 'bg-[#2d3748]'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition transform ${repeat ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAmountInput(false);
                  setSelectedCategory(null);
                }}
                className="flex-1 bg-[#2d3748] hover:bg-[#3d4757] text-white py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedCategory) {
                    const updatedTargets = targets.map(t =>
                      t.id === selectedCategory.id
                        ? { ...t, amount: parseFloat(amount || '0'), frequency, dueDate, repeat }
                        : t
                    );
                    setTargets(updatedTargets);
                    setShowAmountInput(false);
                    setSelectedCategory(null);
                    setAmount('0');
                  }
                }}
                className="flex-1 bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27]/95 backdrop-blur border-t border-[#2d3748] z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2 text-[#7a7d97] hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="text-xs font-semibold">Budget</span>
          </Link>

          <Link href="/spending" className="flex flex-col items-center gap-1 px-4 py-2 text-[#7a7d97] hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-semibold">Spending</span>
          </Link>

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
