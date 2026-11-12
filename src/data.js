// تنظیمات و اطلاعات مستقل از زبان. نمونه‌کارها، تیم، خدمات، مراحل کار و عبارت‌های نوار متحرک در src/database.js هستند؛
// بقیه‌ی متن‌های سایت (عنوان‌ها، فرم و ...) در src/i18n/fa.js و src/i18n/en.js.
import { services } from "./database.js";

// رنگ تأکید (زرد) در حالت تیره. اگر عوضش کردید، متغیر --accent در styles.css را هم هم‌رنگ کنید.
export const ACCENT = "#FFC93C";
// رنگ تأکید در حالت روشن برای خطوط و ذرات سه‌بعدی (زرد تیره‌تر تا روی نقره‌ای دیده شود).
export const ACCENT_LIGHT = "#C98F00";

// آدرس نهایی سایت بعد از اتصال دامنه، مثلاً "https://example.com" (حتماً با https و بدون / آخر).
// با پر کردن آن، هنگام بیلد خودکار canonical، og:url، sitemap.xml و خط Sitemap در robots.txt ساخته می‌شود.
// تا دامنه‌ی نهایی مشخص نیست، خالی بماند.
export const siteUrl = "";
// (اختیاری) نام فایل تصویر پیش‌نمایش لینک داخل پوشه‌ی public، مثلاً "og.png" (ترجیحاً ۱۲۰۰×۶۳۰).
// تا لوگو آماده نیست، خالی بماند.
export const ogImage = "og.png";

// تعداد نمونه‌کارهایی که در بخش «نمونه‌کارها»ی صفحه‌ی اصلی نشان داده می‌شود؛ بقیه فقط در صفحه‌ی «همه‌ی نمونه‌کارها» هستند.
export const homeWorkCount = 4;

// لینک‌های منوی بالا. برچسب هر لینک (به همین ترتیب) در nav.links داخل فایل متن هر زبان است.
export const navHrefs = ["#services", "#work", "#process", "#team"];

// آیکون هر خدمت، به ترتیب جدول services در src/database.js
export const serviceIcons = services.map((service) => service.icon);

export const contact = {
  phone1: "0990 860 6685",
  phone2: "0913 855 9672",
  instagram: "haft-studio",
  email: "haft-studio@gmail.com",
};

// کلید فرم Web3Forms. این کلید طبق طراحی خود سرویس عمومی است و داخل کد سایت قرار می‌گیرد.
// پیام‌های فرم به ایمیلی می‌رسد که با آن در Web3Forms ثبت‌نام کرده‌اید.
export const formAccessKey = "031767d4-8307-4f47-8f17-dc2a032458ce";
