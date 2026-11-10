import { describe, expect, it } from 'vitest';
import { firstDogRate, formatDate, future2027Records, rateValidity, totalsRows } from '../src/lib/page';
import { indexablePaths } from '../src/lib/indexable';
import type { MunicipalityRecord, Tier } from '../src/lib/model';

const nth: Tier[] = [
  { label: 'erster Hund', kind: 'nth-dog', n: 1, amountEur: 60 },
  { label: 'zweiter Hund', kind: 'nth-dog', n: 2, amountEur: 70 },
  { label: 'dritter Hund', kind: 'nth-dog', n: 3, amountEur: 80 },
  { label: 'gefährlicher Hund', kind: 'dangerous', n: 1, amountEur: 600 },
];

const rec = (slug: string, kreisSlug: string, inForceFrom: string | null, status: MunicipalityRecord['status'] = 'published'): MunicipalityRecord => ({
  ags: '05000000', name: slug, slug, kreis: kreisSlug, kreisSlug, population: null, website: null, status,
  tiers: nth,
  bylaw: { url: 'https://example.org/s.pdf', title: 't', date: null, inForceFrom, retrievedAt: '2026-11-01', sha256: 'x', format: 'pdf' },
});

describe('page logic', () => {
  it('formats dates', () => {
    expect(formatDate('2027-01-01')).toBe('01.01.2027');
    expect(formatDate(null)).toBeNull();
  });
  it('AC 10: a 2027 bylaw built in 2026 is labelled "gilt ab 01.01.2027"', () => {
    const v = rateValidity('2027-01-01', new Date('2026-11-10T00:00:00Z'));
    expect(v).toEqual({ future: true, label: 'gilt ab 01.01.2027', year: 2027 });
    expect(rateValidity('2025-01-01', new Date('2026-11-10T00:00:00Z')).future).toBe(false);
  });
  it('first-dog rate and static totals', () => {
    expect(firstDogRate(nth)).toBe(60);
    const t = totalsRows(nth);
    expect(t.normal.map((r) => r.total.replace(/\s/g, ' '))).toEqual(['60 €', '130 €', '210 €']);
    expect(t.dangerous[0].total.replace(/\s/g, ' ')).toBe('600 €');
  });
  it('AC 11: the 2027 page needs 5 published municipalities', () => {
    const mk = (n: number) => Array.from({ length: n }, (_, i) => rec(`g${i}`, 'k', '2027-01-01'));
    expect(future2027Records(mk(4))).toHaveLength(0);
    expect(future2027Records(mk(5))).toHaveLength(5);
    expect(indexablePaths(mk(5))).toContain('/hundesteuer-2027/');
    expect(indexablePaths(mk(4))).not.toContain('/hundesteuer-2027/');
  });
  it('AC 7: only published records and Kreis hubs with 3+ are indexable', () => {
    const recs = [rec('a', 'k1', null), rec('b', 'k1', null), rec('c', 'k2', null), rec('d', 'k1', null, 'not-found')];
    const p = indexablePaths(recs);
    expect(p).toContain('/hundesteuer/a/');
    expect(p).not.toContain('/hundesteuer/d/');
    expect(p).not.toContain('/nrw/k1/');
    expect(indexablePaths([...recs, rec('e', 'k1', null)])).toContain('/nrw/k1/');
  });
});
