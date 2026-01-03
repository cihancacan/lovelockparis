import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lovelockparis.com';

  // 1. Liste de tes langues
  const locales = ['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar'];

  // 2. Liste de TOUTES les pages (ajout de Concept et About)
  const pages = [
    // --- PAGES PRINCIPALES (Haute Priorité) ---
    { route: '', priority: 1.0, freq: 'daily' },           // Accueil
    { route: '/purchase', priority: 0.9, freq: 'daily' },  // Achat (Money Page)
    { route: '/concept', priority: 0.9, freq: 'monthly' }, // Explication du concept (TRES IMPORTANT)
    { route: '/bridge', priority: 0.8, freq: 'weekly' },   // Le Pont 3D
    { route: '/ar-view', priority: 0.8, freq: 'monthly' }, // Réalité Augmentée
    { route: '/about', priority: 0.7, freq: 'monthly' },   // Histoire / À propos

    // --- PAGES LÉGALES (Priorité Moyenne - Confiance) ---
    { route: '/terms', priority: 0.5, freq: 'yearly' },
    { route: '/privacy', priority: 0.5, freq: 'yearly' },
    { route: '/legal', priority: 0.5, freq: 'yearly' },
    { route: '/refund', priority: 0.5, freq: 'yearly' },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // 3. Génération des URLs pour chaque langue
  pages.forEach((page) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page.route}`,
        lastModified: new Date(),
        changeFrequency: page.freq as any,
        priority: page.priority,
      });
    });
  });

  // 4. Ajouter la racine (sans locale)
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  return sitemap;
}
