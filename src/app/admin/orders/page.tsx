'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types';

interface OrderRow {
  id: string;
  orderNumber: string;
  quantity: number;
  charge: number;
  status: OrderStatus;
  createdAt: string;
  link: string;
  user: { name: string; email: string };
  service: { name: string };
}

const STATUSES: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'IN_PROGRESS',
  'COMPLETED',
  'PARTIAL',
  'CANCELLED',
  'REFUNDED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success('Statut mis à jour.');
      load();
    } else {
      toast.error('Échec de la mise à jour.');
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-50">Commandes</h1>
      <p className="mt-1 text-sm text-ink-400">Suivez et mettez à jour le statut des commandes.</p>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-base-700/60 bg-surface-raised/40">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-brand-400" size={24} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-700/60 text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Commande</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Service</th>
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
                    <td className="px-5 py-3.5 text-ink-100">{order.user.name}</td>
                    <td className="px-5 py-3.5 text-ink-300">{order.service.name}</td>
                    <td className="px-5 py-3.5 font-mono text-ink-100">{formatCurrency(order.charge)}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="rounded-lg border border-base-600 bg-base-900 px-2 py-1.5 text-xs text-ink-100 focus:border-brand-500 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
