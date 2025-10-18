'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const BottomNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/budget', label: 'Plan', icon: '📋' },
    { href: '/spending', label: 'Spending', icon: '💰' },
    { href: '/accounts', label: 'Accounts', icon: '🏦' },
    { href: '/reflect', label: 'Reflect', icon: '📊' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e27] border-t border-[#2d3748] z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 py-3 px-2 text-center transition-all duration-200 ${
              isActive(item.href)
                ? 'text-[#0066cc] border-t-2 border-[#0066cc]'
                : 'text-[#7a7d97] hover:text-[#a8aac5]'
            }`}
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-xs font-['Plus_Jakarta_Sans'] font-600">{item.label}</div>
          </Link>
        ))}
      </div>
    </nav>
  );
};
