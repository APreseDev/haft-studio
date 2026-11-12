import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LOGO_PIECES, LOGO_H } from './logoShapes.js';

const rand = (min, max) => min + Math.random() * (max - min);

/**
 * صحنه‌ی سه‌بعدی پس‌زمینه: لوگوی فلزی سه‌بعدی (به‌جای ۷)، حلقه‌ها، شکل‌های شناور و ذرات.
 * اسکرول صفحه، حرکت ماوس و زمان، همه روی صحنه اثر می‌گذارند.
 */
// تنظیمات ظاهر. اگر عدد ۷ هنوز زیادی روشن (سفید) یا زیادی تیره بود، فقط این عددها را عوض کنید.
const LOOK = {
  sevenColor: '#E9B02A', // کرمی/شامپاینی تیره‌تر، تا زیر نور به سفید نرسد
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
  floaters: 6, // تعداد شکل‌های شناور (نسخه‌ی سبک ۴)
  particles: 400, // تعداد ذرات (نسخه‌ی سبک ۲۰۰)
  shell: false, // قاب سیمی دور لوگو؛ تعداد رسم‌ها را دو برابر می‌کند، پس پیش‌فرض خاموش است
  fps: 60, // سقف فریم در ثانیه وقتی عدد ۷ دیده می‌شود
  idleFps: 20, // سقف فریم بعد از هیرو، وقتی عدد ۷ کاملاً محو شده و فقط ذرات و شکل‌های کند حرکت می‌کنند
};

/**
 * صحنه‌ی سه‌بعدی پس‌زمینه. خروجی: { dispose, setTheme }.
 * accent: رنگ تأکید در حالت تیره؛ accentOnLight: رنگ تأکید در حالت روشن؛ theme: 'dark' | 'light'
 */
