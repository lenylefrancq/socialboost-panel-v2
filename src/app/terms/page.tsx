export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-50">Conditions d'utilisation</h1>
      <p className="mt-2 text-sm text-ink-500">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

      <div className="prose-legal mt-8 space-y-8 text-sm leading-relaxed text-ink-300">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">1. Objet</h2>
          <p className="mt-2">
            Les présentes conditions régissent l'utilisation de la plateforme SocialBoost, qui
            propose des services de croissance pour réseaux sociaux (followers, likes, vues,
            commentaires et services associés) sur Instagram, TikTok, YouTube, Discord, Twitch,
            X et Facebook.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">2. Compte utilisateur</h2>
          <p className="mt-2">
            L'utilisateur est responsable de la confidentialité de ses identifiants et de
            l'exactitude des informations fournies lors de l'inscription. Un seul compte est
            autorisé par personne physique ou morale.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">3. Commandes et livraison</h2>
          <p className="mt-2">
            Les délais de livraison affichés sont des estimations moyennes et ne constituent pas
            un engagement contractuel ferme. SocialBoost ne demande jamais de mot de passe pour
            exécuter une commande, uniquement un lien public.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">4. Paiement</h2>
          <p className="mt-2">
            Les paiements sont traités par des prestataires tiers certifiés (Stripe, PayPal,
            prestataires crypto). SocialBoost ne stocke aucune donnée bancaire.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">5. Remboursements</h2>
          <p className="mt-2">
            En cas d'échec total ou partiel d'une commande imputable à SocialBoost, le montant
            correspondant est recrédité sur le solde du compte utilisateur.
        </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">6. Usage interdit</h2>
          <p className="mt-2">
            Il est interdit d'utiliser la plateforme à des fins illégales, frauduleuses ou
            contraires aux conditions d'utilisation des plateformes tierces concernées.
        </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">7. Limitation de responsabilité</h2>
          <p className="mt-2">
            SocialBoost ne saurait être tenu responsable des sanctions appliquées par les
            plateformes tierces (Instagram, TikTok, etc.) suite à l'utilisation de nos services.
        </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">8. Modification des conditions</h2>
          <p className="mt-2">
            SocialBoost se réserve le droit de modifier les présentes conditions à tout moment.
            Les utilisateurs seront informés de tout changement substantiel.
        </p>
        </section>
      </div>
    </div>
  );
}
