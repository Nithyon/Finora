'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  const [accounts] = useState([
    { id: 1, name: 'Checking', balance: 2850.50 },
    { id: 2, name: 'Savings', balance: 12000.00 },
  ]);

  const [transactions] = useState([
    { id: 1, desc: 'Coffee Shop', amt: -5.50, cat: 'Food', date: 'Today' },
    { id: 2, desc: 'Salary', amt: 4500.00, cat: 'Income', date: 'Oct 15' },
    { id: 3, desc: 'Netflix', amt: -15.99, cat: 'Entertainment', date: 'Oct 14' },
    { id: 4, desc: 'Groceries', amt: -87.32, cat: 'Groceries', date: 'Oct 14' },
  ]);

  const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/budget', label: 'Plan', icon: '📋' },
    { href: '/spending', label: 'Spend', icon: '💰' },
    { href: '/accounts', label: 'Accounts', icon: '🏦' },
    { href: '/reflect', label: 'Reflect', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Finora</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
          <p className="text-sm text-[#a8aac5]">Here&apos;s your financial overview</p>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
          <p className="text-xs uppercase text-[#7a7d97] font-semibold mb-2">Net Worth</p>
          <h3 className="text-3xl font-bold text-white mb-4">${netWorth.toLocaleString()}</h3>
          <div className="grid grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-[#1a1f3a] rounded p-3 border border-[#2d3748]">
                <p className="text-xs text-[#7a7d97] mb-1">{acc.name}</p>
                <p className="font-bold text-white">${acc.balance.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
          <p className="text-xs uppercase text-[#7a7d97] font-semibold mb-4">October Spending</p>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-2xl font-bold text-white">$523.45</span>
              <span className="text-xs text-[#7a7d97]">of $1,500</span>
            </div>
            <div className="w-full bg-[#2d3748] rounded-full h-2">
              <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full" style={{width:'35%'}}></div>
            </div>
            <p className="text-xs text-[#a8aac5] mt-2">$976.55 remaining</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[{l:'Needs',p:'40%'},{l:'Wants',p:'35%'},{l:'Goals',p:'20%'},{l:'Flex',p:'5%'}].map((i)=>(
              <div key={i.l} className="bg-[#1a1f3a] rounded p-2 text-center border border-[#2d3748]">
                <p className="text-xs text-[#7a7d97] mb-1">{i.l}</p>
                <p className="text-sm font-bold text-white">{i.p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
          <h3 className="text-sm font-bold text-white mb-4">Recent Transactions</h3>
          {transactions.map((tx)=>(
            <div key={tx.id} className="flex justify-between pb-3 mb-3 border-b border-[#2d3748]">
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{tx.desc}</p>
                <p className="text-xs text-[#7a7d97]">{tx.cat} • {tx.date}</p>
              </div>
              <p className={tx.amt>0?'font-bold text-[#10b981]':'font-bold text-[#ef4444]'}>{tx.amt>0?'+':''}{tx.amt.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold">+ Add Transaction</button>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27] border-t border-[#2d3748]">
        <div className="max-w-md mx-auto flex justify-around">
          {navItems.map((item)=>(
            <Link key={item.href} href={item.href} className={pathname===item.href?'flex-1 py-3 text-center text-[#0066cc] border-t-2 border-[#0066cc]':'flex-1 py-3 text-center text-[#7a7d97]'}>
              <div className="text-lg">{item.icon}</div>
              <div className="text-xs">{item.label}</div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
