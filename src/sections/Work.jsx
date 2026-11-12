import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromEnd, wipeUp } from '../reveal.js';
import { useLang } from '../i18n/context.js';
import ProjectCard from '../components/ProjectCard.jsx';
import { useProjects } from '../useProjects.js';
import { homeWorkCount } from '../data.js';
import { worksPath } from '../routes.js';

export default function Work() {
  const { lang, translations } = useLang();
  const projects = useProjects();
  // در صفحه‌ی اصلی فقط چند نمونه‌ی اول؛ بقیه در صفحه‌ی «همه‌ی نمونه‌کارها»
  const visibleProjects = projects.slice(0, homeWorkCount);
  const root = useRef(null);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از سمت پایان خواندن، کارت‌ها با پرده‌ی بالا‌رونده
        fromEnd('.work-section .head > *', '.work-section .head', { stagger: 0.12 });
        if (!root.current || !root.current.querySelector('.work-grid .work')) return; // هنوز نمونه‌کاری نیست
        wipeUp('.work', '.work-grid', { stagger: 0.16 });
        // عدد ۷ بزرگ پشت هر کارت کمی آرام‌تر از کارت حرکت می‌کند
        gsap.utils.toArray('.work__ghost').forEach((ghost) => {
          gsap.to(ghost, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: ghost.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      },
      root
    );
    return () => mediaContext.revert();
  }, []);

  return (
    <section id="work" className="section work-section" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{translations.work.eyebrow}</p>
          <h2>{translations.work.title}</h2>
          <p className="sub">{translations.work.sub}</p>
        </div>
        {visibleProjects.length > 0 ? (
          <div className="grid work-grid">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} wide={index === 0 || index === 3} />
            ))}
          </div>
        ) : (
          <p className="card work__empty">{translations.work.empty}</p>
        )}
        {projects.length > 0 && (
          <div className="work__more">
            <a className="btn btn--ghost" href={worksPath(lang)}>
              {translations.work.viewAll}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
