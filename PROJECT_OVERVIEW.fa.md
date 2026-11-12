# راهنمای کلی پروژه‌ی هفت استودیو (Haft Studio)

سایت معرفی یک استودیوی دیجیتال؛ دوزبانه (فارسی راست‌به‌چپ و انگلیسی)، با پس‌زمینه‌ی سه‌بعدی، انیمیشن اسکرول، حالت تیره/روشن و فرم تماس. کد با **JavaScript + React** نوشته شده (بدون TypeScript).

نسخه‌ی انگلیسی: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

## ۱. فناوری‌ها

| فناوری | کاربرد |
| --- | --- |
| React 19 | رابط کاربری |
| Vite 8 | اجرای توسعه و بیلد |
| GSAP + ScrollTrigger | انیمیشن‌های اسکرول |
| Three.js | صحنه‌ی سه‌بعدی پس‌زمینه (دیرهنگام بارگذاری می‌شود) |
| Lenis | اسکرول نرم |
| Vazirmatn (Fontsource) | فونت فارسی |
| Web3Forms | رساندن پیام فرم به ایمیل |

دستورها: `npm ci` نصب، `npm run dev` اجرای توسعه، `npm run lint` بررسی کد، `npm run build` بیلد نهایی (Vite و بعد `scripts/postbuild.mjs`).

## ۲. ساختار پوشه‌ها

```
haft/
├── index.html            صفحه‌ی پایه + splash (لوگوی آغازین) + اسکریپت کوچک تنظیم زبان/تم پیش از React
├── vite.config.js        تنظیم Vite (آدرس پایه از VITE_BASE)
├── eslint.config.js      قواعد lint
├── package.json          وابستگی‌ها و دستورها
├── public/               فایل‌های ایستا (بخش ۲ب)
├── scripts/postbuild.mjs ساخت HTML جدا برای هر زبان/صفحه، sitemap و robots بعد از بیلد
├── src/                  کد اصلی (پایین‌تر توضیح داده شده)
├── docs/QA-CHECKLIST.md  چک‌لیست تست دستی
├── .github/workflows/    ci.yml (lint + build) و deploy.yml (انتشار)
└── *.md                  مستندات (README، DEPLOYMENT، PROJECT_STATUS، OWNER-CONTENT، PROJECT_DOCUMENTATION)
```

### ۲ب. پوشه‌ی `public/`

| فایل | کاربرد |
| --- | --- |
| `logo-mark.png`، `logo-full.png` | لوگو (فقط مثلث / مثلث + نوشته)؛ با CSS mask رنگ می‌گیرد |
| `favicon.png`، `apple-touch-icon.png` | آیکون تب مرورگر و آیکون صفحه‌ی اصلی iOS |
| `og.png` | تصویر پیش‌نمایش لینک ۱۲۰۰×۶۳۰ (عمداً PNG؛ در `ogImage` فایل `data.js` تنظیم شده و بعد از پر شدن `siteUrl` استفاده می‌شود) |
| `team/*.webp` | عکس اعضای تیم |
| `products/<پروژه>/*.webp` | عکس نمونه‌کارها (از `database.js` به آن‌ها ارجاع داده می‌شود) |
| `robots.txt`، `404.html`، `_headers` | قواعد خزنده‌ها، صفحه‌ی ۴۰۴، هدرهای امنیتی و کش |

عکس‌ها برای کم‌حجم‌تر شدن WebP هستند. لوگوها و آیکون‌ها PNG می‌مانند (به‌خاطر CSS mask، iOS و پیش‌نمایش لینک).

## ۳. پوشه‌ی `src/`

### نقطه‌ی شروع و ساختار کلی
- **`main.jsx`**: زبان و تم را قبل از اولین نمایش اعمال می‌کند، splash را شروع می‌کند و برنامه را با ترتیب `ThemeProvider ← RouterProvider ← LangProvider ← App` رندر می‌کند.
- **`App.jsx`**: چیدمان کل صفحه. صحنه‌ی سه‌بعدی (lazy)، Cursor، نوار پیشرفت اسکرول، Nav، محتوای صفحه (بر اساس `route.page`) و Footer. اسکرول نرم Lenis و `ScrollTrigger.refresh` هم اینجا مدیریت می‌شود.
- **`splash.js`**: زمان‌بندی رفتن لوگوی آغازین (حداقل ۲٫۴ ثانیه، حداکثر ۴٫۵ ثانیه).

