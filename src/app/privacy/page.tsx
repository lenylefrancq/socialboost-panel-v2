export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-50">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-ink-500">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-300">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">1. Données collectées</h2>
          <p className="mt-2">
            Nous collectons votre nom, adresse email, historique de commandes et informations de
            facturation nécessaires à la fourniture du service. Aucune donnée bancaire n'est
            stockée sur nos serveurs — elle transite directement chez nos prestataires de
            paiement certifiés (Stripe, PayPal).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">2. Finalité du traitement</h2>
          <p className="mt-2">
            Vos données sont utilisées pour exécuter vos commandes, gérer votre compte, assurer
            le support client et vous informer de l'état de vos commandes (notifications).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">3. Conservation des données</h2>
          <p className="mt-2">
            Vos données sont conservées pendant la durée de votre relation avec SocialBoost, puis
            archivées ou supprimées conformément aux obligations légales applicables.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">4. Vos droits</h2>
          <p className="mt-2">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de
            suppression et de portabilité de vos données. Contactez-nous à
            privacy@socialboost.com pour exercer ces droits.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">5. Partage avec des tiers</h2>
          <p className="mt-2">
            Nous ne vendons jamais vos données. Elles peuvent être partagées avec nos prestataires
            techniques (hébergement, paiement) strictement nécessaires au fonctionnement du
            service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">6. Cookies</h2>
          <p className="mt-2">
            Nous utilisons des cookies essentiels au fonctionnement du site (session, panier,
            préférence de thème) et, avec votre consentement, des cookies de mesure d'audience.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-50">7. Sécurité</h2>
          <p className="mt-2">
            Les mots de passe sont chiffrés (hachage bcrypt) et l'ensemble des échanges est
            sécurisé via HTTPS/TLS.
          </p>
        </section>
      </div>
    </div>
  );
}
