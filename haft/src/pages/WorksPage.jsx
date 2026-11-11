import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom, wipeUp } from '../reveal.js';
import { useLang } from '../i18n/context.js';
import { useProjects } from '../useProjects.js';
import { usePageMeta } from '../usePageMeta.js';
import ProjectCard from '../components/ProjectCard.jsx';

/** صفحه‌ی «همه‌ی نمونه‌کارها»: همه‌ی پروژه‌ها با فیلتر دسته. */
export default function WorksPage() {
  const { t } = useLang();
  const projects = useProjects();
  const [tag, setTag] = useState('');
  const root = useRef(null);

  const tags = useMemo(() => [...new Set(projects.map((p) => p.tag))], [projects]);
  const shown = tag ? projects.filter((p) => p.tag === tag) : projects;

  usePageMeta(`${t.worksPage.title} | ${t.brand}`, t.worksPage.sub);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        fromBottom('.works-page .head > *', '.works-page .head', { stagger: 0.12 });
      },
      root
    );
    return () => mm.revert();
  }, []);

  // با عوض شدن فیلتر، کارت‌های تازه با همان پرده‌ی بالا‌رونده وارد می‌شوند
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        if (!root.current || !root.current.querySelector('.work-grid .work')) return;
        wipeUp('.work-grid .work', '.work-grid', { stagger: 0.12 });
      },
      root
    );
    return () => mm.revert();
  }, [tag]);

  return (
    <section className="section page works-page" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{t.worksPage.eyebrow}</p>
          <h1 className="page-title">{t.worksPage.title}</h1>
          <p className="sub">{t.worksPage.sub}</p>
        </div>

        {tags.length > 1 && (
          <div className="filters" role="group" aria-label={t.worksPage.filterLabel}>
            <button type="button" className="chip filter" aria-pressed={tag === ''} onClick={() => setTag('')}>
              {t.worksPage.all}
            </button>
            {tags.map((x) => (
              <button key={x} type="button" className="chip filter" aria-pressed={tag === x} onClick={() => setTag(x)}>
                {x}
              </button>
            ))}
          </div>
        )}

        {shown.length > 0 ? (
          <div className="grid work-grid" key={tag}>
            {shown.map((p, i) => (
              <ProjectCard key={p.slug} p={p} wide={i % 4 === 0 || i % 4 === 3} />
            ))}
          </div>
        ) : (
          <p className="card work__empty">{t.work.empty}</p>
        )}
      </div>
    </section>
  );
}
