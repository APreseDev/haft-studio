# راهنمای انتشار: GitHub، Cloudflare Pages و دامنه

> این راهنما با مستندات رسمی Cloudflare و کد واقعی پروژه تطبیق داده شده، ولی **انتشار واقعی هنوز انجام و آزمایش نشده است.** نام دکمه‌ها در داشبورد Cloudflare و GitHub ممکن است کمی فرق کند.

## ۱. تنظیمات بیلد

| مورد | مقدار |
| --- | --- |
| Install | `npm ci` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Root directory | خالی (ریشه‌ی ریپو) |
| Node.js | از `.nvmrc` (نسخه‌ی ۲۲). پیش‌فرض Cloudflare Pages هم ۲۲ است |
| `VITE_BASE` | **تنظیم نکنید.** (پیش‌فرض `/` برای دامنه‌ی اختصاصی و Cloudflare درست است) |
| متغیر محیطی دیگر | لازم نیست |

سایت تک‌صفحه‌ای است و روتر سمت کاربر ندارد؛ پس **SPA fallback و `_redirects` لازم نیست.** چون `public/404.html` وجود دارد، Cloudflare Pages برای آدرس‌های اشتباه همان صفحه را با کد ۴۰۴ نشان می‌دهد (طبق مستندات Cloudflare؛ روی دامنه‌ی شما هنوز آزمایش نشده). هدرهای امنیتی در `public/_headers` هستند.

## ۲. تنظیم GitHub

۱. ریپوی جدید بسازید (Private یا Public) با شاخه‌ی اصلی `main`.

**روش ساده (بدون دستور و بدون نصب چیزی):**

1. فایل زیپ پروژه را از حالت فشرده خارج کنید.
2. در صفحه‌ی ریپوی خالی GitHub روی **uploading an existing file** کلیک کنید، همه‌ی فایل‌ها و پوشه‌های داخل پوشه‌ی `files` (نه خود پوشه) را بکشید و رها کنید و **Commit changes** را بزنید.
3. اگر پوشه‌های مخفی (مثل `.github`) آپلود نشدند مشکلی نیست؛ برای مسیر Cloudflare لازم نیستند.

**روش با دستور (اختیاری):**

```
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin <آدرس ریپو>
git push -u origin main
```

۲. شاخه‌ی اصلی باید `main` باشد (workflowها روی `main` تنظیم شده‌اند).
۳. Settings → Actions → General: اجرای Actions فعال باشد.
۴. توصیه: احراز هویت دومرحله‌ای، فعال‌کردن Dependabot alerts و Secret scanning، و محافظت از شاخه‌ی `main`.
۵. اگر `.github` آپلود شده باشد، بعد از اولین push در تب Actions، workflow به نام **CI** (lint و build و npm audit) اجرا می‌شود. اگر lint خطا داد، متن آن را بفرستید؛ این روی انتشار Cloudflare اثری ندارد.

### workflowها

- `ci.yml`: روی pull request و شاخه‌های غیر `main` اجرا می‌شود (`npm ci`، `lint`، `build`، و `npm audit` که فقط گزارش می‌دهد).
- `deploy.yml` (انتشار روی GitHub Pages): اگر با **Cloudflare Pages** منتشر می‌کنید، لازم نیست. در تب Actions آن را **Disable** کنید (فایل حذف نشده است) تا با هر push یک اجرای ناموفق نداشته باشید. اگر می‌خواهید با GitHub Pages منتشر کنید: Settings → Pages → Source را روی **GitHub Actions** بگذارید.

## ۳. ساخت پروژه‌ی Cloudflare Pages

1. داشبورد Cloudflare ← Workers & Pages ← Create ← **Pages** ← Connect to Git ← ریپو را انتخاب کنید.
2. Production branch را `main` بگذارید، Framework preset را `None` یا `Vite`، و Build command و Output directory را مطابق جدول بالا.
3. Save and Deploy. آدرس `<نام-پروژه>.pages.dev` ساخته می‌شود.
4. از این به بعد هر push روی `main` خودکار منتشر می‌شود و هر شاخه یا pull request یک آدرس پیش‌نمایش جدا دارد.

