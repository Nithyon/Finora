'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0066cc] to-[#5500cc] flex items-center justify-center">
            <span className="text-lg font-['Plus_Jakarta_Sans'] font-800 text-white">F</span>
          </div>
          <h1 className="text-lg font-['Plus_Jakarta_Sans'] font-800 text-white">Finora</h1>
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-[#141829] rounded-lg transition-colors"
        >
          <span className="text-xl">⚙️</span>
        </button>

        {showMenu && (
          <div className="absolute top-full right-4 mt-2 bg-[#141829] border border-[#2d3748] rounded-lg shadow-xl w-48 z-50">
            <button className="w-full text-left px-4 py-2 hover:bg-[#1a1f3a] transition-colors text-sm text-[#a8aac5]">
              Profile
            </button>
            <Link
              href="/settings"
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-2 hover:bg-[#1a1f3a] transition-colors text-sm text-[#a8aac5] border-t border-[#2d3748] block"
            >
              Settings
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-[#1a1f3a] transition-colors text-sm text-[#a8aac5] border-t border-[#2d3748]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
