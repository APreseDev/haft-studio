import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromBottom } from '../reveal.js';
import { contact } from '../data.js';
import { useLang } from '../i18n/context.js';
import { usePageMeta } from '../usePageMeta.js';

const mailHref = `mailto:${contact.email}`;

/** صفحه‌ی حریم خصوصی. متن‌ها در بخش privacy فایل‌های src/i18n/fa.js و en.js هستند. */
export default function PrivacyPage() {
  const { translations, num } = useLang();
  const text = translations.privacy;
  const root = useRef(null);

  usePageMeta(`${text.title} | ${translations.brand}`, text.sub);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        fromBottom('.privacy-page .head > *', '.privacy-page .head', { stagger: 0.12 });
        fromBottom('.privacy__item', '.privacy__body', { stagger: 0.1, y: 40 });
      },
      root
    );
    return () => mediaContext.revert();
  }, []);

  return (
    <section className="section page privacy-page" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 className="page-title">{text.title}</h1>
          <p className="sub">{text.sub}</p>
          <p className="privacy__updated">{text.updated}</p>
        </div>

        <div className="privacy__body">
          {text.sections.map((section, index) => (
            <article className="privacy__item" key={section.title}>
              <span className="privacy__num" aria-hidden="true">
                {num(String(index + 1).padStart(2, '0'))}
              </span>
              <h2 className="privacy__h">{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {index === text.sections.length - 1 && (
                <a className="btn btn--solid" href={mailHref}>
                  {text.contactCta}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
