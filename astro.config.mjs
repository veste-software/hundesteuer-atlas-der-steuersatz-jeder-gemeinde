// @ts-check
import { defineConfig } from 'astro/config';

// Previews live under https://<owner>.github.io/<repo>/, so the Pages workflow sets
// SITE_URL and SITE_BASE. A local build without them uses base "/".
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // sitemap.xml and robots.txt are our own endpoints in src/pages, so they can
  // list exactly the indexable pages computed from data/.
});
