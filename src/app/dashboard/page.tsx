'use client';

import Link from 'next/link';
import { Wallet, ListOrdered, TrendingUp, ArrowRight } from 'lucide-react';
import { useCurrentUser } from '@/lib/use-current-user';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading } = useCurrentUser();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">
            Bonjour{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-ink-400">Voici un aperçu de votre compte SocialBoost.</p>
        </div>
        <Link href="/dashboard/funds">
          <Button size="sm">
            <Wallet size={14} />
            Ajouter des fonds
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-400">Solde disponible</p>
              <Wallet size={16} className="text-brand-300" />
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink-50">
              {loading ? '—' : formatCurrency(Number(user?.balance ?? 0))}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-400">Commandes passées</p>
              <ListOrdered size={16} className="text-brand-300" />
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink-50">
              {loading ? '—' : user?._count.orders ?? 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-400">Membre depuis</p>
              <TrendingUp size={16} className="text-brand-300" />
            </div>
            <p className="mt-2 font-mono text-lg font-semibold text-ink-50">
              {loading || !user ? '—' : new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ink-50">Explorer la boutique</p>
              <p className="mt-1 text-sm text-ink-400">
                Découvrez tous les services disponibles pour vos réseaux.
              </p>
            </div>
            <Link href="/shop">
              <Button variant="secondary" size="sm">
                <ArrowRight size={14} />
              </Button>
            </Link>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ink-50">Voir l'historique</p>
              <p className="mt-1 text-sm text-ink-400">
                Consultez le statut de toutes vos commandes récentes.
              </p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="secondary" size="sm">
                <ArrowRight size={14} />
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
