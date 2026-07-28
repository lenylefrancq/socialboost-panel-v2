'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  Package,
  CreditCard,
  Ticket,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/orders', label: 'Commandes', icon: ListOrdered },
  { href: '/admin/services', label: 'Services', icon: Package },
  { href: '/admin/payments', label: 'Paiements', icon: CreditCard },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/stats', label: 'Statistiques', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 sm:w-56">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
        Administration
      </p>
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
