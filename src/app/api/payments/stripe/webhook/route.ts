import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Signature Stripe manquante.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erreur de vérification du webhook Stripe:', err);
    return NextResponse.json({ error: 'Webhook invalide.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const orderPayload = session.metadata?.orderPayload;
    const fundsAmount = session.metadata?.fundsAmount;

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    // Cas 1 : recharge de solde
    if (fundsAmount) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: Number(fundsAmount) } },
        }),
        prisma.transaction.create({
          data: {
            userId,
            amount: Number(fundsAmount),
            provider: 'STRIPE',
            status: 'COMPLETED',
            reference: session.id,
          },
        }),
      ]);
    }

    // Cas 2 : paiement direct d'une commande boutique
    if (orderPayload) {
      const items = JSON.parse(orderPayload) as {
        serviceId: string;
        link: string;
        quantity: number;
        charge: number;
      }[];

      await prisma.$transaction(
        items.map((item) =>
          prisma.order.create({
            data: {
              userId,
              serviceId: item.serviceId,
              link: item.link,
              quantity: item.quantity,
              charge: item.charge,
              status: 'PENDING',
          },
        })
      )
      );
    }
  }

  return NextResponse.json({ received: true });
}
