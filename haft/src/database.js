// ===========================================================================================
//  دیتابیس موک هفت استودیو
//  همه‌ی اطلاعات تکرارشونده‌ی سایت (نمونه‌کارها، اعضای تیم، خدمات، مراحل کار، نوار متحرک) فقط همین‌جا و یک‌بار نوشته می‌شود.
//  هر متن به شکل { fa: 'متن فارسی', en: 'English text' } است و خودکار در فایل هر دو زبان پخش می‌شود
//  (src/i18n/fa.js و en.js دیگر لازم نیست دست بخورند).
//
//  قواعد:
//  • برای اضافه کردن یک مورد، «قالب کامل» بالای همان جدول را کپی کنید، داخل لیست بگذارید و مقدارها را عوض کنید.
//  • فیلد اختیاری را اگر ندارید، کلاً پاکش کنید (یا خالی بگذارید). بخشی که اطلاعاتش نباشد در سایت نشان داده نمی‌شود.
//  • اگر ترجمه‌ی انگلیسی را خالی بگذارید، در نسخه‌ی انگلیسی همان متن فارسی نشان داده می‌شود.
//  • مسیر عکس‌ها نسبت به پوشه‌ی public است (مثلاً 'products/dayan-web/hero.jpg').
//  • ترتیب موردها در لیست همان ترتیب نمایش در سایت است.
//  • این فایل فقط داده دارد؛ تنظیمات (دامنه، تماس، رنگ‌ها) در src/data.js است.
// ===========================================================================================

