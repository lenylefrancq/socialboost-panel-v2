'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { TESTIMONIALS } from '@/components/home/testimonials-section';
import { Button } from '@/components/ui/button';

export default function ReviewsPage() {
  const { status } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'authenticated') {
      toast.error('Connectez-vous pour laisser un avis.');
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success('Merci ! Votre avis sera visible après modération.');
      setComment('');
    } else {
      toast.error("Impossible d'envoyer votre avis.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-50">Avis clients</h1>
      <p className="mt-2 max-w-xl text-ink-400">
        Plus de 12 000 clients nous font confiance pour développer leur audience. Voici ce qu'ils
        en pensent.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < t.rating ? 'fill-warning text-warning' : 'text-base-600'} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-300">“{t.text}”</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 font-display text-sm font-semibold text-brand-300">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium text-ink-50">{t.name}</p>
                <p className="text-xs text-ink-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-lg">
        <h2 className="font-display text-xl font-semibold text-ink-50">Laisser un avis</h2>
        <form onSubmit={handleSubmit} className="mt-4 rounded-xl2 border border-base-700/60 bg-surface-raised/40 p-6">
          <label className="text-xs text-ink-400">Votre note</label>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button type="button" key={i} onClick={() => setRating(i + 1)}>
                <Star size={22} className={i < rating ? 'fill-warning text-warning' : 'text-base-600'} />
              </button>
            ))}
          </div>
          <label className="mt-4 block text-xs text-ink-400">Votre commentaire</label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Partagez votre expérience..."
            className="mt-1.5 w-full resize-none rounded-lg border border-base-600 bg-base-900 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
          />
          <Button type="submit" disabled={submitting} className="mt-4 w-full">
            Envoyer mon avis
          </Button>
        </form>
      </div>
    </div>
  );
}
