import { useEffect } from 'react';
import { applyPageMeta } from './i18n/document.js';

/** عنوان و توضیح صفحه (برای تب مرورگر، موتور جست‌وجو و اشتراک‌گذاری) را برای صفحه‌های داخلی تنظیم می‌کند. */
export function usePageMeta(title, description) {
  useEffect(() => {
    applyPageMeta(title, description);
  }, [title, description]);
}
