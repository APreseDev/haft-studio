// بعد از vite build اجرا می‌شود (در npm run build).
// همیشه: برای هر زبان و هر صفحه یک فایل HTML جدا می‌سازد تا موتورهای جست‌وجو، پیش‌نمایش لینک‌ها و میزبان‌های ایستا
// (GitHub Pages، Cloudflare Pages) بدون اجرای جاوااسکریپت هم عنوان و متن درست را ببینند و هر آدرس باز شود:
//   dist/index.html            فارسی، صفحه‌ی اصلی          dist/en/index.html            انگلیسی
//   dist/works/index.html      همه‌ی نمونه‌کارها            dist/en/works/index.html
//   dist/works/<slug>/index.html  جزئیات هر نمونه‌کار      dist/en/works/<slug>/index.html
// اگر siteUrl در src/data.js (یا متغیر محیطی SITE_URL) پر باشد، این‌ها هم ساخته می‌شود:
//   canonical، og:url و hreflang (fa / en / x-default) در هر صفحه، sitemap.xml با نسخه‌های جایگزین، و خط Sitemap در robots.txt
// اگر siteUrl خالی یا نامعتبر باشد، فقط هشدار می‌دهد و بیلد را خراب نمی‌کند.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('[postbuild] dist/index.html پیدا نشد؛ ابتدا vite build باید موفق شود.');
  process.exit(1);
}

const load = async (...p) => import(pathToFileURL(path.join(root, ...p)).href);
const data = await load('src', 'data.js');
const { getProjects } = await load('src', 'projects.js');
const dicts = { fa: (await load('src', 'i18n', 'fa.js')).default, en: (await load('src', 'i18n', 'en.js')).default };
const DIRS = { fa: 'rtl', en: 'ltr' };
const NOJS = {
  fa: 'برای دیدن این سایت، جاوااسکریپت مرورگر را فعال کنید.',
  en: 'Please enable JavaScript in your browser to view this site.',
};
const LANGS = Object.keys(dicts);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const setContent = (html, attr, value) =>
  html.replace(new RegExp(`(<meta ${reEsc(attr)}[^>]*?content=")[^"]*(")`), (_, a, b) => `${a}${esc(value)}${b}`);
const addToHead = (html, extra) => html.replace('</head>', `${extra}  </head>`);

const original = fs.readFileSync(indexPath, 'utf8');

// --- آدرس مطلق سایت (فقط اگر siteUrl پر باشد) ---
const raw = (process.env.SITE_URL || data.siteUrl || '').trim();
let site = '';
if (!raw) {
  console.log('[postbuild] siteUrl خالی است؛ canonical، hreflang و sitemap ساخته نشد (بعد از اتصال دامنه siteUrl را در src/data.js پر کنید).');
} else if (!/^https:\/\/[a-z0-9][a-z0-9.-]*(:\d+)?\/?$/.test(raw)) {
  console.warn(`[postbuild] هشدار: siteUrl نامعتبر است ("${raw}"). باید مثل https://example.com باشد (https، حروف کوچک، بدون مسیر). canonical و sitemap ساخته نشد.`);
} else {
  site = raw.replace(/\/+$/, '');
}
const ogImage = String(data.ogImage || '').trim().replace(/^\/+/, '');

// --- فهرست صفحه‌ها ---
const prefix = (lang) => (lang === 'fa' ? '' : `${lang}/`);
const pagePath = (lang, kind, slug) =>
  `/${prefix(lang)}${kind === 'home' ? '' : kind === 'works' ? 'works/' : `works/${encodeURIComponent(slug)}/`}`;

const pages = [];
for (const lang of LANGS) {
  const d = dicts[lang];
  pages.push({ lang, kind: 'home', slug: '', title: d.meta.title, description: d.meta.description, extra: '' });
  pages.push({
    lang,
    kind: 'works',
    slug: '',
    title: `${d.worksPage.title} | ${d.brand}`,
    description: d.worksPage.sub,
    extra: '',
  });
  for (const p of getProjects(d)) {
    const description = p.summary || p.hint || d.meta.description;
    const body = (p.description || []).map((x) => `<p>${esc(x)}</p>`).join('');
    pages.push({ lang, kind: 'project', slug: p.slug, title: `${p.title} | ${d.brand}`, description, extra: body, h1: p.title });
  }
}
const exists = (lang, kind, slug) => pages.some((x) => x.lang === lang && x.kind === kind && x.slug === slug);

function render(page) {
  const { lang, kind, slug } = page;
  const d = dicts[lang];
  const otherLangs = LANGS.filter((l) => l !== lang);
  let html = original
    .replace('<html lang="fa" dir="rtl">', `<html lang="${lang}" dir="${DIRS[lang]}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = setContent(html, 'name="description"', page.description);
  html = setContent(html, 'property="og:title"', page.title);
  html = setContent(html, 'property="og:description"', page.description);
  html = setContent(html, 'property="og:locale"', d.meta.ogLocale);
  html = setContent(html, 'property="og:site_name"', d.brand);
  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>
      <style>#splash { display: none; }</style>
      <div style="padding: 24px">
        <h1>${esc(page.h1 || d.brand)}</h1>
        <p>${esc(page.description)}</p>${page.extra}
        <p>${esc(NOJS[lang])}</p>
      </div>
    </noscript>`
  );
  let extra = otherLangs.map((l) => `    <meta property="og:locale:alternate" content="${dicts[l].meta.ogLocale}" />\n`).join('');
  if (site) {
    const self = site + pagePath(lang, kind, slug);
    extra += `    <link rel="canonical" href="${self}" />\n    <meta property="og:url" content="${self}" />\n`;
    for (const l of LANGS) {
      if (exists(l, kind, slug)) extra += `    <link rel="alternate" hreflang="${l}" href="${site + pagePath(l, kind, slug)}" />\n`;
    }
    extra += `    <link rel="alternate" hreflang="x-default" href="${site + pagePath('fa', kind, slug)}" />\n`;
    if (ogImage) extra += `    <meta property="og:image" content="${site}/${ogImage}" />\n`;
  }
  html = addToHead(html, extra);
  if (site && ogImage) html = html.replace('content="summary"', 'content="summary_large_image"');
  return html;
}

for (const page of pages) {
  const dir = path.join(dist, pagePath(page.lang, page.kind, page.slug).replace(/^\/|\/$/g, '').split('/').map(decodeURIComponent).join('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(page));
}
console.log(`[postbuild] ${pages.length} صفحه‌ی HTML ساخته شد (صفحه‌ی اصلی، همه‌ی نمونه‌کارها و جزئیات هر نمونه‌کار، به هر دو زبان).`);

if (!site) process.exit(0);

const today = new Date().toISOString().slice(0, 10);
const entry = (page) => {
  const alts = LANGS.filter((l) => exists(l, page.kind, page.slug))
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site + pagePath(l, page.kind, page.slug)}" />\n`)
    .join('');
  return (
    `  <url>\n    <loc>${site + pagePath(page.lang, page.kind, page.slug)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${site + pagePath('fa', page.kind, page.slug)}" />\n  </url>\n`
  );
};
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pages.map(entry).join('')}</urlset>\n`
);

const robotsPath = path.join(dist, 'robots.txt');
let robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : 'User-agent: *\nAllow: /\n';
if (!/^Sitemap:/im.test(robots)) robots = robots.replace(/\s*$/, '\n') + `\nSitemap: ${site}/sitemap.xml\n`;
fs.writeFileSync(robotsPath, robots);

console.log(`[postbuild] canonical، og:url، hreflang${ogImage ? '، og:image' : ''}، sitemap.xml و robots.txt ساخته شد.`);
