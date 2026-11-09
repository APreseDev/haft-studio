// بعد از vite build اجرا می‌شود (در npm run build).
// اگر siteUrl در src/data.js (یا متغیر محیطی SITE_URL) پر باشد، این‌ها را در dist می‌سازد:
//   canonical و og:url در index.html، فایل sitemap.xml، و خط Sitemap در robots.txt
// اگر خالی یا نامعتبر باشد، فقط هشدار می‌دهد و بیلد را خراب نمی‌کند.
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
const raw = (process.env.SITE_URL || data.siteUrl || '').trim();

if (!raw) {
  console.log('[postbuild] siteUrl خالی است؛ canonical و sitemap ساخته نشد (بعد از اتصال دامنه siteUrl را در src/data.js پر کنید).');
  process.exit(0);
}
if (!/^https:\/\/[a-z0-9][a-z0-9.-]*(:\d+)?\/?$/.test(raw)) {
  console.warn(`[postbuild] هشدار: siteUrl نامعتبر است ("${raw}"). باید مثل https://example.com باشد (https، حروف کوچک، بدون مسیر). canonical و sitemap ساخته نشد.`);
  process.exit(0);
}

const site = raw.replace(/\/+$/, '');
const home = `${site}/`;
const ogImage = String(data.ogImage || '').trim().replace(/^\/+/, '');

let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('rel="canonical"')) {
  let extra = `    <link rel="canonical" href="${home}" />\n    <meta property="og:url" content="${home}" />\n`;
  if (ogImage) {
    extra += `    <meta property="og:image" content="${site}/${ogImage}" />\n`;
    html = html.replace('content="summary"', 'content="summary_large_image"');
  }
  html = html.replace('</head>', `${extra}  </head>`);
  fs.writeFileSync(indexPath, html);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${home}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`
);

const robotsPath = path.join(dist, 'robots.txt');
let robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : 'User-agent: *\nAllow: /\n';
if (!/^Sitemap:/im.test(robots)) robots = robots.replace(/\s*$/, '\n') + `\nSitemap: ${site}/sitemap.xml\n`;
fs.writeFileSync(robotsPath, robots);

console.log(`[postbuild] canonical، og:url${ogImage ? '، og:image' : ''}، sitemap.xml و robots.txt برای ${home} ساخته شد.`);
