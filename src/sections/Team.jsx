import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap.js";
import { fromStart, flipIn } from "../reveal.js";
import { Icon } from "../components/Icons.jsx";
import { useLang } from "../i18n/context.js";
import { useTilt } from "../hooks.js";

function Member({ m }) {
  const tilt = useTilt(8);
  return (
    <article ref={tilt} className="card card--glow member">
      <span className="avatar">
        {m.photo ? (
          <img
            src={`${import.meta.env.BASE_URL}${m.photo}`}
            alt={m.name}
            width="360"
            height="360"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Icon name="user" size={38} />
        )}
      </span>
      <h3>{m.name}</h3>
      <p>{m.role}</p>
    </article>
  );
}

export default function Team() {
  const { t } = useLang();
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        // عنوان از سمت شروع خواندن، کارت‌ها مثل ورق‌زدن از پهلو می‌چرخند
        fromStart(".team .head > *", ".team .head", { stagger: 0.12 });
        flipIn(".member", ".team .grid", { stagger: 0.16 });
      },
      root,
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="team" className="section team" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{t.team.eyebrow}</p>
          <h2>{t.team.title}</h2>
        </div>
        <div className="grid grid--3">
          {t.team.members.map((m, i) => (
            <Member key={m.role + i} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
