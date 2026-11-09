import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromLeft, wipeUp } from '../reveal.js';
import { projects, workIntro } from '../data.js';
import { useTilt } from '../hooks.js';

// عنوانی که داخل [ ] باشد هنوز placeholder است. این موردها فقط در npm run dev دیده می‌شوند، نه در سایت منتشرشده.
const isPlaceholder = (t) => /^\s*\[.*\]\s*$/.test(t || '');
const visibleProjects = import.meta.env.DEV ? projects : projects.filter((p) => !isPlaceholder(p.title));

function Project({ p, wide }) {
  const tilt = useTilt(7);
  return (
    <article
      ref={tilt}
      className={`card card--glow work ${wide ? 'work--wide' : ''}${p.image ? ' work--img' : ''}`}
      data-hover
    >
      {p.image ? (
        <img
          className="work__img"
          src={`${import.meta.env.BASE_URL}${p.image}`}
          alt={p.alt || ''}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="work__ghost" aria-hidden="true">
          ۷
        </span>
      )}
      <div className="work__cap">
        <span className="chip">{p.tag}</span>
        <h3>{p.title}</h3>
        {p.hint && <span className="work__hint">{p.hint}</span>}
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
        // عنوان از چپ، کارت‌ها با پرده‌ی بالا‌رونده
        fromLeft('.work-section .head > *', '.work-section .head', { stagger: 0.12 });
        if (!root.current || !root.current.querySelector('.work-grid .work')) return; // هنوز نمونه‌کاری نیست
        wipeUp('.work', '.work-grid', { stagger: 0.16 });
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
          <p className="sub">{workIntro.sub}</p>
        </div>
        {visibleProjects.length > 0 ? (
          <div className="grid work-grid">
            {visibleProjects.map((p, i) => (
              <Project key={p.title} p={p} wide={i === 0 || i === 3} />
            ))}
          </div>
        ) : (
          <p className="card work__empty">{workIntro.empty}</p>
        )}
      </div>
    </section>
  );
}
