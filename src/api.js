import { formAccessKey } from './data.js';

// ارتباط با سرویسی که پیام فرم را به ایمیل می‌رساند.
// اگر بعداً بک‌اند خودتان را ساختید، فقط ENDPOINT و شکل body در همین فایل عوض می‌شود.
const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * ارسال پیام فرم تماس.
 * خروجی همیشه یک شیء است و خطا پرتاب نمی‌کند:
 *   { ok: true }
 *   { ok: false, reason: 'rejected' | 'rate_limited' | 'network' | 'timeout', status?, detail? }
 */
export async function sendContact({ name, phone, service, message }, { timeoutMs = 15000 } = {}) {
  const abortController = new AbortController();
  const timer = setTimeout(() => abortController.abort(), timeoutMs);
  try {
    const response = await fetch(ENDPOINT, {
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
      signal: abortController.signal,
    });
    let data = null;
    try {
      data = await response.json();
    } catch {
      /* پاسخ JSON نبود */
    }
    if (response.ok && data && data.success) return { ok: true };
    return { ok: false, reason: response.status === 429 ? 'rate_limited' : 'rejected', status: response.status, detail: data && data.message };
  } catch (error) {
    return { ok: false, reason: error && error.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
