'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ServiceRow {
  id: string;
  name: string;
  pricePer1000: number;
  minQuantity: number;
  maxQuantity: number;
  active: boolean;
  category: { name: string; platform: string };
}

interface CategoryRow {
  id: string;
  name: string;
  platform: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    pricePer1000: 1,
    minQuantity: 100,
    maxQuantity: 10000,
    avgTimeHours: 24,
  });

  function load() {
    setLoading(true);
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([servicesData, categoriesData]) => {
        setServices(servicesData.services ?? []);
        setCategories(categoriesData.categories ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    if (!form.name || !form.categoryId) {
      toast.error('Nom et catégorie requis.');
      return;
    }
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Service créé.');
      setShowForm(false);
      setForm({ name: '', categoryId: '', pricePer1000: 1, minQuantity: 100, maxQuantity: 10000, avgTimeHours : 24 });
      load();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Échec de la création.');
    }
  }

  async function toggleActive(service: ServiceRow) {
    const res = await fetch(`/api/services/${service.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !service.active }),
    });
    if (res.ok) {
      toast.success(service.active ? 'Service désactivé.' : 'Service activé.');
      load();
    }
  }

  async function deleteService(id: string) {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Service supprimé.');
      load();
    } else {
      toast.error('Échec de la suppression.');
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Services</h1>
          <p className="mt-1 text-sm text-ink-400">Ajoutez, modifiez ou supprimez des services.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Annuler' : 'Nouveau service'}
        </Button>
      </div>

      {showForm && (
        <div className="mt-5 grid gap-3 rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="text-xs text-ink-400">Nom du service</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400">Catégorie</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            >
              <option value="">Sélectionner…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.platform} · {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-400">Prix / 1000</label>
            <input
              type="number"
              step="0.01"
              value={form.pricePer1000}
              onChange={(e) => setForm({ ...form, pricePer1000: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400">Quantité min</label>
            <input
              type="number"
              value={form.minQuantity}
              onChange={(e) => setForm({ ...form, minQuantity: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400">Quantité max</label>
            <input
              type="number"
              value={form.maxQuantity}
              onChange={(e) => setForm({ ...form, maxQuantity: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-3">
            <Button size="sm" onClick={handleCreate}>
              <Check size={14} />
              Enregistrer le service
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl2 border border-base-700/60 bg-surface-raised/40">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-brand-400" size={24} />
          </div>
        ) : services.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-500">
            Aucun service en base — lancez <code className="text-ink-300">npm run db:seed</code> ou
            créez-en un ci-dessus.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-700/60 text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Catégorie</th>
                  <th className="px-5 py-3 font-medium">Prix / 1000</th>
                  <th className="px-5 py-3 font-medium">Min / Max</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700/60">
                {services.map((s) => (
                  <tr key={s.id}>
                    <td className="px-5 py-3.5 text-ink-100">{s.name}</td>
                    <td className="px-5 py-3.5 text-ink-400">
                      {s.category.platform} · {s.category.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-ink-100">
                      {formatCurrency(Number(s.pricePer1000))}
                    </td>
                    <td className="px-5 py-3.5 text-ink-400">
                      {s.minQuantity.toLocaleString('fr-FR')} / {s.maxQuantity.toLocaleString('fr-FR')}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          s.active
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-base-600 bg-base-800 text-ink-500'
                        }`}
                      >
                        {s.active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => deleteService(s.id)}
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
