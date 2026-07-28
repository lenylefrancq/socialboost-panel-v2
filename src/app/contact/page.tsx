'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Message envoyé ! Nous répondons sous 24h.');
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error("Impossible d'envoyer le message.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-50">Contact</h1>
      <p className="mt-2 max-w-xl text-ink-400">
        Une question, un problème avec une commande, ou une demande de tarif sur-mesure ?
        Écrivez-nous.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-ink-400">Nom</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-ink-400">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-ink-400">Message</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1.5 w-full resize-none rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-50 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <Button type="submit" disabled={submitting} className="mt-5">
            Envoyer le message
          </Button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-5">
            <Mail size={18} className="text-brand-300" />
            <p className="mt-3 font-medium text-ink-50">Email</p>
            <p className="mt-1 text-sm text-ink-400">support@socialboost.com</p>
          </div>
          <div className="rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-5">
            <MessageCircle size={18} className="text-brand-300" />
            <p className="mt-3 font-medium text-ink-50">Chat en direct</p>
            <p className="mt-1 text-sm text-ink-400">Disponible depuis votre tableau de bord</p>
          </div>
          <div className="rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-5">
            <Clock size={18} className="text-brand-300" />
            <p className="mt-3 font-medium text-ink-50">Temps de réponse</p>
            <p className="mt-1 text-sm text-ink-400">Moins de 24h, 7j/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
