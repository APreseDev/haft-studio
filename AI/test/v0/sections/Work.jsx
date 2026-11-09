import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { projects } from '../data.js';
import { useTilt } from '../hooks.js';

function Project({ p, wide }) {
  const tilt = useTilt(7);
  return (
    <article ref={tilt} className={`card card--glow work ${wide ? 'work--wide' : ''}`} data-hover>
      <span className="work__ghost" aria-hidden="true">
        ۷
      </span>
      <div className="work__cap">
        <span className="chip">{p.tag}</span>
        <b>{p.title}</b>
        <span className="work__hint">{p.hint}</span>
      </div>
    </article>
  );
}

export default function Work() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.work-section .head > *', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-section .head', start: 'top 80%' },
        });
        gsap.from('.work', {
          y: 80,
          opacity: 0,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-grid', start: 'top 80%' },
        });
        // عدد ۷ بزرگ پشت هر کارت کمی آرام‌تر از کارت حرکت می‌کند
        gsap.utils.toArray('.work__ghost').forEach((g) => {
          gsap.to(g, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: g.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      },
      root
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="work" className="section work-section" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">۰۲ — نمونه‌کارها</p>
          <h2>کارهایی که حرف می‌زنند.</h2>
          <p className="sub">اولین پروژه‌های هفت استودیو این‌جا می‌نشینند. هر کادر جای یک نمونه‌کار است.</p>
        </div>
        <div className="grid work-grid">
          {projects.map((p, i) => (
            <Project key={p.title} p={p} wide={i === 0 || i === 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
