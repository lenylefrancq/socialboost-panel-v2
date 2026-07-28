'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CouponRow {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discountType: 'PERCENT', discountValue: 10, maxUses: 100 });

  function load() {
    setLoading(true);
    fetch('/api/admin/coupons')
      .then((res) => res.json())
      .then((data) => setCoupons(data.coupons ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!form.code) {
      toast.error('Le code est requis.');
      return;
    }
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Coupon créé.');
      setShowForm(false);
      setForm({ code: '', discountType: 'PERCENT', discountValue: 10, maxUses: 100 });
      load();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Échec de la création.');
    }
  }

  async function toggleActive(coupon: CouponRow) {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !coupon.active }),
    });
    if (res.ok) {
      toast.success(coupon.active ? 'Coupon désactivé.' : 'Coupon activé.');
      load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Coupon supprimé.');
      load();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Coupons</h1>
          <p className="mt-1 text-sm text-ink-400">Créez des codes promotionnels pour vos clients.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Annuler' : 'Nouveau coupon'}
        </Button>
      </div>

      {showForm && (
        <div className="mt-5 grid gap-3 rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs text-ink-400">Code</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="BOOST10"
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400">Type</label>
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            >
              <option value="PERCENT">Pourcentage (%)</option>
              <option value="FIXED">Montant fixe (€)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-400">Valeur</label>
            <input
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400">Utilisations max</label>
            <input
              type="number"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-4">
            <Button size="sm" onClick={handleCreate}>
              <Check size={14} />
              Créer le coupon
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl2 border border-base-700/60 bg-surface-raised/40">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-brand-400" size={24} />
          </div>
        ) : coupons.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-500">Aucun coupon créé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-700/60 text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Réduction</th>
                  <th className="px-5 py-3 font-medium">Utilisations</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700/60">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-5 py-3.5 font-mono text-ink-100">{c.code}</td>
                    <td className="px-5 py-3.5 text-ink-300">
                      {c.discountType === 'PERCENT' ? `${c.discountValue}%` : `${c.discountValue} €`}
                    </td>
                    <td className="px-5 py-3.5 text-ink-400">
                      {c.usedCount} / {c.maxUses ?? '∞'}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive(c)}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-xs font-medium',
                          c.active
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-base-600 bg-base-800 text-ink-500'
                        )}
                      >
                        {c.active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => remove(c.id)}
                        className="text-ink-500 transition-colors hover:text-danger"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={15} />
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
