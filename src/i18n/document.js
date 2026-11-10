import { locales } from './locales.js';

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
  // canonical و og:url (اگر هنگام بیلد ساخته شده باشند) به نسخه‌ی همین زبان اشاره کنند
  const alt = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
  if (alt) {
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', alt.href);
    setMeta('meta[property="og:url"]', alt.href);
  }
}
