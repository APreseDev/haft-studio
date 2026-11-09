/* global process */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// آدرس پایه‌ی سایت. پیش‌فرض "/" است (Cloudflare Pages و دامنه‌ی اختصاصی).
// برای GitHub Pages با آدرس زیرمسیر (username.github.io/<repo>/)، workflow مقدار VITE_BASE را تنظیم می‌کند.
const trimmed = (process.env.VITE_BASE || "").replace(/^\/+|\/+$/g, "");
const base = trimmed ? `/${trimmed}/` : "/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
});
