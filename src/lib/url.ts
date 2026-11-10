// Every internal link, asset path and sitemap entry goes through these helpers,
// so the site works at "/" (custom domain) and under "/<repo>/" (GitHub Pages preview).

/** Normalise a base like "", "/", "/preview" or "/preview/" to "/" or "/preview/". */
export function normaliseBase(base: string | undefined): string {
  const trimmed = (base ?? '/').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

/**
 * Prefix a site-internal path with the base path.
 * withBase('/nrw/', '/preview') === '/preview/nrw/'
 */
export function withBase(path: string, base: string = import.meta.env?.BASE_URL ?? '/'): string {
  const b = normaliseBase(base);
  const p = path.replace(/^\/+/, '');
  return b + p;
}

/** Absolute URL for canonical tags and the sitemap: SITE_URL + SITE_BASE + path. */
export function absoluteUrl(path: string, site: string | URL, base?: string): string {
  const origin = new URL(String(site)).origin;
  return origin + withBase(path, base);
}