// ------------------------------------------------------------------------------------------
//  جدول ۱: نمونه‌کارها (projects)
//  قالب کامل یک نمونه‌کار (همه‌ی فیلدها). موردهایی که عنوانشان داخل [ ] باشد فقط در npm run dev دیده می‌شوند.
//
//  {
//    slug: 'my-project',                                  // الزامی. بخش آخر آدرس صفحه‌ی جزئیات؛ فقط حروف لاتین کوچک، عدد و خط تیره؛ یکتا
//    tag: { fa: 'طراحی سایت', en: 'Web design' },          // الزامی. دسته (فیلتر صفحه‌ی همه‌ی نمونه‌کارها)
//    title: { fa: 'نام پروژه', en: 'Project name' },       // الزامی. نام پروژه
//    hint: { fa: 'توضیح کوتاه کارت', en: 'Short card text' },   // متن کوتاه روی کارت
//    summary: { fa: 'یک جمله درباره‌ی پروژه', en: 'One sentence about the project' },  // بالای صفحه‌ی جزئیات
//    client: { fa: 'نام کارفرما', en: 'Client name' },
//    year: { fa: 1405, en: 2026 },                         // سال شمسی در فارسی و میلادی در انگلیسی
//    services: { fa: ['طراحی سایت', 'طراحی رابط'], en: ['Web design', 'UI design'] },   // خدمات انجام‌شده
//    description: { fa: ['پاراگراف اول', 'پاراگراف دوم'], en: ['Paragraph one', 'Paragraph two'] },
//    results: { fa: ['نتیجه‌ی اول', 'نتیجه‌ی دوم'], en: ['First result', 'Second result'] },
//    link: 'https://example.com',                          // لینک پروژه‌ی منتشرشده
//    image: 'products/my-project/hero.jpg',               // عکس اصلی (داخل public)
//    alt: { fa: 'توضیح عکس', en: 'Image description' },   // توضیح عکس اصلی
//    width: 1600, height: 900,                             // اختیاری: اندازه‌ی عکس اصلی (پیش‌فرض ۱۶۰۰×۹۰۰)
//    gallery: [                                            // اختیاری: عکس‌های گالری
//      { src: 'products/my-project/1.jpg', alt: { fa: 'توضیح', en: 'Description' }, width: 1200, height: 800 },
//    ],
//  },
// ------------------------------------------------------------------------------------------
export const projects = [
  {
    slug: "tasisat-dayan-website",
    tag: { fa: "طراحی سایت", en: "Web design" },
    title: {
      fa: "سایت فروشگاهی تاسیسات دایان",
      en: "Tasisat Dayan online store",
    },
    hint: {
      fa: "فروشگاه لوازم تاسیساتی مثل کولر گازی و ...",
      en: "An online store for HVAC equipment such as gas air conditioners and more",
    },
    summary: {
      fa: "طراحی سایت فروشگاهی، رابط گرافیکی و انیمیشن‌های شخصی‌سازی‌شده برای تاسیسات دایان.",
      en: "Online store design, graphic interface and custom animations for Tasisat Dayan.",
    },
    client: { fa: "تاسیسات دایان", en: "Tasisat Dayan" },
    year: { fa: 1405, en: 2026 },
    services: {
      fa: ["طراحی سایت", "طراحی رابط گرافیکی", "انیمیشن شخصی‌سازی‌شده"],
      en: ["Web design", "Graphic interface design", "Custom animation"],
    },
    image: "products/dayan-web/dayan.jfif",
    alt: {
      fa: "صفحه‌ی اصلی سایت فروشگاهی تاسیسات دایان",
      en: "Home page of the Tasisat Dayan online store",
    },
    results: {
      fa: ["رضایت کامل کارفرما", "ثبت چند فروش آنلاین"],
      en: ["Full client satisfaction", "Several online sales already recorded"],
    },
    link: "https://dayan.vercel.app",
    description: {
      fa: [
        "تاسیسات دایان نمایندگی فروش کولرهای گازی اطلس را داشت و محصولات دیگری هم برای فروش داشت، اما فروشش فقط حضوری بود.",
        "آن‌ها به ما اعتماد کردند و سایت و فروش غیرحضوری‌شان را به ما سپردند.",
      ],
      en: [
        "Tasisat Dayan was an authorized dealer of Atlas gas air conditioners and also sold other products, but they only sold in person.",
        "They trusted us with their website and with moving their sales online.",
      ],
    },
  },
  {
    slug: "project-1",
    tag: { fa: "طراحی سایت", en: "Web design" },
    title: { fa: "[نام پروژه اول]", en: "[Project one name]" },
    hint: {
      fa: "جای تصویر یا ویدیوی نمونه‌کار",
      en: "Space for a sample image or video",
    },
    summary: {
      fa: "[یک جمله درباره‌ی پروژه]",
      en: "[One sentence about the project]",
    },
    client: { fa: "[نام کارفرما]", en: "[Client name]" },
    year: { fa: 1405, en: 2026 },
    services: {
      fa: ["طراحی سایت", "طراحی رابط کاربری"],
      en: ["Web design", "UI design"],
    },
    description: {
      fa: [
        "[پاراگراف اول: هدف پروژه و چالش کارفرما]",
        "[پاراگراف دوم: کاری که انجام دادیم و نتیجه]",
      ],
      en: [
        "[Paragraph one: the goal and the client’s challenge]",
        "[Paragraph two: what we did and the result]",
      ],
    },
    results: {
      fa: ["[نتیجه‌ی اول]", "[نتیجه‌ی دوم]"],
      en: ["[First result]", "[Second result]"],
    },
  },
  {
    slug: "project-2",
    tag: { fa: "ریلز اینستاگرام", en: "Instagram reels" },
    title: { fa: "[نام پروژه دوم]", en: "[Project two name]" },
    hint: { fa: "جای نمونه‌کار", en: "Space for a sample" },
    summary: {
      fa: "[یک جمله درباره‌ی پروژه]",
      en: "[One sentence about the project]",
    },
    services: { fa: ["ساخت ریلز"], en: ["Reels production"] },
    description: { fa: ["[توضیح پروژه]"], en: ["[Project description]"] },
  },
  {
    slug: "project-3",
    tag: { fa: "کمپین تبلیغاتی", en: "Ad campaign" },
    title: { fa: "[نام پروژه سوم]", en: "[Project three name]" },
    hint: { fa: "جای نمونه‌کار", en: "Space for a sample" },
  },
  {
    slug: "project-4",
    tag: { fa: "مدیریت پیج", en: "Page management" },
    title: { fa: "[نام پروژه چهارم]", en: "[Project four name]" },
    hint: {
      fa: "جای تصویر یا ویدیوی نمونه‌کار",
      en: "Space for a sample image or video",
    },
  },
];

// ------------------------------------------------------------------------------------------
//  جدول ۲: اعضای تیم (team)
//  قالب کامل یک عضو:
//
//  {
//    name: { fa: 'علی رضایی', en: 'Ali Rezaei' },          // الزامی
//    role: { fa: 'طراح رابط کاربری', en: 'UI Designer' },   // الزامی. سمت
//    photo: 'team/ali.jpg',                                // اختیاری. عکس مربعی داخل public (بدون عکس، آیکون نشان داده می‌شود)
//  },
// ------------------------------------------------------------------------------------------
export const team = [
  {
    name: { fa: "امیرمحسن دهقان", en: "Amirmohsen Dehghan" },
    role: { fa: "مدیر و طراح سایت", en: "Executive & Web Developer" },
    photo: "./team/mohsen.jfif",
  },
  {
    name: { fa: "متین دهقان", en: "Matin dehghan" },
    role: { fa: "مدیر اجرایی و تدوین‌گر", en: "Executive & Editor" },
    photo: "./team/matin.jfif",
  },
  {
    name: { fa: "امیرحسین دشتی", en: "Amirhossein Dashti" },
    role: {
      fa: "روابط‌عمومی و تولیدمحتوا",
      en: "Public Relations & Content Manager",
    },
    photo: "./team/dashti.jfif",
  },
  {
    name: { fa: "سانیار کامه", en: "Saniar Kame" },
    role: { fa: "فیلم‌بردار و گرافیست", en: "Videographer & Graphic Designer" },
  },
];