### آزمایش روی `pages.dev` (قبل از دامنه)

از چک‌لیست `docs/QA-CHECKLIST.md` استفاده کنید. مهم‌ترین‌ها: باز شدن سایت روی موبایل و دسکتاپ، نبودن خطای Console، ارسال واقعی فرم، صفحه‌ی ۴۰۴ برای آدرس اشتباه، و نبودن خطای CSP.

## ۴. دامنه

### انتخاب آدرس اصلی (Canonical)

یکی را انتخاب کنید (پیشنهاد: بدون `www`، یعنی `example.com`) و دیگری را به آن ریدایرکت کنید.

**کار شما فقط همین است:** بعد از اینکه دامنه وصل شد، در فایل `src/data.js` مقدار `siteUrl` را بنویسید، مثلاً `"https://example.com"` (با https، بدون `/` آخر). در بیلد بعدی، `canonical`، `og:url`، `sitemap.xml` و خط `Sitemap:` در `robots.txt` خودکار ساخته می‌شوند. اگر مقدار را اشتباه بنویسید، فقط هشدار در لاگ بیلد می‌آید و سایت همچنان منتشر می‌شود.

### اتصال دامنه‌ی اصلی (apex)

طبق مستندات Cloudflare، برای دامنه‌ی اصلی (مثل `example.com`) دامنه باید **Zone** در همان حساب Cloudflare باشد (تغییر Nameserver):

1. **خرید دامنه با خودتان است** (پرداخت و احراز هویت).
2. Cloudflare ← Add a domain ← دامنه را وارد کنید ← پلن Free. دو Nameserver به شما داده می‌شود.
3. در پنل ثبت‌کننده‌ی دامنه Nameserverها را با همان دو مورد عوض کنید. محل این تنظیم در هر رجیستراری فرق می‌کند. (برای دامنه‌ی `.ir` از پنل رجیستراری ایرانی انجام می‌شود؛ قبول‌شدن آن در Cloudflare هنگام افزودن دامنه چک شود. از اینجا تأیید نشده.)
4. صبر کنید تا وضعیت دامنه در Cloudflare **Active** شود.
5. Workers & Pages ← پروژه ← Custom domains ← Set up a domain ← `example.com`. Cloudflare رکورد CNAME را خودش می‌سازد.

**هشدار:** رکورد CNAME را قبل از مرحله‌ی ۵ دستی نسازید؛ دامنه کار نمی‌کند (خطای ۵۲۲).

اگر فقط ساب‌دامین می‌خواهید (مثل `www.example.com`) و Nameserver را عوض نمی‌کنید: ابتدا دامنه را در Pages اضافه کنید، بعد در DNS فعلی یک CNAME به `<نام-پروژه>.pages.dev` بسازید.

### DNS

- DNS دامنه‌ی اصلی را Cloudflare مدیریت می‌کند (بعد از تغییر Nameserver) و رکورد را خودش می‌سازد.
- رکوردهای قبلی دامنه (مثل ایمیل) را قبل از تغییر Nameserver در Cloudflare وارد کنید، وگرنه از کار می‌افتند.
- اگر رکورد CAA دارید، صادرکننده‌های گواهی Cloudflare را مجاز کنید.

### ریدایرکت `www` به دامنه‌ی اصلی (راهنمای رسمی Cloudflare)

1. Bulk Redirects ← یک لیست بسازید: Source `www.example.com`، Target `https://example.com`، Status `301`، و گزینه‌های Preserve query string، Subpath matching، Preserve path suffix و Include subdomains. بعد یک Bulk Redirect rule با آن لیست بسازید.
2. DNS ← رکورد `A` برای `www` با مقدار `192.0.2.1` و حالت **Proxied** (فقط برای اینکه Cloudflare بتواند ریدایرکت را پاسخ دهد).
3. آزمایش: `curl --head -i https://www.example.com/` باید `301` و `location` درست نشان دهد.

اگر `www` را آدرس اصلی کردید، معکوس این کار را انجام دهید و `www` را به‌عنوان Custom domain اضافه کنید.

### SSL و HTTPS

