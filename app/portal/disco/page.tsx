// PROTOTYPE — throwaway route. Disco Tap: a 60-second tapping game.
// Reproduces the opening game's look (starfield + hanging disco ball + brooms
// bursting from its centre — see variant-d.tsx), but scored over 60 seconds:
// tap "la boule disco" as many times as you can, then see your score and replay.
// Brooms are transient (each removes itself after its flight) so they don't pile
// up over hundreds of taps. Timer + counter wrap AROUND the ball, not above it.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BackToHub } from "../BackToHub";

import { useLocale } from "../locale";

import { Instrument_Serif, Rye } from "next/font/google";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;

const DURATION = 60;

// deterministic pseudo-random, matching the opening game
const rand = (i: number, salt: number) =>
  (((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1;

const STARS = Array.from({ length: 130 }).map((_, i) => ({
  left: rand(i, 1) * 100,
  top: rand(i, 2) * 100,
  size: 1 + rand(i, 3) * 2.4,
  opacity: 0.12 + rand(i, 4) * 0.4,
  delay: rand(i, 5) * 6,
  duration: 3 + rand(i, 6) * 4,
}));

const COPY = {
  fr: {
    intro: "Tape la boule disco le plus de fois possible en 60 secondes !",
    start: "Tape pour commencer",
    taps: "taps",
    timeUp: "Temps écoulé !",
    result: (n: number) => `Tu as tapé ${n} fois !`,
    again: "Rejouer",
  },
  en: {
    intro: "Tap the disco ball as many times as you can in 60 seconds!",
    start: "Tap to start",
    taps: "taps",
    timeUp: "Time's up!",
    result: (n: number) => `You tapped ${n} times!`,
    again: "Play again",
  },
};

// a broom that bursts from the ball's centre and flies out, spinning — copied
// from the opening game's FlyingBroom, but keyed off a unique id so each tap
// throws a fresh one in its own direction
function FlyingBroom({ seed }: { seed: number }) {
  const angle = ((seed * 137.508 + (rand(seed, 11) - 0.5) * 40) * Math.PI) / 180;
  const dist = 30 + rand(seed, 12) * 26;
  const dx = Math.cos(angle) * dist;
  const dy = Math.sin(angle) * dist * 0.82;
  const swirl = (rand(seed, 19) - 0.5) * 26;
  const midX = dx * 0.5 - Math.sin(angle) * swirl;
  const midY = dy * 0.5 + Math.cos(angle) * swirl;
  const restY = dy + 3 + rand(seed, 18) * 9;
  const spinDir = rand(seed, 20) > 0.5 ? 1 : -1;
  const spin = spinDir * (220 + rand(seed, 13) * 700);
  const scale = 0.5 + rand(seed, 14) * 0.6;
  const dur = 850 + rand(seed, 15) * 700;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20"
      style={
        {
          "--mx": `${midX}vmin`, "--my": `${midY}vmin`,
          "--dx": `${dx}vmin`, "--dy": `${dy}vmin`, "--dy2": `${restY}vmin`,
          "--rotMid": `${spin * 0.45}deg`, "--rot": `${spin}deg`, "--rot2": `${spin * 1.12}deg`,
          "--scale": scale,
          animation: `flyOut ${dur}ms cubic-bezier(.16,.7,.32,1) both`,
        } as React.CSSProperties
      }
    >
      <img alt="" className="w-12 max-w-none sm:w-16" src="/30ans/broom.png" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.8))" }} />
    </div>
  );
}

type Phase = "ready" | "playing" | "done";

