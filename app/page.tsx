'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: number;
  desc: string;
  amt: number;
  cat: string;
  date: string;
}

interface Account {
  id: number;
  name: string;
  balance: number;
}

interface UserSetupData {
  salary: string;
  checkingBalance: string;
  savingsBalance: string;
  monthlyBudget: string;
}

export default function Home() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // User setup data
  const [userSetup, setUserSetup] = useState<UserSetupData>({
    salary: '',
    checkingBalance: '',
    savingsBalance: '',
    monthlyBudget: '',
  });

  // Accounts and transactions state
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: 'Checking', balance: 0 },
    { id: 2, name: 'Savings', balance: 0 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Check if user has completed setup
  useEffect(() => {
    const setup = localStorage.getItem('finora_setup');
    if (setup) {
      const parsedSetup = JSON.parse(setup) as UserSetupData;
      setUserSetup(parsedSetup);
      setAccounts([
        { id: 1, name: 'Checking', balance: parseFloat(parsedSetup.checkingBalance) || 0 },
        { id: 2, name: 'Savings', balance: parseFloat(parsedSetup.savingsBalance) || 0 },
      ]);
      setTransactions([
        { id: 1, desc: `Monthly Salary`, amt: parseFloat(parsedSetup.salary) || 0, cat: 'Income', date: 'This month' },
      ]);
      setIsSetupComplete(true);
    } else {
      setShowSetupModal(true);
    }
  }, []);

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSetup.salary || !userSetup.monthlyBudget) {
      alert('Please fill in salary and monthly budget');
      return;
    }
    
    localStorage.setItem('finora_setup', JSON.stringify(userSetup));
    setAccounts([
      { id: 1, name: 'Checking', balance: parseFloat(userSetup.checkingBalance) || 0 },
      { id: 2, name: 'Savings', balance: parseFloat(userSetup.savingsBalance) || 0 },
    ]);
    setTransactions([
      { id: 1, desc: `Monthly Salary`, amt: parseFloat(userSetup.salary), cat: 'Income', date: 'This month' },
    ]);
    setShowSetupModal(false);
    setIsSetupComplete(true);
  };

  const handleSetupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSetup(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetSetup = () => {
    localStorage.removeItem('finora_setup');
    setShowSetupModal(true);
    setIsSetupComplete(false);
  };

  const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyBudget = parseFloat(userSetup.monthlyBudget) || 0;
  const currentSpending = transactions
    .filter(t => t.amt < 0)
    .reduce((sum, t) => sum + Math.abs(t.amt), 0);
  const remaining = monthlyBudget - currentSpending;
  const spendingPercentage = monthlyBudget > 0 ? (currentSpending / monthlyBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      {/* Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Finora! 👋</h2>
            <p className="text-sm text-[#a8aac5] mb-6">Let&apos;s set up your financial profile</p>
            
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Monthly Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={userSetup.salary}
                  onChange={handleSetupChange}
                  placeholder="e.g., 5000"
                  className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Monthly Budget</label>
                <input
                  type="number"
                  name="monthlyBudget"
                  value={userSetup.monthlyBudget}
                  onChange={handleSetupChange}
                  placeholder="e.g., 2000"
                  className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Checking Account Balance</label>
                <input
                  type="number"
                  name="checkingBalance"
                  value={userSetup.checkingBalance}
                  onChange={handleSetupChange}
                  placeholder="e.g., 3000"
                  className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Savings Account Balance</label>
                <input
                  type="number"
                  name="savingsBalance"
                  value={userSetup.savingsBalance}
                  onChange={handleSetupChange}
                  placeholder="e.g., 10000"
                  className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition mt-6"
              >
                Get Started
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
              Reconfigure
            </button>
          )}
        </div>
      </header>

      {isSetupComplete && (
        <main className="max-w-md mx-auto px-4 pb-24 pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
            <p className="text-sm text-[#a8aac5]">Here&apos;s your financial overview</p>
          </div>

          {/* Net Worth Card */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
            <p className="text-xs uppercase text-[#7a7d97] font-semibold mb-2">Net Worth</p>
            <h3 className="text-3xl font-bold text-white mb-4">${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <div className="grid grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div key={acc.id} className="bg-[#1a1f3a] rounded p-3 border border-[#2d3748]">
                  <p className="text-xs text-[#7a7d97] mb-1">{acc.name}</p>
                  <p className="font-bold text-white">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
            <p className="text-xs uppercase text-[#7a7d97] font-semibold mb-4">Monthly Budget</p>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-bold text-white">${currentSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-xs text-[#7a7d97]">of ${monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-[#2d3748] rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full transition-all"
                  style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#a8aac5] mt-2">
                ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[{ l: 'Needs', p: '40%' }, { l: 'Wants', p: '35%' }, { l: 'Goals', p: '20%' }, { l: 'Flex', p: '5%' }].map((i) => (
                <div key={i.l} className="bg-[#1a1f3a] rounded p-2 text-center border border-[#2d3748]">
                  <p className="text-xs text-[#7a7d97] mb-1">{i.l}</p>
                  <p className="text-sm font-bold text-white">{i.p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Card */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-bold text-white mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-xs text-[#7a7d97]">No transactions yet</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between pb-3 mb-3 border-b border-[#2d3748] last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{tx.desc}</p>
                    <p className="text-xs text-[#7a7d97]">{tx.cat} • {tx.date}</p>
                  </div>
                  <p className={tx.amt > 0 ? 'font-bold text-[#10b981]' : 'font-bold text-[#ef4444]'}>
                    {tx.amt > 0 ? '+' : '-'}${Math.abs(tx.amt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))
            )}
          </div>

          <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition">
            + Add Transaction
          </button>
        </main>
      )}
    </div>
  );
}
