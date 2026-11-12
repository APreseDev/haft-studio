import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap.js";
import { fromStart, flipIn } from "../reveal.js";
import { Icon } from "../components/Icons.jsx";
import { useLang } from "../i18n/context.js";
import { useTilt } from "../hooks.js";

function Member({ member }) {
  const tilt = useTilt(8);
  return (
    <article ref={tilt} className="card card--glow member">
      <span className="avatar">
        {member.photo ? (
          <img
            src={`${import.meta.env.BASE_URL}${member.photo}`}
            alt={member.name}
            width="360"
            height="360"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Icon name="user" size={38} />
        )}
      </span>
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </article>
  );
}

export default function Team() {
  const { translations } = useLang();
  const root = useRef(null);

  useLayoutEffect(() => {
    const mediaContext = gsap.matchMedia();
    mediaContext.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        // عنوان از سمت شروع خواندن، کارت‌ها مثل ورق‌زدن از پهلو می‌چرخند
        fromStart(".team .head > *", ".team .head", { stagger: 0.12 });
        flipIn(".member", ".team .grid", { stagger: 0.16 });
      },
      root,
    );
    return () => mediaContext.revert();
  }, []);

  return (
    <section id="team" className="section team" ref={root}>
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">{translations.team.eyebrow}</p>
          <h2>{translations.team.title}</h2>
        </div>
        <div className="grid grid--3">
          {translations.team.members.map((member, index) => (
            <Member key={member.role + index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
