import Logo from '../components/Logo.jsx';
import { useLang } from '../i18n/context.js';
import { privacyPath } from '../routes.js';

// سال جاری با تقویم هر زبان (شمسی برای فارسی)، تا هر سال خودکار به‌روز شود
function currentYear(locale, fallback) {
  try {
    return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(new Date());
  } catch {
    return fallback;
  }
}

export default function Footer() {
  const { lang, translations } = useLang();
  const year = currentYear(translations.intl, translations.footer.fallbackYear);
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span className="logo" role="img" aria-label={translations.brand}>
          <Logo variant="full" />
        </span>
        <span className="footer__meta">
          <a className="footer__link" href={privacyPath(lang)}>
            {translations.footer.privacy}
          </a>
          <span>{translations.footer.rights.replace('{year}', year)}</span>
        </span>
      </div>
    </footer>
  );
}
