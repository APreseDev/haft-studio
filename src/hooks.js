import { useEffect, useRef } from 'react';
import { gsap } from './gsap.js';

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** دکمه‌ای که به سمت ماوس کشیده می‌شود. */
export function useMagnetic(strength = 0.35) {
  const elementRef = useRef(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isFinePointer() || prefersReduced()) return;
    const animateToX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
    const animateToY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });
    // رویدادهای ماوس پشت‌سرهم می‌آیند؛ فقط آخرین موقعیت نگه داشته می‌شود و در هر فریم یک بار محاسبه می‌شود
    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    const apply = () => {
      frameId = 0;
      const bounds = element.getBoundingClientRect();
      animateToX((pointerX - (bounds.left + bounds.width / 2)) * strength);
      animateToY((pointerY - (bounds.top + bounds.height / 2)) * strength);
    };
    const move = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frameId) frameId = requestAnimationFrame(apply);
    };
    const leave = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      animateToX(0);
      animateToY(0);
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [strength]);
  return elementRef;
}

/** کج‌شدن سه‌بعدی کارت با ماوس + نور دنبال‌کننده (متغیرهای --mx و --my). */
export function useTilt(maxTilt = 9) {
  const elementRef = useRef(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isFinePointer() || prefersReduced()) return;
    // به‌جای ساختن انیمیشن تازه روی هر حرکت ماوس، دو quickTo یک بار ساخته و دوباره استفاده می‌شود
    gsap.set(element, { transformPerspective: 900 });
    const animateRotationX = gsap.quickTo(element, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    const animateRotationY = gsap.quickTo(element, 'rotationY', { duration: 0.4, ease: 'power2.out' });
    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    const apply = () => {
      frameId = 0;
      const bounds = element.getBoundingClientRect(); // یک بار در هر فریم (نه یک بار برای هر رویداد)
      const relativeX = (pointerX - bounds.left) / bounds.width;
      const relativeY = (pointerY - bounds.top) / bounds.height;
      element.style.setProperty('--mx', `${relativeX * 100}%`);
      element.style.setProperty('--my', `${relativeY * 100}%`);
      animateRotationY((relativeX - 0.5) * maxTilt * 2);
      animateRotationX(-(relativeY - 0.5) * maxTilt * 2);
    };
    const move = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frameId) frameId = requestAnimationFrame(apply);
    };
    const leave = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      animateRotationX(0);
      animateRotationY(0);
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
    };
  }, [maxTilt]);
  return elementRef;
}
