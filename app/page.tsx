'use client';

import { useState, useEffect } from 'react';

interface BudgetCategory {
  id: number;
  name: string;
  icon: string;
  assigned: number;
  spent: number;
  target: number;
}

interface Transaction {
  id: number;
  desc: string;
  amt: number;
  categoryId: number;
  date: string;
}

export default function Home() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [readyToAssign, setReadyToAssign] = useState(0);

  // YNAB-style budget categories
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 1, name: 'Groceries', icon: '🛒', assigned: 0, spent: 0, target: 15000 },
    { id: 2, name: 'Rent', icon: '🏠', assigned: 0, spent: 0, target: 25000 },
    { id: 3, name: 'Transportation', icon: '🚗', assigned: 0, spent: 0, target: 5000 },
    { id: 4, name: 'Utilities', icon: '💡', assigned: 0, spent: 0, target: 3000 },
    { id: 5, name: 'Entertainment', icon: '🎬', assigned: 0, spent: 0, target: 5000 },
    { id: 6, name: 'Dining Out', icon: '🍽️', assigned: 0, spent: 0, target: 4000 },
    { id: 7, name: 'Shopping', icon: '🛍️', assigned: 0, spent: 0, target: 3000 },
    { id: 8, name: 'Savings', icon: '💰', assigned: 0, spent: 0, target: 10000 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [setupIncome, setSetupIncome] = useState('');

  // Check if setup is complete
  useEffect(() => {
    const setup = localStorage.getItem('finora_ynab_setup');
    if (setup) {
      const parsed = JSON.parse(setup);
      setMonthlyIncome(parsed.income);
      setReadyToAssign(parsed.income);
      setCategories(parsed.categories || categories);
      setTransactions(parsed.transactions || []);
      setIsSetupComplete(true);
    } else {
      setShowSetupModal(true);
    }
  }, []);

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseFloat(setupIncome);
    if (!income || income <= 0) {
      alert('Please enter a valid monthly income');
      return;
    }

    setMonthlyIncome(income);
    setReadyToAssign(income);
    
    const setupData = {
      income,
      categories,
      transactions: [],
    };
    
    localStorage.setItem('finora_ynab_setup', JSON.stringify(setupData));
    setShowSetupModal(false);
    setIsSetupComplete(true);
  };

  const handleAssignMoney = (categoryId: number, amount: number) => {
    if (amount > readyToAssign) {
      alert('Not enough money to assign!');
      return;
    }

    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, assigned: cat.assigned + amount } : cat
      )
    );
    setReadyToAssign(prev => prev - amount);

    // Save to localStorage
    const setupData = {
      income: monthlyIncome,
      categories: categories.map(cat =>
        cat.id === categoryId ? { ...cat, assigned: cat.assigned + amount } : cat
      ),
      transactions,
    };
    localStorage.setItem('finora_ynab_setup', JSON.stringify(setupData));
  };

  const handleResetSetup = () => {
    localStorage.removeItem('finora_ynab_setup');
    setShowSetupModal(true);
    setIsSetupComplete(false);
    setMonthlyIncome(0);
    setReadyToAssign(0);
    setCategories([
      { id: 1, name: 'Groceries', icon: '🛒', assigned: 0, spent: 0, target: 15000 },
      { id: 2, name: 'Rent', icon: '🏠', assigned: 0, spent: 0, target: 25000 },
      { id: 3, name: 'Transportation', icon: '🚗', assigned: 0, spent: 0, target: 5000 },
      { id: 4, name: 'Utilities', icon: '💡', assigned: 0, spent: 0, target: 3000 },
      { id: 5, name: 'Entertainment', icon: '🎬', assigned: 0, spent: 0, target: 5000 },
      { id: 6, name: 'Dining Out', icon: '🍽️', assigned: 0, spent: 0, target: 4000 },
      { id: 7, name: 'Shopping', icon: '🛍️', assigned: 0, spent: 0, target: 3000 },
      { id: 8, name: 'Savings', icon: '💰', assigned: 0, spent: 0, target: 10000 },
    ]);
    setTransactions([]);
  };

  const totalAssigned = categories.reduce((sum, cat) => sum + cat.assigned, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      {/* Setup Modal */}
      {showSetupModal && !isSetupComplete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Finora! 💰</h2>
            <p className="text-sm text-[#a8aac5] mb-6">YNAB-style envelope budgeting</p>
            
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Monthly Income (₹)
                </label>
                <p className="text-xs text-[#a8aac5] mb-2">
                  How much money do you receive each month?
                </p>
                <input
                  type="number"
                  value={setupIncome}
                  onChange={(e) => setSetupIncome(e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-3 text-white text-xl font-bold placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="bg-[#1a1f3a] border border-[#2d3748] rounded p-4">
                <p className="text-xs text-[#a8aac5] mb-2">
                  💡 <strong>How it works:</strong>
                </p>
                <ul className="text-xs text-[#a8aac5] space-y-1">
                  <li>• Assign every rupee to a category</li>
                  <li>• Track spending in each envelope</li>
                  <li>• Move money between categories as needed</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition mt-6"
              >
                Get Started →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Finora</h1>
          {isSetupComplete && (
            <button
              onClick={handleResetSetup}
              className="text-xs text-[#0066cc] hover:text-[#0052a3] font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      {isSetupComplete && (
        <main className="max-w-md mx-auto px-4 pb-24 pt-6">
          {/* Ready to Assign - YNAB's key feature */}
          <div className="bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-lg p-6 mb-6 shadow-lg">
            <p className="text-xs uppercase text-white/80 font-semibold mb-1">Ready to Assign</p>
            <h3 className="text-4xl font-bold text-white mb-2">
              ₹{readyToAssign.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-white/80">
              Give every rupee a job! Assign money to your budget categories below.
            </p>
          </div>

          {/* Budget Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
              <p className="text-xs text-[#7a7d97] mb-1">Assigned</p>
              <p className="text-xl font-bold text-white">₹{totalAssigned.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
              <p className="text-xs text-[#7a7d97] mb-1">Spent</p>
              <p className="text-xl font-bold text-[#ef4444]">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Budget Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => {
                const available = category.assigned - category.spent;
                const percentage = category.assigned > 0 ? (category.spent / category.assigned) * 100 : 0;
                const isOverspent = category.spent > category.assigned;
                
                return (
                  <div
                    key={category.id}
                    className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 hover:border-[#0066cc] transition cursor-pointer"
                    onClick={() => {
                      const amount = prompt(`Assign money to ${category.name} (Available: ₹${readyToAssign})`);
                      if (amount) {
                        handleAssignMoney(category.id, parseFloat(amount));
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="font-bold text-white">{category.name}</h3>
                          <p className="text-xs text-[#7a7d97]">
                            Target: ₹{category.target.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isOverspent ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                          ₹{available.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-[#7a7d97]">available</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#2d3748] rounded-full h-2 mb-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverspent ? 'bg-[#ef4444]' : 'bg-gradient-to-r from-[#10b981] to-[#059669]'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-[#7a7d97]">
                      <span>Assigned: ₹{category.assigned.toLocaleString('en-IN')}</span>
                      <span>Spent: ₹{category.spent.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Assign Button */}
          <button
            onClick={() => {
              // Auto-assign based on targets
              const totalTarget = categories.reduce((sum, cat) => sum + cat.target, 0);
              if (totalTarget <= readyToAssign) {
                setCategories(prev =>
                  prev.map(cat => ({ ...cat, assigned: cat.target }))
                );
                setReadyToAssign(readyToAssign - totalTarget);
                
                const setupData = {
                  income: monthlyIncome,
                  categories: categories.map(cat => ({ ...cat, assigned: cat.target })),
                  transactions,
                };
                localStorage.setItem('finora_ynab_setup', JSON.stringify(setupData));
              } else {
                alert('Not enough money to auto-assign all targets!');
              }
            }}
            className="w-full bg-[#5500cc] hover:bg-[#440099] text-white py-3 rounded-lg font-semibold transition mb-4"
          >
            🎯 Auto-Assign to Targets
          </button>

          {/* Help Text */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 text-center">
            <p className="text-xs text-[#a8aac5]">
              💡 Click on any category to assign money from your "Ready to Assign" pool
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
