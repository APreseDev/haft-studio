import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../gsap.js';
import { fromRight, fromLeft, fromBottom } from '../reveal.js';
import { Icon } from '../components/Icons.jsx';
import { contact, serviceOptions } from '../data.js';
import { sendContact } from '../api.js';
import { useMagnetic } from '../hooks.js';
import { cleanPhone, isValidPhone, toInternationalPhone } from '../formUtils.js';

// شماره‌ی فارسی را برای لینک تماس به فرمت بین‌المللی (+98...) تبدیل می‌کند
const telHref = `tel:${toInternationalPhone(contact.phone)}`;
const mailHref = `mailto:${contact.email}`;
const instaHref = `https://instagram.com/${contact.instagram.replace(/^@/, '')}`;

export default function Contact() {
  const root = useRef(null);
  const submit = useMagnetic(0.25);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false); // قفل فوری؛ state دیرتر به‌روز می‌شود و دوبار کلیک سریع را نمی‌گیرد
  const [statusKind, setStatusKind] = useState(''); // '' | 'error'
  const [invalid, setInvalid] = useState(''); // '' | 'name' | 'phone'

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
    if (sendingRef.current) return;
    const form = e.currentTarget; // قبل از await گرفته می‌شود
    const f = new FormData(form);
    const name = String(f.get('name') || '').trim();
    const phone = cleanPhone(String(f.get('phone') || ''));
    const service = String(f.get('service') || '');
    const message = String(f.get('message') || '').trim();

    const fail = (field, text) => {
      setInvalid(field);
      setStatusKind('error');
      setStatus(text);
      const el = form.elements.namedItem(field);
      if (el && el.focus) el.focus();
    };
    if (!name) return fail('name', 'لطفاً نام و نام شرکت را وارد کنید.');
    if (!phone) return fail('phone', 'لطفاً شماره تماس را وارد کنید.');
    if (!isValidPhone(phone)) return fail('phone', 'شماره تماس معتبر نیست. شماره را فقط با ارقام وارد کنید.');
    setInvalid('');

    // فیلد مخفی ضد اسپم: انسان آن را نمی‌بیند و پر نمی‌کند
    if (f.get('botcheck')) {
      setStatusKind('');
      setStatus('پیام شما ارسال شد. به‌زودی با شما تماس می‌گیریم.');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setStatusKind('error');
      setStatus('به اینترنت وصل نیستید. اتصال را بررسی کنید و دوباره تلاش کنید.');
      return;
    }

    sendingRef.current = true;
    setSending(true);
    setStatusKind('');
    setStatus('در حال ارسال…');
    const r = await sendContact({ name, phone, service, message });
    sendingRef.current = false;
    setSending(false);
    if (r.ok) {
      setStatus('پیام شما ارسال شد. به‌زودی با شما تماس می‌گیریم.');
      form.reset();
    } else {
      setStatusKind('error');
      setStatus(
        r.reason === 'network' || r.reason === 'timeout'
          ? 'ارتباط با سرور برقرار نشد. چند لحظه بعد دوباره تلاش کنید یا مستقیم با شماره و ایمیل بالا تماس بگیرید.'
          : 'ارسال انجام نشد. دوباره تلاش کنید یا مستقیم با شماره و ایمیل بالا تماس بگیرید.'
      );
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
                <a href={telHref}>
                  <bdi>{contact.phone}</bdi>
                </a>
              </li>
              <li>
                <Icon name="insta" size={22} />
                <a href={instaHref} target="_blank" rel="noopener noreferrer">
                  <bdi>{contact.instagram}</bdi>
                </a>
              </li>
              <li>
                <Icon name="mail" size={22} />
                <a href={mailHref}>
                  <bdi>{contact.email}</bdi>
                </a>
              </li>
            </ul>
          </div>

          <form aria-busy={sending} onSubmit={onSubmit} onInput={() => invalid && setInvalid('')} noValidate>
            <div className="field">
              <label htmlFor="f-name">
                نام و نام شرکت<span className="req" aria-hidden="true"> *</span>
              </label>
              <input
                id="f-name"
                name="name"
                type="text"
                autoComplete="organization"
                maxLength={100}
                aria-required="true"
                aria-invalid={invalid === 'name'}
              />
            </div>
            <div className="field">
              <label htmlFor="f-phone">
                شماره تماس<span className="req" aria-hidden="true"> *</span>
              </label>
              <input
                id="f-phone"
                name="phone"
                type="tel"
                dir="rtl"
                autoComplete="tel"
                maxLength={20}
                aria-required="true"
                aria-invalid={invalid === 'phone'}
              />
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
              <textarea id="f-msg" name="message" rows="4" maxLength={2000} />
            </div>
            <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button ref={submit} type="submit" className="btn btn--solid" disabled={sending}>
              {sending ? 'در حال ارسال…' : 'ارسال درخواست'}
              <Icon name="arrow" size={20} />
            </button>
            <p className={`status${statusKind === 'error' ? ' status--error' : ''}`} role="status">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
