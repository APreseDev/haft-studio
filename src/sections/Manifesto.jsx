import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { useLang } from '../i18n/context.js';
import { parseAccentWords } from '../i18n/format.js';

/** شعار تیم. با اسکرول، کلمه‌ها یکی‌یکی روشن می‌شوند. کلمه‌های بین دو ستاره با رنگ تأکید نشان داده می‌شوند. */
export default function Manifesto() {
  const { translations } = useLang();
  const root = useRef(null);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
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
    return () => mediaContext.revert();
  }, []);

  const words = parseAccentWords(translations.manifesto);

  return (
    <section className="manifesto" ref={root}>
      <div className="wrap">
        <p className="manifesto__text">
          {words.map((word, index) => (
            <span key={index}>
              <span className="w">
                <span className={`wi ${word.accent ? 'accent' : ''}`}>{word.text}</span>
              </span>{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
