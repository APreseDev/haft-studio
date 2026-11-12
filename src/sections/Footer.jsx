import Logo from '../components/Logo.jsx';
import { useLang } from '../i18n/context.js';

// سال جاری با تقویم هر زبان (شمسی برای فارسی)، تا هر سال خودکار به‌روز شود
function currentYear(locale, fallback) {
  try {
    return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(new Date());
  } catch {
    return fallback;
  }
}

export default function Footer() {
  const { translations } = useLang();
  const year = currentYear(translations.intl, translations.footer.fallbackYear);
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span className="logo" role="img" aria-label={translations.brand}>
          <Logo variant="full" />
        </span>
        <span>{translations.footer.rights.replace('{year}', year)}</span>
      </div>
    </footer>
  );
}
