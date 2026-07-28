'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, ThumbsUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error('Email ou mot de passe incorrect.');
      return;
    }
    toast.success('Connexion réussie !');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-radial-grid px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-glow-sm">
            <ThumbsUp size={20} className="text-white" fill="white" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-50">
            Content de vous revoir
          </h1>
          <p className="mt-1 text-sm text-ink-400">Connectez-vous à votre compte SocialBoost</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl2 border border-base-700/60 bg-surface-raised/60 p-6 shadow-card"
        >
          <label className="block text-xs font-medium text-ink-300">Adresse email</label>
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
              placeholder="••••••••"
              className="w-full rounded-lg border border-base-600 bg-base-900 py-2.5 pl-10 pr-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-6 w-full" size="md">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Se connecter'}
          </Button>

          <p className="mt-4 text-center text-xs text-ink-500">
            Compte démo : demo@socialboost.com / Demo123!
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-medium text-brand-300 hover:text-brand-200">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
