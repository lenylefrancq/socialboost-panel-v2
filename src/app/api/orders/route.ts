import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const orderItemSchema = z.object({
  serviceId: z.string().min(1),
  serviceName: z.string().min(1),
  link: z.string().url('Lien invalide.'),
  quantity: z.number().int().positive(),
  charge: z.number().positive(),
});

const checkoutSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Le panier est vide.'),
  provider: z.enum(['STRIPE', 'PAYPAL', 'CRYPTO', 'BALANCE']),
  couponCode: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { service: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Connectez-vous pour commander.' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const { items, provider, couponCode } = parsed.data;
  const userId = (session.user as any).id as string;
  const totalAmount = items.reduce((sum, i) => sum + i.charge, 0);

  // Note: dans ce scaffold, les services proviennent du catalogue statique
  // (src/data/catalog.ts). En production, valider serviceId contre la table `Service`
  // en base de données pour éviter toute falsification du prix côté client.

  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: 'Code promo invalide ou expiré.' }, { status: 400 });
    }
  }

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
      line_items: items.map((i) => ({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(i.charge * 100),
          product_data: { name: `${i.serviceName} (x${i.quantity})` },
        },
      })),
      metadata: { userId, orderPayload: JSON.stringify(items) },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=1`,
    });

    return NextResponse.json({ redirectUrl: checkoutSession.url });
  }

  if (provider === 'BALANCE') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || Number(user.balance) < totalAmount) {
      return NextResponse.json({ error: 'Solde insuffisant.' }, { status: 400 });
    }

    const orders = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalAmount } },
      });

      const created = [];
      for (const item of items) {
        const order = await tx.order.create({
          data: {
            userId,
            serviceId: item.serviceId,
            link: item.link,
            quantity: item.quantity,
            charge: item.charge,
            status: 'PENDING',
            couponId: coupon?.id,
          },
        });
        created.push(order);
      }
      return created;
    });

    return NextResponse.json({ orders });
  }

  // PAYPAL / CRYPTO : le paiement est confirmé côté fournisseur puis via webhook.
  // Ici on route vers l'endpoint dédié qui initialise la transaction.
  return NextResponse.json(
    {
      redirectUrl: `/api/payments/${provider.toLowerCase()}?amount=${totalAmount}`,
    },
    { status: 202 }
  );
}
