// Polite fetcher: robots.txt per host (cached), >= 1 s between requests to one host,
// identifying User-Agent, timeout and size cap. fetch and clock are injectable for tests.
import robotsParser from 'robots-parser';

export interface Clock {
  now(): number;
  sleep(ms: number): Promise<void>;
}

export const realClock: Clock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
};

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export interface FetcherOptions {
  siteUrl?: string;
  fetchFn?: FetchFn;
  clock?: Clock;
  minIntervalMs?: number;
  timeoutMs?: number;
  maxBytes?: number;
}

export type FetchResult =
  | { ok: true; url: string; status: number; contentType: string; body: Uint8Array }
  | { ok: false; url: string; reason: 'robots' | 'http' | 'timeout' | 'too-large' | 'error'; status?: number; message?: string };

type Robots = ReturnType<typeof robotsParser>;

export function userAgent(siteUrl: string): string {
  return `HundesteuerAtlasBot/0.1 (+${siteUrl.replace(/\/+$/, '')}/methodik/)`;
}

export class PoliteFetcher {
  readonly ua: string;
  private readonly fetchFn: FetchFn;
  private readonly clock: Clock;
  private readonly minInterval: number;
  private readonly timeoutMs: number;
  private readonly maxBytes: number;
  private robots = new Map<string, Promise<Robots | null>>();
  /** Per host: the time the next request may start. Reserved synchronously so parallel callers queue. */
  private nextSlot = new Map<string, number>();

  constructor(opts: FetcherOptions = {}) {
    this.ua = userAgent(opts.siteUrl ?? process.env.SITE_URL ?? 'https://example.org');
    this.fetchFn = opts.fetchFn ?? ((url, init) => fetch(url, init));
    this.clock = opts.clock ?? realClock;
    this.minInterval = opts.minIntervalMs ?? 1000;
    this.timeoutMs = opts.timeoutMs ?? 20000;
    this.maxBytes = opts.maxBytes ?? 15 * 1024 * 1024;
  }

  /** Wait for this host's slot, then reserve the next one. */
  private async throttle(host: string): Promise<void> {
    const now = this.clock.now();
    const slot = Math.max(now, this.nextSlot.get(host) ?? 0);
    this.nextSlot.set(host, slot + this.minInterval);
    if (slot > now) await this.clock.sleep(slot - now);
  }

  private async raw(url: string, accept?: string): Promise<Response> {
    const u = new URL(url);
    await this.throttle(u.host);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      return await this.fetchFn(url, {
        headers: { 'User-Agent': this.ua, ...(accept ? { Accept: accept } : {}) },
        signal: ctrl.signal,
        redirect: 'follow',
      });
    } finally {
      clearTimeout(timer);
    }
  }

  private loadRobots(origin: string): Promise<Robots | null> {
    let p = this.robots.get(origin);
    if (!p) {
      const robotsUrl = `${origin}/robots.txt`;
      p = (async () => {
        try {
          const res = await this.raw(robotsUrl);
          if (res.status >= 400) return null; // no robots.txt: everything allowed
          return robotsParser(robotsUrl, await res.text());
        } catch {
          return null;
        }
      })();
      this.robots.set(origin, p);
    }
    return p;
  }

  async isAllowed(url: string): Promise<boolean> {
    const robots = await this.loadRobots(new URL(url).origin);
    return robots ? robots.isAllowed(url, this.ua) !== false : true;
  }

  async get(url: string): Promise<FetchResult> {
    if (!(await this.isAllowed(url))) return { ok: false, url, reason: 'robots' };
    try {
      const res = await this.raw(url);
      if (!res.ok) return { ok: false, url, reason: 'http', status: res.status };
      const declared = Number(res.headers.get('content-length') ?? 0);
      if (declared > this.maxBytes) return { ok: false, url, reason: 'too-large' };
      const body = new Uint8Array(await res.arrayBuffer());
      if (body.byteLength > this.maxBytes) return { ok: false, url, reason: 'too-large' };
      return { ok: true, url, status: res.status, contentType: res.headers.get('content-type') ?? '', body };
    } catch (e) {
      const aborted = e instanceof Error && e.name === 'AbortError';
      return { ok: false, url, reason: aborted ? 'timeout' : 'error', message: e instanceof Error ? e.message : String(e) };
    }
  }
}