### داده‌ها
- **`database.js`**: «دیتابیس موک». نمونه‌کارها، تیم، خدمات، مراحل کار و عبارت‌های نوار متحرک، هر متن به شکل `{ fa, en }`. برای افزودن محتوا فقط همین فایل را ویرایش کنید.
- **`data.js`**: تنظیمات مستقل از زبان: رنگ‌های تأکید، `siteUrl`، `ogImage`، لینک‌های منو، اطلاعات تماس (`phone1` شماره‌ی اصلی و `phone2` جایگزین است؛ هر کدام لینک تماس خودش را دارد)، کلید Web3Forms.
- **`projects.js`**: `getProjects()` فهرست نمونه‌کارهای یک زبان را می‌سازد (slug خودکار و حذف placeholderها). هم سایت و هم postbuild از آن استفاده می‌کنند.
- **`useProjects.js`**: هوک React بالا برای زبان فعلی.

### چندزبانگی (`i18n/`)
- **`fa.js` / `en.js`**: متن‌های ثابت سایت (عنوان‌ها، فرم، منو و ...).
- **`locales.js`**: فهرست زبان‌ها (جهت، برچسب، دیکشنری) و `isLang`.
- **`LangProvider.jsx` + `context.js`**: `useLang()` مقدارهای `lang`، `dir`، `translations`، `setLang` و `num` را می‌دهد. زبان از آدرس می‌آید (`/` انگلیسی، `/fa/` فارسی).
- **`localizeData.js`**: داده‌ی `{fa, en}` را به متن یک زبان تبدیل می‌کند.
- **`document.js`**: تنظیم `lang`، `dir`، `<title>`، متای og، canonical و hreflang.
- **`format.js`**: ارقام فارسی/انگلیسی و جدا کردن کلمه‌های *ستاره‌دار* (برای رنگ تأکید).

### مسیریابی و تم
- **`routes.js`**: ساخت و تجزیه‌ی آدرس‌ها (`/`، `/works/`، `/works/<slug>/` و نسخه‌ی `/fa/`).
- **`router/RouterProvider.jsx` + `context.js`**: مسیریاب سبک بدون کتابخانه؛ `useRouter()` مقدارهای `pathname`، `route`، `navigate` را می‌دهد. لینک‌های داخلی واقعی‌اند ولی بدون بارگذاری مجدد باز می‌شوند.
- **`theme/ThemeProvider.jsx` + `context.js`**: حالت تیره/روشن، ذخیره در localStorage، `useTheme()`.

### صفحه‌ها و بخش‌ها
- **`pages/`**: `WorksPage.jsx` (همه‌ی نمونه‌کارها با فیلتر دسته) و `ProjectPage.jsx` (جزئیات یک نمونه‌کار).
- **`sections/`** (صفحه‌ی اصلی، به ترتیب): `Hero`، `Marquee` (نوار متحرک)، `Services`، `Work`، `Process`، `Manifesto`، `Team`، `Contact`، و `Footer`.

### کامپوننت‌ها (`components/`)
`Nav` (منو، تغییر زبان و تم)، `Scene` (بوم سه‌بعدی)، `Cursor` (نشانگر سفارشی ماوس)، `ProjectCard`، `Icons`، `Logo`، `StructuredData` (داده‌ی ساخت‌یافته‌ی Organization برای سئو).

### صحنه‌ی سه‌بعدی (`three/`)
- **`createScene.js`**: لوگوی فلزی سه‌بعدی، حلقه‌ها، شکل‌های شناور و ذرات. با اسکرول و ماوس حرکت می‌کند و اگر دستگاه کند باشد کیفیتش خودکار پایین می‌آید. خروجی‌اش `{ dispose, setTheme }` است.
- **`logoShapes.js`**: نقطه‌های هر تکه‌ی لوگو.

### ابزارهای کمکی
- **`hooks.js`**: `useMagnetic` (دکمه‌ای که به سمت ماوس کشیده می‌شود)، `useTilt` (کج‌شدن کارت)، `prefersReduced`، `isFinePointer`.
- **`reveal.js`**: انیمیشن‌های ورود با اسکرول (`fromStart`، `fromEnd`، `fromBottom`، `flipIn`، `wipeUp`، `alternateSides`).
- **`gsap.js`** و **`lenis.js`**: تنظیم GSAP و نگه‌داری نمونه‌ی مشترک Lenis.
- **`api.js`**: `sendContact()` پیام فرم را به Web3Forms می‌فرستد و هیچ‌وقت خطا پرتاب نمی‌کند (خروجی `{ ok }` یا `{ ok:false, reason }`).
- **`formUtils.js`**: تبدیل ارقام فارسی/عربی، پاک‌سازی و اعتبارسنجی شماره، تبدیل به فرمت بین‌المللی.
- **`usePageMeta.js`**: عنوان و توضیح صفحه‌های داخلی.
- **`styles.css`**: همه‌ی استایل‌ها (حدود ۱۳۶۰ خط)، شامل متغیرهای رنگ تیره/روشن.

