import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`,          lastModified: new Date(), priority: 1.0 },
    { url: `${base}/products`,  lastModified: new Date(), priority: 0.8 },
    { url: `${base}/technology`,lastModified: new Date(), priority: 0.8 },
    { url: `${base}/about`,     lastModified: new Date(), priority: 0.5 },
    { url: `${base}/privacy`,   lastModified: new Date(), priority: 0.3 },
    { url: `${base}/terms`,     lastModified: new Date(), priority: 0.3 },
  ];
}