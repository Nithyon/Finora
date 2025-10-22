'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Budget', icon: '🏠', short: 'Budget' },
    { href: '/personalize-plan', label: 'Plan', icon: '🎯', short: 'Plan' },
    { href: '/spending', label: 'Spending', icon: '💳', short: 'Spend' },
    { href: '/accounts', label: 'Accounts', icon: '🏦', short: 'Accts' },
    { href: '/analytics', label: 'Analytics', icon: '📊', short: 'Analysis' },
    { href: '/chat', label: 'Chat', icon: '💬', short: 'Chat' },
    { href: '/settings', label: 'Settings', icon: '⚙️', short: 'Set' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27]/95 backdrop-blur border-t border-[#2d3748] z-[9999]">
      <div className="w-full px-0 py-1 flex justify-between items-end">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0 px-0 py-1.5 rounded transition-all duration-200 flex-1 ${
              isActive(item.href)
                ? 'text-[#0066cc] bg-[#0066cc]/10'
                : 'text-[#7a7d97] hover:text-white hover:bg-[#1a1f3a]/50'
            }`}
            title={item.label}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span className="text-[7px] font-semibold leading-tight text-center">{item.short || item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
