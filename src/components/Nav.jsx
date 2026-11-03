import { useEffect, useState } from 'react';
import { nav } from '../data.js';
import { useMagnetic } from '../hooks.js';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const cta = useMagnetic(0.3);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // منوی موبایل با Escape بسته شود
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${solid || open ? 'nav--solid' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="logo" aria-label="هفت استودیو" onClick={close}>
          <span className="logo__mark">۷</span>
          <span className="logo__text">هفت استودیو</span>
        </a>
        <nav id="main-nav" className={`nav__links ${open ? 'is-open' : ''}`} aria-label="منوی اصلی">
          {nav.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="nav__only-menu" onClick={close}>
            شروع پروژه
          </a>
        </nav>
        <a ref={cta} href="#contact" className="btn btn--ghost nav__cta">
          شروع پروژه
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
