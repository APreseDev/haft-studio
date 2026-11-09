// توابع کمکی فرم تماس (بدون وابستگی به React تا راحت تست شوند)

const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

/** ارقام فارسی و عربی را به لاتین تبدیل می‌کند. */
export const toLatinDigits = (s) =>
  String(s)
    .replace(/[۰-۹]/g, (d) => FA.indexOf(d))
    .replace(/[٠-٩]/g, (d) => AR.indexOf(d));

/** فاصله، خط تیره، نقطه و پرانتز را برمی‌دارد و ارقام را لاتین می‌کند. */
export const cleanPhone = (s) => toLatinDigits(s).replace(/[\s\-().]/g, '');

/** فقط رقم (با + اختیاری اول)، بین ۱۰ تا ۱۵ رقم. شماره‌ی موبایل و ثابت ایران و شماره‌های بین‌المللی را می‌پذیرد. */
export const isValidPhone = (s) => /^\+?\d{10,15}$/.test(s);

/** شماره را برای tel: و داده‌ی ساخت‌یافته به فرمت بین‌المللی می‌برد (۰۹۱... → +۹۸۹۱...). */
export const toInternationalPhone = (s) => {
  const d = cleanPhone(s).replace(/\D/g, '');
  if (d.startsWith('0')) return '+98' + d.slice(1);
  return d ? '+' + d : '';
};
