import { NextResponse } from 'next/server';

/**
 * Intégration PayPal — squelette prêt à connecter.
 *
 * Pour activer réellement PayPal :
 * 1. Créez une app sur https://developer.paypal.com
 * 2. Renseignez PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET dans .env
 * 3. Utilisez le SDK officiel (@paypal/checkout-server-sdk) pour créer une
 *    commande PayPal (Orders API v2), puis capturez le paiement côté
 *    /api/payments/paypal/capture après retour de l'utilisateur.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get('amount');
  const purpose = searchParams.get('purpose') ?? 'order';

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      {
        error:
          'PayPal n’est pas configuré. Ajoutez PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET dans .env pour activer ce moyen de paiement.',
      },
      { status: 503 }
    );
  }

  // TODO: créer une commande PayPal réelle via le SDK officiel et
  // rediriger vers l'URL d'approbation retournée par PayPal.
  return NextResponse.json({
    message: `Créez ici la commande PayPal (Orders API) pour ${amount} € (${purpose}).`,
  });
}
