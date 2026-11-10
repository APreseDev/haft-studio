import fa from './fa.js';
import en from './en.js';

// فهرست زبان‌ها. برای افزودن زبان تازه: یک فایل متن مثل en.js بسازید و این‌جا ثبت کنید.
// (اسکریپت کوچک داخل index.html و scripts/postbuild.mjs هم باید زبان تازه را بشناسند؛ به PROJECT_DOCUMENTATION.md نگاه کنید.)
export const locales = {
  fa: { dir: 'rtl', label: 'فارسی', short: 'FA', dict: fa },
  en: { dir: 'ltr', label: 'English', short: 'EN', dict: en },
};

export const DEFAULT_LANG = 'fa';

export const isLang = (x) => typeof x === 'string' && Object.prototype.hasOwnProperty.call(locales, x);

// آدرس پایه‌ی سایت (در Vite از VITE_BASE می‌آید؛ پیش‌فرض "/"). زبان پیش‌فرض (فارسی) روی خود این آدرس است
// و هر زبان دیگر زیرمسیر خودش را دارد: "/" فارسی، "/en/" انگلیسی.
const BASE = import.meta.env.BASE_URL || '/';

/** زبان را از آدرس صفحه می‌خواند. آدرس تنها منبع حقیقت است تا هر زبان لینک و نسخه‌ی HTML جدا داشته باشد. */
export function langFromPath(pathname = window.location.pathname) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\/+/, '');
  const first = rest.split('/')[0];
  return isLang(first) && first !== DEFAULT_LANG ? first : DEFAULT_LANG;
}

/** آدرس نسخه‌ی یک زبان، مثلاً "/" یا "/en/". */
export const pathForLang = (lang) => (lang === DEFAULT_LANG ? BASE : `${BASE}${lang}/`);
