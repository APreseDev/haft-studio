import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { splashDone } from '../splash.js';
import { Icon } from '../components/Icons.jsx';
import { useMagnetic } from '../hooks.js';
import { useLang } from '../i18n/context.js';
import { parseAccentWords } from '../i18n/format.js';

// هر کلمه جدا می‌شود (نه هر حرف) تا اتصال حروف فارسی خراب نشود.
const Word = ({ children, accent }) => (
  <>
    <span className="w">
      <span className={`wi ${accent ? 'accent' : ''}`}>{children}</span>
    </span>{' '}
  </>
);

export default function Hero() {
  const { translations } = useLang();
  const root = useRef(null);
  const cta1 = useMagnetic(0.3);
  const cta2 = useMagnetic(0.3);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add('(prefers-reduced-motion: no-preference)', () => {
      // تا وقتی لوگوی آغازین در حال رفتن نیست، ورود بخش اول شروع نمی‌شود (وگرنه پشت لوگو اجرا می‌شد و دیده نمی‌شد)
      const timeline = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1, paused: true });
      splashDone.then(() => timeline.play());
      timeline.from('.hero .pill', { y: 20, opacity: 0, duration: 0.7 })
        .from('.hero .wi', { yPercent: 120, rotate: 5, duration: 0.9, stagger: 0.06 }, '-=0.45')
        .from('.hero .hero__text', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero .hero__cta > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.6')
        .from('.hero .scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.3');

      // با اسکرول، متن آرام بالا می‌رود و محو می‌شود
      gsap.to('.hero__inner', {
        yPercent: -14,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => mediaContext.revert();
  }, []);

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero__inner">
        <p className="pill">
          <span className="dot" />
          {translations.hero.pill}
        </p>
        <h1 className="hero__title">
          {parseAccentWords(translations.hero.title).map((word, index) => (
            <Word key={index} accent={word.accent}>
              {word.text}
            </Word>
          ))}
        </h1>
        <p className="hero__text">
          {translations.hero.text}
        </p>
        <div className="hero__cta">
          <a ref={cta1} href="#contact" className="btn btn--solid">
            {translations.hero.cta1}
            <Icon name="arrow" size={20} />
          </a>
          <a ref={cta2} href="#services" className="btn btn--ghost">
            {translations.hero.cta2}
          </a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>{translations.hero.scroll}</span>
        <i />
      </div>
    </section>
  );
}
