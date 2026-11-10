import { describe, expect, it } from 'vitest';
import { discover, extractLinks, parseSitemapUrls, scoreCandidate, rankCandidates, type Getter } from '../pipeline/discover';

const enc = (s: string) => new TextEncoder().encode(s);

function site(pages: Record<string, string>): Getter & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    async get(url: string) {
      calls.push(url);
      const body = pages[url];
      return body === undefined
        ? { ok: false as const, url }
        : { ok: true as const, url, contentType: url.endsWith('.xml') ? 'application/xml' : 'text/html', body: enc(body) };
    },
  };
}

describe('ranking', () => {
  it('puts Lesefassung and Satzung before amendments, newest year first', () => {
    const ranked = rankCandidates([
      scoreCandidate('https://x.de/a/1-aenderungssatzung-hundesteuer-2024.pdf', ''),
      scoreCandidate('https://x.de/a/hundesteuersatzung-2019.pdf', ''),
      scoreCandidate('https://x.de/a/hundesteuersatzung-2023.pdf', ''),
      scoreCandidate('https://x.de/a/hundesteuersatzung-lesefassung.pdf', ''),
    ]);
    expect(ranked.map((c) => c.url.split('/').pop())).toEqual([
      'hundesteuersatzung-lesefassung.pdf',
      'hundesteuersatzung-2023.pdf',
      'hundesteuersatzung-2019.pdf',
      '1-aenderungssatzung-hundesteuer-2024.pdf',
    ]);
    expect(ranked[3].secondary).toBe(true);
  });
});

describe('parsing', () => {
  it('reads sitemap index and url sets', () => {
    const r = parseSitemapUrls(
      '<sitemapindex><sitemap><loc>https://x.de/s1.xml</loc></sitemap></sitemapindex><urlset><url><loc>https://x.de/p</loc></url></urlset>',
    );
    expect(r.sitemaps).toEqual(['https://x.de/s1.xml']);
    expect(r.pages).toEqual(['https://x.de/p']);
  });
  it('resolves relative links and skips mailto', () => {
    const l = extractLinks('<a href="/a/b.pdf">Hundesteuersatzung <b>2023</b></a><a href="mailto:a@b.de">m</a>', 'https://x.de/start/');
    expect(l).toEqual([{ url: 'https://x.de/a/b.pdf', text: 'Hundesteuersatzung 2023' }]);
  });
});

describe('discover', () => {
  it('uses the sitemap first and does not crawl', async () => {
    const f = site({
      'https://x.de/sitemap.xml': '<urlset><url><loc>https://x.de/ortsrecht/hundesteuersatzung.pdf</loc></url><url><loc>https://x.de/kontakt</loc></url></urlset>',
    });
    const r = await discover('https://x.de/', f);
    expect(r.candidates.map((c) => c.url)).toEqual(['https://x.de/ortsrecht/hundesteuersatzung.pdf']);
    expect(f.calls).toEqual(['https://x.de/sitemap.xml']);
  });

  it('crawls best-first and finds the bylaw link', async () => {
    const f = site({
      'https://x.de/': '<a href="/freizeit">Freizeit</a><a href="/ortsrecht">Ortsrecht</a>',
      'https://x.de/ortsrecht': '<a href="/d/hundesteuersatzung-2022.pdf">Satzung über die Erhebung der Hundesteuer</a>',
    });
    const r = await discover('https://x.de/', f);
    expect(r.candidates[0].url).toBe('https://x.de/d/hundesteuersatzung-2022.pdf');
    expect(f.calls.indexOf('https://x.de/ortsrecht')).toBeLessThan(f.calls.indexOf('https://x.de/freizeit'));
  });

  it('stops at the page cap', async () => {
    const pages: Record<string, string> = { 'https://x.de/': Array.from({ length: 20 }, (_, i) => `<a href="/p${i}">p${i}</a>`).join('') };
    const f = site(pages);
    const r = await discover('https://x.de/', f, { maxPages: 5 });
    expect(r.pagesFetched).toBe(5);
    expect(f.calls.length).toBe(5);
  });

  it('stops at the depth cap', async () => {
    const f = site({
      'https://x.de/': '<a href="/a">a</a>',
      'https://x.de/a': '<a href="/b">b</a>',
      'https://x.de/b': '<a href="/c">c</a>',
      'https://x.de/c': '<a href="/d">d</a>',
    });
    await discover('https://x.de/', f, { maxDepth: 2 });
    expect(f.calls).toContain('https://x.de/b');
    expect(f.calls).not.toContain('https://x.de/c');
  });
});
