import { lazy, Suspense, useEffect, useState } from 'react';
import { useLang } from './i18n/context.js';
import { useRouter } from './router/context.js';
import { gsap, ScrollTrigger } from './gsap.js';
import { setLenis } from './lenis.js';
import { prefersReduced } from './hooks.js';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './sections/Hero.jsx';
import Marquee from './sections/Marquee.jsx';
import Services from './sections/Services.jsx';
import Work from './sections/Work.jsx';
import Process from './sections/Process.jsx';
import Manifesto from './sections/Manifesto.jsx';
import Team from './sections/Team.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import StructuredData from './components/StructuredData.jsx';
import WorksPage from './pages/WorksPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';

// کتابخانه‌ی Three.js حجیم‌ترین بخش سایت است. جدا و دیرتر بارگذاری می‌شود تا متن‌ها و منو فوراً دیده شوند.
const Scene = lazy(() => import('./components/Scene.jsx'));
const sceneFallback = <div className="scene scene--fallback" aria-hidden="true" />;

export default function App() {
  const { lang, dir, translations } = useLang();
  const { route } = useRouter();
  // با عوض شدن زبان یا صفحه، محتوای اصلی دوباره ساخته می‌شود (انیمیشن‌ها پاک و از نو ساخته می‌شوند)
  const pageKey = `${lang}:${route.page}:${route.slug}`;
  const [sceneReady, setSceneReady] = useState(false);

  // صحنه‌ی سه‌بعدی بعد از اولین نمایش صفحه و در زمان بیکاری مرورگر شروع می‌شود
  useEffect(() => {
    // اگر کاربر «صرفه‌جویی در داده» را روشن کرده باشد، بسته‌ی سنگین سه‌بعدی دانلود نمی‌شود و پس‌زمینه‌ی ساده می‌ماند.
    const conn = navigator.connection;
    if (conn && conn.saveData) return;
    const start = () => setSceneReady(true);
    if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleCallbackId);
    }
    const timeoutId = setTimeout(start, 400);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (prefersReduced()) return;

    // Lenis برای اولین نمایش لازم نیست؛ جدا و بعد از رندر اول دانلود می‌شود (کم شدن حجم بسته‌ی اصلی)
    let disposed = false;
    let cleanup = null;
    import('lenis').then(({ default: Lenis }) => {
      if (disposed) return;

      // اسکرول نرم، هماهنگ با ScrollTrigger
      const lenis = new Lenis({
        duration: 0.9, // کوتاه‌تر = اسکرول سریع‌تر جواب می‌دهد و کمتر «شناور» حس می‌شود
        easing: (progress) => Math.min(1, 1.001 - Math.pow(2, -10 * progress)),
      });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // لینک‌های داخل صفحه با Lenis اسکرول شوند
      const onClick = (event) => {
        const anchor = event.target.closest && event.target.closest('a[href^="#"]');
        if (!anchor) return;
        const selector = anchor.getAttribute('href');
        if (!selector || selector.length < 2) {
          if (selector === '#') event.preventDefault();
          return;
        }
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
      };
      document.addEventListener('click', onClick);

      cleanup = () => {
        document.removeEventListener('click', onClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    });

    // بعد از آمدن فونت و بارگذاری کامل، جای شروع انیمیشن‌ها دوباره محاسبه شود
    // (فونت و load ممکن است تقریباً هم‌زمان برسند؛ در یک فریم فقط یک بار محاسبه می‌شود)
    let refreshRaf = 0;
    const refresh = () => {
      if (refreshRaf) return;
      refreshRaf = requestAnimationFrame(() => {
        refreshRaf = 0;
        ScrollTrigger.refresh();
      });
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      disposed = true;
      window.removeEventListener('load', refresh);
      if (refreshRaf) cancelAnimationFrame(refreshRaf);
      if (cleanup) cleanup();
    };
  }, []);

  // نوار پیشرفت اسکرول. از سمت شروع خواندن پر می‌شود، پس با عوض شدن جهت (فارسی/انگلیسی) دوباره ساخته می‌شود.
  useEffect(() => {
    if (prefersReduced()) return;
    gsap.set('.progress', { transformOrigin: dir === 'rtl' ? '100% 50%' : '0% 50%' });
    const progress = gsap.to('.progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }, // Lenis خودش نرم می‌کند؛ scrub اضافه هر فریم کار می‌ریخت
    });
    return () => {
      progress.scrollTrigger && progress.scrollTrigger.kill();
      progress.kill();
    };
  }, [dir]);

  // با عوض شدن زبان یا صفحه، طول متن‌ها و ارتفاع صفحه عوض می‌شود؛ جای شروع انیمیشن‌ها دوباره محاسبه شود
  useEffect(() => {
    const frameId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frameId);
  }, [pageKey]);

  return (
    <>
      <StructuredData />
      <a className="skip-link" href="#main">
        {translations.ui.skip}
      </a>
      {sceneReady ? <Suspense fallback={sceneFallback}><Scene /></Suspense> : sceneFallback}
      <Cursor />
      <div className="progress" aria-hidden="true" />
      <Nav />
      <main id="main" tabIndex={-1} key={pageKey}>
        {route.page === 'works' && <WorksPage />}
        {route.page === 'project' && <ProjectPage slug={route.slug} />}
        {route.page === 'home' && (
          <>
            <Hero />
            <Marquee />
            <Services />
            <Work />
            <Process />
            <Manifesto />
            <Team />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
