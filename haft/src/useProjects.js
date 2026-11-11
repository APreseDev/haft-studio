import { useMemo } from 'react';
import { useLang } from './i18n/context.js';
import { getProjects } from './projects.js';

/** نمونه‌کارهای زبان فعلی (موردهای placeholder فقط در npm run dev). */
export function useProjects() {
  const { t } = useLang();
  return useMemo(() => getProjects(t, { includePlaceholders: import.meta.env.DEV }), [t]);
}
