import { describe, expect, it } from 'vitest';
import { municipalitySlug, slugify } from '../src/lib/slug';

describe('slugify', () => {
  it('handles spaces and umlauts', () => {
    expect(slugify('Bad Lippspringe')).toBe('bad-lippspringe');
    expect(slugify('Mülheim an der Ruhr')).toBe('muelheim-an-der-ruhr');
    expect(slugify('Groß Köln')).toBe('gross-koeln');
  });
  it('strips other diacritics and punctuation', () => {
    expect(slugify('Saint-Étienne (Test)')).toBe('saint-etienne-test');
  });
});

describe('municipalitySlug', () => {
  it('appends the Kreis slug for duplicated names only', () => {
    const dups = new Set(['Neukirchen']);
    expect(municipalitySlug('Neukirchen', 'kreis-heinsberg', dups)).toBe('neukirchen-kreis-heinsberg');
    expect(municipalitySlug('Paderborn', 'kreis-paderborn', dups)).toBe('paderborn');
  });
});
