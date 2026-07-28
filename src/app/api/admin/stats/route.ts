import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 });
  }

  const [userCount, orderCount, revenueAgg, pendingOrders, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { charge: true } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'PROCESSING', 'IN_PROGRESS'] } } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, service: { select: { name: true } } },
    }),
  ]);

  return NextResponse.json({
    userCount,
    orderCount,
    revenue: revenueAgg._sum.charge ?? 0,
    pendingOrders,
    recentOrders,
  });
}
