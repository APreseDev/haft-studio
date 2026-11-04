import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom, fromRight } from '../reveal.js';
import { steps } from '../data.js';

const FA = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export default function Process() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از پایین، قدم‌ها یکی‌یکی از راست (به ترتیب خواندن فارسی)
        fromBottom('.process .head > *', '.process .head', { stagger: 0.12 });
        fromRight('.step', '.steps', { stagger: 0.2 });
        // خط بالای هر قدم با اسکرول کشیده می‌شود
        gsap.fromTo(
          '.step__line',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            stagger: 0.15,
            scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 70%', scrub: true },
          }
        );
      },
      root
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="process" className="section process" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">۰۳ — روش کار</p>
          <h2>از اولین گفتگو تا انتشار، در چهار قدم.</h2>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <span className="step__line" aria-hidden="true" />
              <span className="step__num" aria-hidden="true">
                {FA[i]}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
