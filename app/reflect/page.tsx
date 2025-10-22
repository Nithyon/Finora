'use client';

import Link from 'next/link';

export default function ReflectPage() {

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

      <main className="max-w-md mx-auto px-4 pb-32 pt-6">
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
                      <p className="text-xs text-[#7a7d97]">₹{goal.current.toLocaleString('en-IN')} of ₹{goal.target.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#0066cc]">{Math.round(pct)}%</p>
                </div>
                <div className="w-full bg-[#2d3748] rounded-full h-2">
                  <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full" style={{width:`${pct}%`}}></div>
                </div>
                <p className="text-xs text-[#a8aac5] mt-2">₹{(goal.target - goal.current).toLocaleString('en-IN')} to go</p>
              </div>
            );
          })}
        </div>

        <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold mt-6">+ Add New Goal</button>
      </main>

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

          <div className="flex flex-col items-center gap-1 px-4 py-2 text-[#0066cc]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-semibold">Reflect</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
