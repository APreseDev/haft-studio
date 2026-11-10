// تنظیمات و اطلاعات مستقل از زبان. متن‌های قابل‌ترجمه‌ی سایت (خدمات، مراحل، شعار، فرم و ...) در src/i18n/fa.js و src/i18n/en.js هستند.

// رنگ تأکید (کرمی) در حالت تیره. اگر عوضش کردید، متغیر --accent در styles.css را هم هم‌رنگ کنید.
export const ACCENT = "#EADFC8";
// رنگ تأکید در حالت روشن (برنزی تیره). باید با --accent در بخش :root[data-theme="light"] در styles.css یکی باشد.
export const ACCENT_LIGHT = "#7A5C22";

// آدرس نهایی سایت بعد از اتصال دامنه، مثلاً "https://example.com" (حتماً با https و بدون / آخر).
// با پر کردن آن، هنگام بیلد خودکار canonical، og:url، sitemap.xml و خط Sitemap در robots.txt ساخته می‌شود.
// تا دامنه‌ی نهایی مشخص نیست، خالی بماند.
export const siteUrl = "";
// (اختیاری) نام فایل تصویر پیش‌نمایش لینک داخل پوشه‌ی public، مثلاً "og.png" (ترجیحاً ۱۲۰۰×۶۳۰).
// تا لوگو آماده نیست، خالی بماند.
export const ogImage = "";

// لینک‌های منوی بالا. برچسب هر لینک (به همین ترتیب) در nav.links داخل فایل متن هر زبان است.
export const navHrefs = ["#services", "#work", "#process", "#team"];

// آیکون هر خدمت، به ترتیب خدمات در فایل متن هر زبان (services.items)
export const serviceIcons = ["web", "video", "phone", "mega"];

export const contact = {
  phone: "۰۹۱2 345 6789",
  instagram: "haft-studio",
  email: "haft-studio@gmail.com",
};

// کلید فرم Web3Forms. این کلید طبق طراحی خود سرویس عمومی است و داخل کد سایت قرار می‌گیرد.
// پیام‌های فرم به ایمیلی می‌رسد که با آن در Web3Forms ثبت‌نام کرده‌اید.
export const formAccessKey = "031767d4-8307-4f47-8f17-dc2a032458ce";
