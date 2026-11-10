// Bylaw discovery: sitemap first, else best-first crawl from the homepage.
// Pure ranking/link helpers plus `discover()` that takes a PoliteFetcher-like object.
// No HTML-parser dependency: anchors are read with a small regex, which is enough for link lists.

export interface Getter {
  get(url: string): Promise<
    { ok: true; url: string; contentType: string; body: Uint8Array } | { ok: false; url: string }
  >;
}

export interface Candidate {
  url: string;
  text: string;
  score: number;
  secondary: boolean;
}

export interface DiscoverOptions {
  maxPages?: number;
  maxDepth?: number;
}

const HUND = /hundesteuer/i;
const PREFER = /ortsrecht|satzung|steuer|abgaben|finanz|hund/i;
const decode = (b: Uint8Array) => new TextDecoder('utf-8').decode(b);

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function isDocumentLink(url: string): boolean {
  return /\.pdf(\?|#|$)/i.test(url);
}

/** Score a candidate: "satzung"/"lesefassung" first, newest year next; amendments are secondary. */
export function scoreCandidate(url: string, text: string): Candidate {
  const hay = `${safeDecode(url)} ${text}`;
  const secondary = /änderung|aenderung|nachtrag/i.test(hay);
  let score = 0;
  if (/lesefassung/i.test(hay)) score += 200;
  if (/satzung/i.test(hay)) score += 100;
  if (secondary) score -= 150;
  const years = [...hay.matchAll(/\b(19[89]\d|20[0-4]\d)\b/g)].map((m) => Number(m[1]));
  if (years.length) score += Math.max(...years) - 1980;
  return { url, text, score, secondary };
}

export function rankCandidates(list: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  return list
    .filter((c) => (seen.has(c.url) ? false : (seen.add(c.url), true)))
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
}

export function parseSitemapUrls(xml: string): { pages: string[]; sitemaps: string[] } {
  const pages: string[] = [];
  const sitemaps: string[] = [];
  for (const block of xml.matchAll(/<(url|sitemap)>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>[\s\S]*?<\/\1>/gi)) {
    (block[1].toLowerCase() === 'sitemap' ? sitemaps : pages).push(block[2]);
  }
  return { pages, sitemaps };
}

export function extractLinks(html: string, base: string): { url: string; text: string }[] {
  const out: { url: string; text: string }[] = [];
  for (const m of html.matchAll(/<a\s[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1].trim();
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    try {
      const u = new URL(href, base);
      if (!/^https?:$/.test(u.protocol)) continue;
      u.hash = '';
      out.push({ url: u.toString(), text: m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() });
    } catch {
      /* ignore bad hrefs */
    }
  }
  return out;
}

export interface DiscoverResult {
  candidates: Candidate[];
  pagesFetched: number;
}

export async function discover(
  homepage: string,
  fetcher: Getter,
  opts: DiscoverOptions = {},
): Promise<DiscoverResult> {
  const maxPages = opts.maxPages ?? 60;
  const maxDepth = opts.maxDepth ?? 4;
  const host = new URL(homepage).host;
  const found: Candidate[] = [];
  let pagesFetched = 0;

  // 1. sitemap(s)
  const sm = await fetcher.get(new URL('/sitemap.xml', homepage).toString());
  pagesFetched++;
  if (sm.ok) {
    const { pages, sitemaps } = parseSitemapUrls(decode(sm.body));
    let all = pages;
    for (const s of sitemaps.slice(0, 5)) {
      if (pagesFetched >= maxPages) break;
      const r = await fetcher.get(s);
      pagesFetched++;
      if (r.ok) all = all.concat(parseSitemapUrls(decode(r.body)).pages);
    }
    for (const u of all) if (HUND.test(safeDecode(u))) found.push(scoreCandidate(u, ''));
    if (found.length) return { candidates: rankCandidates(found), pagesFetched };
  }

  // 2. best-first crawl
  const queue: { url: string; depth: number; prio: number }[] = [{ url: homepage, depth: 0, prio: 100 }];
  const visited = new Set<string>();
  while (queue.length && pagesFetched < maxPages) {
    queue.sort((a, b) => b.prio - a.prio);
    const next = queue.shift()!;
    if (visited.has(next.url)) continue;
    visited.add(next.url);
    const res = await fetcher.get(next.url);
    pagesFetched++;
    if (!res.ok || !/html/i.test(res.contentType)) continue;
    for (const l of extractLinks(decode(res.body), next.url)) {
      if (HUND.test(l.text) || HUND.test(safeDecode(l.url))) {
        found.push(scoreCandidate(l.url, l.text));
        continue;
      }
      if (isDocumentLink(l.url) || new URL(l.url).host !== host) continue;
      if (next.depth + 1 > maxDepth || visited.has(l.url)) continue;
      const prio = PREFER.test(`${l.url} ${l.text}`) ? 50 - next.depth : 10 - next.depth;
      queue.push({ url: l.url, depth: next.depth + 1, prio });
    }
  }
  return { candidates: rankCandidates(found), pagesFetched };
}
