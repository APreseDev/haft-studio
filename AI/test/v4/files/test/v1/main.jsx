import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/900.css';
import 'lenis/dist/lenis.css';
import './styles.css';
import App from './App.jsx';

// سایت فارسی است و باید راست‌به‌چپ باشد، حتی اگر index.html پروژه این دو مقدار را نداشته باشد.
document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'fa');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
