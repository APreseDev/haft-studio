import { useEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { isFinePointer, prefersReduced } from '../hooks.js';

/** حلقه‌ای که با تأخیر دنبال ماوس می‌آید و روی لینک و دکمه بزرگ می‌شود. فقط روی دستگاه‌های ماوس‌دار. */
export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const r = ring.current;
    const d = dot.current;
    gsap.set([r, d], { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3.out' });
    const dx = gsap.quickTo(d, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(d, 'y', { duration: 0.08 });
    let shown = false;
    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.to([r, d], { opacity: 1, duration: 0.3 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };
    // pointerover با رد شدن از روی هر عنصر می‌آید؛ فقط وقتی حالت (روی لینک/دکمه بودن یا نبودن) عوض شد انیمیشن ساخته می‌شود
    let wasHot = false;
    const over = (e) => {
      const hot = !!(e.target.closest && e.target.closest('a, button, input, select, textarea, [data-hover]'));
      if (hot === wasHot) return;
      wasHot = hot;
      gsap.to(r, { scale: hot ? 2.2 : 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      r.classList.toggle('is-hot', hot);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      gsap.killTweensOf([r, d]);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
