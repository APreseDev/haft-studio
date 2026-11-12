// صفحه‌ی آغازین (لوگوی هفت استودیو): HTML و CSS آن داخل index.html است تا پیش از رسیدن جاوااسکریپت هم فوراً دیده شود.
// این‌جا فقط تعیین می‌شود چه زمانی برود: بعد از حداقل MIN میلی‌ثانیه از شروع بازشدن صفحه و همین‌که صفحه و فونت‌ها آماده شدند،
// ولی نهایتاً بعد از MAX (تا اگر چیزی دیر لود شد، کاربر بیش از حد منتظر نماند).
const MIN_VISIBLE_MS = 2400; // حداقل زمان نمایش لوگو (میلی‌ثانیه از شروع بارگذاری)
const MAX_WAIT_MS = 4500; // سقف زمان انتظار
const FADE = 600; // مدت محو شدن (باید با transition در index.html یکی باشد)
const HERO_DELAY = 350; // انیمیشن ورود بخش اول کمی بعد از شروع محو شدن لوگو شروع می‌شود

let resolveDone;
/** وقتی لوگوی آغازین در حال رفتن است resolve می‌شود؛ انیمیشن ورود بخش اول منتظر آن می‌ماند. */
export const splashDone = new Promise((resolve) => {
  resolveDone = resolve;
});

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, Math.max(0, milliseconds)));

export function startSplash() {
  const splashElement = document.getElementById('splash');
  if (!splashElement) {
    resolveDone();
    return;
  }

  // تا وقتی لوگو دیده می‌شود، اسکرول صفحه‌ی پشتش بسته است (بدون overflow: hidden تا عرض صفحه و محاسبه‌ی انیمیشن‌ها عوض نشود)
  const block = (event) => event.preventDefault();
  window.addEventListener('wheel', block, { passive: false });
  window.addEventListener('touchmove', block, { passive: false });

  const loaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  const fonts = (document.fonts && document.fonts.ready) || Promise.resolve();

  Promise.race([
    Promise.all([loaded, fonts]).then(() => wait(MIN_VISIBLE_MS - performance.now())),
    wait(MAX_WAIT_MS - performance.now()),
  ]).then(() => {
    window.removeEventListener('wheel', block);
    window.removeEventListener('touchmove', block);
    splashElement.classList.add('is-hidden');
    setTimeout(resolveDone, HERO_DELAY);
    setTimeout(() => splashElement.remove(), FADE + 100);
  });
}
