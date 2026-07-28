import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(500),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Connectez-vous pour laisser un avis.' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Avis invalide.' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      userId: (session.user as any).id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ reviews });
}
