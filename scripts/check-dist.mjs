// Post-build checks on dist/. Plain node, no dependencies. Later tasks add checks here.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

if (!fs.existsSync(dist)) {
  console.error(`check-dist: ${dist} does not exist, run the build first`);
  process.exit(1);
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => path.relative(dist, f);
const pages = new Map();
for (const f of htmlFiles) pages.set(rel(f), fs.readFileSync(f, 'utf8'));

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3]) : undefined;
};

// The site's own host and base path come from the canonical link of the homepage.
const indexHtml = pages.get('index.html') ?? '';
const indexCanon = indexHtml.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0] ?? '';
const siteUrl = attr(indexCanon, 'href') ? new URL(attr(indexCanon, 'href')) : null;
const siteHost = siteUrl?.host;
const base = siteUrl ? siteUrl.pathname : '/';

const titles = new Map();
const descriptions = new Map();

for (const [name, html] of pages) {
  if (!/<html[^>]*\slang="de"/i.test(html)) fail(`${name}: missing <html lang="de">`);
  if (!/<link[^>]*rel="canonical"/i.test(html)) fail(`${name}: missing canonical link`);

  for (const m of html.matchAll(/<(script|iframe)\b[^>]*>/gi)) {
    const src = attr(m[0], 'src');
    if (src && /^(https?:)?\/\//i.test(src)) {
      const host = new URL(src.startsWith('//') ? `https:${src}` : src).host;
      if (host !== siteHost) fail(`${name}: <${m[1]}> loads from another host (${src})`);
    } else if (m[1].toLowerCase() === 'iframe') {
      fail(`${name}: <iframe> is not allowed`);
    }
  }

  const is404 = name === '404.html';
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  if (!title) fail(`${name}: missing <title>`);
  else if (titles.has(title) && !is404) fail(`${name}: title also used by ${titles.get(title)}`);
  else titles.set(title, name);

  const descTag = html.match(/<meta[^>]*name="description"[^>]*>/i)?.[0];
  const desc = descTag ? attr(descTag, 'content') : undefined;
  if (!desc) fail(`${name}: missing meta description`);
  else if (descriptions.has(desc) && !is404) fail(`${name}: description also used by ${descriptions.get(desc)}`);
  else descriptions.set(desc, name);
}

for (const f of files) {
  if (/\.(html|js|mjs|css|xml|json|txt)$/.test(f) && fs.readFileSync(f, 'utf8').includes('document.cookie')) {
    fail(`${rel(f)}: uses document.cookie`);
  }
}

// Municipality pages (AC 8): every one must carry the required elements.
for (const [name, html] of pages) {
  if (!/^hundesteuer[\\/][^\\/]+[\\/]index\.html$/.test(name)) continue;
  const required = [
    [/<h1[^>]*>\s*Hundesteuer /, 'H1 "Hundesteuer <Name>"'],
    [/<table/, 'rates table'],
    [/class="margin"/, '§ margin column'],
    [/Satzung öffnen/, 'bylaw link'],
    [/abgerufen am \d{2}\.\d{2}\.\d{4}/, 'retrieval date'],
    [/Ermäßigungen und Befreiungen laut Satzung/, 'reliefs section'],
    [/Taf\. 2/, 'static totals table'],
    [/Angaben ohne Gewähr\. Verbindlich ist allein die Satzung der Gemeinde\./, 'disclaimer'],
    [/Fehler melden/, '"Fehler melden"'],
    [/BreadcrumbList/, 'BreadcrumbList JSON-LD'],
  ];
  for (const [re, label] of required) if (!re.test(html)) fail(`${name}: missing ${label}`);
}

// Sitemap: every entry must exist and must not be noindex.
const sitemapFile = path.join(dist, 'sitemap.xml');
if (!fs.existsSync(sitemapFile)) fail('sitemap.xml missing');
else {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let p = new URL(m[1]).pathname;
    if (p.startsWith(base)) p = p.slice(base.length);
    p = p.replace(/^\/+/, '');
    const key = path.join(p, 'index.html');
    const html = pages.get(key);
    if (!html) fail(`sitemap.xml: ${m[1]} has no page (${key})`);
    else if (/<meta[^>]*name="robots"[^>]*noindex/i.test(html)) fail(`sitemap.xml: ${m[1]} is noindex`);
  }
}

if (errors.length) {
  console.error('check-dist failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`check-dist: ${htmlFiles.length} pages ok`);
