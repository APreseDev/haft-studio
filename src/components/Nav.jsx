import { useEffect, useState } from 'react';
import { nav } from '../data.js';
import { useMagnetic } from '../hooks.js';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const cta = useMagnetic(0.3);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="logo" aria-label="هفت استودیو">
          <span className="logo__mark">۷</span>
          <span className="logo__text">هفت استودیو</span>
        </a>
        <nav className="nav__links" aria-label="منوی اصلی">
          {nav.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a ref={cta} href="#contact" className="btn btn--ghost">
          شروع پروژه
        </a>
      </div>
    </header>
  );
}
