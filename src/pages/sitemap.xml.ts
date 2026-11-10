import type { APIRoute } from 'astro';
import { allRecords } from '../lib/data';
import { indexablePaths } from '../lib/indexable';
import { absoluteUrl } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const urls = indexablePaths(allRecords())
    .map((p) => `  <url><loc>${absoluteUrl(p, origin, import.meta.env.BASE_URL)}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
