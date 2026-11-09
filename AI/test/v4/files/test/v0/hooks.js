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
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
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
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      gsap.to(el, {
        rotationY: (px - 0.5) * max * 2,
        rotationX: -(py - 0.5) * max * 2,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const leave = () =>
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'elastic.out(1,0.6)', overwrite: 'auto' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [max]);
  return ref;
}
