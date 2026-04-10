// =============================================================================
// src/app/robots.ts — robots.txt automatique
// =============================================================================

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://www.justundev.fr/sitemap.xml',
  };
}
