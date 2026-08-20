// PROTOTYPE — throwaway route. RINA-LAND hub.
// Original cream background + red rays and Rye / Instrument-Serif fonts.
// A scalloped-cartouche MARQUEE title (bulb string), small and near the top;
// the ferris-wheel + joker cutouts smaller and drifting left↔right either side
// of it; the six entrances in a responsive grid (one row desktop / 2-up mobile,
// no scroll) with per-icon size balancing; a scatter of mixed-shape sparkles; a
// banner-plane flying right→left; the fortune cookie in the corner.

"use client";

import { useEffect, useState } from "react";
import { Instrument_Serif, Rye } from "next/font/google";
import Image from "next/image";

import { useLocale } from "../locale";
import { useScreenNav } from "../screen-nav";

import { ACTIVITIES, HUB } from "./content";
import { FortuneCookie } from "./FortuneCookie";
import { TicketEntry } from "./TicketEntry";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;

const RED = "#c4302b";
const DEEPRED = "#9e241f";
const NAVY = "#2f3a66";
const GOLD = "#f2c14e";
const CREAM = "#fdf3d8";
const INK = "#3a2118";

const ART: Record<string, string> = {
  quiz: "/30ans/hub/quizz-icon.png",
  fit: "/30ans/hub/outfit-icon.png",
  wheel: "/30ans/hub/wheel-cutout.png",
  gallery: "/30ans/hub/gallery.png",
  quotes: "/30ans/thumbsup.png",
  disco: "/30ans/disco-ball.png",
};

// hand-jitter + a per-icon scale so the cutouts read at a consistent size
const TUNE: Record<string, { rot: number; delay: number; scale: number }> = {
  quiz: { rot: -3, delay: 0, scale: 1 },
  fit: { rot: 2.5, delay: 0.4, scale: 1.12 },
  wheel: { rot: -2, delay: 0.8, scale: 1.02 },
  gallery: { rot: 3, delay: 0.2, scale: 0.86 },
  quotes: { rot: -2.5, delay: 0.6, scale: 0.8 },
  disco: { rot: 2, delay: 1, scale: 0.88 },
};

