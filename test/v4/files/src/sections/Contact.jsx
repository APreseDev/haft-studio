import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../gsap.js';
import { fromRight, fromLeft, fromBottom } from '../reveal.js';
import { Icon } from '../components/Icons.jsx';
import { contact, serviceOptions } from '../data.js';
import { sendContact } from '../api.js';
import { useMagnetic } from '../hooks.js';

export default function Contact() {
  const root = useRef(null);
  const submit = useMagnetic(0.25);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        // اطلاعات تماس از راست و فرم از چپ به هم می‌رسند؛ در موبایل (تک‌ستونه) هر دو از پایین
        if (window.innerWidth >= 769) {
          fromRight('.contact__info', '.contact__box');
          fromLeft('form', '.contact__box');
        } else {
          fromBottom('.contact__info, form', '.contact__box');
        }
      },
      root
    );
    return () => mm.revert();
  }, []);

  // پیام از طریق src/api.js به ایمیل تیم فرستاده می‌شود.
  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget; // قبل از await گرفته می‌شود
    const f = new FormData(form);
    const name = String(f.get('name') || '').trim();
    const phone = String(f.get('phone') || '').trim();
    const service = String(f.get('service') || '');
    const message = String(f.get('message') || '').trim();

    if (!name || !phone) {
      setStatus('لطفاً نام و شماره تماس را وارد کنید.');
      return;
    }
    // فیلد مخفی ضد اسپم: انسان آن را نمی‌بیند و پر نمی‌کند
    if (f.get('botcheck')) {
      setStatus('پیام شما ارسال شد. به‌زودی با شما تماس می‌گیریم.');
      return;
    }

    setSending(true);
    setStatus('در حال ارسال…');
    const r = await sendContact({ name, phone, service, message });
    setSending(false);
    if (r.ok) {
      setStatus('پیام شما ارسال شد. به‌زودی با شما تماس می‌گیریم.');
      form.reset();
    } else {
      setStatus('ارسال انجام نشد. دوباره تلاش کنید یا مستقیم با شماره و ایمیل بالا تماس بگیرید.');
    }
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
                <span>
                  <bdi>{contact.phone}</bdi>
                </span>
              </li>
              <li>
                <Icon name="insta" size={22} />
                <span>
                  <bdi>{contact.instagram}</bdi>
                </span>
              </li>
              <li>
                <Icon name="mail" size={22} />
                <span>
                  <bdi>{contact.email}</bdi>
                </span>
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
              <input id="f-phone" name="phone" type="tel" dir="rtl" autoComplete="tel" />
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
            <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button ref={submit} type="submit" className="btn btn--solid" disabled={sending}>
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
