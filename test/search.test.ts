import { describe, expect, it } from 'vitest';
import { fold, searchMunicipalities, type SearchEntry } from '../src/lib/search';

const data: SearchEntry[] = [
  { name: 'Paderborn', slug: 'paderborn', kreis: 'Paderborn', firstDog: 72 },
  { name: 'Bad Lippspringe', slug: 'bad-lippspringe', kreis: 'Paderborn', firstDog: 60 },
  { name: 'Mülheim an der Ruhr', slug: 'muelheim-an-der-ruhr', kreis: 'Mülheim', firstDog: 90 },
  { name: 'Spaderborn', slug: 'x', kreis: 'X', firstDog: null },
];

describe('search', () => {
  it('finds Paderborn by "Pader", prefix before substring', () => {
    expect(searchMunicipalities(data, 'Pader').map((e) => e.slug)).toEqual(['paderborn', 'x']);
  });
  it('is umlaut- and case-insensitive', () => {
    expect(searchMunicipalities(data, 'MUELHEIM')[0].slug).toBe('muelheim-an-der-ruhr');
    expect(searchMunicipalities(data, 'mülheim')[0].slug).toBe('muelheim-an-der-ruhr');
  });
  it('matches word starts and ignores empty queries', () => {
    expect(searchMunicipalities(data, 'lipp')[0].slug).toBe('bad-lippspringe');
    expect(searchMunicipalities(data, '  ')).toEqual([]);
    expect(fold('Straße')).toBe('strasse');
  });
});
