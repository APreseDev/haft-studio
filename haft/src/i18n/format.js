/** رقم‌های یک متن یا عدد را با ارقام زبان فعلی (مثلاً ۰۱۲… یا 012…) نشان می‌دهد. */
export const localizeDigits = (value, numerals) => String(value).replace(/\d/g, (d) => numerals[d]);

/** متنی با کلمه‌های *ستاره‌دار* را به آرایه‌ی { text, accent } تبدیل می‌کند (کلمه‌ها با فاصله جدا می‌شوند). */
export function parseAccentWords(text) {
  return String(text)
    .split(' ')
    .filter(Boolean)
    .map((w) => {
      const accent = w.length > 2 && w.startsWith('*') && w.endsWith('*');
      return { text: accent ? w.slice(1, -1) : w, accent };
    });
}
