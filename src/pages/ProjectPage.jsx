import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom } from '../reveal.js';
import { useLang } from '../i18n/context.js';
import { useProjects } from '../useProjects.js';
import { usePageMeta } from '../usePageMeta.js';
import { homePath, projectPath, worksPath } from '../routes.js';

const imgSrc = (imagePath) => (/^(https?:)?\/\//.test(imagePath) ? imagePath : `${import.meta.env.BASE_URL}${imagePath}`);

/** صفحه‌ی جزئیات یک نمونه‌کار. فیلدهای اختیاری (کارفرما، سال، خدمات، توضیح، نتیجه‌ها، لینک، گالری) اگر نباشند نشان داده نمی‌شوند. */
export default function ProjectPage({ slug }) {
  const { lang, translations, num } = useLang();
  const projects = useProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];
  const root = useRef(null);
  const projectPageText = translations.projectPage;

  usePageMeta(
    project ? `${project.title} | ${translations.brand}` : `${projectPageText.notFoundTitle} | ${translations.brand}`,
    project ? project.summary || project.hint || translations.meta.description : translations.meta.description
  );

  useLayoutEffect(() => {
    if (!project) return;
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
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
    return () => mediaContext.revert();
  }, [project]);

  if (!project) {
    return (
      <section className="section page project-page" ref={root}>
        <div className="wrap">
          <div className="head">
            <h1 className="page-title">{projectPageText.notFoundTitle}</h1>
            <p className="sub">{projectPageText.notFoundText}</p>
          </div>
          <a className="btn btn--solid" href={worksPath(lang)}>
            {projectPageText.back}
          </a>
        </div>
      </section>
    );
  }

  const prev = projects[index - 1];
  const next = projects[index + 1];
  const hasMeta = project.client || project.year || (project.services && project.services.length > 0);

  return (
    <section className="section page project-page" ref={root}>
      <div className="wrap">
        <a className="back-link" href={worksPath(lang)}>
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          {projectPageText.back}
        </a>

        <header className="project__head">
          <span className="chip">{project.tag}</span>
          <h1 className="page-title">{project.title}</h1>
          {(project.summary || project.hint) && <p className="sub">{project.summary || project.hint}</p>}
        </header>

        {hasMeta && (
          <dl className="project__meta">
            {project.client && (
              <div>
                <dt>{projectPageText.client}</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt>{projectPageText.year}</dt>
                <dd>{num(project.year)}</dd>
              </div>
            )}
            {project.services && project.services.length > 0 && (
              <div>
                <dt>{projectPageText.services}</dt>
                <dd>{project.services.join(translations.listSeparator)}</dd>
              </div>
            )}
          </dl>
        )}

        {project.image ? (
          <img
            className="project__cover"
            src={imgSrc(project.image)}
            alt={project.alt || ''}
            width={project.width || 1600}
            height={project.height || 900}
            decoding="async"
          />
        ) : (
          <div className="project__cover project__cover--ghost card" aria-hidden="true">
            <span className="work__ghost">{num(7)}</span>
          </div>
        )}

        <div className="project__body">
          {(project.description || []).map((para, paragraphIndex) => (
            <p key={paragraphIndex}>{para}</p>
          ))}
          {project.results && project.results.length > 0 && (
            <>
              <h2 className="project__h">{projectPageText.results}</h2>
              <ul className="project__results">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </>
          )}
          {project.link && (
            <a className="btn btn--solid" href={project.link} target="_blank" rel="noopener noreferrer">
              {projectPageText.visit}
            </a>
          )}
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="project__gallery" aria-label={projectPageText.gallery}>
            {project.gallery.map((galleryImage) => (
              <figure key={galleryImage.src}>
                <img
                  src={imgSrc(galleryImage.src)}
                  alt={galleryImage.alt || ''}
                  width={galleryImage.width || 1200}
                  height={galleryImage.height || 800}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        )}

        {(prev || next) && (
          <nav className="project-nav" aria-label={projectPageText.more}>
            {prev ? (
              <a className="card project-nav__item" href={projectPath(lang, prev.slug)} data-hover>
                <span>{projectPageText.prev}</span>
                <b>{prev.title}</b>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a className="card project-nav__item project-nav__item--next" href={projectPath(lang, next.slug)} data-hover>
                <span>{projectPageText.next}</span>
                <b>{next.title}</b>
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}

        <div className="project-cta card">
          <h2>{projectPageText.cta}</h2>
          <p>{projectPageText.ctaText}</p>
          <a className="btn btn--solid" href={`${homePath(lang)}#contact`}>
            {translations.nav.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
