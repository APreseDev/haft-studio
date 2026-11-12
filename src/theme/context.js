import { createContext, useContext } from 'react';

export const THEMES = ['dark', 'light'];
// ظاهر فعلی سایت (زمینه‌ی تیره با متن کرمی) همان «dark» است و پیش‌فرض می‌ماند. «light» حالت تازه است.
export const DEFAULT_THEME = 'dark';
export const THEME_STORAGE_KEY = 'haft-theme';
// رنگ نوار مرورگر موبایل (باید با --bg هر حالت در styles.css یکی باشد)
export const THEME_COLORS = { dark: '#2b2d31', light: '#d9dadc' };

export const isTheme = (value) => THEMES.includes(value);

export function readStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function storeTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ذخیره‌سازی بسته است؛ فقط برای همین بازدید می‌ماند */
  }
}

/** حالت را روی <html> می‌گذارد (data-theme) و رنگ نوار مرورگر را هماهنگ می‌کند. */
export function applyThemeToDocument(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.head.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
}

export const ThemeContext = createContext(null);

/** theme ('dark' | 'light')، setTheme(name) و toggleTheme() */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme باید داخل <ThemeProvider> استفاده شود.');
  return context;
}
