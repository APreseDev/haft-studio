import { useEffect } from 'react';
import { contact } from '../data.js';
import { useLang } from '../i18n/context.js';
import { locales } from '../i18n/locales.js';
import { toInternationalPhone } from '../formUtils.js';

// داده‌ی ساخت‌یافته‌ی Organization برای موتورهای جست‌وجو.
// فقط از اطلاعاتی ساخته می‌شود که مالک در data.js و index.html داده است؛ چیزی اضافه یا فرضی ندارد.
export default function StructuredData() {
  const { lang, t } = useLang();
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: t.brand,
      alternateName: (lang === 'fa' ? locales.en : locales.fa).dict.brand, // نام در زبان دیگر
      description: t.meta.description,
      inLanguage: t.meta.ogLocale.replace('_', '-'),
      email: contact.email,
      telephone: toInternationalPhone(contact.phone),
      sameAs: [`https://instagram.com/${contact.instagram.replace(/^@/, '')}`],
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    document.head.appendChild(el);
    return () => el.remove();
  }, [lang, t]);
  return null;
}
