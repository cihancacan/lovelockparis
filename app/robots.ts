import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard'], // On cache l'admin et le dashboard à Google
    },
    sitemap: 'https://lovelockparis.com/sitemap.xml',
  };
}
