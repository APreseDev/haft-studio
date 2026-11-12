import { useLang } from '../i18n/context.js';
import { useTilt } from '../hooks.js';
import { projectPath } from '../routes.js';

/** کارت یک نمونه‌کار (در صفحه‌ی اصلی و صفحه‌ی همه‌ی نمونه‌کارها). کل کارت لینک صفحه‌ی جزئیات است. */
export default function ProjectCard({ project, wide = false }) {
  const { lang, num, translations } = useLang();
  const tilt = useTilt(7);
  return (
    <article
      ref={tilt}
      className={`card card--glow work ${wide ? 'work--wide' : ''}${project.image ? ' work--img' : ''}`}
      data-hover
    >
      {project.image ? (
        <img
          className="work__img"
          src={`${import.meta.env.BASE_URL}${project.image}`}
          alt={project.alt || ''}
          width={project.width || 800}
          height={project.height || 600}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="work__ghost" aria-hidden="true">
          {num(7)}
        </span>
      )}
      <div className="work__cap">
        <span className="chip">{project.tag}</span>
        <h3>{project.title}</h3>
        {project.hint && <span className="work__hint">{project.hint}</span>}
      </div>
      <a className="work__cover" href={projectPath(lang, project.slug)}>
        <span className="sr-only">
          {project.title} — {translations.work.open}
        </span>
      </a>
    </article>
  );
}
