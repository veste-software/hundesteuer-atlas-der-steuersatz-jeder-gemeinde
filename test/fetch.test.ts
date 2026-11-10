import { describe, expect, it } from 'vitest';
import { PoliteFetcher, type Clock } from '../pipeline/fetch';

const ROBOTS = 'User-agent: *\nDisallow: /intern/\n';

function setup() {
  let t = 0;
  const calls: { url: string; at: number }[] = [];
  const clock: Clock = {
    now: () => t,
    sleep: async (ms) => {
      t += ms;
    },
  };
  const fetchFn = async (url: string) => {
    calls.push({ url, at: t });
    if (url.endsWith('/robots.txt')) return new Response(ROBOTS, { status: 200 });
    return new Response('ok', { status: 200, headers: { 'content-type': 'text/html' } });
  };
  return { fetcher: new PoliteFetcher({ siteUrl: 'https://atlas.test', fetchFn, clock }), calls };
}

describe('PoliteFetcher', () => {
  it('does not fetch a URL disallowed by robots.txt', async () => {
    const { fetcher, calls } = setup();
    const r = await fetcher.get('https://a.example/intern/satzung.pdf');
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toBe('robots');
    expect(calls.map((c) => c.url)).toEqual(['https://a.example/robots.txt']);
  });

  it('waits at least 1000 ms between requests to one host', async () => {
    const { fetcher, calls } = setup();
    await fetcher.get('https://a.example/eins');
    await fetcher.get('https://a.example/zwei');
    const times = calls.map((c) => c.at);
    for (let i = 1; i < times.length; i++) expect(times[i] - times[i - 1]).toBeGreaterThanOrEqual(1000);
    expect(calls.length).toBe(3); // robots.txt + 2 pages
  });

  it('does not delay requests to different hosts', async () => {
    const { fetcher, calls } = setup();
    await fetcher.get('https://a.example/x');
    const before = calls.length;
    await fetcher.get('https://b.example/x');
    const b = calls.slice(before);
    // b's robots.txt request starts at the time a finished, with no extra waiting of its own
    expect(b[0].url).toBe('https://b.example/robots.txt');
    expect(b[0].at).toBe(calls[before - 1].at);
  });

  it('sends the identifying user agent', async () => {
    const { fetcher } = setup();
    expect(fetcher.ua).toBe('HundesteuerAtlasBot/0.1 (+https://atlas.test/methodik/)');
  });
});
