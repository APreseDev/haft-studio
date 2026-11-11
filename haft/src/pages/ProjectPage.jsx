import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom } from '../reveal.js';
import { useLang } from '../i18n/context.js';
import { useProjects } from '../useProjects.js';
import { usePageMeta } from '../usePageMeta.js';
import { homePath, projectPath, worksPath } from '../routes.js';

const imgSrc = (src) => (/^(https?:)?\/\//.test(src) ? src : `${import.meta.env.BASE_URL}${src}`);

/** صفحه‌ی جزئیات یک نمونه‌کار. فیلدهای اختیاری (کارفرما، سال، خدمات، توضیح، نتیجه‌ها، لینک، گالری) اگر نباشند نشان داده نمی‌شوند. */
export default function ProjectPage({ slug }) {
  const { lang, t, num } = useLang();
  const projects = useProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const p = projects[index];
  const root = useRef(null);
  const tp = t.projectPage;

  usePageMeta(
    p ? `${p.title} | ${t.brand}` : `${tp.notFoundTitle} | ${t.brand}`,
    p ? p.summary || p.hint || t.meta.description : t.meta.description
  );

  useLayoutEffect(() => {
    if (!p) return;
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        fromBottom('.project__head > *', '.project__head', { stagger: 0.1 });
        fromBottom('.project__meta', '.project__meta');
        fromBottom('.project__cover', '.project__cover', { y: 40 });
        fromBottom('.project__body > *', '.project__body', { stagger: 0.1, y: 40 });
        if (root.current && root.current.querySelector('.project__gallery img')) {
          fromBottom('.project__gallery figure', '.project__gallery', { stagger: 0.12, y: 40 });
        }
        fromBottom('.project-nav > *', '.project-nav', { stagger: 0.1, y: 40 });
      },
      root
    );
    return () => mm.revert();
  }, [p]);

  if (!p) {
    return (
      <section className="section page project-page" ref={root}>
        <div className="wrap">
          <div className="head">
            <h1 className="page-title">{tp.notFoundTitle}</h1>
            <p className="sub">{tp.notFoundText}</p>
          </div>
          <a className="btn btn--solid" href={worksPath(lang)}>
            {tp.back}
          </a>
        </div>
      </section>
    );
  }

  const prev = projects[index - 1];
  const next = projects[index + 1];
  const hasMeta = p.client || p.year || (p.services && p.services.length > 0);

  return (
    <section className="section page project-page" ref={root}>
      <div className="wrap">
        <a className="back-link" href={worksPath(lang)}>
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          {tp.back}
        </a>

        <header className="project__head">
          <span className="chip">{p.tag}</span>
          <h1 className="page-title">{p.title}</h1>
          {(p.summary || p.hint) && <p className="sub">{p.summary || p.hint}</p>}
        </header>

        {hasMeta && (
          <dl className="project__meta">
            {p.client && (
              <div>
                <dt>{tp.client}</dt>
                <dd>{p.client}</dd>
              </div>
            )}
            {p.year && (
              <div>
                <dt>{tp.year}</dt>
                <dd>{num(p.year)}</dd>
              </div>
            )}
            {p.services && p.services.length > 0 && (
              <div>
                <dt>{tp.services}</dt>
                <dd>{p.services.join(t.listSeparator)}</dd>
              </div>
            )}
          </dl>
        )}

        {p.image ? (
          <img
            className="project__cover"
            src={imgSrc(p.image)}
            alt={p.alt || ''}
            width={p.width || 1600}
            height={p.height || 900}
            decoding="async"
          />
        ) : (
          <div className="project__cover project__cover--ghost card" aria-hidden="true">
            <span className="work__ghost">{num(7)}</span>
          </div>
        )}

        <div className="project__body">
          {(p.description || []).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {p.results && p.results.length > 0 && (
            <>
              <h2 className="project__h">{tp.results}</h2>
              <ul className="project__results">
                {p.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
          {p.link && (
            <a className="btn btn--solid" href={p.link} target="_blank" rel="noopener noreferrer">
              {tp.visit}
            </a>
          )}
        </div>

        {p.gallery && p.gallery.length > 0 && (
          <div className="project__gallery" aria-label={tp.gallery}>
            {p.gallery.map((g) => (
              <figure key={g.src}>
                <img
                  src={imgSrc(g.src)}
                  alt={g.alt || ''}
                  width={g.width || 1200}
                  height={g.height || 800}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        )}

        {(prev || next) && (
          <nav className="project-nav" aria-label={tp.more}>
            {prev ? (
              <a className="card project-nav__item" href={projectPath(lang, prev.slug)} data-hover>
                <span>{tp.prev}</span>
                <b>{prev.title}</b>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a className="card project-nav__item project-nav__item--next" href={projectPath(lang, next.slug)} data-hover>
                <span>{tp.next}</span>
                <b>{next.title}</b>
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}

        <div className="project-cta card">
          <h2>{tp.cta}</h2>
          <p>{tp.ctaText}</p>
          <a className="btn btn--solid" href={`${homePath(lang)}#contact`}>
            {t.nav.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
