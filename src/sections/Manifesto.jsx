import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n/context.js';
import { parseAccentWords } from '../i18n/format.js';

/** شعار تیم. با اسکرول، کلمه‌ها یکی‌یکی روشن می‌شوند. کلمه‌های بین دو ستاره با رنگ تأکید نشان داده می‌شوند. */
export default function Manifesto() {
  const { t } = useLang();
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

  const words = parseAccentWords(t.manifesto);

  return (
    <section className="manifesto" ref={root}>
      <div className="wrap">
        <p className="manifesto__text">
          {words.map((w, i) => (
            <span key={i}>
              <span className="w">
                <span className={`wi ${w.accent ? 'accent' : ''}`}>{w.text}</span>
              </span>{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
