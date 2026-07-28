import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const services = await prisma.service.findMany({
    include: { category: true },
    orderBy: [{ categoryId: 'asc' }, { position: 'asc' }],
  });
  return NextResponse.json({ services });
}

const serviceSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().min(1),
  pricePer1000: z.number().positive(),
  minQuantity: z.number().int().positive(),
  maxQuantity: z.number().int().positive(),
  avgTimeHours: z.number().int().positive().default(24),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const service = await prisma.service.create({ data: parsed.data });
  return NextResponse.json({ service }, { status: 201 });
}
