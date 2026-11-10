import { describe, expect, it } from 'vitest';
import { yearlyTotal } from '../src/lib/calc';
import type { Tier } from '../src/lib/model';

const nth: Tier[] = [
  { label: 'für den ersten Hund', kind: 'nth-dog', n: 1, amountEur: 60 },
  { label: 'für den zweiten Hund', kind: 'nth-dog', n: 2, amountEur: 70 },
  { label: 'für den dritten und jeden weiteren Hund', kind: 'nth-dog', n: 3, amountEur: 80 },
  { label: 'gefährlicher Hund', kind: 'dangerous', n: 1, amountEur: 600 },
];

const perDog: Tier[] = [
  { label: 'ein Hund', kind: 'per-dog-when-n-kept', n: 1, amountEur: 72 },
  { label: 'zwei Hunde, je Hund', kind: 'per-dog-when-n-kept', n: 2, amountEur: 90 },
  { label: 'gefährlicher Hund', kind: 'dangerous', n: 1, amountEur: 600 },
];

describe('yearlyTotal', () => {
  it('sums nth-dog tiers: 60/70/80 with 3 dogs = 210', () => {
    expect(yearlyTotal(nth, { normal: 3, dangerous: 0 }).normal).toBe(210);
  });
  it('applies "third and further" to dogs 4 and 5', () => {
    expect(yearlyTotal(nth, { normal: 4, dangerous: 0 }).normal).toBe(290);
    expect(yearlyTotal(nth, { normal: 5, dangerous: 0 }).normal).toBe(370);
  });
  it('per-dog-when-n-kept: 90 each with 2 dogs = 180', () => {
    expect(yearlyTotal(perDog, { normal: 2, dangerous: 0 }).normal).toBe(180);
    expect(yearlyTotal(perDog, { normal: 1, dangerous: 0 }).normal).toBe(72);
  });
  it('zero dangerous dogs cost 0, dangerous dogs are multiplied', () => {
    expect(yearlyTotal(nth, { normal: 1, dangerous: 0 }).dangerous).toBe(0);
    expect(yearlyTotal(nth, { normal: 0, dangerous: 2 }).dangerous).toBe(1200);
  });
  it('flags mixed holdings and keeps separate totals', () => {
    const t = yearlyTotal(nth, { normal: 1, dangerous: 1 });
    expect(t.mixedUndefined).toBe(true);
    expect(t.normal).toBe(60);
    expect(t.dangerous).toBe(600);
    expect(yearlyTotal(nth, { normal: 2, dangerous: 0 }).mixedUndefined).toBe(false);
  });
});
