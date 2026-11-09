import { gsap } from './gsap.js';

// فاصله‌ی شروع حرکت: در موبایل کمتر تا از لبه‌ی صفحه خیلی دور نشود.
const dist = () => (window.innerWidth < 769 ? 48 : 150);
const at = (trigger, start = 'top 82%') => ({ trigger, start });

/** از راست وارد می‌شود (سمت شروع خواندن فارسی). */
export const fromRight = (targets, trigger, vars = {}) =>
  gsap.from(targets, { x: dist(), opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: at(trigger), ...vars });

/** از چپ وارد می‌شود. */
export const fromLeft = (targets, trigger, vars = {}) =>
  gsap.from(targets, { x: -dist(), opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: at(trigger), ...vars });

/** از پایین بالا می‌آید. */
export const fromBottom = (targets, trigger, vars = {}) =>
  gsap.from(targets, { y: 90, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: at(trigger), ...vars });

/** یکی در میان از راست و چپ، با کمی چرخش سه‌بعدی. */
export const alternateSides = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    x: (i) => (i % 2 === 0 ? 1 : -1) * dist(),
    rotationY: (i) => (i % 2 === 0 ? -22 : 22),
    transformPerspective: 900,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: at(trigger),
    ...vars,
  });

/** با پرده‌ی بالا‌رونده باز می‌شود (clip-path) و کمی بزرگ می‌شود. */
export const wipeUp = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    y: 120,
    scale: 0.92,
    opacity: 0,
    clipPath: 'inset(100% 0% 0% 0% round 26px)',
    clearProps: 'clipPath',
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: at(trigger),
    ...vars,
  });

/** مثل ورق‌زدن کارت: از پهلو می‌چرخد و بزرگ می‌شود. */
export const flipIn = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    rotationY: (i) => (i % 2 === 0 ? -80 : 80),
    scale: 0.85,
    transformPerspective: 800,
    opacity: 0,
    duration: 1.2,
    ease: 'back.out(1.2)',
    scrollTrigger: at(trigger),
    ...vars,
  });
