import { useEffect } from 'react';
import { contact } from '../data.js';
import { useLang } from '../i18n/context.js';
import { locales } from '../i18n/locales.js';
import { toInternationalPhone } from '../formUtils.js';

// داده‌ی ساخت‌یافته‌ی Organization برای موتورهای جست‌وجو.
// فقط از اطلاعاتی ساخته می‌شود که مالک در data.js و index.html داده است؛ چیزی اضافه یا فرضی ندارد.
export default function StructuredData() {
  const { lang, translations } = useLang();
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: translations.brand,
      alternateName: (lang === 'fa' ? locales.en : locales.fa).dict.brand, // نام در زبان دیگر
      description: translations.meta.description,
      inLanguage: translations.meta.ogLocale.replace('_', '-'),
      email: contact.email,
      telephone: [contact.phone1, contact.phone2].map(toInternationalPhone),
      sameAs: [`https://instagram.com/${contact.instagram.replace(/^@/, '')}`],
    };
    const scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';
    scriptElement.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    document.head.appendChild(scriptElement);
    return () => scriptElement.remove();
  }, [lang, translations]);
  return null;
}
