// دیتابیس موک (src/database.js) هر متن را برای هر دو زبان کنار هم نگه می‌دارد، مثلاً { fa: 'سایت', en: 'Website' }.
// این تابع همان داده را برای یک زبان «تک‌زبانه» می‌کند تا بقیه‌ی کد (بخش‌ها و صفحه‌ها) مثل قبل با متن ساده کار کنند.
// فایل ساده‌ی جاوااسکریپت است (بدون React) تا scripts/postbuild.mjs هم بتواند از آن استفاده کند.

const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
const isBilingual = (v) =>
  v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => k === 'fa' || k === 'en');

/** مقدار { fa, en } را به مقدار همان زبان تبدیل می‌کند. اگر ترجمه‌ی آن زبان خالی بود، متن فارسی نشان داده می‌شود. */
export function localize(value, lang) {
  if (Array.isArray(value)) return value.map((v) => localize(v, lang));
  if (isBilingual(value)) return isEmpty(value[lang]) ? value.fa : value[lang];
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, lang)]));
  }
  return value;
}
