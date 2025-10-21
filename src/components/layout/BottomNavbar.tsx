'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/budget', label: 'Plan', icon: '📊' },
    { href: '/spending', label: 'Spend', icon: '💳' },
    { href: '/accounts', label: 'Accounts', icon: '🏦' },
    { href: '/reflect', label: 'Reflect', icon: '✨' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27] border-t border-[#2d3748] z-40">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? 'flex-1 py-3 text-center text-[#0066cc] border-t-2 border-[#0066cc] transition-colors'
                : 'flex-1 py-3 text-center text-[#7a7d97] hover:text-[#a8aac5] transition-colors'
            }
          >
            <div className="text-lg">{item.icon}</div>
            <div className="text-xs font-medium">{item.label}</div>
          </Link>
        ))}
        <Link
          href="/chat"
          className={
            pathname === '/chat'
              ? 'flex-1 py-3 text-center text-[#0066cc] border-t-2 border-[#0066cc] transition-colors'
              : 'flex-1 py-3 text-center text-[#7a7d97] hover:text-[#a8aac5] transition-colors'
          }
        >
          <div className="text-lg">💬</div>
          <div className="text-xs font-medium">Chat</div>
        </Link>
        <Link
          href="/settings"
          className={
            pathname === '/settings'
              ? 'flex-1 py-3 text-center text-[#0066cc] border-t-2 border-[#0066cc] transition-colors'
              : 'flex-1 py-3 text-center text-[#7a7d97] hover:text-[#a8aac5] transition-colors'
          }
        >
          <div className="text-lg">⚙️</div>
          <div className="text-xs font-medium">Settings</div>
        </Link>
      </div>
    </nav>
  );
}
