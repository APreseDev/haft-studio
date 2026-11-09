import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { Icon } from '../components/Icons.jsx';
import { team } from '../data.js';
import { useTilt } from '../hooks.js';

function Member({ m }) {
  const tilt = useTilt(8);
  return (
    <article ref={tilt} className="card card--glow member">
      <span className="avatar">
        <Icon name="user" size={38} />
      </span>
      <h3>{m.name}</h3>
      <p>{m.role}</p>
    </article>
  );
}

export default function Team() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.team .head > *', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.team .head', start: 'top 80%' },
        });
        gsap.from('.member', {
          y: 70,
          opacity: 0,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.team .grid', start: 'top 80%' },
        });
      },
      root
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="team" className="section team" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">۰۴ — تیم</p>
          <h2>آدم‌های پشت هفت استودیو.</h2>
        </div>
        <div className="grid grid--3">
          {team.map((m, i) => (
            <Member key={m.role + i} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
