'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User, ThumbsUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Une erreur est survenue.');
        setLoading(false);
        return;
      }

      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      setLoading(false);

      if (signInRes?.error) {
        toast.success('Compte créé ! Vous pouvez vous connecter.');
        router.push('/login');
        return;
      }

      toast.success('Bienvenue sur SocialBoost !');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setLoading(false);
      toast.error('Impossible de créer le compte pour le moment.');
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-radial-grid px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-glow-sm">
            <ThumbsUp size={20} className="text-white" fill="white" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-50">Créer un compte</h1>
          <p className="mt-1 text-sm text-ink-400">Rejoignez SocialBoost en quelques secondes</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl2 border border-base-700/60 bg-surface-raised/60 p-6 shadow-card"
        >
          <label className="block text-xs font-medium text-ink-300">Nom complet</label>
          <div className="relative mt-1.5">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jean Dupont"
              className="w-full rounded-lg border border-base-600 bg-base-900 py-2.5 pl-10 pr-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <label className="mt-4 block text-xs font-medium text-ink-300">Adresse email</label>
          <div className="relative mt-1.5">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@exemple.com"
              className="w-full rounded-lg border border-base-600 bg-base-900 py-2.5 pl-10 pr-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <label className="mt-4 block text-xs font-medium text-ink-300">Mot de passe</label>
          <div className="relative mt-1.5">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="8 caractères minimum"
              className="w-full rounded-lg border border-base-600 bg-base-900 py-2.5 pl-10 pr-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-6 w-full" size="md">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Créer mon compte'}
          </Button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-500">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/terms" className="underline hover:text-ink-300">
              Conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="underline hover:text-ink-300">
              Politique de confidentialité
            </Link>
            .
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Déjà un compte ?{' '}
          <Link href="/login" className="font-medium text-brand-300 hover:text-brand-200">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
