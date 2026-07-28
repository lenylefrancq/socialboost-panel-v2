import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PLATFORMS } from '@/data/catalog';
import { ShopExplorer } from '@/components/shop/shop-explorer';
import type { Platform } from '@/types';

interface Props {
  params: { category: string };
}

function resolvePlatform(slug: string): Platform | undefined {
  return PLATFORMS.find((p) => p.key.toLowerCase() === slug.toLowerCase())?.key;
}

export function generateStaticParams() {
  return PLATFORMS.map((p) => ({ category: p.key.toLowerCase() }));
}

export function generateMetadata({ params }: Props): Metadata {
  const platform = resolvePlatform(params.category);
  return { title: platform ? `${platform} — Boutique SocialBoost` : 'Boutique — SocialBoost' };
}

export default function ShopPlatformPage({ params }: Props) {
  const platform = resolvePlatform(params.category);
  if (!platform) notFound();

  const label = PLATFORMS.find((p) => p.key === platform)?.label;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink-50 sm:text-4xl">
          Services {label}
        </h1>
        <p className="mt-2 text-ink-400">
          Followers, likes, vues et bien plus pour développer votre présence sur {label}.
        </p>
      </div>

      <div className="mt-8">
        <ShopExplorer initialPlatform={platform} />
      </div>
    </div>
  );
}
