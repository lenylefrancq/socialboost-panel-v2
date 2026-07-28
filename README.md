# SocialBoost — Panel SMM

Plateforme premium de vente de services réseaux sociaux (followers, likes, vues...) pour
Instagram, TikTok, YouTube, Discord, Twitch, X et Facebook.

**Stack :** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Prisma · PostgreSQL
· NextAuth · Stripe

---

## 1. Installation

```bash
npm install
cp .env.example .env
```

Renseignez ensuite `.env` :

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connexion PostgreSQL (ex: Neon, Supabase, Vercel Postgres) |
| `NEXTAUTH_SECRET` | Générez avec `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de votre app (`http://localhost:3000` en dev) |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Clés API depuis le dashboard Stripe |
| `STRIPE_WEBHOOK_SECRET` | Depuis `stripe listen` en dev, ou la config webhook en prod |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Depuis le développeur PayPal — à connecter |
| `CRYPTO_API_KEY` | Coinbase Commerce / NOWPayments — à connecter |

## 2. Base de données

```bash
npm run db:push      # crée les tables à partir de prisma/schema.prisma
npm run db:seed      # insère les catégories/services + comptes de démo
```

Comptes créés par le seed :
- **Admin** : `admin@socialboost.com` / `Admin123!`
- **Démo** : `demo@socialboost.com` / `Demo123!` (solde de 50 €)

## 3. Lancer en local

```bash
npm run dev
```

Application disponible sur http://localhost:3000.

Pour tester les paiements Stripe en local :

```bash
stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
```

## 4. Déploiement sur Vercel

1. Poussez ce projet sur un dépôt Git (GitHub/GitLab/Bitbucket).
2. Importez-le sur vercel.com/new.
3. Renseignez toutes les variables d'environnement de `.env.example` dans
   **Project Settings → Environment Variables**.
4. Provisionnez une base PostgreSQL managée (Neon, Supabase, Vercel Postgres)
   et renseignez `DATABASE_URL`.
5. Après le premier déploiement, lancez `npm run db:push` (ou intégrez-le à
   votre commande de build : `prisma generate && prisma db push && next build`).
6. Configurez le webhook Stripe en production vers
   `https://votre-domaine.com/api/payments/stripe/webhook` et copiez le
   secret dans `STRIPE_WEBHOOK_SECRET`.

## 5. Finaliser PayPal et Crypto

Les routes `src/app/api/payments/paypal/route.ts` et
`src/app/api/payments/crypto/route.ts` sont des squelettes commentés, prêts à
être connectés au SDK officiel du fournisseur choisi (PayPal Orders API v2,
Coinbase Commerce ou NOWPayments). Le flux Stripe sert d'exemple de référence
pour la logique de webhook → crédit du solde / validation de commande.

## 6. Structure du projet

```
src/
  app/                 Pages et routes API (App Router)
    dashboard/         Espace utilisateur (protégé)
    admin/              Espace administrateur (protégé, rôle ADMIN)
    api/                 Routes API REST
  components/           Composants réutilisables (ui, layout, shop, dashboard, admin, home)
  context/               Store panier (Zustand) + thème clair/sombre
  data/catalog.ts        Catalogue de démonstration (aligné avec le seed Prisma)
  lib/                    Prisma client, NextAuth config, Stripe, utils
prisma/
  schema.prisma          Modèle de données complet
  seed.ts                Données de démonstration
```

## 7. Sécurité — points d'attention avant mise en production

- Les routes admin vérifient le rôle côté serveur (API) **et** via
  `middleware.ts` — ne retirez pas cette double vérification.
- Le panier utilise le catalogue statique côté client pour l'affichage :
  **validez systématiquement les prix côté serveur** contre la table
  `Service` avant tout paiement réel (voir le commentaire dans
  `src/app/api/orders/route.ts`).
- Activez le rate-limiting sur `/api/register` et `/api/contact` en
  production (ex: Vercel Firewall, Upstash Ratelimit).
- Ne committez jamais votre fichier `.env`.
