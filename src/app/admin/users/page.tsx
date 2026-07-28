'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.users ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleRole(user: UserRow) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast.success(`${user.name} est maintenant ${newRole === 'ADMIN' ? 'administrateur' : 'utilisateur'}.`);
      load();
    } else {
      toast.error('Impossible de modifier le rôle.');
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-50">Utilisateurs</h1>
      <p className="mt-1 text-sm text-ink-400">Gérez les comptes clients et administrateurs.</p>

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
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Solde</th>
                  <th className="px-5 py-3 font-medium">Commandes</th>
                  <th className="px-5 py-3 font-medium">Inscrit le</th>
                  <th className="px-5 py-3 font-medium">Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700/60">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3.5 text-ink-100">{u.name}</td>
                    <td className="px-5 py-3.5 text-ink-400">{u.email}</td>
                    <td className="px-5 py-3.5 font-mono text-ink-100">{formatCurrency(Number(u.balance))}</td>
                    <td className="px-5 py-3.5 text-ink-300">{u._count.orders}</td>
                    <td className="px-5 py-3.5 text-ink-500">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleRole(u)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                          u.role === 'ADMIN'
                            ? 'border-brand-500/30 bg-brand-500/10 text-brand-300'
                            : 'border-base-600 bg-base-800 text-ink-400'
                        )}
                      >
                        {u.role === 'ADMIN' ? <Shield size={11} /> : <User size={11} />}
                        {u.role}
                      </button>
                    </td>
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
