'use client';

import { useEffect, useState } from 'react';
import { Loader2, PackageSearch } from 'lucide-react';
import { OrderStatusBadge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface OrderRow {
  id: string;
  orderNumber: string;
  link: string;
  quantity: number;
  charge: number;
  status: OrderStatus;
  createdAt: string;
  service: { name: string };
}

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-50">Mes commandes</h1>
      <p className="mt-1 text-sm text-ink-400">Historique complet de vos commandes SocialBoost.</p>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-base-700/60 bg-surface-raised/40">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-brand-400" size={24} />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <PackageSearch size={28} className="text-ink-500" />
            <p className="text-sm text-ink-400">Vous n'avez pas encore passé de commande.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-700/60 text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Commande</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Quantité</th>
                  <th className="px-5 py-3 font-medium">Montant</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700/60">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-400">
                      #{order.orderNumber.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3.5 text-ink-100">{order.service.name}</td>
                    <td className="px-5 py-3.5 text-ink-300">{order.quantity.toLocaleString('fr-FR')}</td>
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