## ۴. جریان کار برنامه

1. مرورگر `index.html` را باز می‌کند؛ splash و اسکریپت کوچک اولیه زبان و تم را بلافاصله روی `<html>` می‌گذارند.
2. `main.jsx` برنامه را بالا می‌آورد. `RouterProvider` آدرس را می‌خواند و `LangProvider` از `route.lang` زبان را می‌گیرد.
3. `App` بر اساس `route.page` (`home`، `works` یا `project`) صفحه را نشان می‌دهد. با عوض شدن زبان یا صفحه، محتوا با `key` دوباره ساخته می‌شود تا انیمیشن‌ها از نو بسازند.
4. هر بخش متن‌هایش را از `useLang().translations` می‌گیرد و انیمیشن‌هایش را با GSAP داخل `gsap.matchMedia()` می‌سازد تا برای کاربران «کاهش حرکت» اجرا نشود.
5. وقتی مرورگر بیکار است، `Scene.jsx` صحنه‌ی سه‌بعدی را دانلود و اجرا می‌کند (اگر «صرفه‌جویی در داده» روشن باشد، اجرا نمی‌شود).
6. صحنه‌ی سه‌بعدی بی‌صدا شکست می‌خورد: اگر WebGL یا بسته‌ی درخشش در دسترس نباشد، سایت بدون هیچ خروجی در کنسول به پس‌زمینه‌ی ساده برمی‌گردد.
7. فرم تماس: `Contact.jsx` ورودی را اعتبارسنجی می‌کند، با `sendContact` می‌فرستد و وضعیت را نشان می‌دهد. فیلد مخفی `botcheck` جلوی ربات‌ها را می‌گیرد.

## ۵. بیلد و انتشار

- `vite build` بسته‌ی اصلی را می‌سازد؛ سپس **`scripts/postbuild.mjs`** برای هر زبان و هر صفحه یک `index.html` جدا می‌سازد (مناسب سئو و هاست‌های ایستا). اگر `siteUrl` پر باشد، canonical، hreflang، `sitemap.xml` و خط Sitemap در `robots.txt` هم ساخته می‌شود.
- انتشار با GitHub Actions (CI) و Cloudflare Pages؛ جزئیاتش در `DEPLOYMENT.md`. هدرهای امنیتی در `public/_headers` است.

## ۶. کارهای رایج

| می‌خواهم... | کجا تغییر بدهم |
| --- | --- |
| نمونه‌کار، عضو تیم، خدمت یا مرحله‌ی کار اضافه کنم | `src/database.js` |
| متن عنوان‌ها، فرم و منو را عوض کنم | `src/i18n/fa.js` و `en.js` |
| شماره، ایمیل، اینستاگرام یا دامنه را عوض کنم | `src/data.js` |
| رنگ تأکید را عوض کنم | `ACCENT` و `ACCENT_LIGHT` در `data.js` و `--accent` در `styles.css` |
| ظاهر یا سرعت صحنه‌ی سه‌بعدی را تنظیم کنم | شیء `LOOK` بالای `three/createScene.js` |
| زبان جدید اضافه کنم | فایل متن جدید + ثبت در `locales.js` (و اسکریپت `index.html` و `postbuild.mjs`) |
| عکس نمونه‌کار بگذارم | پوشه‌ی `public/products/<نام>/` و مسیرش در `database.js` |

## ۷. هش اسکریپت `index.html`

اسکریپت کوچک داخل `index.html` (تنظیم زبان و تم قبل از React) در سیاست امنیتی `public/_headers` با هش SHA-256 مجاز شده است. اگر متن این اسکریپت را عوض کردید، هش را دوباره حساب کنید و در بخش `script-src` فایل `public/_headers` بگذارید. (هش فعلی با نسخه‌ی تغییرنام‌یافته‌ی اسکریپت هماهنگ شده است.)

## ۸. مستندات دیگر پروژه

`README.md` (شروع سریع)، `DEPLOYMENT.md` (انتشار و دامنه)، `OWNER-CONTENT.md` (اطلاعات لازم از مالک سایت) و `docs/QA-CHECKLIST.md` (چک‌لیست تست دستی).
