import type { MunicipalityRecord } from './model';
import { future2027Records, isPublished } from './page';

/** Kreis hubs need at least this many published municipalities to be indexable. */
export const MIN_KREIS_PUBLISHED = 3;

export function kreisIndexable(records: MunicipalityRecord[], kreisSlug: string): boolean {
  return records.filter((r) => isPublished(r) && r.kreisSlug === kreisSlug).length >= MIN_KREIS_PUBLISHED;
}

// The single list of indexable pages. sitemap.xml is built from it, and every page that is
// noindex must stay out of it. `records` are all records from data/nw/.
export function indexablePaths(records: MunicipalityRecord[] = []): string[] {
  const published = records.filter(isPublished);
  const paths = ['/', '/methodik/'];
  for (const r of published) paths.push(`/hundesteuer/${r.slug}/`);
  for (const k of [...new Set(published.map((r) => r.kreisSlug))].sort()) {
    if (kreisIndexable(records, k)) paths.push(`/nrw/${k}/`);
  }
  if (future2027Records(records).length > 0) paths.push('/hundesteuer-2027/');
  return paths;
}
