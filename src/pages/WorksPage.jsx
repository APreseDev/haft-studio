import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom, wipeUp } from '../reveal.js';
import { useLang } from '../i18n/context.js';
import { useProjects } from '../useProjects.js';
import { usePageMeta } from '../usePageMeta.js';
import ProjectCard from '../components/ProjectCard.jsx';

/** صفحه‌ی «همه‌ی نمونه‌کارها»: همه‌ی پروژه‌ها با فیلتر دسته. */
export default function WorksPage() {
  const { translations } = useLang();
  const projects = useProjects();
  const [tag, setTag] = useState('');
  const root = useRef(null);

  const tags = useMemo(() => [...new Set(projects.map((project) => project.tag))], [projects]);
  const shown = tag ? projects.filter((project) => project.tag === tag) : projects;

  usePageMeta(`${translations.worksPage.title} | ${translations.brand}`, translations.worksPage.sub);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        fromBottom('.works-page .head > *', '.works-page .head', { stagger: 0.12 });
      },
      root
    );
    return () => mediaContext.revert();
  }, []);

  // با عوض شدن فیلتر، کارت‌های تازه با همان پرده‌ی بالا‌رونده وارد می‌شوند
  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        if (!root.current || !root.current.querySelector('.work-grid .work')) return;
        wipeUp('.work-grid .work', '.work-grid', { stagger: 0.12 });
      },
      root
    );
    return () => mediaContext.revert();
  }, [tag]);

  return (
    <section className="section page works-page" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{translations.worksPage.eyebrow}</p>
          <h1 className="page-title">{translations.worksPage.title}</h1>
          <p className="sub">{translations.worksPage.sub}</p>
        </div>

        {tags.length > 1 && (
          <div className="filters" role="group" aria-label={translations.worksPage.filterLabel}>
            <button type="button" className="chip filter" aria-pressed={tag === ''} onClick={() => setTag('')}>
              {translations.worksPage.all}
            </button>
            {tags.map((tagName) => (
              <button key={tagName} type="button" className="chip filter" aria-pressed={tag === tagName} onClick={() => setTag(tagName)}>
                {tagName}
              </button>
            ))}
          </div>
        )}

        {shown.length > 0 ? (
          <div className="grid work-grid" key={tag}>
            {shown.map((project, index) => (
              <ProjectCard key={project.slug} project={project} wide={index % 4 === 0 || index % 4 === 3} />
            ))}
          </div>
        ) : (
          <p className="card work__empty">{translations.work.empty}</p>
        )}
      </div>
    </section>
  );
}
