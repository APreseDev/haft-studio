import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LOGO_PIECES, LOGO_H } from './logoShapes.js';

const rand = (a, b) => a + Math.random() * (b - a);

/**
 * صحنه‌ی سه‌بعدی پس‌زمینه: لوگوی فلزی سه‌بعدی (به‌جای ۷)، حلقه‌ها، شکل‌های شناور و ذرات.
 * اسکرول صفحه، حرکت ماوس و زمان، همه روی صحنه اثر می‌گذارند.
 */
// تنظیمات ظاهر. اگر عدد ۷ هنوز زیادی روشن (سفید) یا زیادی تیره بود، فقط این عددها را عوض کنید.
const LOOK = {
  sevenColor: '#3B82D6', // کرمی/شامپاینی تیره‌تر، تا زیر نور به سفید نرسد
  exposure: 0.95, // روشنایی کلی صحنه
  envIntensity: 0.35, // شدت بازتاب محیط روی فلز
  keyLight: 0.8, // نور اصلی
  accentLight: 30, // نور کرمی متحرک
  warmLight: 26, // نور کهربایی کناری
  bloomStrength: 0.3, // شدت درخشش
  bloomThreshold: 0.95, // درخشش فقط روی روشن‌ترین نقطه‌ها
  particleOpacity: 0.5, // شفافیت ذرات
  // محو شدن عدد ۷ با اسکرول: از ۵۰٪ ارتفاع بخش اول (هیرو) شروع می‌شود و کمی بعد از خروج کامل هیرو تمام می‌شود.
  fadeStart: 0.5,
  fadeEnd: 1.1,
  // --- تنظیمات سرعت ---
  maxPixelRatio: 1, // سقف وضوح رندر؛ ۱ یعنی بدون وضوح اضافه روی نمایشگرهای رتینا (حدود ۳۶٪ پیکسل کمتر از ۱٫۲۵)
  bloom: false, // درخشش (چند پاس تمام‌صفحه). ظاهر را خیلی کم عوض می‌کند ولی سنگین‌ترین بخش بود؛ برای روشن‌کردن true بگذارید
  floaters: 10, // تعداد شکل‌های شناور (نسخه‌ی سبک ۶)
  particles: 800, // تعداد ذرات (نسخه‌ی سبک ۴۰۰)
  fps: 60, // سقف فریم در ثانیه وقتی عدد ۷ دیده می‌شود
  idleFps: 30, // سقف فریم بعد از هیرو، وقتی عدد ۷ کاملاً محو شده و فقط ذرات و شکل‌های کند حرکت می‌کنند
};

/**
 * صحنه‌ی سه‌بعدی پس‌زمینه. خروجی: { dispose, setTheme }.
 * accent: رنگ تأکید در حالت تیره؛ accentOnLight: رنگ تأکید در حالت روشن؛ theme: 'dark' | 'light'
 */
