import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      balance: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
