import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RouterContext } from './context.js';
import { applyLangToDocument, syncPageLinks } from '../i18n/document.js';
import { getLenis } from '../lenis.js';
import { isAppPath, parsePath } from '../routes.js';

function scrollToHash(hash) {
  let el = null;
  try {
    el = hash ? document.querySelector(decodeURIComponent(hash)) : null;
  } catch {
    el = null;
  }
  const lenis = getLenis();
  if (el) {
    if (lenis) lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView();
    return;
  }
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * مسیریاب سبک (بدون کتابخانه‌ی اضافه). آدرس تنها منبع حقیقت است؛ لینک‌های معمولی <a href> داخل سایت
 * بدون بارگذاری دوباره‌ی صفحه باز می‌شوند ولی در واقع لینک واقعی‌اند (برای موتور جست‌وجو، کلیک وسط و «باز کردن در تب جدید»).
 */
export default function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [tick, setTick] = useState(0);
  const scrollRequest = useRef(null);

  const navigate = useCallback((to, { replace = false, scroll = true } = {}) => {
    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.assign(to);
      return;
    }
    // lang و dir پیش از رندر عوض می‌شوند تا انیمیشن‌هایی که هنگام ساخته‌شدن جهت را می‌خوانند، جهت درست را ببینند
    applyLangToDocument(parsePath(url.pathname).lang);
    try {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash);
    } catch {
      window.location.assign(to);
      return;
    }
    scrollRequest.current = scroll ? { hash: url.hash } : null;
    setPathname(url.pathname);
    setTick((n) => n + 1);
  }, []);

  // دکمه‌ی «بازگشت/جلو» مرورگر
  useEffect(() => {
    const onPop = () => {
      applyLangToDocument(parsePath(window.location.pathname).lang);
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // کلیک روی لینک‌های داخل سایت
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return; // لینک‌های «#…» را خود App با Lenis اسکرول می‌کند
      let url;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || !isAppPath(url.pathname)) return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  // بعد از رفتن به صفحه‌ی تازه: بالای صفحه یا (اگر #بخش داشت) همان بخش
  useLayoutEffect(() => {
    const req = scrollRequest.current;
    if (!req) return;
    scrollRequest.current = null;
    if (!req.hash) {
      scrollToHash('');
      return;
    }
    const id = requestAnimationFrame(() => scrollToHash(req.hash));
    return () => cancelAnimationFrame(id);
  }, [tick]);

  // canonical / hreflang (اگر هنگام بیلد ساخته شده باشند) با صفحه‌ی فعلی هماهنگ شوند
  useLayoutEffect(() => {
    syncPageLinks(pathname);
  }, [pathname]);

  const value = useMemo(() => ({ pathname, route: parsePath(pathname), navigate }), [pathname, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
