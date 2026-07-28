import { NextResponse } from 'next/server';

/**
 * Intégration Crypto — squelette prêt à connecter.
 *
 * Recommandé : Coinbase Commerce ou NOWPayments (API REST simple, webhooks
 * de confirmation). Étapes :
 * 1. Créez un compte marchand et récupérez une clé API.
 * 2. Renseignez CRYPTO_API_KEY / CRYPTO_WEBHOOK_SECRET dans .env
 * 3. Créez une "charge" via leur API avec le montant en EUR, redirigez
 *    l'utilisateur vers l'URL de paiement hébergée retournée.
 * 4. Sur le webhook de confirmation, créditez le solde ou validez la
 *    commande (voir /api/payments/stripe/webhook pour un exemple de logique).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get('amount');
  const purpose = searchParams.get('purpose') ?? 'order';

  if (!process.env.CRYPTO_API_KEY) {
    return NextResponse.json(
      {
        error:
          'Le paiement Crypto n’est pas configuré. Ajoutez CRYPTO_API_KEY dans .env pour l’activer.',
      },
      { status: 503 }
    );
  }

  // TODO: créer une "charge" via l'API du fournisseur crypto choisi et
  // rediriger vers l'URL de paiement hébergée retournée.
  return NextResponse.json({
    message: `Créez ici la charge crypto pour ${amount} € (${purpose}).`,
  });
}
