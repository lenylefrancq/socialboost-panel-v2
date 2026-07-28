import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Formulaire invalide.' }, { status: 400 });
  }

  // TODO: brancher un service d'envoi d'email (Resend, Postmark, SES...)
  // pour transmettre ce message à ADMIN_EMAIL.
  console.log('Nouveau message de contact:', parsed.data);

  return NextResponse.json({ success: true });
}
