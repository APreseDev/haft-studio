// توابع کمکی فرم تماس (بدون وابستگی به React تا راحت تست شوند)

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** ارقام فارسی و عربی را به لاتین تبدیل می‌کند. */
export const toLatinDigits = (text) =>
  String(text)
    .replace(/[۰-۹]/g, (digit) => PERSIAN_DIGITS.indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => ARABIC_DIGITS.indexOf(digit));

/** فاصله، خط تیره، نقطه و پرانتز را برمی‌دارد و ارقام را لاتین می‌کند. */
export const cleanPhone = (phone) => toLatinDigits(phone).replace(/[\s\-().]/g, '');

/** فقط رقم (با + اختیاری اول)، بین ۱۰ تا ۱۵ رقم. شماره‌ی موبایل و ثابت ایران و شماره‌های بین‌المللی را می‌پذیرد. */
export const isValidPhone = (phone) => /^\+?\d{10,15}$/.test(phone);

/** شماره را برای tel: و داده‌ی ساخت‌یافته به فرمت بین‌المللی می‌برد (۰۹۱... → +۹۸۹۱...). */
export const toInternationalPhone = (phone) => {
  const digits = cleanPhone(phone).replace(/\D/g, '');
  if (digits.startsWith('0')) return '+98' + digits.slice(1);
  return digits ? '+' + digits : '';
};
