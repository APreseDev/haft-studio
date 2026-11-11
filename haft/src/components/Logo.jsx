// لوگوی هفت استودیو. عکس‌ها در public هستند: logo-mark.png (فقط مثلث) و logo-full.png (مثلث + نوشته‌ی HAFT STUDIO).
// با CSS mask رنگ می‌گیرد (styles.css، کلاس logo__img)، پس هم روی زمینه‌ی تیره و هم روشن دیده می‌شود.
export default function Logo({ variant = 'mark' }) {
  const file = variant === 'full' ? 'logo-full.png' : 'logo-mark.png';
  return (
    <span
      className={`logo__img logo__img--${variant}`}
      style={{ '--logo-src': `url(${import.meta.env.BASE_URL}${file})` }}
      aria-hidden="true"
    />
  );
}
