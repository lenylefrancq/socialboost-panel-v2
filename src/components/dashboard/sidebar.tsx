'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListOrdered, Wallet, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/dashboard', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Mes commandes', icon: ListOrdered },
  { href: '/dashboard/funds', label: 'Ajouter des fonds', icon: Wallet },
  { href: '/shop', label: 'Boutique', icon: ShoppingBag },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 sm:w-56">
      <nav className="flex gap-1.5 overflow-x-auto sm:flex-col sm:overflow-visible">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-500/15 text-brand-200 border border-brand-500/30'
                  : 'text-ink-400 hover:bg-base-800 hover:text-ink-100 border border-transparent'
              )}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
