import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// روی موبایل با بالا و پایین رفتن نوار آدرس، اندازه‌ی پنجره کمی عوض می‌شود و ScrollTrigger هر بار همه‌چیز را دوباره
// محاسبه می‌کرد (کندی و پرش هنگام اسکرول). با این گزینه فقط تغییر واقعی اندازه (مثل چرخاندن گوشی) محاسبه می‌شود.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
