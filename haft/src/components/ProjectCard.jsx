import { useLang } from '../i18n/context.js';
import { useTilt } from '../hooks.js';
import { projectPath } from '../routes.js';

/** کارت یک نمونه‌کار (در صفحه‌ی اصلی و صفحه‌ی همه‌ی نمونه‌کارها). کل کارت لینک صفحه‌ی جزئیات است. */
export default function ProjectCard({ p, wide = false }) {
  const { lang, num, t } = useLang();
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
          width={p.width || 800}
          height={p.height || 600}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="work__ghost" aria-hidden="true">
          {num(7)}
        </span>
      )}
      <div className="work__cap">
        <span className="chip">{p.tag}</span>
        <h3>{p.title}</h3>
        {p.hint && <span className="work__hint">{p.hint}</span>}
      </div>
      <a className="work__cover" href={projectPath(lang, p.slug)}>
        <span className="sr-only">
          {p.title} — {t.work.open}
        </span>
      </a>
    </article>
  );
}
