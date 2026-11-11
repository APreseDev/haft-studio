import { createContext, useContext } from 'react';

export const RouterContext = createContext(null);

/**
 * pathname، route ({ lang, page, slug })،
 * navigate(to, { replace?, scroll? }) برای رفتن به یک صفحه‌ی سایت بدون بارگذاری دوباره‌ی کامل.
 */
export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter باید داخل <RouterProvider> استفاده شود.');
  return ctx;
}
