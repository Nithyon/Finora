'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import TransactionService from './utils/transactionService';

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
  const { user, transactions: appTransactions, loading } = useApp();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [readyToAssign, setReadyToAssign] = useState(0);
  const [availableToAssign, setAvailableToAssign] = useState(0);
  
  // Modal state for assigning money
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [assignAmount, setAssignAmount] = useState('');

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

  const [setupIncome, setSetupIncome] = useState('');

  // Check if setup is complete and load personalized targets
  useEffect(() => {
    const setup = localStorage.getItem('finora_ynab_setup');
    const budgetTargets = localStorage.getItem('finora_budget_targets');
    
    if (setup) {
      const parsed = JSON.parse(setup);
      setMonthlyIncome(parsed.income);
      setReadyToAssign(parsed.income);
      
      // If budget targets were personalized, use those. Otherwise use defaults
      if (budgetTargets) {
        try {
          const targets = JSON.parse(budgetTargets);
          const mappedCategories = targets.map((t: any, idx: number) => ({
            id: idx + 1,
            name: t.category,
            icon: t.icon,
            assigned: 0,
            spent: 0,
            target: t.amount,
          }));
          setCategories(mappedCategories);
        } catch (e) {
          console.error('Error loading targets:', e);
          setCategories(parsed.categories || [
            { id: 1, name: 'Groceries', icon: '🛒', assigned: 0, spent: 0, target: 15000 },
            { id: 2, name: 'Rent', icon: '🏠', assigned: 0, spent: 0, target: 25000 },
            { id: 3, name: 'Transportation', icon: '🚗', assigned: 0, spent: 0, target: 5000 },
            { id: 4, name: 'Utilities', icon: '💡', assigned: 0, spent: 0, target: 3000 },
            { id: 5, name: 'Entertainment', icon: '🎬', assigned: 0, spent: 0, target: 5000 },
            { id: 6, name: 'Dining Out', icon: '🍽️', assigned: 0, spent: 0, target: 4000 },
            { id: 7, name: 'Shopping', icon: '🛍️', assigned: 0, spent: 0, target: 3000 },
            { id: 8, name: 'Savings', icon: '💰', assigned: 0, spent: 0, target: 10000 },
          ]);
        }
      } else {
        setCategories(parsed.categories || [
          { id: 1, name: 'Groceries', icon: '🛒', assigned: 0, spent: 0, target: 15000 },
          { id: 2, name: 'Rent', icon: '🏠', assigned: 0, spent: 0, target: 25000 },
          { id: 3, name: 'Transportation', icon: '🚗', assigned: 0, spent: 0, target: 5000 },
          { id: 4, name: 'Utilities', icon: '💡', assigned: 0, spent: 0, target: 3000 },
          { id: 5, name: 'Entertainment', icon: '🎬', assigned: 0, spent: 0, target: 5000 },
          { id: 6, name: 'Dining Out', icon: '🍽️', assigned: 0, spent: 0, target: 4000 },
          { id: 7, name: 'Shopping', icon: '🛍️', assigned: 0, spent: 0, target: 3000 },
          { id: 8, name: 'Savings', icon: '💰', assigned: 0, spent: 0, target: 10000 },
        ]);
      }
      setIsSetupComplete(true);
    } else {
      setShowSetupModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate available to assign using TransactionService
  useEffect(() => {
    if (isSetupComplete && user?.id) {
      try {
        const budgets = categories.map(cat => ({ amount: cat.assigned }));
        const available = TransactionService.getAvailableToAssign(
          monthlyIncome,
          budgets
        );
        setAvailableToAssign(available);
      } catch (e) {
        console.error('Error calculating available to assign:', e);
      }
    }
  }, [isSetupComplete, user?.id, monthlyIncome, categories]);

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
  };

  const totalAssigned = categories.reduce((sum, cat) => sum + cat.assigned, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  
  // Calculate actual spending from transactions
  const actualSpending = appTransactions?.reduce((sum: number, tx: any) => {
    if (tx.transaction_type === 'expense') {
      return sum + tx.amount;
    }
    return sum;
  }, 0) || 0;

  return (
    <div className="w-full">
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
          <div className="flex items-center gap-3">
            {isSetupComplete && (
              <button
                onClick={handleResetSetup}
                className="text-xs text-[#0066cc] hover:text-[#0052a3] font-semibold"
              >
                Reset
              </button>
            )}
            <Link href="/settings" className="text-[#7a7d97] hover:text-white transition" title="Settings">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {isSetupComplete && (
        <main className="max-w-md mx-auto px-4 py-6 pt-6">
          {/* Ready to Assign - YNAB's key feature */}
          <div className="bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-xl p-6 mb-8">
            <p className="text-xs uppercase text-[#e0e7ff] font-semibold tracking-wider mb-1">Ready to Assign</p>
            <h3 className="text-4xl font-bold text-white mb-2">
              ₹{availableToAssign.toLocaleString('en-IN')}
            </h3>
            <p className="text-sm text-[#e0e7ff]">
              Give every rupee a job! {availableToAssign > 0 ? `You have ₹${availableToAssign.toLocaleString('en-IN')} waiting to be assigned` : 'All income assigned!'}
            </p>
          </div>

          {/* Budget Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
              <p className="text-xs text-[#7a7d97] uppercase tracking-wider mb-1">Assigned</p>
              <p className="text-2xl font-bold text-white">₹{totalAssigned.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4">
              <p className="text-xs text-[#7a7d97] uppercase tracking-wider mb-1">Actual Spending</p>
              <p className={`text-2xl font-bold ${actualSpending > totalAssigned ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                ₹{actualSpending.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Spending Overview */}
          {appTransactions && appTransactions.length > 0 && (
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Spending Overview</h3>
                <Link href="/spending" className="text-xs text-[#0066cc] hover:text-[#0052a3]">
                  View →
                </Link>
              </div>
              <p className="text-sm text-[#a8aac5] mb-3">
                You&apos;ve spent <span className="text-white font-bold">₹{actualSpending.toLocaleString('en-IN')}</span> across your categories
              </p>
              <Link 
                href="/spending"
                className="text-xs bg-[#0066cc] hover:bg-[#0052a3] text-white px-3 py-2 rounded transition inline-block"
              >
                📊 View detailed breakdown
              </Link>
            </div>
          )}

          {/* Personalize Plan Button */}
          <Link 
            href="/personalize-plan"
            className="w-full bg-gradient-to-r from-[#5500cc] to-[#0066cc] hover:from-[#440099] hover:to-[#0052a3] text-white py-3 rounded-lg font-semibold transition mb-8 inline-block text-center"
          >
            ⚙️ Personalize Plan
          </Link>

          {/* Budget Categories */}
          <div className="mb-8">
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
                      setSelectedCategory(category);
                      setAssignAmount('');
                      setShowAssignModal(true);
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
                };
                localStorage.setItem('finora_ynab_setup', JSON.stringify(setupData));
              } else {
                alert('Not enough money to auto-assign all targets!');
              }
            }}
            className="w-full bg-[#5500cc] hover:bg-[#440099] text-white py-3 rounded-lg font-semibold transition mb-6"
          >
            🎯 Auto-Assign to Targets
          </button>

          {/* Help Text */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 text-center">
            <p className="text-xs text-[#a8aac5]">
              💡 Click on any category to assign money from your &quot;Ready to Assign&quot; pool
            </p>
          </div>
        </main>
      )}

      {/* Assign Money Modal */}
      {showAssignModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Assign Money to {selectedCategory.name}
            </h3>
            
            <p className="text-sm text-[#7a7d97] mb-4">
              Available to assign: <span className="text-[#10b981] font-bold">₹{readyToAssign.toLocaleString('en-IN')}</span>
            </p>

            <input
              type="number"
              value={assignAmount}
              onChange={(e) => setAssignAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-[#0a0e27] border border-[#2d3748] rounded-lg px-4 py-2 text-white placeholder-[#7a7d97] focus:border-[#0066cc] focus:outline-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCategory(null);
                  setAssignAmount('');
                }}
                className="flex-1 bg-[#2d3748] hover:bg-[#3d4758] text-white py-2 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (assignAmount && selectedCategory) {
                    handleAssignMoney(selectedCategory.id, parseFloat(assignAmount));
                    setShowAssignModal(false);
                    setSelectedCategory(null);
                    setAssignAmount('');
                  }
                }}
                className="flex-1 bg-[#0066cc] hover:bg-[#0052a3] text-white py-2 rounded-lg font-semibold transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