- گواهی برای دامنه‌ی متصل‌شده به Pages خودکار صادر می‌شود. تا وقتی وضعیت **Verifying** است صبر کنید.
- SSL/TLS ← Overview: حالت **Full (strict)**.
- بعد از اینکه سایت روی HTTPS درست باز شد: SSL/TLS ← Edge Certificates ← **Always Use HTTPS** را روشن کنید.
- **HSTS** را فقط بعد از اطمینان کامل و با `max-age` کوتاه (مثلاً یک ماه، بدون preload) روشن کنید؛ برگرداندنش سخت است.
- هدر `Content-Security-Policy-Report-Only` در `public/_headers` فعلاً فقط گزارش می‌دهد. اگر در Console خطای CSP نبود، نامش را به `Content-Security-Policy` تغییر دهید.

### بعد از اتصال دامنه

- (اختیاری) ریدایرکت `*.pages.dev` به دامنه‌ی اصلی با Bulk Redirects (راهنمای رسمی: Redirect `*.pages.dev` to a custom domain).
- ثبت سایت در Google Search Console.
- `siteUrl` را در `src/data.js` پر کنید (بخش «انتخاب آدرس اصلی»).

## ۵. به‌روزرسانی و بازگشت به نسخه‌ی قبل

- به‌روزرسانی: تغییرها را commit و روی `main` push کنید؛ انتشار خودکار است.
- بازگشت: Pages ← Deployments ← انتشار قبلی ← Rollback.

## ۶. عیب‌یابی

| مشکل | علت محتمل | راه‌حل |
| --- | --- | --- |
| بیلد روی Cloudflare خطا می‌دهد | نسخه‌ی Node یا lockfile | نسخه‌ی Node باید ≥ ۲۰٫۱۹ یا ≥ ۲۲٫۱۲ باشد (`NODE_VERSION` را روی `22` بگذارید). متن خطا را بفرستید |
| صفحه سفید یا فایل‌ها لود نمی‌شوند | `VITE_BASE` اشتباهاً تنظیم شده | متغیر `VITE_BASE` را در Cloudflare حذف کنید |
| خطای ۵۲۲ روی دامنه | CNAME قبل از افزودن دامنه به Pages ساخته شده | دامنه را در Pages ← Custom domains اضافه کنید |
| «Verifying» تمام نمی‌شود | رکورد CAA سخت‌گیر، ریدایرکت یا Access که مسیر تأیید را می‌بندد | مانع را بردارید و صبر کنید |
| `www` کار نمی‌کند | `www` هنوز رکورد یا ریدایرکت ندارد | بخش ریدایرکت `www` را انجام دهید |
| آدرس اشتباه صفحه‌ی اصلی را نشان می‌دهد | `404.html` منتشر نشده | مطمئن شوید `public/404.html` در `dist` هست |
| عکس تیم یا فایلی ۴۰۴ می‌دهد | حروف بزرگ و کوچک نام فایل (Linux حساس است) | نام فایل را دقیقاً مطابق `data.js` بنویسید |
| فرم ارسال نمی‌شود | سهمیه‌ی ماهانه‌ی Web3Forms (پلن رایگان ۲۵۰ ارسال)، یا قطع اینترنت | داشبورد Web3Forms و پوشه‌ی Spam ایمیل را چک کنید |
| خطای CSP در Console | سیاست CSP بیش‌ازحد سخت‌گیر است | هدر را در حالت Report-Only نگه دارید و خطا را بفرستید |
| اجرای ناموفق در Actions با هر push | workflow قدیمی GitHub Pages فعال است | آن را Disable کنید یا Pages را روی GitHub Actions تنظیم کنید |
| تغییر منتشر شد ولی قدیمی دیده می‌شود | کش مرورگر | Hard refresh؛ روی دامنه کش دستی تنظیم نکنید |

## ۷. نکته: Pages یا Workers؟

Cloudflare برای پروژه‌های جدید استفاده از Workers (Static Assets) را پیشنهاد می‌کند، ولی Pages هنوز پشتیبانی می‌شود و برای این سایت ساده کافی است. در صورت مهاجرت به Workers باید `not_found_handling` را روی `404-page` بگذارید.
