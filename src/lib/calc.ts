import type { Tier } from './model';

export interface Holding {
  /** Normal dogs kept (not dangerous). */
  normal: number;
  /** Dangerous dogs kept. */
  dangerous: number;
}

export interface YearlyTotal {
  normal: number;
  dangerous: number;
  /** normal + dangerous, only meaningful when `mixedUndefined` is false or one part is 0. */
  sum: number;
  /** True when both kinds are kept and the bylaw does not say how they are counted together. */
  mixedUndefined: boolean;
}

/** Amount for the n-th normal dog (1-based) under nth-dog tiers: the tier with the highest n <= dog. */
function nthDogAmount(tiers: Tier[], dog: number): number {
  const nth = tiers.filter((t) => t.kind === 'nth-dog').sort((a, b) => a.n - b.n);
  let amount = 0;
  for (const t of nth) if (t.n <= dog) amount = t.amountEur;
  return amount;
}

/** Normal dogs: per-dog-when-n-kept tiers apply to every dog once n dogs are kept. */
function normalTotal(tiers: Tier[], count: number): number {
  if (count <= 0) return 0;
  const perDog = tiers.filter((t) => t.kind === 'per-dog-when-n-kept').sort((a, b) => a.n - b.n);
  if (perDog.length > 0) {
    let rate = 0;
    for (const t of perDog) if (t.n <= count) rate = t.amountEur;
    // Fall back to the nth-dog tier for a first dog if no per-dog tier covers this count.
    if (rate === 0) rate = nthDogAmount(tiers, 1);
    return rate * count;
  }
  let sum = 0;
  for (let dog = 1; dog <= count; dog++) sum += nthDogAmount(tiers, dog);
  return sum;
}

function dangerousTotal(tiers: Tier[], count: number): number {
  if (count <= 0) return 0;
  const d = tiers.find((t) => t.kind === 'dangerous');
  return d ? d.amountEur * count : 0;
}

export function yearlyTotal(tiers: Tier[], holding: Holding): YearlyTotal {
  const normal = normalTotal(tiers, holding.normal);
  const dangerous = dangerousTotal(tiers, holding.dangerous);
  return {
    normal,
    dangerous,
    sum: normal + dangerous,
    // No bylaw field records mixed counting, so any mixed holding is flagged.
    mixedUndefined: holding.normal > 0 && holding.dangerous > 0,
  };
}
