import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromStart, alternateSides } from '../reveal.js';
import { Icon } from '../components/Icons.jsx';
import { serviceIcons } from '../data.js';
import { useLang } from '../i18n/context.js';
import { useTilt } from '../hooks.js';

function Card({ s, i }) {
  const { num } = useLang();
  const tilt = useTilt(8);
  return (
    <article ref={tilt} className="card card--glow service">
      <div className="service__top">
        <span className="service__icon">
          <Icon name={serviceIcons[i]} />
        </span>
        <span className="service__n">{num(String(i + 1).padStart(2, '0'))}</span>
      </div>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
    </article>
  );
}

export default function Services() {
  const { t } = useLang();
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از سمت شروع خواندن، کارت‌ها یکی در میان از دو طرف
        fromStart('.services .head > *', '.services .head', { stagger: 0.12 });
        alternateSides('.services .service', '.services .grid', { stagger: 0.14 });
      },
      root
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="section services" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2>{t.services.title}</h2>
        </div>
        <div className="grid grid--4">
          {t.services.items.map((s, i) => (
            <Card key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
