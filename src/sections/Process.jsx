import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom, dirSign } from '../reveal.js';
import { useLang } from '../i18n/context.js';

export default function Process() {
  const { translations, num } = useLang();
  const root = useRef(null);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از پایین وارد می‌شود
        fromBottom('.process .head > *', '.process .head', { stagger: 0.12 });

        // هر قدم یک تایم‌لاین جدا دارد که کاملاً به موقعیت اسکرول وصل است (scrub):
        // ورود از سمت شروع خواندن ← ماندن ← خروج به سمت دیگر و محو شدن.
        // چون فقط به اسکرول وابسته است، اسکرول به بالا همین مسیر را برعکس می‌رود.
        // عنصرها از DOM حذف نمی‌شوند؛ فقط opacity و transform عوض می‌شود.
        const sign = dirSign(); // ورود از سمت شروع خواندن: راست در فارسی، چپ در انگلیسی
        gsap.utils.toArray('.step').forEach((step) => {
          const inner = step.querySelector('.step__inner');
          const line = step.querySelector('.step__line');
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: step, start: 'top 80%', end: 'bottom 20%', scrub: true },
          });
          timeline.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.25 }, 0)
            .fromTo(inner, { opacity: 0, xPercent: 8 * sign }, { opacity: 1, xPercent: 0, duration: 0.3, ease: 'power2.out' }, 0)
            .to(inner, { opacity: 1, xPercent: 0, duration: 0.4 }) // ماندن
            .to(inner, { opacity: 0, xPercent: -8 * sign, duration: 0.3, ease: 'power2.in' }); // خروج
        });
      },
      root
    );
    return () => mediaContext.revert();
  }, []);

  return (
    <section id="process" className="section process" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{translations.process.eyebrow}</p>
          <h2>{translations.process.title}</h2>
        </div>
      </div>
      <div className="steps">
        {translations.process.steps.map((step, index) => (
          <div className="step" key={step.title}>
            <span className="step__line" aria-hidden="true" />
            <div className="step__inner">
              <span className="step__num" aria-hidden="true">
                {num(index + 1)}
              </span>
              <div className="step__body">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
