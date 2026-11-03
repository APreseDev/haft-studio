import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';
import { setLenis } from './lenis.js';
import { prefersReduced } from './hooks.js';
import Scene from './components/Scene.jsx';
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

export default function App() {
  useEffect(() => {
    if (prefersReduced()) return;

    // اسکرول نرم، هماهنگ با ScrollTrigger
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // لینک‌های داخل صفحه با Lenis اسکرول شوند
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) {
        if (id === '#') e.preventDefault();
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72 });
    };
    document.addEventListener('click', onClick);

    // نوار پیشرفت اسکرول
    const progress = gsap.to('.progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
    });

    return () => {
      document.removeEventListener('click', onClick);
      progress.scrollTrigger && progress.scrollTrigger.kill();
      progress.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <>
      <Scene />
      <Cursor />
      <div className="progress" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Process />
        <Manifesto />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
