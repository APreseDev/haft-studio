import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { RouterContext } from './context.js';
import { applyLangToDocument, syncPageLinks } from '../i18n/document.js';
import { getLenis } from '../lenis.js';
import { isAppPath, parsePath } from '../routes.js';

function scrollToHash(hash) {
  let element = null;
  try {
    element = hash ? document.querySelector(decodeURIComponent(hash)) : null;
  } catch {
    element = null;
  }
  const lenis = getLenis();
  if (element) {
    if (lenis) lenis.scrollTo(element, { offset: -72 });
    else element.scrollIntoView();
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

  const navigate = useCallback((destination, { replace = false, scroll = true } = {}) => {
    const url = new URL(destination, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.assign(destination);
      return;
    }
    // lang و dir پیش از رندر عوض می‌شوند تا انیمیشن‌هایی که هنگام ساخته‌شدن جهت را می‌خوانند، جهت درست را ببینند
    applyLangToDocument(parsePath(url.pathname).lang);
    try {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash);
    } catch {
      window.location.assign(destination);
      return;
    }
    scrollRequest.current = scroll ? { hash: url.hash } : null;
    setPathname(url.pathname);
    setTick((count) => count + 1);
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
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest && event.target.closest('a[href]');
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return; // لینک‌های «#…» را خود App با Lenis اسکرول می‌کند
      let url;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || !isAppPath(url.pathname)) return;
      event.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  // بعد از رفتن به صفحه‌ی تازه: بالای صفحه یا (اگر #بخش داشت) همان بخش
  useLayoutEffect(() => {
    const pendingScroll = scrollRequest.current;
    if (!pendingScroll) return;
    scrollRequest.current = null;
    if (!pendingScroll.hash) {
      scrollToHash('');
      return;
    }
    const frameId = requestAnimationFrame(() => scrollToHash(pendingScroll.hash));
    return () => cancelAnimationFrame(frameId);
  }, [tick]);

  // canonical / hreflang (اگر هنگام بیلد ساخته شده باشند) با صفحه‌ی فعلی هماهنگ شوند
  useLayoutEffect(() => {
    syncPageLinks(pathname);
  }, [pathname]);

  const value = useMemo(() => ({ pathname, route: parsePath(pathname), navigate }), [pathname, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
