// بعد از vite build اجرا می‌شود (در npm run build).
// همیشه: نسخه‌ی انگلیسی dist/en/index.html را با HTML و متادیتای انگلیسی (lang/dir، title، description، Open Graph، noscript) می‌سازد
//        تا موتورهای جست‌وجو و پیش‌نمایش لینک‌ها بدون اجرای جاوااسکریپت هم متن درست را ببینند.
// اگر siteUrl در src/data.js (یا متغیر محیطی SITE_URL) پر باشد، این‌ها هم ساخته می‌شود:
//   canonical، og:url و hreflang (fa / en / x-default) در هر دو نسخه، sitemap.xml با نسخه‌های جایگزین، و خط Sitemap در robots.txt
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

const data = await import(pathToFileURL(path.join(root, 'src', 'data.js')).href);
const en = (await import(pathToFileURL(path.join(root, 'src', 'i18n', 'en.js')).href)).default;
const fa = (await import(pathToFileURL(path.join(root, 'src', 'i18n', 'fa.js')).href)).default;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const setContent = (html, attr, value) =>
  html.replace(new RegExp(`(<meta ${attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*?content=")[^"]*(")`), (_, a, b) => `${a}${esc(value)}${b}`);
const setLink = (html, extra) => (html.includes('</head>') ? html.replace('</head>', `${extra}  </head>`) : html);

const original = fs.readFileSync(indexPath, 'utf8');

// --- نسخه‌ی انگلیسی (از روی نسخه‌ی فارسی ساخته می‌شود) ---
let enHtml = original
  .replace('<html lang="fa" dir="rtl">', '<html lang="en" dir="ltr">')
  .replace(/<title>[^<]*<\/title>/, `<title>${esc(en.meta.title)}</title>`);
enHtml = setContent(enHtml, 'name="description"', en.meta.description);
enHtml = setContent(enHtml, 'property="og:title"', en.meta.title);
enHtml = setContent(enHtml, 'property="og:description"', en.meta.description);
enHtml = setContent(enHtml, 'property="og:locale"', en.meta.ogLocale);
enHtml = setContent(enHtml, 'property="og:site_name"', en.brand);
enHtml = enHtml.replace(
  /<noscript>[\s\S]*?<\/noscript>/,
  `<noscript>
      <style>#splash { display: none; }</style>
      <div style="padding: 24px">
        <h1>${esc(en.brand)}</h1>
        <p>${esc(en.meta.description)}</p>
        <p>Please enable JavaScript in your browser to view this site.</p>
      </div>
    </noscript>`
);
let faHtml = original;
const alt = (loc) => `    <meta property="og:locale:alternate" content="${loc}" />\n`;
faHtml = setLink(faHtml, alt(en.meta.ogLocale));
enHtml = setLink(enHtml, alt(fa.meta.ogLocale));

// --- آدرس‌های مطلق (فقط اگر siteUrl پر باشد) ---
const raw = (process.env.SITE_URL || data.siteUrl || '').trim();
let site = '';
if (!raw) {
  console.log('[postbuild] siteUrl خالی است؛ canonical، hreflang و sitemap ساخته نشد (بعد از اتصال دامنه siteUrl را در src/data.js پر کنید).');
} else if (!/^https:\/\/[a-z0-9][a-z0-9.-]*(:\d+)?\/?$/.test(raw)) {
  console.warn(`[postbuild] هشدار: siteUrl نامعتبر است ("${raw}"). باید مثل https://example.com باشد (https، حروف کوچک، بدون مسیر). canonical و sitemap ساخته نشد.`);
} else {
  site = raw.replace(/\/+$/, '');
}

const faUrl = `${site}/`;
const enUrl = `${site}/en/`;
const ogImage = String(data.ogImage || '').trim().replace(/^\/+/, '');

if (site) {
  const seo = (self) => {
    let extra = `    <link rel="canonical" href="${self}" />\n    <meta property="og:url" content="${self}" />\n`;
    extra += `    <link rel="alternate" hreflang="fa" href="${faUrl}" />\n    <link rel="alternate" hreflang="en" href="${enUrl}" />\n    <link rel="alternate" hreflang="x-default" href="${faUrl}" />\n`;
    if (ogImage) extra += `    <meta property="og:image" content="${site}/${ogImage}" />\n`;
    return extra;
  };
  const withCard = (h) => (ogImage ? h.replace('content="summary"', 'content="summary_large_image"') : h);
  if (!faHtml.includes('rel="canonical"')) faHtml = withCard(setLink(faHtml, seo(faUrl)));
  if (!enHtml.includes('rel="canonical"')) enHtml = withCard(setLink(enHtml, seo(enUrl)));
}

fs.writeFileSync(indexPath, faHtml);
fs.mkdirSync(path.join(dist, 'en'), { recursive: true });
fs.writeFileSync(path.join(dist, 'en', 'index.html'), enHtml);
console.log('[postbuild] نسخه‌ی انگلیسی dist/en/index.html ساخته شد.');

if (!site) process.exit(0);

const today = new Date().toISOString().slice(0, 10);
const entry = (loc) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
  `    <xhtml:link rel="alternate" hreflang="fa" href="${faUrl}" />\n` +
  `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />\n` +
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${faUrl}" />\n  </url>\n`;
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entry(faUrl)}${entry(enUrl)}</urlset>\n`
);

const robotsPath = path.join(dist, 'robots.txt');
let robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : 'User-agent: *\nAllow: /\n';
if (!/^Sitemap:/im.test(robots)) robots = robots.replace(/\s*$/, '\n') + `\nSitemap: ${site}/sitemap.xml\n`;
fs.writeFileSync(robotsPath, robots);

console.log(`[postbuild] canonical، og:url، hreflang${ogImage ? '، og:image' : ''}، sitemap.xml و robots.txt برای ${faUrl} و ${enUrl} ساخته شد.`);
