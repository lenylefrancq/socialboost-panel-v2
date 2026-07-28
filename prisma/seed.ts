import { PrismaClient, Platform } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATALOG: Record<
  Platform,
  { category: string; icon: string; services: { name: string; price: number; min: number; max: number }[] }[]
> = {
  INSTAGRAM: [
    {
      category: 'Followers',
      icon: 'users',
      services: [
        { name: 'Followers Instagram - Qualité Haute', price: 2.5, min: 100, max: 100000 },
        { name: 'Followers Instagram - Qualité Premium (Actifs)', price: 5.9, min: 50, max: 50000 },
      ],
    },
    {
      category: 'Likes',
      icon: 'heart',
      services: [
        { name: 'Likes Instagram - Rapide', price: 0.9, min: 50, max: 20000 },
        { name: 'Likes Instagram - Comptes Réels', price: 1.8, min: 50, max: 10000 },
      ],
    },
    {
      category: 'Views',
      icon: 'eye',
      services: [{ name: 'Vues Instagram (Vidéo/Post)', price: 0.3, min: 100, max: 1000000 }],
    },
    {
      category: 'Comments',
      icon: 'message-circle',
      services: [{ name: 'Commentaires Instagram Personnalisés', price: 8.0, min: 10, max: 2000 }],
    },
    {
      category: 'Story Views',
      icon: 'circle-play',
      services: [{ name: 'Vues Story Instagram', price: 0.4, min: 100, max: 50000 }],
    },
    {
      category: 'Reel Views',
      icon: 'clapperboard',
      services: [{ name: 'Vues Reels Instagram', price: 0.35, min: 100, max: 1000000 }],
    },
  ],
  TIKTOK: [
    { category: 'Followers', icon: 'users', services: [{ name: 'Followers TikTok', price: 3.2, min: 100, max: 100000 }] },
    { category: 'Likes', icon: 'heart', services: [{ name: 'Likes TikTok', price: 1.1, min: 50, max: 50000 }] },
    { category: 'Views', icon: 'eye', services: [{ name: 'Vues TikTok', price: 0.15, min: 100, max: 5000000 }] },
    { category: 'Comments', icon: 'message-circle', services: [{ name: 'Commentaires TikTok', price: 9.0, min: 10, max: 1000 }] },
    { category: 'Shares', icon: 'share-2', services: [{ name: 'Partages TikTok', price: 1.5, min: 50, max: 20000 }] },
  ],
  YOUTUBE: [
    { category: 'Subscribers', icon: 'users', services: [{ name: 'Abonnés YouTube', price: 12.0, min: 50, max: 20000 }] },
    { category: 'Views', icon: 'eye', services: [{ name: 'Vues YouTube', price: 1.2, min: 500, max: 1000000 }] },
    { category: 'Likes', icon: 'heart', services: [{ name: 'Likes YouTube', price: 2.5, min: 50, max: 10000 }] },
    { category: 'Watch Time', icon: 'clock', services: [{ name: "Heures de visionnage YouTube", price: 25.0, min: 500, max: 4000 }] },
  ],
  DISCORD: [
    { category: 'Members', icon: 'users', services: [{ name: 'Membres Discord', price: 4.0, min: 50, max: 50000 }] },
    { category: 'Online Members', icon: 'circle', services: [{ name: 'Membres en ligne Discord', price: 6.0, min: 50, max: 10000 }] },
  ],
  TWITCH: [
    { category: 'Followers', icon: 'users', services: [{ name: 'Followers Twitch', price: 5.0, min: 50, max: 20000 }] },
    { category: 'Views', icon: 'eye', services: [{ name: 'Vues Twitch (VOD)', price: 1.0, min: 100, max: 100000 }] },
    { category: 'Live Viewers', icon: 'radio', services: [{ name: 'Viewers Live Twitch (30 min)', price: 15.0, min: 10, max: 500 }] },
  ],
  X: [
    { category: 'Followers', icon: 'users', services: [{ name: 'Followers X (Twitter)', price: 6.5, min: 50, max: 50000 }] },
    { category: 'Likes', icon: 'heart', services: [{ name: 'Likes X (Twitter)', price: 1.4, min: 50, max: 20000 }] },
    { category: 'Retweets', icon: 'repeat', services: [{ name: 'Retweets X', price: 2.2, min: 20, max: 10000 }] },
  ],
  FACEBOOK: [
    { category: 'Page Likes', icon: 'thumbs-up', services: [{ name: 'Likes Page Facebook', price: 3.5, min: 100, max: 50000 }] },
    { category: 'Followers', icon: 'users', services: [{ name: 'Followers Facebook', price: 3.0, min: 100, max: 50000 }] },
    { category: 'Post Likes', icon: 'heart', services: [{ name: 'Likes Publication Facebook', price: 1.6, min: 50, max: 20000 }] },
    { category: 'Views', icon: 'eye', services: [{ name: 'Vues Vidéo Facebook', price: 0.4, min: 100, max: 1000000 }] },
  ],
};

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@socialboost.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@socialboost.com',
      password: adminPassword,
      role: 'ADMIN',
      balance: 0,
    },
  });

  const demoPassword = await bcrypt.hash('Demo123!', 10);
  await prisma.user.upsert({
    where: { email: 'demo@socialboost.com' },
    update: {},
    create: {
      name: 'Client Demo',
      email: 'demo@socialboost.com',
      password: demoPassword,
      role: 'USER',
      balance: 50,
    },
  });

  let categoryPosition = 0;
  for (const [platform, categories] of Object.entries(CATALOG)) {
    for (const cat of categories) {
      categoryPosition += 1;
      const slug = `${platform.toLowerCase()}-${cat.category.toLowerCase().replace(/\s+/g, '-')}`;
      const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: cat.category,
          slug,
          platform: platform as Platform,
          icon: cat.icon,
          position: categoryPosition,
        },
      });

      let servicePosition = 0;
      for (const svc of cat.services) {
        servicePosition += 1;
        await prisma.service.create({
          data: {
            name: svc.name,
            categoryId: category.id,
            pricePer1000: svc.price,
            minQuantity: svc.min,
            maxQuantity: svc.max,
            position: servicePosition,
            avgTimeHours: 24,
          },
        });
      }
    }
  }

  console.log('Seeding terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
