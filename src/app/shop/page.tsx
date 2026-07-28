import type { Metadata } from 'next';
import { ShopExplorer } from '@/components/shop/shop-explorer';

export const metadata: Metadata = {
  title: 'Boutique — SocialBoost',
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink-50 sm:text-4xl">Boutique</h1>
        <p className="mt-2 text-ink-400">
          Choisissez une plateforme, sélectionnez un service, collez votre lien et lancez votre
          commande.
        </p>
      </div>

      <div className="mt-8">
        <ShopExplorer />
      </div>
    </div>
  );
}
