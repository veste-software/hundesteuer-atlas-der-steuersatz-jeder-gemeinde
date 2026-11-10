// The single list of indexable pages. sitemap.xml is built from it, and every page that is
// noindex must stay out of it. The Builder extends this from data/ (municipality pages,
// Kreis hubs with >= 3 published municipalities, /nrw/ once it has data, /hundesteuer-2027/).
export function indexablePaths(): string[] {
  return ['/', '/methodik/'];
}
