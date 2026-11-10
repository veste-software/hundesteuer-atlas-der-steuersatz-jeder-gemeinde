// Display logic for municipality pages. Pure functions, no Astro.
import type { MunicipalityRecord, Tier } from './model';
import { yearlyTotal } from './calc';
import { formatEur } from './stats';

/** "2025-01-01" → "01.01.2025"; null/invalid → null. */
export function formatDate(iso: string | null | undefined): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]}.${m[2]}.${m[1]}` : null;
}

export interface RateValidity {
  /** True when the bylaw takes effect after the build date. */
  future: boolean;
  /** "gilt ab 01.01.2027", "in Kraft seit 01.01.2025" or null when the date is unknown. */
  label: string | null;
  /** Year printed on the tag. */
  year: number;
}

export function rateValidity(inForceFrom: string | null | undefined, buildDate: Date): RateValidity {
  const formatted = formatDate(inForceFrom);
  if (!formatted || !inForceFrom) return { future: false, label: null, year: buildDate.getUTCFullYear() };
  const from = new Date(inForceFrom.slice(0, 10) + 'T00:00:00Z');
  const future = from.getTime() > buildDate.getTime();
  return {
    future,
    label: future ? `gilt ab ${formatted}` : `in Kraft seit ${formatted}`,
    year: future ? from.getUTCFullYear() : buildDate.getUTCFullYear(),
  };
}

/** The first-dog yearly rate: the nth-dog tier with n = 1, else the lowest per-dog tier. */
export function firstDogRate(tiers: Tier[]): number | null {
  const nth = tiers.find((t) => t.kind === 'nth-dog' && t.n === 1);
  if (nth) return nth.amountEur;
  const perDog = tiers.filter((t) => t.kind === 'per-dog-when-n-kept').sort((a, b) => a.n - b.n)[0];
  return perDog ? perDog.amountEur : null;
}

export interface TotalsRow {
  dogs: number;
  total: string;
}

/** Static totals for 1, 2 and 3 normal dogs, and for 1 to 3 dangerous dogs when the bylaw has such a tier. */
export function totalsRows(tiers: Tier[]) {
  const normal: TotalsRow[] = [1, 2, 3].map((dogs) => ({
    dogs,
    total: formatEur(yearlyTotal(tiers, { normal: dogs, dangerous: 0 }).normal),
  }));
  const hasDangerous = tiers.some((t) => t.kind === 'dangerous');
  const dangerous: TotalsRow[] = hasDangerous
    ? [1, 2, 3].map((dogs) => ({ dogs, total: formatEur(yearlyTotal(tiers, { normal: 0, dangerous: dogs }).dangerous) }))
    : [];
  return { normal, dangerous, hasDangerous };
}

export function isPublished(r: MunicipalityRecord): boolean {
  return r.status === 'published' && !!r.tiers?.length && !!r.bylaw;
}

/** Gate for /hundesteuer-2027/: at least `min` published records with inForceFrom >= 2027-01-01. */
export function future2027Records(records: MunicipalityRecord[], min = 5): MunicipalityRecord[] {
  const hits = records.filter((r) => isPublished(r) && (r.bylaw?.inForceFrom ?? '') >= '2027-01-01');
  return hits.length >= min ? hits : [];
}
