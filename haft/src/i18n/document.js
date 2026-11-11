import { DEFAULT_LANG, isLang, locales } from './locales.js';
import { pathWithLang } from '../routes.js';

const setMeta = (selector, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute('content', value);
};

/** lang و dir صفحه، عنوان و متادیتای اشتراک‌گذاری را با زبان داده‌شده هماهنگ می‌کند. چندبار صدا زدنش مشکلی ندارد. */
export function applyLangToDocument(lang) {
  const { dir, dict } = locales[lang];
  const root = document.documentElement;
  root.setAttribute('lang', lang);
  root.setAttribute('dir', dir);
  document.title = dict.meta.title;
  setMeta('meta[name="description"]', dict.meta.description);
  setMeta('meta[property="og:title"]', dict.meta.title);
  setMeta('meta[property="og:description"]', dict.meta.description);
  setMeta('meta[property="og:locale"]', dict.meta.ogLocale);
  setMeta('meta[property="og:site_name"]', dict.brand);
}

/** عنوان و توضیح یک صفحه‌ی داخلی (مثل صفحه‌ی یک نمونه‌کار). بعد از applyLangToDocument صدا زده می‌شود و آن را برای همین صفحه عوض می‌کند. */
export function applyPageMeta(title, description) {
  document.title = title;
  if (description) {
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:description"]', description);
  }
  setMeta('meta[property="og:title"]', title);
}

/**
 * canonical، og:url و hreflang را با آدرس فعلی هماهنگ می‌کند. این تگ‌ها فقط وقتی هنگام بیلد ساخته شده‌اند
 * که siteUrl پر باشد؛ اگر نباشند کاری نمی‌کند. (موتور جست‌وجو HTML ثابت هر آدرس را می‌خواند؛ این برای رفتن داخل سایت است.)
 */
export function syncPageLinks(pathname) {
  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) return;
  let origin;
  try {
    origin = new URL(canonical.href).origin;
  } catch {
    return;
  }
  canonical.setAttribute('href', origin + pathname);
  setMeta('meta[property="og:url"]', origin + pathname);
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
    const code = link.getAttribute('hreflang');
    const target = code === 'x-default' ? DEFAULT_LANG : code;
    if (isLang(target)) link.setAttribute('href', origin + pathWithLang(pathname, target));
  });
}
