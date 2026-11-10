import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { LangContext } from './context.js';
import { applyLangToDocument } from './document.js';
import { localizeDigits } from './format.js';
import { isLang, langFromPath, locales, pathForLang } from './locales.js';

export default function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => langFromPath());

  const setLang = useCallback((next) => {
    if (!isLang(next)) return;
    // lang و dir قبل از رندر دوباره عوض می‌شوند تا انیمیشن‌های بخش‌ها (که هنگام ساخته‌شدن جهت را می‌خوانند) جهت درست را ببینند
    applyLangToDocument(next);
    // آدرس هم عوض می‌شود (بدون بارگذاری دوباره و بدون پرش اسکرول) تا هر زبان لینک جدا داشته باشد
    try {
      window.history.pushState({}, '', pathForLang(next) + window.location.hash);
    } catch {
      /* history در دسترس نیست؛ فقط زبان صفحه عوض می‌شود */
    }
    setLangState(next);
  }, []);

  // دکمه‌ی «بازگشت/جلو» مرورگر: زبان از آدرس تازه خوانده می‌شود
  useEffect(() => {
    const onPop = () => {
      const next = langFromPath();
      applyLangToDocument(next);
      setLangState(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // همگام‌سازی بعد از اولین نمایش (اسکریپت index.html و main.jsx معمولاً قبلاً این کار را کرده‌اند)
  useLayoutEffect(() => {
    applyLangToDocument(lang);
  }, [lang]);

  const value = useMemo(() => {
    const { dir, dict } = locales[lang];
    return { lang, dir, t: dict, setLang, num: (n) => localizeDigits(n, dict.numerals) };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