export function createScene(
  canvas,
  { accent = '#1A8CFF', accentOnLight = '#0A5FD1', lite = false, reduced = false, theme: initialTheme = 'dark' } = {}
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lite,
    alpha: false, // زمینه همیشه پُر است (setClearColor با آلفای ۱)؛ بافت بدون کانال آلفا کار ترکیب مرورگر را سبک‌تر می‌کند
    stencil: false, // از stencil استفاده نمی‌شود؛ حافظه‌ی گرافیکی کمتر
    powerPreference: lite ? 'default' : 'high-performance', // پس‌زمینه‌ی تزئینی روی گوشی/دستگاه ضعیف باتری را فشار ندهد
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, LOOK.maxPixelRatio)); // سقف کمتر = رندر خیلی سبک‌تر
  renderer.setClearColor(0x04070d, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = LOOK.exposure;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04070d, 0.03);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  camera.position.set(0, 0, 14);

  // بازتاب محیطی برای درخشش فلز
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTex = pmrem.fromScene(room, 0.04).texture;
  // صحنه‌ی کمکی و ابزار ساخت بازتاب بعد از ساخته شدن تکسچر لازم نیستند؛ زودتر آزاد می‌شوند (ظاهر عوض نمی‌شود)
  if (room.dispose) room.dispose();
  pmrem.dispose();
  scene.environment = envTex;
  scene.environmentIntensity = LOOK.envIntensity;

  const accentColor = new THREE.Color(accent);

  // نورها
  const key = new THREE.DirectionalLight(0xd6e8ff, LOOK.keyLight);
  key.position.set(5, 6, 8);
  scene.add(key);
  const accentLight = new THREE.PointLight(accentColor, LOOK.accentLight, 40, 2);
  accentLight.position.set(-6, 2, 5);
  scene.add(accentLight);
  // نور کناری کهربایی (به‌جای نور فیروزه‌ای قبلی) تا همه‌چیز در تن کرمی بماند
  const coolLight = new THREE.PointLight(0x2f7fff, LOOK.warmLight, 40, 2);
  coolLight.position.set(7, -3, 4);
  scene.add(coolLight);

  const group = new THREE.Group();
  scene.add(group);

  // لوگوی سه‌بعدی هفت استودیو (جایگزین عدد ۷ قبلی)
  // هر تکه‌ی لوگو جدا اکسترود می‌شود تا فاصله‌ی باریک بین تکه‌ها بماند؛ عمق تکه‌ها کمی فرق دارد تا حس لایه‌لایه بدهد.
  const LOGO_SCALE = 5.2 / LOGO_H; // ارتفاع لوگو در صحنه ≈ ۵٫۲ واحد (هم‌اندازه‌ی ۷ قبلی)
  const sevenMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(LOOK.sevenColor),
    metalness: 0.7,
    roughness: 0.32,
    clearcoat: 0.25,
    clearcoatRoughness: 0.3,
    transparent: true, // از ابتدا شفاف‌پذیر است تا هنگام اولین محوشدن، شیدر دوباره کامپایل نشود و نپرد
  });
  const shellMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.1 });
  const seven = new THREE.Group(); // نام قدیمی حفظ شده؛ حالا گروه تکه‌های لوگوست
  const shell = new THREE.Group();
  shell.scale.setScalar(1.05);
  LOGO_PIECES.forEach((pts, i) => {
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x * LOGO_SCALE, y * LOGO_SCALE)));
    const depth = 0.9 + (i % 3) * 0.28;
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.025,
      bevelOffset: -0.025,
      bevelSegments: lite ? 1 : 3,
    });
    geo.translate(0, 0, -depth / 2);
    seven.add(new THREE.Mesh(geo, sevenMat));
    shell.add(new THREE.Mesh(geo, shellMat));
  });
  const hero = new THREE.Group();
  hero.add(seven, shell);

  // حلقه‌های مداری
  const ringMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.4 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.018, 8, lite ? 80 : 180), ringMat);
  ring1.rotation.x = Math.PI / 2.6;
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(6.4, 0.012, 8, lite ? 80 : 180),
    new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.28 })
  );
  ring2.rotation.set(Math.PI / 3, 0.6, 0);
  hero.add(ring1, ring2);
  group.add(hero);

  // شکل‌های شناور
  const floaters = new THREE.Group();
  scene.add(floaters);
  const geos = [
    new THREE.IcosahedronGeometry(0.42, 0),
    new THREE.OctahedronGeometry(0.5),
    new THREE.TorusGeometry(0.34, 0.12, 12, 28),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
  ];
  const solid = new THREE.MeshStandardMaterial({ color: 0x161b24, metalness: 0.9, roughness: 0.28 });
  const wire = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.45 });
  const floaterData = [];
  const count = lite ? 6 : LOOK.floaters;
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(geos[i % geos.length], i % 3 === 0 ? wire : solid);
    const ang = rand(0, Math.PI * 2);
    const rad = rand(6, 17);
    m.position.set(Math.cos(ang) * rad, rand(-9, 9), rand(-12, 3));
    m.scale.setScalar(rand(0.7, 1.9));
    floaters.add(m);
    floaterData.push({ m, sx: rand(-0.4, 0.4), sy: rand(-0.4, 0.4), ph: rand(0, 6.28), y0: m.position.y });
  }

  // ذرات
  const pCount = lite ? 400 : LOOK.particles;
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pos[i * 3] = rand(-26, 26);
    pos[i * 3 + 1] = rand(-20, 20);
    pos[i * 3 + 2] = rand(-26, 8);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: accentColor,
      size: 0.06,
      transparent: true,
      opacity: LOOK.particleOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particles);

  // پست‌پراسسینگ (درخشش)
  // درخشش (bloom) سنگین‌ترین بخش است؛ فقط روی دستگاه‌های قوی (۸ هسته یا بیشتر) فعال می‌شود.
  const useBloom = LOOK.bloom && !lite && initialTheme === 'dark' && (navigator.hardwareConcurrency || 4) >= 8;
  // کدهای پست‌پراسسینگ فقط روی دستگاه‌های قوی و با import پویا دانلود می‌شوند؛ بقیه‌ی کاربران این بسته را نمی‌گیرند.
  // تا آماده شدن آن، صحنه بدون درخشش رندر می‌شود.
  let composer = null;
  let disposed = false;
  let bloomOff = false; // وقتی کنترل‌کننده‌ی کیفیت درخشش را خاموش کرد، دیگر ساخته نشود
  if (useBloom) {
    Promise.all([
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js'),
    ])
      .then(([ec, rp, ub, op]) => {
        if (disposed || bloomOff) return;
        const c = new ec.EffectComposer(renderer);
        c.addPass(new rp.RenderPass(scene, camera));
        c.addPass(new ub.UnrealBloomPass(new THREE.Vector2(1, 1), LOOK.bloomStrength, 0.6, LOOK.bloomThreshold));
        c.addPass(new op.OutputPass());
        if (lastW && lastH) c.setSize(lastW, lastH);
        composer = c;
        if (reduced) frame();
      })
      .catch((err) => console.warn('Bloom unavailable', err));
  }

  // حالت تیره/روشن: رنگ زمینه و مه، رنگ خط‌ها و ذرات، و ترکیب ذرات (روی زمینه‌ی روشن، additive دیده نمی‌شود)
  const PALETTE = {
    dark: { bg: 0x04070d, accent, blending: THREE.AdditiveBlending, particleOpacity: LOOK.particleOpacity },
    light: { bg: 0xf3f6fb, accent: accentOnLight, blending: THREE.NormalBlending, particleOpacity: 0.55 },
  };
  function applyTheme(name) {
    const p = PALETTE[name] || PALETTE.dark;
    renderer.setClearColor(p.bg, 1);
    scene.fog.color.set(p.bg);
    [shellMat, ringMat, ring2.material, wire, particles.material].forEach((m) => m.color.set(p.accent));
    particles.material.blending = p.blending;
    particles.material.opacity = p.particleOpacity;
    particles.material.needsUpdate = true;
    if (name === 'light') {
      // درخشش (bloom) روی زمینه‌ی روشن کل صفحه را می‌درخشاند؛ در حالت روشن خاموش است (و بعد از آن دوباره ساخته نمی‌شود)
      bloomOff = true;
      if (composer) {
        composer.dispose();
        composer = null;
      }
    }
  }
  applyTheme(initialTheme);

  // چیدمان بر اساس اندازه‌ی صفحه
  let baseX = -3.4;
  let baseY = 0;
  let baseScale = 1;
  let baseZ = 14;
  // اندازه از خود بوم گرفته می‌شود (ارتفاعش با CSS ثابت است). با بالا و پایین رفتن نوار آدرس موبایل
  // اندازه عوض نمی‌شود، پس صحنه دوباره ساخته نمی‌شود و نمی‌پرد.
  let lastW = 0;
  let lastH = 0;
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    renderer.setSize(w, h, false);
    if (composer) composer.setSize(w, h);
    camera.aspect = w / h;
    const wide = camera.aspect > 1.1;
    // فارسی (راست‌به‌چپ): متن سمت راست است و ۷ سمت چپ. انگلیسی (چپ‌به‌راست): متن سمت چپ است و ۷ باید سمت راست باشد.
    const side = document.documentElement.getAttribute('dir') === 'ltr' ? 1 : -1;
    baseX = wide ? 3.6 * side : 0;
    baseY = wide ? 0 : 3.4;
    baseScale = wide ? 1 : 0.62;
    baseZ = wide ? 14 : 18;
    camera.updateProjectionMatrix();
    if (reduced) frame();
  }

  // ارتفاع قابل اسکرول فقط وقتی اندازه‌ی صفحه عوض می‌شود محاسبه می‌شود، نه در هر فریم
  let maxScroll = 1;
  let fadeFrom = 0;
  let fadeTo = 1;
  const updateMax = () => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    // محدوده‌ی محوشدن عدد ۷ (به پیکسل) بر اساس ارتفاع بخش اول؛ فقط وقتی اندازه عوض می‌شود محاسبه می‌شود
    const heroEl = document.getElementById('top');
    const heroH = (heroEl && heroEl.offsetHeight) || window.innerHeight;
    fadeFrom = heroH * LOOK.fadeStart;
    fadeTo = Math.max(fadeFrom + 1, heroH * LOOK.fadeEnd);
  };

  // میزان دیده‌شدن عدد ۷ (۱ = کامل، ۰ = محو). فقط تابعی از موقعیت اسکرول است، پس بالا و پایین‌رفتن خودبه‌خود معکوس می‌شود.
  let shellOff = false; // وقتی کنترل‌کننده‌ی کیفیت قاب سیمی را خاموش کرد، دوباره روشن نشود
  let lastFade = -1;
  const sevenShellOpacity = shellMat.opacity; // ۰٫۱ ؛ شفافیت پایه‌ی قاب سیمی
  function applyFade(y) {
    const k = Math.min(1, Math.max(0, (y - fadeFrom) / (fadeTo - fadeFrom)));
    const vis = 1 - k * k * (3 - 2 * k); // smoothstep
    if (vis === lastFade) return; // بدون تغییر: کاری نکن
    lastFade = vis;
    sevenMat.opacity = vis;
    shellMat.opacity = sevenShellOpacity * vis;
    seven.visible = vis > 0.002; // وقتی کاملاً محو است اصلاً رسم نشود
    shell.visible = !shellOff && vis > 0.002;
  }

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  const clock = new THREE.Clock();
  let cur = 0;
  function frame() {
    const t = clock.getElapsedTime();
    const max = maxScroll;
    const target = Math.min(1, Math.max(0, window.scrollY / max));
    cur += (target - cur) * (reduced ? 1 : 0.06);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const p = cur;
    const m = reduced ? 0 : 1;
    applyFade(window.scrollY);

    hero.rotation.y = m * (p * Math.PI * 5 + t * 0.25 + mouse.x * 0.5);
    hero.rotation.x = 0.08 + m * (Math.sin(p * Math.PI * 3) * 0.4 + mouse.y * 0.3);
    hero.position.x = baseX * Math.cos(p * Math.PI * 2.5);
    hero.position.y = baseY + m * (Math.sin(t * 0.8) * 0.25 + Math.sin(p * Math.PI * 4) * 0.6);
    hero.position.z = -p * 6;
    hero.scale.setScalar(baseScale * (1 - 0.3 * Math.min(1, p * 1.5)));
    ring1.rotation.z = m * t * 0.35;
    ring2.rotation.z = m * -t * 0.22;

    camera.position.x = mouse.x * 0.8;
    camera.position.y = -mouse.y * 0.5;
    camera.position.z = baseZ - Math.sin(p * Math.PI) * 2;
    camera.lookAt(0, 0, 0);

    accentLight.position.x = Math.sin(t * 0.6) * 7;
    coolLight.position.y = Math.cos(t * 0.5) * 5;

    particles.rotation.y = m * (t * 0.02 + p * 0.8);
    particles.position.y = p * 3;

    for (const f of floaterData) {
      f.m.rotation.x += f.sx * 0.01 * m;
      f.m.rotation.y += f.sy * 0.01 * m;
      f.m.position.y = f.y0 + m * Math.sin(t * 0.5 + f.ph) * 0.6 + p * 2;
    }

    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  updateMax();
  resize();
  // چند تغییر اندازه‌ی پشت‌سرهم (مثلاً هنگام انیمیشن یا باز شدن منو) فقط یک بار محاسبه می‌شود (updateMax به layout دست می‌زند)
  let maxRaf = 0;
  const bodyObserver = new ResizeObserver(() => {
    if (maxRaf) return;
    maxRaf = requestAnimationFrame(() => {
      maxRaf = 0;
      updateMax();
    });
  });
  bodyObserver.observe(document.body);
  window.addEventListener('load', updateMax);
  window.addEventListener('resize', resize);
  // با عوض شدن زبان (و جهت صفحه)، جای عدد ۷ هم عوض شود
  const dirObserver = new MutationObserver(() => {
    lastW = 0;
    resize();
  });
  dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
  if (!reduced) {
    window.addEventListener('pointermove', onMove, { passive: true });
    // سقف حدود ۶۰ فریم در ثانیه: روی نمایشگرهای ۱۲۰/۱۴۴ هرتز رندر و سرعت انیمیشن دو برابر نشود
    //
    // کنترل‌کننده‌ی کیفیت: اگر دستگاه در چند ثانیه‌ی اول فریم کافی ندهد، صحنه خودکار سبک‌تر می‌شود
    // (مرحله ۱: بدون درخشش، رزولوشن ۱، شکل‌های کمتر) و اگر باز هم کند بود، ثابت می‌ماند
    // و آخرین فریم به‌عنوان پس‌زمینه می‌ماند تا اسکرول صفحه روان شود.
    let last = 0;
    let tier = 0;
    let frames = 0;
    let acc = 0;
    let good = 0;
    let monitoring = true;
    const WARMUP = 90; // فریم‌های اول (کامپایل شیدر و ...) حساب نمی‌شوند
    const WINDOW = 120;
    const degrade = () => {
      tier += 1;
      if (tier === 1) {
        bloomOff = true;
        if (composer) {
          composer.dispose();
          composer = null;
        }
        renderer.setPixelRatio(1);
        lastW = 0;
        resize();
        shellOff = true;
        shell.visible = false;
        floaterData.forEach((f, i) => {
          if (i % 2) f.m.visible = false;
        });
      } else {
        renderer.setAnimationLoop(null);
        monitoring = false;
      }
    };
    // وقتی عدد ۷ کاملاً محو است (بعد از هیرو)، صحنه با نیمی از فریم‌ریت رسم می‌شود. این بخش از صفحه فقط ذرات
    // و شکل‌های کند دارد و تفاوتش دیده نمی‌شود، ولی کار پردازنده‌ی گرافیکی نصف می‌شود.
    const MIN_DT = 1000 / LOOK.fps - 2;
    const MIN_DT_IDLE = 1000 / LOOK.idleFps - 3;
    renderer.setAnimationLoop((now) => {
      const dt = now - last;
      const idle = lastFade === 0;
      if (dt < (idle ? MIN_DT_IDLE : MIN_DT)) return;
      last = now;
      frame();
      // فریم‌های کم‌فریم‌ریتِ عمدی در حالت idle نباید به‌عنوان «دستگاه کند» حساب شوند
      if (monitoring && !idle && dt < 250) {
        // وقفه‌های بزرگ (مثلاً عوض‌کردن تب) حساب نمی‌شوند
        frames += 1;
        if (frames > WARMUP) {
          acc += dt;
          if (frames === WARMUP + WINDOW) {
            const avg = acc / WINDOW;
            frames = 0;
            acc = 0;
            if (avg > (tier === 0 ? 28 : 40)) degrade();
            else if (++good >= 2) monitoring = false;
          }
        }
      }
    });
  } else {
    frame();
    window.addEventListener('scroll', frame, { passive: true });
  }

  function dispose() {
    disposed = true;
    renderer.setAnimationLoop(null);
    bodyObserver.disconnect();
    dirObserver.disconnect();
    if (maxRaf) cancelAnimationFrame(maxRaf);
    window.removeEventListener('load', updateMax);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', frame);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((mt) => mt.dispose());
      }
    });
    envTex.dispose();
    pmrem.dispose();
    if (composer) composer.dispose();
    renderer.dispose();
  }

  return {
    dispose,
    // یک فریم تازه هم رسم می‌شود تا حالت بدون حلقه‌ی انیمیشن (کاهش حرکت یا کیفیت پایین) هم فوراً رنگ عوض کند
    setTheme(name) {
      applyTheme(name);
      frame();
    },
  };
}
