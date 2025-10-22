'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Bottom navigation bar - 6 main navigation items with Analytics
export default function BottomNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Budget', icon: '🏠', short: 'Budget' },
    { href: '/personalize-plan', label: 'Plan', icon: '🎯', short: 'Plan' },
    { href: '/spending', label: 'Spending', icon: '💳', short: 'Spend' },
    { href: '/accounts', label: 'Accounts', icon: '🏦', short: 'Accts' },
    { href: '/chat', label: 'Chat', icon: '💬', short: 'Chat' },
    { href: '/analytics', label: 'Analytics', icon: '📊', short: 'Analyze' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27]/95 backdrop-blur border-t border-[#2d3748] z-[9999]">
      <div className="w-full max-w-md mx-auto px-2 py-3 flex justify-around items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 ${
              isActive(item.href)
                ? 'text-[#0066cc] bg-[#0066cc]/15'
                : 'text-[#7a7d97] hover:text-white hover:bg-[#1a1f3a]/60'
            }`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[7px] font-bold leading-tight text-center whitespace-nowrap">{item.short || item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
