import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

const fundsSchema = z.object({
  amount: z.number().min(5, 'Le montant minimum est de 5 €.').max(5000, 'Le montant maximum est de 5000 €.'),
  provider: z.enum(['STRIPE', 'PAYPAL', 'CRYPTO']),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = fundsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Montant invalide.' },
      { status: 400 }
    );
  }

  const { amount, provider } = parsed.data;
  const userId = (session.user as any).id as string;

  if (provider === 'STRIPE') {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe n’est pas configuré (STRIPE_SECRET_KEY manquant).' },
        { status: 503 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(amount * 100),
            product_data: { name: `Recharge de solde SocialBoost` },
          },
        },
      ],
      metadata: { userId, fundsAmount: String(amount) },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?funds=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/funds?cancelled=1`,
    });

    return NextResponse.json({ redirectUrl: checkoutSession.url });
  }

  // PayPal et Crypto : redirige vers l'endpoint fournisseur dédié.
  return NextResponse.json({
    redirectUrl: `/api/payments/${provider.toLowerCase()}?amount=${amount}&purpose=funds`,
  });
}
