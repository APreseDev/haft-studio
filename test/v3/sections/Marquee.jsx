import { marquee } from '../data.js';

/** نوار لیمویی با متن بی‌پایان. حرکتش با CSS است و برای کاربرانی که حرکت کم می‌خواهند متوقف می‌شود. */
export default function Marquee() {
  const row = (key) => (
    <div className="marquee__row" aria-hidden={key !== 'a'} key={key}>
      {marquee.map((t, i) => (
        <span key={t + i} className="marquee__item">
          {t}
          <b aria-hidden="true">/</b>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
