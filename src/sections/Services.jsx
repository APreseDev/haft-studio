import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromStart, alternateSides } from '../reveal.js';
import { Icon } from '../components/Icons.jsx';
import { serviceIcons } from '../data.js';
import { useLang } from '../i18n/context.js';
import { useTilt } from '../hooks.js';

function Card({ service, index }) {
  const { num } = useLang();
  const tilt = useTilt(8);
  return (
    <article ref={tilt} className="card card--glow service">
      <div className="service__top">
        <span className="service__icon">
          <Icon name={serviceIcons[index]} />
        </span>
        <span className="service__n">{num(String(index + 1).padStart(2, '0'))}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.text}</p>
    </article>
  );
}

export default function Services() {
  const { translations } = useLang();
  const root = useRef(null);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از سمت شروع خواندن، کارت‌ها یکی در میان از دو طرف
        fromStart('.services .head > *', '.services .head', { stagger: 0.12 });
        alternateSides('.services .service', '.services .grid', { stagger: 0.14 });
      },
      root
    );
    return () => mediaContext.revert();
  }, []);

  return (
    <section id="services" className="section services" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{translations.services.eyebrow}</p>
          <h2>{translations.services.title}</h2>
        </div>
        <div className="grid grid--4">
          {translations.services.items.map((service, index) => (
            <Card key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
