'use client';

import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/context/cart-store';
import { formatCurrency, calcServicePrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-base-800">
          <ShoppingBag size={24} className="text-ink-500" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-50">Votre panier est vide</h1>
        <p className="mt-2 text-ink-400">Parcourez la boutique pour ajouter des services.</p>
        <Link href="/shop" className="mt-6">
          <Button>Voir la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-50">Votre panier</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink-50">{item.service.name}</p>
                  <p className="mt-1 truncate text-xs text-ink-500">{item.link}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Retirer du panier"
                  className="shrink-0 text-ink-500 transition-colors hover:text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-ink-500">Quantité</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min={item.service.minQuantity}
                    max={item.service.maxQuantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    className="w-24 rounded-lg border border-base-600 bg-base-900 px-3 py-1.5 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <p className="font-mono text-base font-semibold text-ink-50">
                  {formatCurrency(calcServicePrice(item.service.pricePer1000, item.quantity))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6">
          <h2 className="font-display text-lg font-semibold text-ink-50">Résumé</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-400">
              <span>Articles</span>
              <span>{items.length}</span>
            </div>
            <div className="flex justify-between border-t border-base-700/60 pt-3 font-medium text-ink-50">
              <span>Total</span>
              <span className="font-mono">{formatCurrency(total())}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="mt-6 w-full group">
              Passer au paiement
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
