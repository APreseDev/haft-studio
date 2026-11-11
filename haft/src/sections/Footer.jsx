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
  const { t } = useLang();
  const year = currentYear(t.intl, t.footer.fallbackYear);
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span className="logo" role="img" aria-label={t.brand}>
          <Logo variant="full" />
        </span>
        <span>{t.footer.rights.replace('{year}', year)}</span>
      </div>
    </footer>
  );
}
