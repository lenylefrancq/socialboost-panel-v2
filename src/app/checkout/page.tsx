'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CreditCard, Wallet, Bitcoin, ShieldCheck, Loader2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/context/cart-store';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Provider = 'STRIPE' | 'PAYPAL' | 'CRYPTO' | 'BALANCE';

const METHODS: { key: Provider; label: string; icon: typeof CreditCard; hint: string }[] = [
  { key: 'STRIPE', label: 'Carte bancaire', icon: CreditCard, hint: 'Via Stripe · Visa, Mastercard, Amex' },
  { key: 'PAYPAL', label: 'PayPal', icon: Wallet, hint: 'Paiement instantané' },
  { key: 'CRYPTO', label: 'Crypto', icon: Bitcoin, hint: 'BTC, ETH, USDT' },
  { key: 'BALANCE', label: 'Solde SocialBoost', icon: ShieldCheck, hint: 'Débit immédiat de votre solde' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const { items, total, clear } = useCartStore();
  const [provider, setProvider] = useState<Provider>('STRIPE');
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (status !== 'authenticated') {
      toast.error('Connectez-vous pour finaliser votre commande.');
      router.push('/login');
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            serviceId: i.service.id,
            serviceName: i.service.name,
            link: i.link,
            quantity: i.quantity,
            charge: i.total,
          })),
          provider,
          couponCode: coupon || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Le paiement a échoué.');
        setLoading(false);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      clear();
      toast.success('Commande confirmée !');
      router.push('/dashboard/orders');
    } catch {
      toast.error('Une erreur est survenue pendant le paiement.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-50">Paiement sécurisé</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium text-ink-300">Choisissez un moyen de paiement</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setProvider(m.key)}
                className={cn(
                  'flex items-start gap-3 rounded-xl2 border p-4 text-left transition-colors',
                  provider === m.key
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-base-700 bg-base-900 hover:border-base-600'
                )}
              >
                <m.icon size={18} className={provider === m.key ? 'text-brand-300' : 'text-ink-400'} />
                <div>
                  <p className="text-sm font-medium text-ink-50">{m.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{m.hint}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-ink-300">Code promo</label>
            <div className="relative mt-1.5 max-w-xs">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="EX: BOOST10"
                className="w-full rounded-lg border border-base-600 bg-base-900 py-2.5 pl-9 pr-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-xl2 border border-base-700/60 bg-base-900/60 p-4 text-xs text-ink-500">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-success" />
            Vos paiements sont chiffrés et traités par nos partenaires certifiés (Stripe, PayPal).
            Nous ne stockons jamais vos données bancaires.
          </div>
        </div>

        <div className="h-fit rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6">
          <h2 className="font-display text-lg font-semibold text-ink-50">Récapitulatif</h2>
          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="truncate text-ink-400">
                  {item.service.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-mono text-ink-100">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-base-700/60 pt-4 font-medium text-ink-50">
            <span>Total</span>
            <span className="font-mono">{formatCurrency(total())}</span>
          </div>
          <Button onClick={handlePay} disabled={loading || items.length === 0} className="mt-6 w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : `Payer ${formatCurrency(total())}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