export function createScene(
  canvas,
  { accent = '#FFC93C', accentOnLight = '#C98F00', lite = false, reduced = false, theme: initialTheme = 'dark' } = {}
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lite,
    alpha: false, // زمینه همیشه پُر است (setClearColor با آلفای ۱)؛ بافت بدون کانال آلفا کار ترکیب مرورگر را سبک‌تر می‌کند
    stencil: false, // از stencil استفاده نمی‌شود؛ حافظه‌ی گرافیکی کمتر
    powerPreference: lite ? 'default' : 'high-performance', // پس‌زمینه‌ی تزئینی روی گوشی/دستگاه ضعیف باتری را فشار ندهد
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, LOOK.maxPixelRatio)); // سقف کمتر = رندر خیلی سبک‌تر
  renderer.setClearColor(0x2b2d31, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = LOOK.exposure;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x2b2d31, 0.03);

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
  const keyLight = new THREE.DirectionalLight(0xfff4d6, LOOK.keyLight);
  keyLight.position.set(5, 6, 8);
  scene.add(keyLight);
  const accentLight = new THREE.PointLight(accentColor, LOOK.accentLight, 40, 2);
  accentLight.position.set(-6, 2, 5);
  scene.add(accentLight);
  // نور کناری کهربایی (به‌جای نور فیروزه‌ای قبلی) تا همه‌چیز در تن کرمی بماند
  const coolLight = new THREE.PointLight(0xffb300, LOOK.warmLight, 40, 2);
  coolLight.position.set(7, -3, 4);
  scene.add(coolLight);

  const group = new THREE.Group();
  scene.add(group);

  // لوگوی سه‌بعدی هفت استودیو (جایگزین عدد ۷ قبلی)
  // هر تکه‌ی لوگو جدا اکسترود می‌شود تا فاصله‌ی باریک بین تکه‌ها بماند؛ عمق تکه‌ها کمی فرق دارد تا حس لایه‌لایه بدهد.
  const LOGO_SCALE = 5.2 / LOGO_H; // ارتفاع لوگو در صحنه ≈ ۵٫۲ واحد (هم‌اندازه‌ی ۷ قبلی)
  const sevenMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(LOOK.sevenColor),
    metalness: 0.7,
    roughness: 0.32,
    transparent: true, // از ابتدا شفاف‌پذیر است تا هنگام اولین محوشدن، شیدر دوباره کامپایل نشود و نپرد
  });
  const shellMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.1 });
  const seven = new THREE.Group(); // نام قدیمی حفظ شده؛ حالا گروه تکه‌های لوگوست
  const shell = new THREE.Group();
  shell.scale.setScalar(1.05);
  LOGO_PIECES.forEach((points, pieceIndex) => {
    const shape = new THREE.Shape(points.map(([pointX, pointY]) => new THREE.Vector2(pointX * LOGO_SCALE, pointY * LOGO_SCALE)));
    const depth = 0.9 + (pieceIndex % 3) * 0.28;
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.025,
      bevelOffset: -0.025,
      bevelSegments: lite ? 1 : 2,
    });
    geometry.translate(0, 0, -depth / 2);
    seven.add(new THREE.Mesh(geometry, sevenMat));
    if (LOOK.shell) shell.add(new THREE.Mesh(geometry, shellMat));
  });
  const hero = new THREE.Group();
  hero.add(seven, shell);

  // حلقه‌های مداری
  const ringMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.4 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.018, 8, lite ? 64 : 96), ringMat);
  ring1.rotation.x = Math.PI / 2.6;
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(6.4, 0.012, 8, lite ? 64 : 96),
    new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.28 })
  );
  ring2.rotation.set(Math.PI / 3, 0.6, 0);
  hero.add(ring1, ring2);
  group.add(hero);

  // شکل‌های شناور
  const floaters = new THREE.Group();
  scene.add(floaters);
  const floaterGeometries = [
    new THREE.IcosahedronGeometry(0.42, 0),
    new THREE.OctahedronGeometry(0.5),
    new THREE.TorusGeometry(0.34, 0.12, 12, 28),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
  ];
  const solid = new THREE.MeshStandardMaterial({ color: 0x1b1c1f, metalness: 0.9, roughness: 0.28 });
  const wire = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.45 });
  const floaterData = [];
  const count = lite ? 4 : LOOK.floaters;
  for (let floaterIndex = 0; floaterIndex < count; floaterIndex++) {
    const mesh = new THREE.Mesh(floaterGeometries[floaterIndex % floaterGeometries.length], floaterIndex % 3 === 0 ? wire : solid);
    const angle = rand(0, Math.PI * 2);
    const radius = rand(6, 17);
    mesh.position.set(Math.cos(angle) * radius, rand(-9, 9), rand(-12, 3));
    mesh.scale.setScalar(rand(0.7, 1.9));
    floaters.add(mesh);
    floaterData.push({ mesh, spinX: rand(-0.4, 0.4), spinY: rand(-0.4, 0.4), phase: rand(0, 6.28), startY: mesh.position.y });
  }

  // ذرات
  const particleCount = lite ? 200 : LOOK.particles;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
    particlePositions[particleIndex * 3] = rand(-26, 26);
    particlePositions[particleIndex * 3 + 1] = rand(-20, 20);
    particlePositions[particleIndex * 3 + 2] = rand(-26, 8);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
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
      .then(([effectComposerModule, renderPassModule, unrealBloomPassModule, outputPassModule]) => {
        if (disposed || bloomOff) return;
        const effectComposer = new effectComposerModule.EffectComposer(renderer);
        effectComposer.addPass(new renderPassModule.RenderPass(scene, camera));
        effectComposer.addPass(new unrealBloomPassModule.UnrealBloomPass(new THREE.Vector2(1, 1), LOOK.bloomStrength, 0.6, LOOK.bloomThreshold));
        effectComposer.addPass(new outputPassModule.OutputPass());
        if (lastWidth && lastHeight) effectComposer.setSize(lastWidth, lastHeight);
        composer = effectComposer;
        if (reduced) frame();
      })
      .catch(() => {
        // بسته‌ی درخشش دانلود نشد؛ صحنه بدون درخشش ادامه می‌دهد
      });
  }

  // حالت تیره/روشن: رنگ زمینه و مه، رنگ خط‌ها و ذرات، و ترکیب ذرات (روی زمینه‌ی روشن، additive دیده نمی‌شود)
  const PALETTE = {
    dark: { bg: 0x2b2d31, accent, blending: THREE.AdditiveBlending, particleOpacity: LOOK.particleOpacity },
    light: { bg: 0xd9dadc, accent: accentOnLight, blending: THREE.NormalBlending, particleOpacity: 0.55 },
  };
  function applyTheme(name) {
    const colors = PALETTE[name] || PALETTE.dark;
    renderer.setClearColor(colors.bg, 1);
    scene.fog.color.set(colors.bg);
    [shellMat, ringMat, ring2.material, wire, particles.material].forEach((material) => material.color.set(colors.accent));
    particles.material.blending = colors.blending;
    particles.material.opacity = colors.particleOpacity;
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
  let lastWidth = 0;
  let lastHeight = 0;
  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;
    renderer.setSize(width, height, false);
    if (composer) composer.setSize(width, height);
    camera.aspect = width / height;
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
  function applyFade(scrollPosition) {
    const fadeProgress = Math.min(1, Math.max(0, (scrollPosition - fadeFrom) / (fadeTo - fadeFrom)));
    const visibility = 1 - fadeProgress * fadeProgress * (3 - 2 * fadeProgress); // smoothstep
    if (visibility === lastFade) return; // بدون تغییر: کاری نکن
    lastFade = visibility;
    sevenMat.opacity = visibility;
    shellMat.opacity = sevenShellOpacity * visibility;
    seven.visible = visibility > 0.002; // وقتی کاملاً محو است اصلاً رسم نشود
    shell.visible = !shellOff && visibility > 0.002;
  }

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (event) => {
    mouse.tx = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (event.clientY / window.innerHeight) * 2 - 1;
  };

  const clock = new THREE.Clock();
  let smoothedScroll = 0;
  function frame() {
    const elapsed = clock.getElapsedTime();
    const scrollRange = maxScroll;
    const target = Math.min(1, Math.max(0, window.scrollY / scrollRange));
    smoothedScroll += (target - smoothedScroll) * (reduced ? 1 : 0.06);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const scrollProgress = smoothedScroll;
    const motionScale = reduced ? 0 : 1;
    applyFade(window.scrollY);

    hero.rotation.y = motionScale * (scrollProgress * Math.PI * 5 + elapsed * 0.25 + mouse.x * 0.5);
    hero.rotation.x = 0.08 + motionScale * (Math.sin(scrollProgress * Math.PI * 3) * 0.4 + mouse.y * 0.3);
    hero.position.x = baseX * Math.cos(scrollProgress * Math.PI * 2.5);
    hero.position.y = baseY + motionScale * (Math.sin(elapsed * 0.8) * 0.25 + Math.sin(scrollProgress * Math.PI * 4) * 0.6);
    hero.position.z = -scrollProgress * 6;
    hero.scale.setScalar(baseScale * (1 - 0.3 * Math.min(1, scrollProgress * 1.5)));
    ring1.rotation.z = motionScale * elapsed * 0.35;
    ring2.rotation.z = motionScale * -elapsed * 0.22;

    camera.position.x = mouse.x * 0.8;
    camera.position.y = -mouse.y * 0.5;
    camera.position.z = baseZ - Math.sin(scrollProgress * Math.PI) * 2;
    camera.lookAt(0, 0, 0);

    accentLight.position.x = Math.sin(elapsed * 0.6) * 7;
    coolLight.position.y = Math.cos(elapsed * 0.5) * 5;

    particles.rotation.y = motionScale * (elapsed * 0.02 + scrollProgress * 0.8);
    particles.position.y = scrollProgress * 3;

    for (const floater of floaterData) {
      floater.mesh.rotation.x += floater.spinX * 0.01 * motionScale;
      floater.mesh.rotation.y += floater.spinY * 0.01 * motionScale;
      floater.mesh.position.y = floater.startY + motionScale * Math.sin(elapsed * 0.5 + floater.phase) * 0.6 + scrollProgress * 2;
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
    lastWidth = 0;
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
    let lastFrameTime = 0;
    let tier = 0;
    let frames = 0;
    let frameTimeSum = 0;
    let goodWindows = 0;
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
        lastWidth = 0;
        resize();
        shellOff = true;
        shell.visible = false;
        floaterData.forEach((floater, index) => {
          if (index % 2) floater.mesh.visible = false;
        });
      } else {
        renderer.setAnimationLoop(null);
        monitoring = false;
      }
    };
    // وقتی عدد ۷ کاملاً محو است (بعد از هیرو)، صحنه با نیمی از فریم‌ریت رسم می‌شود. این بخش از صفحه فقط ذرات
    // و شکل‌های کند دارد و تفاوتش دیده نمی‌شود، ولی کار پردازنده‌ی گرافیکی نصف می‌شود.
    const MIN_DT = 1000 / (lite ? 30 : LOOK.fps) - 2; // روی دستگاه ضعیف/موبایل نصف فریم (حدود ۳۰ فریم در ثانیه)
    const MIN_DT_IDLE = 1000 / LOOK.idleFps - 3;
    renderer.setAnimationLoop((timestamp) => {
      const deltaMs = timestamp - lastFrameTime;
      const idle = lastFade === 0;
      if (deltaMs < (idle ? MIN_DT_IDLE : MIN_DT)) return;
      lastFrameTime = timestamp;
      frame();
      // فریم‌های کم‌فریم‌ریتِ عمدی در حالت idle نباید به‌عنوان «دستگاه کند» حساب شوند
      if (monitoring && !idle && deltaMs < 250) {
        // وقفه‌های بزرگ (مثلاً عوض‌کردن تب) حساب نمی‌شوند
        frames += 1;
        if (frames > WARMUP) {
          frameTimeSum += deltaMs;
          if (frames === WARMUP + WINDOW) {
            const averageFrameMs = frameTimeSum / WINDOW;
            frames = 0;
            frameTimeSum = 0;
            if (averageFrameMs > (tier === 0 ? 24 : 36)) degrade();
            else if (++goodWindows >= 2) monitoring = false;
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
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
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
