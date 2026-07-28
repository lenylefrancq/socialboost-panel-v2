import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 14);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, charge: true },
  });

  const days: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    days[key] = 0;
  }

  for (const order of orders) {
    const key = new Date(order.createdAt).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
    if (key in days) days[key] += Number(order.charge);
  }

  const chart = Object.entries(days).map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }));

  return NextResponse.json({ chart });
}
