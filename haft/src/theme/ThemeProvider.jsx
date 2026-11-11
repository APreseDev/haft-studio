import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ThemeContext, applyThemeToDocument, isTheme, readStoredTheme, storeTheme } from './context.js';

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  const setTheme = useCallback((next) => {
    if (!isTheme(next)) return;
    storeTheme(next);
    setThemeState(next);
  }, []);
  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
