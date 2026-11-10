// Case- and umlaut-insensitive search over municipality names (prefix matches first, then substrings).
export interface SearchEntry {
  name: string;
  slug: string;
  kreis: string;
  firstDog: number | null;
}

export function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function searchMunicipalities(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const q = fold(query);
  if (!q) return [];
  const prefix: SearchEntry[] = [];
  const inner: SearchEntry[] = [];
  for (const e of entries) {
    const n = fold(e.name);
    if (n.split(' ').some((w) => w.startsWith(q))) prefix.push(e);
    else if (n.includes(q)) inner.push(e);
  }
  const byName = (a: SearchEntry, b: SearchEntry) => a.name.localeCompare(b.name, 'de');
  return [...prefix.sort(byName), ...inner.sort(byName)].slice(0, limit);
}
