// منطق مشترک نمونه‌کارها. فایل ساده‌ی جاوااسکریپت است (بدون React) تا scripts/postbuild.mjs هم بتواند از آن استفاده کند.

// عنوانی که داخل [ ] باشد هنوز placeholder است. این موردها فقط در npm run dev دیده می‌شوند، نه در سایت منتشرشده.
export const isPlaceholder = (title) => /^\s*\[.*\]\s*$/.test(title || '');

/**
 * فهرست نمونه‌کارهای یک زبان. هر مورد یک slug دارد (بخش آخر آدرس صفحه‌ی جزئیاتش).
 * اگر slug نوشته نشده باشد، از شماره‌ی ترتیب ساخته می‌شود (project-1, project-2, ...).
 */
export function getProjects(dict, { includePlaceholders = false } = {}) {
  const all = dict.work.projects.map((p, i) => ({ ...p, slug: p.slug || `project-${i + 1}` }));
  return includePlaceholders ? all : all.filter((p) => !isPlaceholder(p.title));
}
