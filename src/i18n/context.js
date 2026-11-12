import { createContext, useContext } from 'react';

export const LangContext = createContext(null);

/**
 * زبان فعلی و متن‌ها:
 *   lang، dir ('rtl' | 'ltr')، translations (متن‌های همین زبان)، setLang(code)،
 *   num(n) رقم‌ها را با ارقام همین زبان برمی‌گرداند.
 */
export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang باید داخل <LangProvider> استفاده شود.');
  return context;
}
