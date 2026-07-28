'use client';

import { useState } from 'react';
import { CreditCard, Wallet, Bitcoin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/lib/use-current-user';

type Provider = 'STRIPE' | 'PAYPAL' | 'CRYPTO';

const PRESETS = [10, 25, 50, 100, 250, 500];

const METHODS: { key: Provider; label: string; icon: typeof CreditCard }[] = [
  { key: 'STRIPE', label: 'Carte bancaire (Stripe)', icon: CreditCard },
  { key: 'PAYPAL', label: 'PayPal', icon: Wallet },
  { key: 'CRYPTO', label: 'Crypto', icon: Bitcoin },
];

export default function AddFundsPage() {
  const { user } = useCurrentUser();
  const [amount, setAmount] = useState(25);
  const [provider, setProvider] = useState<Provider>('STRIPE');
  const [loading, setLoading] = useState(false);

  async function handleAddFunds() {
    setLoading(true);
    try {
      const res = await fetch('/api/funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, provider }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Impossible d'ajouter des fonds pour le moment.");
        setLoading(false);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      toast.success('Fonds ajoutés !');
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink-50">Ajouter des fonds</h1>
      <p className="mt-1 text-sm text-ink-400">
        Solde actuel :{' '}
        <span className="font-mono text-ink-100">{formatCurrency(Number(user?.balance ?? 0))}</span>
      </p>

      <div className="mt-6 rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6">
        <label className="text-sm font-medium text-ink-300">Montant à ajouter</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={cn(
                'rounded-lg border py-2.5 text-sm font-medium transition-colors',
                amount === p
                  ? 'border-brand-500 bg-brand-500/10 text-brand-200'
                  : 'border-base-700 bg-base-900 text-ink-300 hover:border-base-600'
              )}
            >
              {p} €
            </button>
          ))}
        </div>
        <input
          type="number"
          min={5}
          max={5000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-3 w-full rounded-lg border border-base-600 bg-base-900 px-4 py-2.5 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
        />

        <label className="mt-6 block text-sm font-medium text-ink-300">Moyen de paiement</label>
        <div className="mt-2 space-y-2">
          {METHODS.map((m) => (
            <button
              key={m.key}
              onClick={() => setProvider(m.key)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                provider === m.key
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-base-700 bg-base-900 hover:border-base-600'
              )}
            >
              <m.icon size={16} className={provider === m.key ? 'text-brand-300' : 'text-ink-400'} />
              <span className="text-sm text-ink-100">{m.label}</span>
            </button>
          ))}
        </div>

        <Button onClick={handleAddFunds} disabled={loading || amount < 5} className="mt-6 w-full">
          {loading ? <Loader2 size={16} className="animate-spin" /> : `Ajouter ${formatCurrency(amount)}`}
        </Button>
      </div>
    </div>
  );
}
