'use client';

import { useEffect, useState } from 'react';
import { Users, ListOrdered, Euro, Clock3, Loader2 } from 'lucide-react';
import { AdminStatCard } from '@/components/admin/stat-card';
import { OrderStatusBadge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface Stats {
  userCount: number;
  orderCount: number;
  revenue: number;
  pendingOrders: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    quantity: number;
    charge: number;
    status: OrderStatus;
    createdAt: string;
    user: { name: string };
    service: { name: string };
  }[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-50">Vue d'ensemble</h1>
      <p className="mt-1 text-sm text-ink-400">Suivi global de la plateforme SocialBoost.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Utilisateurs" value={loading ? '—' : String(stats?.userCount ?? 0)} icon={Users} />
        <AdminStatCard label="Commandes" value={loading ? '—' : String(stats?.orderCount ?? 0)} icon={ListOrdered} />
        <AdminStatCard
          label="Chiffre d'affaires"
          value={loading ? '—' : formatCurrency(Number(stats?.revenue ?? 0))}
          icon={Euro}
        />
        <AdminStatCard
          label="Commandes en cours"
          value={loading ? '—' : String(stats?.pendingOrders ?? 0)}
          icon={Clock3}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl2 border border-base-700/60 bg-surface-raised/40">
        <div className="border-b border-base-700/60 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink-50">Commandes récentes</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-brand-400" size={24} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-700/60 text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Montant</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700/60">
                {stats?.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-3.5 text-ink-100">{order.user.name}</td>
                    <td className="px-5 py-3.5 text-ink-300">{order.service.name}</td>
                    <td className="px-5 py-3.5 font-mono text-ink-100">{formatCurrency(order.charge)}</td>
                    <td className="px-5 py-3.5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-ink-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
