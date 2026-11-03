import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../gsap.js';
import { Icon } from '../components/Icons.jsx';
import { contact, serviceOptions } from '../data.js';
import { useMagnetic } from '../hooks.js';

export default function Contact() {
  const root = useRef(null);
  const submit = useMagnetic(0.25);
  const [status, setStatus] = useState('');

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.contact__box', {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact__box', start: 'top 85%' },
        });
      },
      root
    );
    return () => mm.revert();
  }, []);

  // اگر در data.js ایمیل واقعی بگذارید، فرم یک ایمیل آماده در برنامه‌ی ایمیل کاربر باز می‌کند.
  // فرم به سرور وصل نیست؛ برای ارسال واقعی باید یک سرویس فرم یا API اضافه شود.
  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = contact.email;
    if (!email || email.startsWith('[')) {
      setStatus('ایمیل تیم هنوز در فایل data.js تنظیم نشده است.');
      return;
    }
    const subject = encodeURIComponent(`درخواست پروژه: ${f.get('service')}`);
    const body = encodeURIComponent(
      `نام: ${f.get('name')}\nتماس: ${f.get('phone')}\nخدمت: ${f.get('service')}\n\n${f.get('message')}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus('برنامه‌ی ایمیل شما باز شد. پیام را از همان‌جا ارسال کنید.');
  };

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="wrap">
        <div className="contact__box">
          <div className="contact__info">
            <p className="eyebrow">۰۵ — تماس</p>
            <h2>پروژه‌ات را برایمان بگو.</h2>
            <p className="sub">چند خط درباره‌ی کسب‌وکار و هدفت بنویس. به‌زودی با تو تماس می‌گیریم.</p>
            <ul className="contact__list">
              <li>
                <Icon name="call" size={22} />
                <span>{contact.phone}</span>
              </li>
              <li>
                <Icon name="insta" size={22} />
                <span>{contact.instagram}</span>
              </li>
              <li>
                <Icon name="mail" size={22} />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="f-name">نام و نام شرکت</label>
              <input id="f-name" name="name" type="text" autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="f-phone">شماره تماس</label>
              <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="f-service">چه خدمتی لازم داری؟</label>
              <select id="f-service" name="service">
                {serviceOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-msg">درباره‌ی پروژه بنویس</label>
              <textarea id="f-msg" name="message" rows="4" />
            </div>
            <button ref={submit} type="submit" className="btn btn--solid">
              ارسال درخواست
              <Icon name="arrow" size={20} />
            </button>
            <p className="status" role="status">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
