import fa from './fa.js';
import en from './en.js';

// فهرست زبان‌ها. برای افزودن زبان تازه: یک فایل متن مثل en.js بسازید و این‌جا ثبت کنید.
// (اسکریپت کوچک داخل index.html و scripts/postbuild.mjs هم باید زبان تازه را بشناسند؛ به PROJECT_OVERVIEW.fa.md نگاه کنید.)
export const locales = {
  fa: { dir: 'rtl', label: 'فارسی', short: 'FA', dict: fa },
  en: { dir: 'ltr', label: 'English', short: 'EN', dict: en },
};

// زبان پیش‌فرض: «/…» انگلیسی و «/fa/…» فارسی
export const DEFAULT_LANG = 'en';

export const isLang = (value) => typeof value === 'string' && Object.prototype.hasOwnProperty.call(locales, value);

// آدرس هر زبان و صفحه: src/routes.js
