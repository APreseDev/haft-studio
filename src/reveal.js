import { gsap } from './gsap.js';

// فاصله‌ی شروع حرکت: در موبایل کمتر تا از لبه‌ی صفحه خیلی دور نشود.
const dist = () => (window.innerWidth < 769 ? 32 : 90);
const at = (trigger, start = 'top 82%') => ({ trigger, start });

/** جهت صفحه: ۱ برای راست‌به‌چپ (فارسی) و ۱- برای چپ‌به‌راست (انگلیسی). از attribute صفحه خوانده می‌شود. */
export const dirSign = () => (document.documentElement.getAttribute('dir') === 'ltr' ? -1 : 1);

/** از سمت شروع خواندن وارد می‌شود (در فارسی از راست، در انگلیسی از چپ). */
export const fromStart = (targets, trigger, vars = {}) =>
  gsap.from(targets, { x: dirSign() * dist(), opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: at(trigger), ...vars });

/** از سمت پایان خواندن وارد می‌شود (در فارسی از چپ، در انگلیسی از راست). */
export const fromEnd = (targets, trigger, vars = {}) =>
  gsap.from(targets, { x: -dirSign() * dist(), opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: at(trigger), ...vars });

/** از پایین بالا می‌آید. */
export const fromBottom = (targets, trigger, vars = {}) =>
  gsap.from(targets, { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: at(trigger), ...vars });

/** یکی در میان از راست و چپ، با کمی چرخش سه‌بعدی. */
export const alternateSides = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    x: (i) => (i % 2 === 0 ? 1 : -1) * dist(),
    rotationY: (i) => (i % 2 === 0 ? -12 : 12),
    transformPerspective: 900,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: at(trigger),
    ...vars,
  });

/** از پایین بالا می‌آید و کمی بزرگ می‌شود. (clip-path حذف شد: در هر فریم دوباره رسم می‌شد و سنگین بود؛ حالا فقط transform و opacity) */
export const wipeUp = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    y: 80,
    scale: 0.94,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: at(trigger),
    ...vars,
  });

/** مثل ورق‌زدن کارت: از پهلو می‌چرخد و بزرگ می‌شود. */
export const flipIn = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    rotationY: (i) => (i % 2 === 0 ? -50 : 50),
    scale: 0.9,
    transformPerspective: 800,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: at(trigger),
    ...vars,
  });
