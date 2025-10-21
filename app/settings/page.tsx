'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthProtected } from '@/app/hooks/useAuthProtected';

export default function SettingsPage() {
  useAuthProtected();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  // Get user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('user_email') || 'user@example.com';
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-lg">
            ← 
          </Link>
          <h1 className="text-lg font-bold text-white">Settings</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-6">
        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Account</h2>
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-4 mb-4">
            <p className="text-xs text-[#7a7d97] mb-1">Logged In As</p>
            <p className="text-white font-semibold">{userEmail}</p>
          </div>

          {/* Account Settings Items */}
          <div className="space-y-0 bg-[#141829] border border-[#2d3748] rounded-lg overflow-hidden">
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">👤</span>
              <span>Account Settings</span>
            </button>
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">🏦</span>
              <span>Manage Bank Connections</span>
            </button>
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">👥</span>
              <span>Finora Together</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition"
            >
              <span className="text-lg">🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* App Section */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4">App</h2>
          <div className="space-y-0 bg-[#141829] border border-[#2d3748] rounded-lg overflow-hidden">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎨</span>
                <span className="text-white">Display Options</span>
              </div>
            </button>
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔔</span>
                <span className="text-white">Notifications</span>
              </div>
            </button>
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <div className="flex items-center gap-3">
                <span className="text-lg">📍</span>
                <span className="text-white">Location Permissions</span>
              </div>
            </button>
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1a1f3a] transition">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔒</span>
                <span className="text-white">App Lock</span>
              </div>
              <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center p-1">
                <div className="w-5 h-5 bg-white rounded-full ml-auto"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Share Finora Section */}
        <div className="mb-8 bg-[#141829] border border-[#0066cc]/30 rounded-lg p-6">
          <h3 className="text-white font-bold mb-2">Share Finora</h3>
          <p className="text-[#7a7d97] text-sm mb-4">Friends don&apos;t let friends live without a plan.</p>
          <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
            <span>➤</span>
            <span>Share</span>
          </button>
        </div>

        {/* Misc Section */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Misc</h2>
          <div className="space-y-0 bg-[#141829] border border-[#2d3748] rounded-lg overflow-hidden">
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">▶️</span>
              <span>Send In Diagnostics</span>
            </button>
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">❤️</span>
              <span>Write a Review</span>
            </button>
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">📄</span>
              <span>Acknowledgements</span>
            </button>
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition border-b border-[#2d3748]">
              <span className="text-lg">📄</span>
              <span>Privacy Policy</span>
            </button>
            <button className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-[#1a1f3a] transition">
              <span className="text-lg">📄</span>
              <span>California Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#7a7d97] text-xs py-4">
          <p>Finora v1.0.0</p>
        </div>
      </main>

    </div>
  );
}