export default function DiscoTap() {
  const { locale, setLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [brooms, setBrooms] = useState<number[]>([]);
  const phaseRef = useRef<Phase>("ready");
  const idRef = useRef(0);
  const ballRef = useRef<HTMLImageElement>(null);
  const t = COPY[locale];

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { setPhase("done"); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const start = useCallback(() => {
    setCount(0);
    setLeft(DURATION);
    setBrooms([]);
    setPhase("playing");
  }, []);

  const tap = useCallback(() => {
    if (phaseRef.current === "done") return;
    if (phaseRef.current === "ready") start();
    setCount((c) => c + 1);
    const id = idRef.current++;
    setBrooms((b) => [...b, id]);
    window.setTimeout(() => setBrooms((b) => b.filter((x) => x !== id)), 1700);
    const el = ballRef.current;
    if (el?.animate) {
      el.animate([{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }], { duration: 160, easing: "ease-out" });
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
  }, [start]);

  const C = 2 * Math.PI * 45; // ring circumference
  const frac = phase === "ready" ? 1 : left / DURATION;
  const ringColor = phase !== "playing" ? "#9aa3ad" : left <= 15 ? "#ff5a4a" : left <= 30 ? "#f2c14e" : "#9aa3ad";

  return (
    <div className="disco fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none" onPointerDown={tap}>
      <BackToHub />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* starfield */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span key={i} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity, animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      {phase === "ready" && <p className={`${SERIF} intro`}>{t.intro}</p>}

      {/* the stage: ball with timer ring + counter around it, brooms bursting out */}
      <div className="stage">
        {brooms.map((id) => <FlyingBroom key={id} seed={id} />)}

        <button aria-label={t.start} className="ball" type="button">
          <img alt="" className="ball-img" ref={ballRef} src="/30ans/disco-ball.png" />
        </button>

        {phase === "ready" && <span className="ball-hint">{t.start}</span>}

        {/* counter AROUND the ball: taps on top, seconds at the bottom */}
        {phase === "playing" && <span className="badge badge-top">{count}<i>{t.taps}</i></span>}
      </div>

      {phase === "playing" && (
        <div className="timer">
          <span className={`secs ${SERIF}`}>{left}s</span>
          <div className="bar"><div className="bar-fill" style={{ width: `${frac * 100}%`, background: ringColor }} /></div>
        </div>
      )}

      {/* result */}
      {phase === "done" && (
        <div className="result">
          <p className={`${SERIF} result-top`}>{t.timeUp}</p>
          <p className="result-score">{count}</p>
          <p className={`${SERIF} result-line`}>{t.result(count)}</p>
          <button className="again" onClick={start} type="button">↻ {t.again}</button>
        </div>
      )}

      <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
        <button className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200" onClick={(e) => { e.stopPropagation(); setLocale((l) => (l === "fr" ? "en" : "fr")); }}>
          {locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
      </div>
    </div>
  );
}

const CSS = `
.disco { background: #030305; color: #fdf3d8; }
.disco, .disco * { cursor: auto; }
.disco button { cursor: pointer; }
.disco { -webkit-tap-highlight-color: transparent; }
.disco *:focus, .disco *:focus-visible { outline: none !important; box-shadow: none; }
.star { position: absolute; border-radius: 9999px; background: #fff; }
@keyframes twinkle { 0%,100% { opacity: .15 } 50% { opacity: 1 } }

.intro { position: relative; z-index: 3; max-width: 22rem; text-align: center; margin-bottom: 1.4rem; padding: 0 1.5rem; font-size: clamp(1.05rem, 4vw, 1.35rem); line-height: 1.35; color: rgba(255,255,255,.85); }

.stage { position: relative; width: clamp(240px, 70vw, 380px); aspect-ratio: 1; display: grid; place-items: center; }
.ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.ring-track { fill: none; stroke: rgba(255,255,255,.12); stroke-width: 2.4; }
.ring-arc { fill: none; stroke-width: 3.2; stroke-linecap: round; transition: stroke-dashoffset 1s linear, stroke .4s linear; }

.ball { position: relative; z-index: 2; border: 0; background: none; padding: 0; width: 74%; animation: hang 5s ease-in-out infinite; transform-origin: top center; }
.ball-img { display: block; width: 100%; height: auto; filter: drop-shadow(0 0 30px rgba(203,213,225,.4)); }
@keyframes hang { 0%,100% { transform: rotate(-1.4deg) } 50% { transform: rotate(1.4deg) } }
.ball-hint { position: absolute; z-index: 3; bottom: 6%; white-space: nowrap; font-size: .78rem; text-transform: uppercase; letter-spacing: .3em; color: rgba(255,255,255,.6); text-shadow: 0 2px 6px rgba(0,0,0,.85); animation: hint 2s ease-in-out infinite; }
@keyframes hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }

.badge { position: absolute; z-index: 4; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: baseline; gap: .3rem;
  color: #eef3f7; text-shadow: 0 1px 3px rgba(0,0,0,.9), 0 0 14px rgba(203,213,225,.45); font-variant-numeric: tabular-nums; }
.timer { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: .45rem; margin-top: 1.3rem; }
.secs { font-size: clamp(1.1rem, 4.5vw, 1.5rem); color: #eef3f7; opacity: .9; }
.bar { width: clamp(190px, 62vw, 330px); height: 12px; border-radius: 999px; background: rgba(255,255,255,.14); overflow: hidden; }
.bar-fill { height: 100%; border-radius: 999px; transition: width 1s linear, background .4s linear; }
.badge-top { top: -15%; font-size: clamp(1.7rem, 7vw, 2.5rem); line-height: 1; font-weight: 600; }
.badge-top i { font-style: normal; font-size: .42em; opacity: .65; letter-spacing: .12em; text-transform: uppercase; }
.badge-bottom { bottom: -9%; font-size: clamp(1.1rem, 4.5vw, 1.6rem); line-height: 1; opacity: .9; }

@keyframes flyOut {
  0%   { transform: translate(-50%,-50%) rotate(0deg) scale(.15); opacity: 0 }
  16%  { opacity: 1 }
  46%  { transform: translate(calc(-50% + var(--mx)), calc(-50% + var(--my))) rotate(var(--rotMid)) scale(calc(var(--scale) * .88)); opacity: 1 }
  72%  { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)) scale(var(--scale)); opacity: 1 }
  100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy2))) rotate(var(--rot2)) scale(var(--scale)); opacity: 0 }
}

.result { position: absolute; inset: 0; z-index: 5; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: radial-gradient(circle at 50% 45%, rgba(3,3,5,.7), rgba(3,3,5,.93)); animation: fade .3s ease both; text-align: center; padding: 1.5rem; }
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
.result-top { font-size: clamp(1.3rem, 5vw, 1.9rem); color: #fdf3d8; letter-spacing: .04em; }
.result-score { font-size: clamp(4.5rem, 22vw, 8rem); line-height: 1; color: #f2c14e; text-shadow: 0 5px 0 rgba(0,0,0,.4), 0 0 30px rgba(242,193,78,.6); margin: .2rem 0; }
.result-line { font-size: clamp(1.05rem, 4vw, 1.4rem); color: #fdf3d8; opacity: .9; }
.again { margin-top: 1.6rem; border: 1px solid rgba(255,255,255,.4); border-radius: 999px; background: rgba(255,255,255,.1); color: #fff; font-size: clamp(1rem, 4vw, 1.25rem); padding: .7rem 1.8rem; box-shadow: 0 6px 20px rgba(0,0,0,.5); }
.again:hover { background: rgba(255,255,255,.2); }
.again:active { transform: translateY(2px); }

@media (prefers-reduced-motion: reduce) {
  .star, .ball, .ball-hint, .badge-bottom.low { animation: none !important; }
}
`;
