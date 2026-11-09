import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const rand = (a, b) => a + Math.random() * (b - a);

/**
 * صحنه‌ی سه‌بعدی پس‌زمینه: عدد ۷ فلزی، حلقه‌ها، شکل‌های شناور و ذرات.
 * اسکرول صفحه، حرکت ماوس و زمان، همه روی صحنه اثر می‌گذارند.
 */
export function createScene(canvas, { accent = '#D4FF3A', lite = false, reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lite,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.25 : 2));
  renderer.setClearColor(0x0a0a0d, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0d, 0.03);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  camera.position.set(0, 0, 14);

  // بازتاب محیطی برای درخشش فلز
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const accentColor = new THREE.Color(accent);

  // نورها
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(5, 6, 8);
  scene.add(key);
  const accentLight = new THREE.PointLight(accentColor, 90, 40, 2);
  accentLight.position.set(-6, 2, 5);
  scene.add(accentLight);
  const coolLight = new THREE.PointLight(0x3de0ff, 60, 40, 2);
  coolLight.position.set(7, -3, 4);
  scene.add(coolLight);

  const group = new THREE.Group();
  scene.add(group);

  // عدد ۷ سه‌بعدی
  // شکل ۷ با چند نقطه ساخته می‌شود تا به فایل فونت نیازی نباشد.
  const shape = new THREE.Shape();
  shape.moveTo(-1.8, 2.5);
  shape.lineTo(1.8, 2.5);
  shape.lineTo(1.8, 1.7);
  shape.lineTo(-0.3, -2.5);
  shape.lineTo(-1.3, -2.5);
  shape.lineTo(0.7, 1.7);
  shape.lineTo(-1.8, 1.7);
  shape.closePath();
  const sevenGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.4,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.1,
    bevelSegments: lite ? 2 : 5,
  });
  sevenGeo.center();

  const sevenMat = new THREE.MeshPhysicalMaterial({
    color: accentColor,
    metalness: 0.85,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  });
  const seven = new THREE.Mesh(sevenGeo, sevenMat);
  const shell = new THREE.Mesh(
    sevenGeo,
    new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.1 })
  );
  shell.scale.setScalar(1.07);
  const hero = new THREE.Group();
  hero.add(seven, shell);

  // حلقه‌های مداری
  const ringMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.55 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.018, 8, lite ? 80 : 180), ringMat);
  ring1.rotation.x = Math.PI / 2.6;
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(6.4, 0.012, 8, lite ? 80 : 180),
    new THREE.MeshBasicMaterial({ color: 0x3de0ff, transparent: true, opacity: 0.4 })
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
  const solid = new THREE.MeshStandardMaterial({ color: 0x1b1b24, metalness: 0.9, roughness: 0.28 });
  const wire = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.6 });
  const floaterData = [];
  const count = lite ? 8 : 20;
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
  const pCount = lite ? 700 : 2400;
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
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particles);

  // پست‌پراسسینگ (درخشش)
  let composer = null;
  let bloom = null;
  if (!lite) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.6, 0.85);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // چیدمان بر اساس اندازه‌ی صفحه
  let baseX = -3.4;
  let baseY = 0;
  let baseScale = 1;
  let baseZ = 14;
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    if (composer) composer.setSize(w, h);
    camera.aspect = w / h;
    const wide = camera.aspect > 1.1;
    baseX = wide ? -3.6 : 0;
    baseY = wide ? 0 : 3.4;
    baseScale = wide ? 1 : 0.62;
    baseZ = wide ? 14 : 18;
    camera.updateProjectionMatrix();
    if (reduced) frame();
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
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const target = Math.min(1, Math.max(0, window.scrollY / max));
    cur += (target - cur) * (reduced ? 1 : 0.06);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const p = cur;
    const m = reduced ? 0 : 1;

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

  resize();
  window.addEventListener('resize', resize);
  if (!reduced) {
    window.addEventListener('pointermove', onMove, { passive: true });
    renderer.setAnimationLoop(frame);
  } else {
    frame();
    window.addEventListener('scroll', frame, { passive: true });
  }

  return function dispose() {
    renderer.setAnimationLoop(null);
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
  };
}
