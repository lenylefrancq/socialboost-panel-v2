import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ coupons });
}

const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discountType: z.enum(['PERCENT', 'FIXED']).default('PERCENT'),
  discountValue: z.number().positive(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const { expiresAt, ...rest } = parsed.data;
  const coupon = await prisma.coupon.create({
    data: { ...rest, expiresAt: expiresAt ? new Date(expiresAt) : undefined },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
