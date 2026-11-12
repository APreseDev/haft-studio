// آدرس‌های سایت. زبان پیش‌فرض (انگلیسی) روی خود آدرس پایه است و بقیه با پیشوند کد زبان:
//   «/»  «/works/»  «/works/<slug>/»        انگلیسی
//   «/fa/»  «/fa/works/»  «/fa/works/<slug>/»   فارسی
import { DEFAULT_LANG, isLang } from './i18n/locales.js';

// آدرس پایه‌ی سایت (در Vite از VITE_BASE می‌آید؛ پیش‌فرض "/")
const BASE = import.meta.env.BASE_URL || '/';

const safeDecode = (encoded) => {
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
};

const segmentsOf = (pathname) => {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\/+/, '');
  return rest.split('/').filter((segment) => segment && segment !== 'index.html');
};

/** آدرس را به { lang, page: 'home' | 'works' | 'project', slug } تبدیل می‌کند. آدرس ناشناخته به صفحه‌ی اصلی می‌رود. */
export function parsePath(pathname) {
  const segs = segmentsOf(pathname);
  let lang = DEFAULT_LANG;
  if (segs.length && isLang(segs[0]) && segs[0] !== DEFAULT_LANG) lang = segs.shift();
  if (segs[0] === 'works') {
    return segs[1] ? { lang, page: 'project', slug: safeDecode(segs[1]) } : { lang, page: 'works', slug: '' };
  }
  return { lang, page: 'home', slug: '' };
}

const prefix = (lang) => (lang === DEFAULT_LANG ? '' : `${lang}/`);
export const homePath = (lang) => `${BASE}${prefix(lang)}`;
export const worksPath = (lang) => `${homePath(lang)}works/`;
export const projectPath = (lang, slug) => `${worksPath(lang)}${encodeURIComponent(slug)}/`;

/** همین صفحه، ولی به زبان دیگر (برای دکمه‌ی تغییر زبان). */
export function pathWithLang(pathname, lang) {
  const { page, slug } = parsePath(pathname);
  if (page === 'project') return projectPath(lang, slug);
  if (page === 'works') return worksPath(lang);
  return homePath(lang);
}

/** آیا این آدرس یکی از صفحه‌های همین برنامه است (نه یک فایل مثل عکس یا PDF)؟ */
export function isAppPath(pathname) {
  if (!pathname.startsWith(BASE)) return false;
  const last = pathname.split('/').filter(Boolean).pop() || '';
  return !last.includes('.') || last === 'index.html';
}
