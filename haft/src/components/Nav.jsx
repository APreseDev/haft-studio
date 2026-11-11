import { useEffect, useState } from 'react';
import { navHrefs } from '../data.js';
import { useLang } from '../i18n/context.js';
import { locales } from '../i18n/locales.js';
import { useRouter } from '../router/context.js';
import { homePath, pathWithLang } from '../routes.js';
import { useTheme } from '../theme/context.js';
import { Icon } from './Icons.jsx';
import { useMagnetic } from '../hooks.js';
import Logo from './Logo.jsx';

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const { route, pathname } = useRouter();
  // در صفحه‌ی اصلی لینک‌ها فقط #بخش‌اند؛ در صفحه‌های دیگر به بخش همان صفحه‌ی اصلی می‌روند
  const home = route.page === 'home' ? '' : homePath(lang);
  const { theme, toggleTheme } = useTheme();
  const otherLang = Object.keys(locales).find((k) => k !== lang);
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
        <a href={`${home}#top`} className="logo" aria-label={t.brand} onClick={close}>
          <Logo />
        </a>
        <nav id="main-nav" className={`nav__links ${open ? 'is-open' : ''}`} aria-label={t.nav.label}>
          {navHrefs.map((href, i) => (
            <a key={href} href={`${home}${href}`} onClick={close}>
              {t.nav.links[i]}
            </a>
          ))}
          <a href={`${home}#contact`} className="nav__only-menu" onClick={close}>
            {t.nav.cta}
          </a>
        </nav>
        <a ref={cta} href={`${home}#contact`} className="btn btn--ghost nav__cta">
          {t.nav.cta}
        </a>
        <div className="nav__tools">
          {/* لینک واقعی به نسخه‌ی زبان دیگر: روی دکمه نام زبانی نوشته می‌شود که با کلیک به آن می‌رویم */}
          <a
            className="tool-btn tool-btn--lang"
            href={pathWithLang(pathname, otherLang)}
            hrefLang={otherLang}
            aria-label={t.ui.switchLang}
            onClick={(e) => {
              if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              setLang(otherLang);
            }}
          >
            <span lang={otherLang} className="lang-full">
              {locales[otherLang].label}
            </span>
            <span lang={otherLang} className="lang-short" aria-hidden="true">
              {locales[otherLang].short}
            </span>
          </a>
          <button
            type="button"
            className="tool-btn"
            aria-label={theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark}
            onClick={toggleTheme}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
        </div>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? t.nav.close : t.nav.open}
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
