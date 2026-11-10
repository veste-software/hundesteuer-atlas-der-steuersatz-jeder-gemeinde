// Statistics over published first-dog rates. Pure functions, no Astro.

export interface RatePoint {
  slug: string;
  name: string;
  kreisSlug: string;
  /** First-dog yearly rate in EUR. */
  firstDog: number;
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function summary(points: RatePoint[]) {
  const rates = points.map((p) => p.firstDog);
  return {
    count: points.length,
    min: rates.length ? Math.min(...rates) : null,
    median: median(rates),
    max: rates.length ? Math.max(...rates) : null,
  };
}

const byRate = (a: RatePoint, b: RatePoint) => a.firstDog - b.firstDog || a.name.localeCompare(b.name, 'de');

export function cheapest(points: RatePoint[], n = 10): RatePoint[] {
  return [...points].sort(byRate).slice(0, n);
}

export function mostExpensive(points: RatePoint[], n = 10): RatePoint[] {
  return [...points].sort((a, b) => byRate(b, a) || a.name.localeCompare(b.name, 'de')).slice(0, n);
}

export function kreisMedian(points: RatePoint[], kreisSlug: string): number | null {
  return median(points.filter((p) => p.kreisSlug === kreisSlug).map((p) => p.firstDog));
}

export function formatEur(amount: number): string {
  const hasCents = Math.abs(amount - Math.round(amount)) > 1e-9;
  return amount.toLocaleString('de-DE', { minimumFractionDigits: hasCents ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
}

/** "12 € teurer als der Kreisschnitt (60 €)", or "entspricht dem Kreisschnitt". */
export function compareToKreis(rate: number, kreisMed: number | null): string {
  if (kreisMed === null) return 'Kein Kreisschnitt verfügbar';
  const diff = Math.round((rate - kreisMed) * 100) / 100;
  if (diff === 0) return `entspricht dem Kreisschnitt (${formatEur(kreisMed)})`;
  const word = diff > 0 ? 'teurer' : 'günstiger';
  return `${formatEur(Math.abs(diff))} ${word} als der Kreisschnitt (${formatEur(kreisMed)})`;
}

/** Neighbours: other published municipalities in the same Kreis, cheapest first, with difference to `self`. */
export function neighbours(points: RatePoint[], self: RatePoint) {
  return points
    .filter((p) => p.kreisSlug === self.kreisSlug && p.slug !== self.slug)
    .sort(byRate)
    .map((p) => ({ ...p, diff: p.firstDog - self.firstDog }));
}
