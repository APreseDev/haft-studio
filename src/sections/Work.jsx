import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromEnd, wipeUp } from '../reveal.js';
import { useLang } from '../i18n/context.js';
import ProjectCard from '../components/ProjectCard.jsx';
import { useProjects } from '../useProjects.js';
import { homeWorkCount } from '../data.js';
import { worksPath } from '../routes.js';

export default function Work() {
  const { lang, t } = useLang();
  const projects = useProjects();
  // در صفحه‌ی اصلی فقط چند نمونه‌ی اول؛ بقیه در صفحه‌ی «همه‌ی نمونه‌کارها»
  const visibleProjects = projects.slice(0, homeWorkCount);
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از سمت پایان خواندن، کارت‌ها با پرده‌ی بالا‌رونده
        fromEnd('.work-section .head > *', '.work-section .head', { stagger: 0.12 });
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
          <p className="eyebrow">{t.work.eyebrow}</p>
          <h2>{t.work.title}</h2>
          <p className="sub">{t.work.sub}</p>
        </div>
        {visibleProjects.length > 0 ? (
          <div className="grid work-grid">
            {visibleProjects.map((p, i) => (
              <ProjectCard key={p.slug} p={p} wide={i === 0 || i === 3} />
            ))}
          </div>
        ) : (
          <p className="card work__empty">{t.work.empty}</p>
        )}
        {projects.length > 0 && (
          <div className="work__more">
            <a className="btn btn--ghost" href={worksPath(lang)}>
              {t.work.viewAll}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
