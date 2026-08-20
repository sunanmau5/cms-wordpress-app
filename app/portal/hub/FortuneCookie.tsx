// PROTOTYPE — the fortune cookie that lives in the hub's bottom-right corner.
// Flow the user asked for: the gold PACKAGING sits in the corner → tap it → the
// COOKIE appears in the middle of the screen → it BREAKS IN TWO → a random
// message slides out. Tap the backdrop (or ✕) to close; "encore" re-rolls.
//
// The break is faked from a single cookie PNG: two copies, each clipped to one
// half, driven apart on crack, with the paper slip rising between them.

"use client";

import { useCallback, useState } from "react";
import { Instrument_Serif } from "next/font/google";

import { FORTUNES } from "./fortunes";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;

const COOKIE = "/30ans/hub/fortune-cookie.png";
const PACK = "/30ans/cookie-packaging.png";

type Phase = "idle" | "whole" | "cracked";

export function FortuneCookie({ locale }: { locale: "fr" | "en" }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [i, setI] = useState(0);

  const roll = useCallback(() => {
    setI(Math.floor(Math.random() * FORTUNES.length));
    setPhase("whole");
    // let the whole cookie land, then snap it in two
    window.setTimeout(() => setPhase("cracked"), 750);
  }, []);

  const close = useCallback(() => setPhase("idle"), []);

  const label = locale === "fr" ? "Ouvre-moi !" : "Open me!";
  const again = locale === "fr" ? "Encore" : "Again";
  const msg = FORTUNES[i][locale];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* the packaging waiting in the corner */}
      <button
        aria-label={label}
        className="fc-pack"
        onClick={roll}
        type="button"
      >
        <img alt="" className="fc-pack-img" src={PACK} />
      </button>

      {/* a thin curved doodle arrow + small word, above the plane line, pointing
          down at the cookie; fades slowly in and out (press-start) */}
      {phase === "idle" && (
        <div aria-hidden className="fc-hint">
          <span className={`fc-hint-word ${SERIF}`}>{label}</span>
          <svg className="fc-hint-arrow" fill="none" viewBox="0 0 44 40">
            <path
              d="M7 5 C5 19 12 28 30 32"
              stroke="#9e241f"
              strokeLinecap="round"
              strokeWidth="2.2"
            />
            <path
              d="M32 33 L21 36 M32 33 L24 26"
              stroke="#9e241f"
              strokeLinecap="round"
              strokeWidth="2.2"
            />
          </svg>
        </div>
      )}

      {/* the opened cookie, centre stage */}
      {phase !== "idle" && (
        <div
          aria-label={
            locale === "fr"
              ? "Ton biscuit de la fortune"
              : "Your fortune cookie"
          }
          className="fc-overlay"
          onClick={close}
          role="dialog"
        >
          <button
            aria-label="Close"
            className="fc-x"
            onClick={close}
            type="button"
          >
            ✕
          </button>

          <div
            className={`fc-stage ${phase === "cracked" ? "is-cracked" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fc-cookie">
              <img alt="" className="fc-half fc-half-l" src={COOKIE} />
              <img alt="" className="fc-half fc-half-r" src={COOKIE} />
              <div className={`fc-slip ${SERIF}`}>
                <p>{msg}</p>
              </div>
            </div>

            {phase === "cracked" && (
              <button className="fc-again" onClick={roll} type="button">
                {again}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const CSS = `
:root { --fc-pack: clamp(46px, 7vw, 66px); }
.fc-pack {
  position: fixed; right: 12px; bottom: 10px; z-index: 55;
  width: var(--fc-pack); padding: 0; border: 0; background: none;
  filter: drop-shadow(2px 4px 5px rgba(60,40,20,.4));
  animation: fcWiggle 4.8s ease-in-out infinite; transform-origin: bottom center;
  transition: transform .25s ease;
}
.fc-pack:hover { transform: scale(1.08) rotate(-2deg); }
.fc-pack-img { display: block; width: 100%; height: auto; }
/* the "open me!" hint: a curved doodle arrow with a small word, fading slowly */
/* the hint scales WITH the cookie: the packaging is fluid, so a fixed-size
   arrow looked tiny on desktop and enormous on a narrow window */
.fc-hint {
  position: fixed;
  right: calc(var(--fc-pack) * 0.95);
  bottom: calc(var(--fc-pack) * 1.321 + 10px);
  z-index: 55;
  display: flex; flex-direction: column; align-items: center; gap: 2px; pointer-events: none;
  animation: fcPulse 2.9s ease-in-out infinite;
}
.fc-hint-word {
  font-size: clamp(11px, calc(var(--fc-pack) * 0.268), 16px);
  white-space: nowrap; line-height: 1;
  color: #9e241f; text-shadow: 0 1px 0 rgba(253,243,216,.9);
}
.fc-hint-arrow { width: calc(var(--fc-pack) * 0.661); height: auto; }
@keyframes fcPulse { 0%,100% { opacity: 0 } 45%,62% { opacity: 1 } }
@keyframes fcWiggle { 0%,86%,100% { transform: rotate(0) } 93% { transform: rotate(-7deg) } }

.fc-overlay {
  position: fixed; inset: 0; z-index: 70; display: grid; place-items: center;
  background: radial-gradient(circle at 50% 45%, rgba(18,10,4,.82), rgba(12,7,3,.93));
  animation: fcFade .25s ease both;
}
@keyframes fcFade { from { opacity: 0 } to { opacity: 1 } }

.fc-x {
  position: absolute; top: 16px; right: 18px; z-index: 3;
  width: 42px; height: 42px; border-radius: 999px;
  border: 3px solid #9e241f; background: #fdf3d8; color: #c4302b;
  font-size: 17px; font-weight: 800; line-height: 1;
  box-shadow: 0 3px 0 rgba(158,36,31,.45), 0 5px 12px rgba(0,0,0,.3);
  transition: transform .15s ease, background .15s ease;
}
.fc-x:hover { background: #fff; transform: scale(1.06); }
.fc-x:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(158,36,31,.45); }

.fc-stage { position: relative; display: grid; justify-items: center; }
.fc-cookie {
  position: relative; width: clamp(220px, 62vw, 340px); aspect-ratio: 1 / 1;
  animation: fcDrop .5s cubic-bezier(.16,1,.3,1) both;
}
@keyframes fcDrop { from { opacity: 0; transform: translateY(-24px) scale(.9) } to { opacity: 1; transform: none } }

.fc-half {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(3px 6px 8px rgba(60,30,10,.45));
  transition: transform .55s cubic-bezier(.34,1.4,.5,1);
}
.fc-half-l { clip-path: inset(0 50% 0 0); }
.fc-half-r { clip-path: inset(0 0 0 50%); }
.is-cracked .fc-half-l { transform: translate(-34%, 6%) rotate(-13deg); }
.is-cracked .fc-half-r { transform: translate(34%, 6%) rotate(13deg); }

/* a real fortune-cookie paper strip: long, thin, off-white, faint fold lines,
   rolled up inside the cookie and unfurling out when it cracks */
.fc-slip {
  position: absolute; left: 50%; top: 50%; z-index: 2;
  width: min(90%, 360px);
  transform: translate(-50%, -50%) rotate(-2.5deg) scaleX(.05);
  transform-origin: center; opacity: 0; pointer-events: none;
  background:
    repeating-linear-gradient(90deg, rgba(0,0,0,.035) 0 1px, transparent 1px 46px),
    linear-gradient(180deg, #ffffff 0%, #f5efe0 100%);
  box-shadow: 0 8px 20px rgba(60,30,10,.32), inset 0 0 0 1px rgba(120,90,50,.14);
  padding: 13px 20px; text-align: center;
}
.is-cracked .fc-slip {
  opacity: 1; transform: translate(-50%, -50%) rotate(-2.5deg) scaleX(1); pointer-events: auto;
  transition: opacity .25s ease .32s, transform .55s cubic-bezier(.2,1,.3,1) .32s;
}
.fc-slip p { color: #2a1810; font-size: clamp(.98rem, 3.1vw, 1.24rem); line-height: 1.28; }

.fc-again {
  margin-top: clamp(18px, 5vw, 40px); z-index: 3;
  border: 0; border-radius: 999px; background: #fdf3d8; color: #9e241f;
  font-weight: 700; font-size: 14px; padding: 8px 20px;
  box-shadow: 0 4px 0 rgba(158,36,31,.4), 0 6px 14px rgba(0,0,0,.25);
  animation: fcFade .3s ease .5s both;
}
.fc-again:hover { background: #fff; }

@media (prefers-reduced-motion: reduce) {
  .fc-pack, .fc-cookie, .fc-half, .fc-slip, .fc-again, .fc-overlay { animation: none !important; }
  .fc-half, .fc-slip { transition: none !important; }
}
`;
