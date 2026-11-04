import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { manifesto } from '../data.js';

/** شعار تیم. با اسکرول، کلمه‌ها یکی‌یکی روشن می‌شوند. کلمه‌های بین دو ستاره با رنگ تأکید نشان داده می‌شوند. */
export default function Manifesto() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.fromTo(
          '.manifesto__text .wi',
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 60%', scrub: true },
          }
        );
      },
      root
    );
    return () => mm.revert();
  }, []);

  const words = manifesto.split(' ').filter(Boolean);

  return (
    <section className="manifesto" ref={root}>
      <div className="wrap">
        <p className="manifesto__text">
          {words.map((w, i) => {
            const accent = w.startsWith('*') && w.endsWith('*');
            const text = accent ? w.slice(1, -1) : w;
            return (
              <span key={i}>
                <span className="w">
                  <span className={`wi ${accent ? 'accent' : ''}`}>{text}</span>
                </span>{' '}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
