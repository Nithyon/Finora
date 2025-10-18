'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ReflectPage() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/budget', label: 'Plan', icon: '📋' },
    { href: '/spending', label: 'Spend', icon: '💰' },
    { href: '/accounts', label: 'Accounts', icon: '🏦' },
    { href: '/reflect', label: 'Reflect', icon: '📊' },
  ];

  const goals = [
    { name: 'Emergency Fund', target: 5000, current: 2500, icon: '🏠' },
    { name: 'Vacation', target: 3000, current: 1200, icon: '✈️' },
    { name: 'Car Down Payment', target: 10000, current: 4500, icon: '🚗' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-white">Finora</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Goals & Reflect 📊</h2>
          <p className="text-sm text-[#a8aac5]">Track your financial goals</p>
        </div>

        <div className="space-y-4">
          {goals.map((goal, idx) => {
            const pct = (goal.current / goal.target) * 100;
            return (
              <div key={idx} className="bg-[#141829] border border-[#2d3748] rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <p className="font-bold text-white">{goal.name}</p>
                      <p className="text-xs text-[#7a7d97]">${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#0066cc]">{Math.round(pct)}%</p>
                </div>
                <div className="w-full bg-[#2d3748] rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full" style={{width:`${pct}%`}}></div>
                </div>
                <p className="text-xs text-[#a8aac5] mt-2">${(goal.target - goal.current).toLocaleString()} to go</p>
              </div>
            );
          })}
        </div>

        <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold mt-6">+ Add New Goal</button>
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
