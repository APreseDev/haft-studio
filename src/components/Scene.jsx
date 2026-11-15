import { useEffect, useRef, useState } from "react";
import { createScene } from "../three/createScene.js";
import { prefersReduced } from "../hooks.js";
import { ACCENT, ACCENT_LIGHT } from "../data.js";
import { useTheme } from "../theme/context.js";

/** بوم سه‌بعدی ثابت پشت کل صفحه. اگر WebGL نبود، فقط یک پس‌زمینه‌ی ساده دیده می‌شود. */
export default function Scene() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const { theme } = useTheme();
  const [failed, setFailed] = useState(() =>
    new URLSearchParams(window.location.search).has("noscene"),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const searchParams = new URLSearchParams(window.location.search);
    const lite =
      searchParams.has("lite") ||
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator.hardwareConcurrency || 8) <= 6 ||
      (navigator.deviceMemory || 8) <= 4;
    let handle;
    try {
      // حالت اولیه را از صفحه می‌خوانیم (ThemeProvider و اسکریپت index.html آن را قبل از ساخت صحنه گذاشته‌اند)
      const initial =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "light"
          : "dark";
      handle = createScene(canvas, {
        accent: ACCENT,
        accentOnLight: ACCENT_LIGHT,
        lite,
        reduced: prefersReduced(),
        theme: initial,
      });
      sceneRef.current = handle;
    } catch {
      // ساخت WebGL فقط داخل effect ممکنه؛ پس خطا را همین‌جا می‌فهمیم و باید به state برسانیم
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
    }
    return () => {
      sceneRef.current = null;
      handle && handle.dispose();
    };
  }, []);

  // تغییر حالت تیره/روشن بدون ساختن دوباره‌ی صحنه
  useEffect(() => {
    if (sceneRef.current) sceneRef.current.setTheme(theme);
  }, [theme]);

  if (failed)
    return <div className="scene scene--fallback" aria-hidden="true" />;
  return <canvas ref={canvasRef} className="scene" aria-hidden="true" />;
}
