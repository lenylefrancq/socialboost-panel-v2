'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface TransactionRow {
  id: string;
  amount: number;
  provider: 'STRIPE' | 'PAYPAL' | 'CRYPTO' | 'BALANCE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

const STATUS_STYLE: Record<TransactionRow['status'], string> = {
  PENDING: 'border-warning/30 bg-warning/10 text-warning',
  COMPLETED: 'border-success/30 bg-success/10 text-success',
  FAILED: 'border-danger/30 bg-danger/10 text-danger',
  REFUNDED: 'border-ink-400/30 bg-ink-400/10 text-ink-300',
};

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/payments')
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-50">Paiements</h1>
      <p className="mt-1 text-sm text-ink-400">Historique des transactions (Stripe, PayPal, Crypto).</p>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-base-700/60 bg-surface-raised/40">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-brand-400" size={24} />
          </div>
        ) : transactions.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-500">
            Aucune transaction pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-700/60 text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Utilisateur</th>
                  <th className="px-5 py-3 font-medium">Montant</th>
                  <th className="px-5 py-3 font-medium">Fournisseur</th>
                  <th className="px-5 py-3 font-medium">Référence</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700/60">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-5 py-3.5 text-ink-100">{t.user.name}</td>
                    <td className="px-5 py-3.5 font-mono text-ink-100">{formatCurrency(Number(t.amount))}</td>
                    <td className="px-5 py-3.5 text-ink-400">{t.provider}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-500">{t.reference ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', STATUS_STYLE[t.status])}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-500">{formatDate(t.createdAt)}</td>
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
