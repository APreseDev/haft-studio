// دیتابیس موک (src/database.js) هر متن را برای هر دو زبان کنار هم نگه می‌دارد، مثلاً { fa: 'سایت', en: 'Website' }.
// این تابع همان داده را برای یک زبان «تک‌زبانه» می‌کند تا بقیه‌ی کد (بخش‌ها و صفحه‌ها) مثل قبل با متن ساده کار کنند.
// فایل ساده‌ی جاوااسکریپت است (بدون React) تا scripts/postbuild.mjs هم بتواند از آن استفاده کند.

const isEmpty = (value) => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
const isBilingual = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0 && Object.keys(value).every((key) => key === 'fa' || key === 'en');

/** مقدار { fa, en } را به مقدار همان زبان تبدیل می‌کند. اگر ترجمه‌ی آن زبان خالی بود، متن فارسی نشان داده می‌شود. */
export function localize(value, lang) {
  if (Array.isArray(value)) return value.map((item) => localize(item, lang));
  if (isBilingual(value)) return isEmpty(value[lang]) ? value.fa : value[lang];
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entryValue]) => [key, localize(entryValue, lang)]));
  }
  return value;
}
