import { useCallback, useLayoutEffect, useMemo } from 'react';
import { LangContext } from './context.js';
import { applyLangToDocument } from './document.js';
import { localizeDigits } from './format.js';
import { isLang, locales } from './locales.js';
import { useRouter } from '../router/context.js';
import { pathWithLang } from '../routes.js';

// زبان از آدرس می‌آید (تنها منبع حقیقت): «/…» فارسی و «/en/…» انگلیسی. عوض کردن زبان یعنی رفتن به همان صفحه در زبان دیگر.
export default function LangProvider({ children }) {
  const { route, pathname, navigate } = useRouter();
  const lang = route.lang;

  const setLang = useCallback(
    (next) => {
      if (!isLang(next) || next === lang) return;
      // بدون پرش اسکرول؛ #بخش هم نگه داشته می‌شود
      navigate(pathWithLang(pathname, next) + window.location.hash, { scroll: false });
    },
    [lang, pathname, navigate]
  );

  // همگام‌سازی lang و dir صفحه (اسکریپت index.html و main.jsx معمولاً قبلاً این کار را کرده‌اند)
  useLayoutEffect(() => {
    applyLangToDocument(lang);
  }, [lang]);

  const value = useMemo(() => {
    const { dir, dict } = locales[lang];
    return { lang, dir, translations: dict, setLang, num: (number) => localizeDigits(number, dict.numerals) };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
