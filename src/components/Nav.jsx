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
  const { lang, setLang, translations } = useLang();
  const { route, pathname } = useRouter();
  // در صفحه‌ی اصلی لینک‌ها فقط #بخش‌اند؛ در صفحه‌های دیگر به بخش همان صفحه‌ی اصلی می‌روند
  const home = route.page === 'home' ? '' : homePath(lang);
  const { theme, toggleTheme } = useTheme();
  const otherLang = Object.keys(locales).find((langCode) => langCode !== lang);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const ctaButtonRef = useMagnetic(0.3);

  useEffect(() => {
    const updateSolid = () => setSolid(window.scrollY > 40);
    updateSolid();
    window.addEventListener('scroll', updateSolid, { passive: true });
    return () => window.removeEventListener('scroll', updateSolid);
  }, []);

  // منوی موبایل با Escape بسته شود
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${solid || open ? 'nav--solid' : ''}`}>
      <div className="nav__inner">
        <a href={`${home}#top`} className="logo" aria-label={translations.brand} onClick={close}>
          <Logo />
        </a>
        <nav id="main-nav" className={`nav__links ${open ? 'is-open' : ''}`} aria-label={translations.nav.label}>
          {navHrefs.map((href, index) => (
            <a key={href} href={`${home}${href}`} onClick={close}>
              {translations.nav.links[index]}
            </a>
          ))}
          <a href={`${home}#contact`} className="nav__only-menu" onClick={close}>
            {translations.nav.cta}
          </a>
        </nav>
        <a ref={ctaButtonRef} href={`${home}#contact`} className="btn btn--ghost nav__cta">
          {translations.nav.cta}
        </a>
        <div className="nav__tools">
          {/* لینک واقعی به نسخه‌ی زبان دیگر: روی دکمه نام زبانی نوشته می‌شود که با کلیک به آن می‌رویم */}
          <a
            className="tool-btn tool-btn--lang"
            href={pathWithLang(pathname, otherLang)}
            hrefLang={otherLang}
            aria-label={translations.ui.switchLang}
            onClick={(event) => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
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
            aria-label={theme === 'dark' ? translations.ui.themeToLight : translations.ui.themeToDark}
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
          aria-label={open ? translations.nav.close : translations.nav.open}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
