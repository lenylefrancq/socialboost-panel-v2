'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2, Euro, Users, ListOrdered, Clock3 } from 'lucide-react';
import { AdminStatCard } from '@/components/admin/stat-card';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  userCount: number;
  orderCount: number;
  revenue: number;
  pendingOrders: number;
}

interface ChartPoint {
  date: string;
  revenue: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/stats/chart').then((r) => r.json()),
    ])
      .then(([statsData, chartData]) => {
        setStats(statsData);
        setChart(chartData.chart ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-50">Statistiques</h1>
      <p className="mt-1 text-sm text-ink-400">Ventes, commandes et chiffre d'affaires.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Chiffre d'affaires total" value={loading ? '—' : formatCurrency(Number(stats?.revenue ?? 0))} icon={Euro} />
        <AdminStatCard label="Utilisateurs" value={loading ? '—' : String(stats?.userCount ?? 0)} icon={Users} />
        <AdminStatCard label="Commandes" value={loading ? '—' : String(stats?.orderCount ?? 0)} icon={ListOrdered} />
        <AdminStatCard label="En attente" value={loading ? '—' : String(stats?.pendingOrders ?? 0)} icon={Clock3} />
      </div>

      <div className="mt-8 rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6">
        <h2 className="font-display text-lg font-semibold text-ink-50">
          Chiffre d'affaires — 14 derniers jours
        </h2>
        <div className="mt-4 h-72">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-brand-400" size={24} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D7FFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3D7FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2740" />
                <XAxis dataKey="date" stroke="#5B6580" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5B6580" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#111830',
                    border: '1px solid #1E2740',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Chiffre d’affaires']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4C82FF" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
