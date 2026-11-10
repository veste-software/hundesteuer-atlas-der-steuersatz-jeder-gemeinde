import { describe, expect, it } from 'vitest';
import { absoluteUrl, normaliseBase, withBase } from '../src/lib/url';

describe('normaliseBase', () => {
  it.each([
    [undefined, '/'],
    ['', '/'],
    ['/', '/'],
    ['/preview', '/preview/'],
    ['/preview/', '/preview/'],
    ['preview', '/preview/'],
  ])('%s -> %s', (input, expected) => {
    expect(normaliseBase(input)).toBe(expected);
  });
});

describe('withBase', () => {
  it('keeps root paths at "/" without a base', () => {
    expect(withBase('/nrw/', '/')).toBe('/nrw/');
    expect(withBase('/', '/')).toBe('/');
  });

  it('prefixes the preview sub-path', () => {
    expect(withBase('/nrw/', '/preview')).toBe('/preview/nrw/');
    expect(withBase('hundesteuer/paderborn/', '/preview/')).toBe('/preview/hundesteuer/paderborn/');
    expect(withBase('/', '/preview')).toBe('/preview/');
  });
});

describe('absoluteUrl', () => {
  it('builds canonical URLs from SITE_URL + SITE_BASE', () => {
    expect(absoluteUrl('/methodik/', 'https://example.github.io', '/preview')).toBe(
      'https://example.github.io/preview/methodik/',
    );
    expect(absoluteUrl('/', 'https://hundesteuer-atlas.example/', '/')).toBe('https://hundesteuer-atlas.example/');
  });
});
