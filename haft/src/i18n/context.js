import { createContext, useContext } from 'react';

export const LangContext = createContext(null);

/**
 * زبان فعلی و متن‌ها:
 *   lang، dir ('rtl' | 'ltr')، t (متن‌های همین زبان)، setLang(code)،
 *   num(n) رقم‌ها را با ارقام همین زبان برمی‌گرداند.
 */
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang باید داخل <LangProvider> استفاده شود.');
  return ctx;
}
