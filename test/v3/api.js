import { formAccessKey } from './data.js';

// ارتباط با سرویسی که پیام فرم را به ایمیل می‌رساند.
// اگر بعداً بک‌اند خودتان را ساختید، فقط ENDPOINT و شکل body در همین فایل عوض می‌شود.
const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * ارسال پیام فرم تماس.
 * خروجی همیشه یک شیء است و خطا پرتاب نمی‌کند:
 *   { ok: true }
 *   { ok: false, reason: 'rejected' | 'network' | 'timeout', detail? }
 */
export async function sendContact({ name, phone, service, message }, { timeoutMs = 15000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: formAccessKey,
        from_name: 'سایت هفت استودیو',
        subject: `درخواست پروژه: ${service}`,
        name,
        phone,
        service,
        message,
      }),
      signal: ctrl.signal,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* پاسخ JSON نبود */
    }
    if (res.ok && data && data.success) return { ok: true };
    return { ok: false, reason: 'rejected', detail: data && data.message };
  } catch (err) {
    return { ok: false, reason: err && err.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
