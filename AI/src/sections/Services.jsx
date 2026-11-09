import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { fromRight, alternateSides } from '../reveal.js';
import { Icon } from '../components/Icons.jsx';
import { services } from '../data.js';
import { useTilt } from '../hooks.js';

function Card({ s, i }) {
  const tilt = useTilt(8);
  return (
    <article ref={tilt} className="card card--glow service">
      <div className="service__top">
        <span className="service__icon">
          <Icon name={s.icon} />
        </span>
        <span className="service__n">{String(i + 1).padStart(2, '۰').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])}</span>
      </div>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
    </article>
  );
}

export default function Services() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // عنوان از راست، کارت‌ها یکی در میان از راست و چپ
        fromRight('.services .head > *', '.services .head', { stagger: 0.12 });
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
          <p className="eyebrow">۰۱ — خدمات</p>
          <h2>هر چه برای دیده‌شدن لازم است، یک‌جا.</h2>
        </div>
        <div className="grid grid--4">
          {services.map((s, i) => (
            <Card key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
