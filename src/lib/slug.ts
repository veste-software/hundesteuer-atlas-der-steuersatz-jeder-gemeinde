/** URL slug: lower case, German umlauts transliterated, other diacritics stripped, rest → "-". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Slug for a municipality. When the name occurs more than once in Germany the Kreis slug is appended.
 * `duplicateNames` holds the names (as written) that occur more than once.
 */
export function municipalitySlug(name: string, kreisSlug: string, duplicateNames: ReadonlySet<string> | readonly string[]): string {
  const dup = duplicateNames instanceof Set ? duplicateNames.has(name) : (duplicateNames as readonly string[]).includes(name);
  const base = slugify(name);
  return dup ? `${base}-${kreisSlug}` : base;
}
