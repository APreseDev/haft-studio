import { useEffect, useRef, useState } from 'react';
import { createScene } from '../three/createScene.js';
import { prefersReduced } from '../hooks.js';
import { ACCENT } from '../data.js';

/** بوم سه‌بعدی ثابت پشت کل صفحه. اگر WebGL نبود، فقط یک پس‌زمینه‌ی ساده دیده می‌شود. */
export default function Scene() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const lite = window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
    let dispose;
    try {
      dispose = createScene(canvas, { accent: ACCENT, lite, reduced: prefersReduced() });
    } catch (err) {
      console.warn('WebGL scene failed', err);
      setFailed(true);
    }
    return () => dispose && dispose();
  }, []);

  if (failed) return <div className="scene scene--fallback" aria-hidden="true" />;
  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
