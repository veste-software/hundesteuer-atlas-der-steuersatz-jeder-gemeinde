import { describe, expect, it } from 'vitest';
import { cheapest, compareToKreis, kreisMedian, median, mostExpensive, neighbours, summary, type RatePoint } from '../src/lib/stats';

const p = (slug: string, firstDog: number, kreisSlug = 'k1'): RatePoint => ({ slug, name: slug, kreisSlug, firstDog });
const data = [p('a', 60), p('b', 72), p('c', 90), p('d', 48, 'k2')];

describe('stats', () => {
  it('median handles odd, even and empty', () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBeNull();
  });
  it('summary gives min, median, max', () => {
    expect(summary(data)).toEqual({ count: 4, min: 48, median: 66, max: 90 });
  });
  it('orders cheapest and most expensive', () => {
    expect(cheapest(data, 2).map((x) => x.slug)).toEqual(['d', 'a']);
    expect(mostExpensive(data, 2).map((x) => x.slug)).toEqual(['c', 'b']);
  });
  it('Kreis median and phrasing', () => {
    expect(kreisMedian(data, 'k1')).toBe(72);
    expect(compareToKreis(84, 72)).toBe('12 € teurer als der Kreisschnitt (72 €)');
    expect(compareToKreis(60, 72)).toBe('12 € günstiger als der Kreisschnitt (72 €)');
    expect(compareToKreis(72, 72)).toContain('entspricht');
  });
  it('neighbours are same-Kreis only, with differences', () => {
    const n = neighbours(data, data[1]);
    expect(n.map((x) => [x.slug, x.diff])).toEqual([['a', -12], ['c', 18]]);
  });
});