// mixed-shape sparkles scattered around (avoiding the title). The heroes are
// 8-point COMPASS stars (long cardinals, short diagonals) per the user's ref;
// smaller twinkles and dots fill in around them.
function starPath(
  spikes: number,
  longR: number,
  shortR: number,
  valleyR: number,
) {
  const c = 12;
  let d = "";
  for (let i = 0; i < spikes; i++) {
    const aT = ((i * 360) / spikes - 90) * (Math.PI / 180);
    const rT = i % 2 === 0 ? longR : shortR;
    const xT = +(c + Math.cos(aT) * rT).toFixed(2);
    const yT = +(c + Math.sin(aT) * rT).toFixed(2);
    const aV = (((i + 0.5) * 360) / spikes - 90) * (Math.PI / 180);
    const xV = +(c + Math.cos(aV) * valleyR).toFixed(2);
    const yV = +(c + Math.sin(aV) * valleyR).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${xT} ${yT}L${xV} ${yV}`;
  }
  return `${d}Z`;
}
const SPARK_SHAPES: Record<string, string> = {
  compass: starPath(8, 11.5, 4.6, 2.2), // long cardinals, short diagonals
  star8: starPath(8, 11, 7.5, 2.6), // near-even 8-point
  s4: "M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z",
  dot: "M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z",
};
// Kept to the edges, top and bottom — the central band is left clear so no
// sparkle sits behind the entrance titles and disturbs reading.
const SPARKS = [
  { l: 9, t: 30, s: 30, k: "compass", c: NAVY, d: 0 },
  { l: 91, t: 26, s: 24, k: "compass", c: RED, d: 0.5 },
  { l: 5, t: 64, s: 14, k: "s4", c: GOLD, d: 0.6 },
  { l: 95, t: 58, s: 28, k: "compass", c: GOLD, d: 1.4 },
  { l: 44, t: 22, s: 10, k: "dot", c: NAVY, d: 0.9 },
  { l: 62, t: 33, s: 14, k: "s4", c: RED, d: 1.7 },
  { l: 16, t: 20, s: 12, k: "s4", c: GOLD, d: 2 },
  // bottom fills, some behind the plane
  { l: 12, t: 82, s: 24, k: "compass", c: GOLD, d: 0.4 },
  { l: 34, t: 91, s: 14, k: "s4", c: NAVY, d: 1.5 },
  { l: 52, t: 85, s: 20, k: "star8", c: RED, d: 0.7 },
  { l: 67, t: 92, s: 12, k: "dot", c: GOLD, d: 1.9 },
  { l: 86, t: 83, s: 22, k: "compass", c: NAVY, d: 0.1 },
  { l: 4, t: 84, s: 12, k: "dot", c: NAVY, d: 2.1 },
  { l: 96, t: 80, s: 14, k: "s4", c: RED, d: 1.6 },
];

// The route's chapter: you arrive at the ticket machine, get your ticket, and
// on entering it spins away and the hub content pops in — all in place, no
// second URL (rsvp -> /portal/hub lands here on the ticket stage).
export default function HubPage() {
  const [entered, setEntered] = useState(false);
  // once you've entered the park, coming back (browser back, or the activity
  // back arrow) lands on the hub, not the ticket again. A one-frame cream hold
  // avoids any ticket flash before we know which stage to show.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setEntered(sessionStorage.getItem("portal-hub-entered") === "1");
    setReady(true);
  }, []);

  if (!ready) return <div className="fixed inset-0 z-50 bg-[#f7ead0]" />;
  if (entered) return <HubContent />;
  return (
    <TicketEntry
      onEnter={() => {
        sessionStorage.setItem("portal-hub-entered", "1");
        setEntered(true);
      }}
    />
  );
}

function HubContent() {
  const { locale, setLocale } = useLocale();
  const nav = useScreenNav();
  const t = HUB[locale];
  const plane =
    locale === "fr" ? "/30ans/THANKS-FR.png" : "/30ans/THANKS-airplane.png";

  return (
    <div className="hub fixed inset-0 z-50 overflow-y-auto">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div aria-hidden className="rays" />

      <div aria-hidden className="sparkles">
        {SPARKS.map((s, k) => (
          <span
            key={k}
            className="spark"
            style={{
              left: `${s.l}%`,
              top: `${s.t}%`,
              animationDelay: `${s.d}s`,
            }}
          >
            <svg viewBox="0 0 24 24" width={s.s}>
              <path
                d={SPARK_SHAPES[s.k]}
                fill={s.c}
                stroke={INK}
                strokeWidth="1"
              />
            </svg>
          </span>
        ))}
      </div>

      <div className="relative z-10 flex min-h-full flex-col px-4 pb-24 pt-3">
        {/* the title — a deep-red marquee sign with glowing bulbs (like the quiz) */}
        <div className="title-row shrink-0">
          <div aria-hidden className="side-banner">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                alt=""
                src={
                  i % 2
                    ? "/30ans/hub/joker-icon.png"
                    : "/30ans/hub/ferris-wheel-icon.png"
                }
              />
            ))}
          </div>
          <div className="title-slot">
            <Sign />
          </div>
          <div aria-hidden className="side-banner">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                alt=""
                src={
                  i % 2
                    ? "/30ans/hub/ferris-wheel-icon.png"
                    : "/30ans/hub/joker-icon.png"
                }
              />
            ))}
          </div>
        </div>

        {/* the six entrances, centred in the space below */}
        <div className="acts w-full">
          <div className="row">
            {ACTIVITIES.map((a) => {
              const art = ART[a.icon];
              const tn = TUNE[a.icon] ?? { rot: 0, delay: 0, scale: 1 };
              return (
                <a
                  key={a.id}
                  className="ent"
                  data-a={a.icon}
                  href={a.href}
                  onClick={(e) => {
                    e.preventDefault();
                    nav(a.href, "fade");
                  }}
                  style={{ transform: `rotate(${tn.rot}deg)` }}
                >
                  <span className="ent-lift">
                    <span
                      className="ent-art"
                      style={{ animationDelay: `${tn.delay}s` }}
                    >
                      {art ? (
                        <Image
                          fill
                          alt={a[locale].name}
                          className="ent-img"
                          sizes="(max-width:900px) 40vw, 160px"
                          src={art}
                          style={{
                            objectFit: "contain",
                            transform: `scale(${tn.scale})`,
                          }}
                        />
                      ) : null}
                    </span>
                    <span className="ent-label">
                      <b className={FUNFAIR}>{a[locale].name}</b>
                      <em className={SERIF}>{a[locale].tease}</em>
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div aria-hidden className="plane-wrap">
        <div className="plane-run">
          <div className="plane-bob">
            <img alt="" className="plane" src={plane} />
          </div>
        </div>
      </div>
      <p className="sr-only">{t.marquee}</p>

      <FortuneCookie locale={locale} />

      {/* language toggle — just a flag, bottom-left */}
      <button
        aria-label="Changer de langue · Change language"
        className="fixed bottom-4 left-4 z-[60] text-[2rem] leading-none drop-shadow-[0_2px_3px_rgba(0,0,0,.3)] transition-transform hover:scale-110"
        onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
        type="button"
      >
        {locale === "fr" ? "🇫🇷" : "🇬🇧"}
      </button>
    </div>
  );
}

function Sign() {
  const bulbs: { x: number; y: number }[] = [];
  const x0 = 34,
    x1 = 526,
    y0 = 30,
    y1 = 130;
  const nx = 14,
    ny = 3;
  for (let i = 0; i <= nx; i++) {
    const x = +(x0 + (i * (x1 - x0)) / nx).toFixed(1);
    bulbs.push({ x, y: y0 }, { x, y: y1 });
  }
  for (let i = 1; i < ny; i++) {
    const y = +(y0 + (i * (y1 - y0)) / ny).toFixed(1);
    bulbs.push({ x: x0, y }, { x: x1, y });
  }
  return (
    <svg className="rina-sign" viewBox="0 0 560 160">
      <rect
        fill={DEEPRED}
        height="140"
        rx="26"
        stroke={GOLD}
        strokeWidth="4"
        width="536"
        x="12"
        y="10"
      />
      {bulbs.map((b, i) => (
        <circle
          key={i}
          className="mbulb"
          cx={b.x}
          cy={b.y}
          fill={i % 2 ? CREAM : GOLD}
          r="4.4"
          style={{ animationDelay: `${(i * 100) % 1200}ms` }}
        />
      ))}
      <text
        className={FUNFAIR}
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="62"
        lengthAdjust="spacingAndGlyphs"
        textAnchor="middle"
        textLength="410"
        x="280"
        y="84"
      >
        RINA-LAND
      </text>
    </svg>
  );
}

const CSS = `
.hub { background: #efdcbc; color: ${INK}; }
.hub, .hub * { cursor: auto; }
.hub a, .hub button { cursor: pointer; }

.rays {
  position: fixed; left: 50%; top: 44%; z-index: 0;
  width: 240vmax; height: 240vmax; transform: translate(-50%,-50%);
  background: repeating-conic-gradient(from 0deg at 50% 50%, ${RED} 0deg 5deg, rgba(196,48,43,0) 5deg 10deg);
  opacity: .2; animation: rayTurn 180s linear infinite;
}
@keyframes rayTurn { to { transform: translate(-50%,-50%) rotate(360deg) } }

/* web-only banner: alternating ferris / joker across the top. Hidden on mobile,
   where the single cutouts looked cramped. */
.title-row { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; }
.title-slot { width: min(340px, 72vw); flex: 0 0 auto; }
/* smaller title on short phones, so the grid sits higher and the corner
   fortune cookie no longer overlaps the bottom activities */
@media (max-width: 899px) and (max-height: 820px) {
  .title-slot { width: min(280px, 62vw); }
}
.acts { margin: auto; }
/* web: banners flank the title, and the activities sit higher */
.side-banner { display: none; }
@media (min-width: 900px) {
  .title-slot { width: min(360px, 28vw); }
  .side-banner { display: flex; flex: 1 1 0; min-width: 0; align-items: center; justify-content: space-evenly; gap: clamp(6px, 1.4vw, 18px); pointer-events: none; }
  .side-banner img { width: clamp(38px, 4.1vw, 60px); height: auto; opacity: .9; filter: drop-shadow(2px 4px 5px rgba(60,40,20,.2)); }
  .side-banner img:nth-child(odd) { animation: floatL 8s ease-in-out infinite; }
  .side-banner img:nth-child(even) { animation: floatR 9s ease-in-out infinite; }
}
@keyframes floatL { 0%,100% { transform: translateX(-7px) rotate(-2deg) } 50% { transform: translateX(18px) rotate(2deg) } }
@keyframes floatR { 0%,100% { transform: translateX(7px) rotate(2deg) } 50% { transform: translateX(-18px) rotate(-2deg) } }

.sparkles { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.spark { position: absolute; animation: twinkle 2.6s ease-in-out infinite; transform-origin: center; }
.spark svg { display: block; filter: drop-shadow(1px 2px 0 rgba(0,0,0,.12)); }
@keyframes twinkle { 0%,100% { opacity:.3; transform:scale(.65) rotate(-8deg) } 50% { opacity:1; transform:scale(1.05) rotate(8deg) } }

/* the title sign (the user's image) */
.rina-sign { display: block; width: 100%; height: auto; filter: drop-shadow(0 5px 8px rgba(0,0,0,.24)); }
.mbulb { animation: signBulb 1.2s ease-in-out infinite; }
@keyframes signBulb {
  0%,100% { opacity: .4; filter: drop-shadow(0 0 0 rgba(255,190,80,0)); }
  50% { opacity: 1; filter: drop-shadow(0 0 3px rgba(255,190,80,.95)); }
}
/* same family as the activity names, dialled up so the title still leads */
.title-fallback {
  text-align: center; color: ${RED}; line-height: .92; letter-spacing: .01em; white-space: nowrap;
  font-size: clamp(2.5rem, 9vw, 4.6rem);
  text-shadow:
    0 1px 0 ${CREAM}, 0 3px 0 ${DEEPRED},
    0 5px 0 rgba(158,36,31,.45), 0 8px 14px rgba(0,0,0,.22);
}

/* per-icon size trims asked for per breakpoint */
@media (max-width: 899px) { .ent[data-a="fit"] .ent-img { transform: scale(.98) !important; } }
@media (min-width: 900px) { .ent[data-a="disco"] .ent-img { transform: scale(.78) !important; } }
@keyframes signGlow { 0%,100% { filter: drop-shadow(2px 6px 8px rgba(0,0,0,.26)) } 50% { filter: drop-shadow(2px 6px 8px rgba(0,0,0,.26)) drop-shadow(0 0 10px rgba(242,193,78,.4)) } }

/* the entrances */
.row {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: clamp(14px, 3vw, 22px) clamp(8px, 3vw, 20px);
  width: 100%; max-width: 30rem; margin: 0 auto; justify-items: center;
}
@media (min-width: 900px) { .row { grid-template-columns: repeat(6, 1fr); max-width: 66rem; align-items: end; } }

.ent { display: block; width: 100%; max-width: 12rem; text-decoration: none; }
.ent-lift { display: flex; flex-direction: column; align-items: center; transition: transform .3s cubic-bezier(.2,1.2,.3,1); }
.ent:hover .ent-lift { transform: translateY(-8px) scale(1.05); }
/* entrances pop in on load, one after another (fill: backwards keeps them
   hidden until their turn, then hands transform back so hover still works) */
@keyframes entPop { 0% { opacity: 0; transform: scale(.3) } 65% { opacity: 1; transform: scale(1.08) } 100% { opacity: 1; transform: scale(1) } }
.ent-lift { animation: entPop 520ms cubic-bezier(.2,1.35,.45,1) backwards; }
.ent:nth-child(1) .ent-lift { animation-delay: .06s }
.ent:nth-child(2) .ent-lift { animation-delay: .15s }
.ent:nth-child(3) .ent-lift { animation-delay: .24s }
.ent:nth-child(4) .ent-lift { animation-delay: .33s }
.ent:nth-child(5) .ent-lift { animation-delay: .42s }
.ent:nth-child(6) .ent-lift { animation-delay: .51s }
@media (prefers-reduced-motion: reduce) { .ent-lift { animation: none } }
.ent-art { position: relative; width: 100%; height: clamp(96px, 15vw, 150px); animation: bob 5s ease-in-out infinite; }
.ent-img { filter: drop-shadow(4px 7px 6px rgba(60,40,20,.28)); }
.ent:hover .ent-img { filter: drop-shadow(0 12px 18px rgba(60,40,20,.42)); }
@keyframes bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }

.ent-label { margin-top: 8px; text-align: center; }
.ent-label b { display: block; color: ${RED}; font-weight: 400; line-height: 1.02; font-size: clamp(.9rem, 1.7vw, 1.15rem); text-shadow: 0 1px 0 ${CREAM}, 0 2px 3px rgba(158,36,31,.18); }
.ent-label em { display: block; color: ${INK}; opacity: .82; font-style: normal; line-height: 1.16; margin-top: 3px; font-size: clamp(.68rem, 1.3vw, .82rem); text-shadow: 0 1px 0 rgba(253,243,216,.9); }

/* banner-plane */
.plane-wrap { position: fixed; left: 0; right: 0; bottom: 3%; z-index: 30; overflow: hidden; pointer-events: none; }
.plane-run { width: max-content; animation: fly 19s linear infinite; }
.plane-bob { animation: planeBob 3.6s ease-in-out infinite; }
.plane { display: block; width: clamp(230px, 34vw, 440px); height: auto; filter: drop-shadow(2px 5px 5px rgba(60,40,20,.3)); }
@keyframes fly { from { transform: translateX(100vw) } to { transform: translateX(-100%) } }
@keyframes planeBob { 0%,100% { transform: translateY(0) rotate(-.6deg) } 50% { transform: translateY(-9px) rotate(.6deg) } }

@media (prefers-reduced-motion: reduce) {
  .rays, .side-banner img, .spark, .mbulb, .ent-art, .plane-run, .plane-bob { animation: none !important; }
  .plane-run { display: flex; justify-content: center; transform: none; }
}
`;
