import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/900.css';
import 'lenis/dist/lenis.css';
import './styles.css';
import App from './App.jsx';
import LangProvider from './i18n/LangProvider.jsx';
import ThemeProvider from './theme/ThemeProvider.jsx';
import { applyLangToDocument } from './i18n/document.js';
import { parsePath } from './routes.js';
import RouterProvider from './router/RouterProvider.jsx';
import { applyThemeToDocument, readStoredTheme } from './theme/context.js';
import { startSplash } from './splash.js';

// زبان (از آدرس: «/» فارسی، «/en/» انگلیسی) و حالت تیره/روشن ذخیره‌شده‌ی کاربر قبل از اولین نمایش اعمال می‌شود.
// (اسکریپت کوچک index.html همین کار را حتی زودتر انجام می‌دهد؛ این‌جا برای اطمینان تکرار شده است.)
applyLangToDocument(parsePath(window.location.pathname).lang);
applyThemeToDocument(readStoredTheme());

// لوگوی آغازین (داخل index.html) چند ثانیه‌ی اول دیده می‌شود؛ پشت آن سایت بارگذاری و آماده می‌شود
startSplash();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </RouterProvider>
    </ThemeProvider>
  </React.StrictMode>
);
