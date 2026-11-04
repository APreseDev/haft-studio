// سال شمسی جاری، تا هر سال خودکار به‌روز شود
const year = (() => {
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());
  } catch {
    return '۱۴۰۵';
  }
})();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span className="logo">
          <span className="logo__mark logo__mark--sm">۷</span>
          <span className="logo__text">هفت استودیو</span>
        </span>
        <span>© {year} · همه‌ی حقوق محفوظ است.</span>
      </div>
    </footer>
  );
}
