import { useEffect, useRef } from 'react';
import { useLang } from '../i18n/context.js';

// تعداد تکرار فهرست داخل هر ردیف. ردیف باید همیشه پهن‌تر از صفحه باشد، وگرنه روی لپ‌تاپ و مانیتور بزرگ
// وسط حرکت، قسمتی از نوار خالی دیده می‌شود. چهار تکرار تا حدود ۳۸۰۰ پیکسل عرض صفحه را می‌پوشاند.
// اگر این عدد را عوض کردید، مدت انیمیشن (--marquee-duration در styles.css) را هم متناسب با آن تغییر دهید.
const REPEAT = 4;

/** نوار کرمی با متن بی‌پایان. حرکتش با CSS است و برای کاربرانی که حرکت کم می‌خواهند متوقف می‌شود. */
export default function Marquee() {
  const { t } = useLang();
  const root = useRef(null);

  // وقتی نوار از صفحه بیرون است، انیمیشنش متوقف می‌شود (ترکیب‌کننده‌ی مرورگر هر فریم برایش کار نکند).
  // این تغییر دیده نمی‌شود چون فقط وقتی نوار دیده نمی‌شود فعال است.
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle('is-offscreen', !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // دو ردیف یکسان؛ فقط اولین فهرست برای صفحه‌خوان خوانده می‌شود و بقیه‌ی تکرارها پنهان‌اند.
  const row = (key) => (
    <div className="marquee__row" key={key}>
      {Array.from({ length: REPEAT }, (_, r) =>
        t.marquee.map((text, i) => (
          <span key={`${r}-${i}`} className="marquee__item" aria-hidden={key !== 'a' || r > 0 ? 'true' : undefined}>
            {text}
            <b aria-hidden="true">/</b>
          </span>
        ))
      )}
    </div>
  );
  return (
    <div className="marquee" role="presentation" ref={root}>
      <div className="marquee__track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
