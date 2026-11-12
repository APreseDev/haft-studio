/** رقم‌های یک متن یا عدد را با ارقام زبان فعلی (مثلاً ۰۱۲… یا 012…) نشان می‌دهد. */
export const localizeDigits = (value, numerals) => String(value).replace(/\d/g, (digit) => numerals[digit]);

/** متنی با کلمه‌های *ستاره‌دار* را به آرایه‌ی { text, accent } تبدیل می‌کند (کلمه‌ها با فاصله جدا می‌شوند). */
export function parseAccentWords(text) {
  return String(text)
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const accent = word.length > 2 && word.startsWith('*') && word.endsWith('*');
      return { text: accent ? word.slice(1, -1) : word, accent };
    });
}
