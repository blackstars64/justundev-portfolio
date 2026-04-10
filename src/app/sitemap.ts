// =============================================================================
// src/app/sitemap.ts — sitemap.xml automatique
// =============================================================================

import { MetadataRoute } from 'next';
import { projets } from '@/data/projets';

const BASE_URL = 'https://www.justundev.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const projetUrls = projets.map((p) => ({
    url: `${BASE_URL}/projets/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/projets`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/stack`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/dataviz`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${BASE_URL}/calendrier`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    ...projetUrls,
  ];
}
