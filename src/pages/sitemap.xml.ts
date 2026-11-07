import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';
import { tourPackageRepository } from '../lib/db/repositories/tour-packages.js';
import { cyclingGuideRepository } from '../lib/db/repositories/cycling-guides.js';
import { fallbackCyclingGuides } from '../data/fallback-cycling-guides.ts';

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/packages', changefreq: 'weekly', priority: '0.9' },
  { path: '/guides', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/book', changefreq: 'monthly', priority: '0.6' },
];

const toDate = (value: unknown) =>
  value ? new Date(value as string).toISOString().split('T')[0] : undefined;

export const GET: APIRoute = async () => {
  const urls: { path: string; changefreq: string; priority: string; lastmod?: string }[] = [
    ...staticPages,
  ];

  try {
    const { packages } = await tourPackageRepository.findMany({ limit: 500 });
    packages.forEach((pkg) =>
      urls.push({
        path: `/packages/${pkg.slug}`,
        changefreq: 'weekly',
        priority: '0.9',
        lastmod: toDate((pkg as any).updatedAt),
      })
    );
  } catch (error) {
    console.error('Sitemap: failed to load packages:', error);
  }

  // The guides listing falls back to built-in guides when none are published, so mirror that here
  let guides: { slug: string; updatedAt?: unknown }[] = [];
  try {
    guides = await cyclingGuideRepository.findMany();
  } catch (error) {
    console.error('Sitemap: failed to load guides:', error);
  }
  if (guides.length === 0) {
    guides = fallbackCyclingGuides as { slug: string }[];
  }
  guides.forEach((guide) =>
    urls.push({
      path: `/guides/${guide.slug}`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: toDate(guide.updatedAt),
    })
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.path}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