// ------------------------------------------------------------------------------------------
//  جدول ۳: خدمات (services)
//  قالب کامل یک خدمت:
//
//  {
//    icon: 'web',                                          // الزامی. یکی از: web، video، phone، mega
//    title: { fa: 'طراحی سایت', en: 'Web design' },
//    text: { fa: 'توضیح یکی دو جمله‌ای', en: 'A sentence or two' },
//  },
// ------------------------------------------------------------------------------------------
export const services = [
  {
    icon: "web",
    title: { fa: "طراحی سایت", en: "Web design" },
    text: {
      fa: "سایت شرکتی و لندینگ‌پیج سریع، موبایل‌پسند و هماهنگ با هویت برند شما.",
      en: "Fast, mobile-friendly company sites and landing pages that match your brand identity.",
    },
  },
  {
    icon: "video",
    title: { fa: "ویدیو و ریلز اینستاگرام", en: "Instagram video & reels" },
    text: {
      fa: "ایده، فیلم‌برداری، تدوین و موشن‌گرافیک؛ ویدیوهایی که تا ثانیه آخر دیده می‌شوند.",
      en: "Idea, filming, editing and motion graphics: videos that get watched to the very last second.",
    },
  },
  {
    icon: "phone",
    title: { fa: "مدیریت محتوا و پیج", en: "Content & page management" },
    text: {
      fa: "تقویم محتوایی، طراحی پست و استوری و تولید منظم برای شبکه‌های اجتماعی برند.",
      en: "Content calendar, post and story design, and regular production for your brand’s social media.",
    },
  },
  {
    icon: "mega",
    title: { fa: "کمپین و تبلیغات", en: "Campaigns & advertising" },
    text: {
      fa: "طراحی کمپین و کریتیو تبلیغاتی برای معرفی محصول و جذب مشتری تازه.",
      en: "Campaign design and advertising creative to introduce your product and win new customers.",
    },
  },
];

// ------------------------------------------------------------------------------------------
//  جدول ۴: مراحل کار (processSteps)
//  قالب کامل یک مرحله (شماره‌ی مرحله خودکار از ترتیب ساخته می‌شود):
//
//  {
//    title: { fa: 'گفتگو و شناخت', en: 'Discovery' },
//    text: { fa: 'توضیح یکی دو جمله‌ای', en: 'A sentence or two' },
//  },
// ------------------------------------------------------------------------------------------
export const processSteps = [
  {
    title: { fa: "گفتگو و شناخت", en: "Conversation & discovery" },
    text: {
      fa: "برند، مخاطب و هدف شما را می‌شناسیم تا مسیر روشن شود.",
      en: "We get to know your brand, audience and goal so the path becomes clear.",
    },
  },
  {
    title: { fa: "ایده و استراتژی", en: "Idea & strategy" },
    text: {
      fa: "ایده‌ی خلاق و برنامه‌ی اجرا را پیش از شروع تولید با هم نهایی می‌کنیم.",
      en: "We finalize the creative idea and the execution plan together before production starts.",
    },
  },
  {
    title: { fa: "طراحی و تولید", en: "Design & production" },
    text: {
      fa: "سایت، ویدیو و محتوا ساخته می‌شود و در هر مرحله نظر شما را می‌گیریم.",
      en: "The website, video and content are made, and we ask for your feedback at every stage.",
    },
  },
  {
    title: { fa: "انتشار و رشد", en: "Launch & growth" },
    text: {
      fa: "کار را منتشر می‌کنیم و نتیجه را می‌سنجیم تا قدم بعدی بهتر باشد.",
      en: "We publish the work and measure the result so the next step is even better.",
    },
  },
];

// ------------------------------------------------------------------------------------------
//  جدول ۵: عبارت‌های نوار متحرک زیر بخش اول (marquee)
//  قالب کامل یک عبارت:
//
//  { fa: 'طراحی سایت', en: 'Web design' },
// ------------------------------------------------------------------------------------------
export const marquee = [
  { fa: "طراحی سایت", en: "Web design" },
  { fa: "ویدیو اینستاگرام", en: "Instagram video" },
  { fa: "مدیریت پیج", en: "Page management" },
  { fa: "کمپین تبلیغاتی", en: "Ad campaigns" },
];
