import { useEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { isFinePointer, prefersReduced } from '../hooks.js';

/** حلقه‌ای که با تأخیر دنبال ماوس می‌آید و روی لینک و دکمه بزرگ می‌شود. فقط روی دستگاه‌های ماوس‌دار. */
export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const ringElement = ring.current;
    const dotElement = dot.current;
    gsap.set([ringElement, dotElement], { xPercent: -50, yPercent: -50, opacity: 0 });
    const moveRingX = gsap.quickTo(ringElement, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ringElement, 'y', { duration: 0.45, ease: 'power3.out' });
    const moveDotX = gsap.quickTo(dotElement, 'x', { duration: 0.08 });
    const moveDotY = gsap.quickTo(dotElement, 'y', { duration: 0.08 });
    let shown = false;
    const move = (event) => {
      if (!shown) {
        shown = true;
        gsap.to([ringElement, dotElement], { opacity: 1, duration: 0.3 });
      }
      moveRingX(event.clientX);
      moveRingY(event.clientY);
      moveDotX(event.clientX);
      moveDotY(event.clientY);
    };
    // pointerover با رد شدن از روی هر عنصر می‌آید؛ فقط وقتی حالت (روی لینک/دکمه بودن یا نبودن) عوض شد انیمیشن ساخته می‌شود
    let wasHot = false;
    const over = (event) => {
      const isHot = !!(event.target.closest && event.target.closest('a, button, input, select, textarea, [data-hover]'));
      if (isHot === wasHot) return;
      wasHot = isHot;
      gsap.to(ringElement, { scale: isHot ? 2.2 : 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      ringElement.classList.toggle('is-hot', isHot);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      gsap.killTweensOf([ringElement, dotElement]);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
