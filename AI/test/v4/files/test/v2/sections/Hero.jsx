import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { Icon } from '../components/Icons.jsx';
import { useMagnetic } from '../hooks.js';

// هر کلمه جدا می‌شود (نه هر حرف) تا اتصال حروف فارسی خراب نشود.
const Word = ({ children, accent }) => (
  <>
    <span className="w">
      <span className={`wi ${accent ? 'accent' : ''}`}>{children}</span>
    </span>{' '}
  </>
);

export default function Hero() {
  const root = useRef(null);
  const cta1 = useMagnetic(0.3);
  const cta2 = useMagnetic(0.3);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.25 });
      tl.from('.hero .pill', { y: 24, opacity: 0, duration: 0.9 })
        .from('.hero .wi', { yPercent: 120, rotate: 5, duration: 1.2, stagger: 0.09 }, '-=0.5')
        .from('.hero .hero__text', { y: 24, opacity: 0, duration: 1 }, '-=0.7')
        .from('.hero .hero__cta > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.8')
        .from('.hero .scroll-hint', { opacity: 0, duration: 1 }, '-=0.4');

      // با اسکرول، متن آرام بالا می‌رود و محو می‌شود
      gsap.to('.hero__inner', {
        yPercent: -14,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero__inner">
        <p className="pill">
          <span className="dot" />
          استودیوی تبلیغات و تولید محتوا · تازه‌تأسیس
        </p>
        <h1 className="hero__title">
          <Word>تبلیغی</Word>
          <Word>که</Word>
          <Word accent>دیده</Word>
          <Word accent>می‌شود،</Word>
          <Word>نه</Word>
          <Word>فقط</Word>
          <Word>ساخته</Word>
          <Word>می‌شود.</Word>
        </h1>
        <p className="hero__text">
          هفت استودیو یک تیم تبلیغاتی جوان است. برای شرکت‌ها سایت طراحی می‌کنیم، ویدیوی اینستاگرام می‌سازیم و برندشان را
          در شبکه‌های اجتماعی دیدنی می‌کنیم.
        </p>
        <div className="hero__cta">
          <a ref={cta1} href="#contact" className="btn btn--solid">
            پروژه‌ات را بگو
            <Icon name="arrow" size={20} />
          </a>
          <a ref={cta2} href="#services" className="btn btn--ghost">
            دیدن خدمات
          </a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>اسکرول کن</span>
        <i />
      </div>
    </section>
  );
}
