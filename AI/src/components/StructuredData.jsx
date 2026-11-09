import { useEffect } from 'react';
import { contact } from '../data.js';
import { toInternationalPhone } from '../formUtils.js';

// داده‌ی ساخت‌یافته‌ی Organization برای موتورهای جست‌وجو.
// فقط از اطلاعاتی ساخته می‌شود که مالک در data.js و index.html داده است؛ چیزی اضافه یا فرضی ندارد.
export default function StructuredData() {
  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'هفت استودیو',
      alternateName: 'Haft Studio',
      description: metaDesc ? metaDesc.content : undefined,
      email: contact.email,
      telephone: toInternationalPhone(contact.phone),
      sameAs: [`https://instagram.com/${contact.instagram.replace(/^@/, '')}`],
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}
