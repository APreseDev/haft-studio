# هفت استودیو (Haft Studio)

وب‌سایت معرفی استودیوی دیجیتال «هفت استودیو»: تک‌صفحه‌ای، فارسی و راست‌به‌چپ، با پس‌زمینه‌ی سه‌بعدی، انیمیشن هنگام اسکرول و فرم تماس.

> وضعیت پروژه، تست‌ها و کارهای باقی‌مانده: [PROJECT_STATUS.md](PROJECT_STATUS.md)
> راهنمای انتشار روی GitHub و Cloudflare Pages و اتصال دامنه: [DEPLOYMENT.md](DEPLOYMENT.md)

## فناوری‌ها

| فناوری | کاربرد |
| --- | --- |
| React 19 | رابط کاربری |
| Vite 8 | ابزار توسعه و بیلد |
| GSAP + ScrollTrigger | انیمیشن‌های اسکرول |
| Three.js | پس‌زمینه‌ی سه‌بعدی (با بارگذاری دیرهنگام) |
| Lenis | اسکرول نرم (فقط وقتی کاربر «کاهش حرکت» را روشن نکرده باشد) |
| Fontsource Vazirmatn | فونت فارسی (داخل پروژه، بدون Google Fonts) |
| Web3Forms | ارسال فرم تماس به ایمیل |

## پیش‌نیاز

Node.js نسخه‌ی ۲۲ (فایل `.nvmrc`). حداقل نسخه‌ی لازم: `^20.19.0 || >=22.12.0`.

## نصب و اجرا

```
npm ci            # نصب دقیق وابستگی‌ها از package-lock.json
npm run dev       # اجرای محیط توسعه
npm run lint      # بررسی کد
npm run build     # بیلد نهایی در پوشه‌ی dist (بعدش scripts/postbuild.mjs سئوی وابسته به دامنه را می‌سازد)
npm run preview   # دیدن نسخه‌ی بیلدشده (بهتر از dev برای تست نهایی)
```

## ویرایش محتوا

متن‌ها در دو فایل زبان هستند: `src/i18n/fa.js` (فارسی) و `src/i18n/en.js` (انگلیسی)؛ هر تغییر را در هر دو انجام دهید. تلفن، ایمیل، اینستاگرام و تنظیمات مستقل از زبان در `src/data.js` هستند. راهنمای ویرایش و اطلاعات لازم از مالک: [OWNER-CONTENT.md](OWNER-CONTENT.md). مستند فنی کامل و PRD: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

- نمونه‌کارهایی که عنوانشان هنوز داخل `[ ]` است، فقط در `npm run dev` دیده می‌شوند و در سایت منتشرشده نمایش داده نمی‌شوند.
- عکس نمونه‌کار: فایل را در `public/projects/` بگذارید و مسیر را در فیلد `image` بنویسید.

## ساختار پروژه

```
index.html               متادیتا، Open Graph و noscript
public/                  فایل‌های ثابت: عکس‌ها، لوگو و favicon، robots.txt، 404.html، _headers
src/
  main.jsx               نقطه‌ی شروع
  App.jsx                چیدمان صفحه، Lenis، بارگذاری صحنه‌ی سه‌بعدی
  data.js                تنظیمات و اطلاعات مستقل از زبان (تماس، رنگ تأکید، siteUrl)
  i18n/                  متن فارسی و انگلیسی (fa.js, en.js) و ارائه‌دهنده‌ی زبان
  theme/                 حالت تیره/روشن
  api.js                 ارسال فرم به Web3Forms
  formUtils.js           توابع کمکی فرم (اعتبارسنجی شماره و ...)
  hooks.js, reveal.js    افکت‌های تعاملی و انیمیشن ورود بخش‌ها
  gsap.js, lenis.js      راه‌اندازی GSAP و Lenis
  styles.css             همه‌ی استایل‌ها
  components/            Nav, Cursor, Icons, Logo, Scene, StructuredData
  sections/              Hero, Marquee, Services, Work, Process, Manifesto, Team, Contact, Footer
  three/createScene.js   ساخت صحنه‌ی سه‌بعدی
.github/workflows/       deploy.yml (GitHub Pages)، ci.yml (lint و build)
docs/QA-CHECKLIST.md     چک‌لیست تست دستی
scripts/postbuild.mjs    ساخت خودکار canonical، sitemap.xml و robots (بر اساس siteUrl در data.js)
```

## نکته‌ها

- اگر سایت کند بود: آدرس را با `?noscene` (بدون صحنه‌ی سه‌بعدی) یا `?lite` (نسخه‌ی سبک) باز کنید تا علت مشخص شود. صحنه‌ی سه‌بعدی روی دستگاه‌های ضعیف خودش سبک‌تر یا ثابت می‌شود.
- بعد از اتصال دامنه، فقط `siteUrl` را در `src/data.js` پر کنید.
- زبان و حالت تیره/روشن با دو دکمه در منوی بالا عوض می‌شود و در مرورگر کاربر ذخیره می‌شود. حالت تیره همان ظاهر قبلی سایت و پیش‌فرض است.
- اسکریپت کوچک داخل `index.html` زبان و حالت ذخیره‌شده را قبل از نمایش اعمال می‌کند. اگر متنش را تغییر دادید، هش آن را در `public/_headers` هم به‌روز کنید (راهنما: PROJECT_DOCUMENTATION.md، بخش ۱۴).

- `base` در `vite.config.js` پیش‌فرض `/` است. فقط برای GitHub Pages با زیرمسیر از متغیر `VITE_BASE` (در workflow) استفاده می‌شود.
- کلید Web3Forms داخل `src/data.js` عمومی است (طبق مستندات خودشان) و محرمانه نیست. هیچ اطلاعات محرمانه‌ای نباید در ریپو باشد.
