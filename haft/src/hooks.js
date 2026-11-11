import { useEffect, useRef } from 'react';
import { gsap } from './gsap.js';

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** دکمه‌ای که به سمت ماوس کشیده می‌شود. */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReduced()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    // رویدادهای ماوس پشت‌سرهم می‌آیند؛ فقط آخرین موقعیت نگه داشته می‌شود و در هر فریم یک بار محاسبه می‌شود
    let raf = 0;
    let cx = 0;
    let cy = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      xTo((cx - (r.left + r.width / 2)) * strength);
      yTo((cy - (r.top + r.height / 2)) * strength);
    };
    const move = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);
  return ref;
}

/** کج‌شدن سه‌بعدی کارت با ماوس + نور دنبال‌کننده (متغیرهای --mx و --my). */
export function useTilt(max = 9) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReduced()) return;
    // به‌جای ساختن انیمیشن تازه روی هر حرکت ماوس، دو quickTo یک بار ساخته و دوباره استفاده می‌شود
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power2.out' });
    let raf = 0;
    let cx = 0;
    let cy = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect(); // یک بار در هر فریم (نه یک بار برای هر رویداد)
      const px = (cx - r.left) / r.width;
      const py = (cy - r.top) / r.height;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      ry((px - 0.5) * max * 2);
      rx(-(py - 0.5) * max * 2);
    };
    const move = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      rx(0);
      ry(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [max]);
  return ref;
}
