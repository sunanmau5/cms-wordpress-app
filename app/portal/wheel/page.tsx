// PROTOTYPE — throwaway route. Activity: the wheel of fortune.
// Six named areas on the wheel, four prizes inside each: the wheel stops on an
// area, then the prize is revealed as a second beat. Twenty-four prizes without
// twenty-four unreadable labels.
//
// Visual language is the quiz's, deliberately: same sunburst, bunting, Rye sign
// and cream card — see app/portal/quiz/page.tsx.

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Instrument_Serif, Oswald, Rye } from "next/font/google";

import { BackToHub } from "../BackToHub";
import { useLocale } from "../locale";

import { AREAS } from "./prizes";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;
// condensed poster sans: holds up at ~9px in a 15° cell, where Instrument
// Serif went spindly and system sans went characterless
const oswald = Oswald({ subsets: ["latin"], weight: "500" });
const LABEL = oswald.className;

const BULBS = 13;
const RIM_BULBS = 24;
const SLICE = 360 / AREAS.length;
const PER = 3; // prizes per area
const CELL = SLICE / PER; // 20° — one prize
const R_HUB = 4; // the dot covers this, so no ring of ground shows through
const R_PRZ = 64; // prize cells: R_HUB → R_PRZ
const R_OUT = 90; // area band: R_PRZ → R_OUT
const R_RIM = 99; // ivory rim band, R_OUT → R_RIM, with the bulbs set into it

// One fairground hue per area. A single lightness for every band turned gold
// into olive, so each area carries its own — vivid without going neon.
const PALETTE = [
  { h: 4, s: 74, band: 46, ink: "#fffdf4" }, // red
  { h: 28, s: 86, band: 44, ink: "#fffdf4" }, // orange
  { h: 150, s: 56, band: 38, ink: "#fffdf4" }, // green
  { h: 205, s: 70, band: 44, ink: "#fffdf4" }, // blue
  { h: 262, s: 50, band: 48, ink: "#fffdf4" }, // indigo
  { h: 320, s: 62, band: 46, ink: "#fffdf4" }, // magenta
];
// the four prizes run DARK to LIGHT across their area, always in that order
const STEPS = [56, 68, 80];
const hsl = (h: number, sat: number, l: number) => `hsl(${h} ${sat}% ${l}%)`;
// absolute lightness, not an offset from the band: every cell then sits light
// enough for ONE ink colour across the whole wheel, while still running
// dark → light across each area
const cellL = (_i: number, n: number) => STEPS[n];
const CELL_INK = "#2b1512";

const COPY = {
  fr: {
    title: "La roue",
    spin: "Tourner",
    again: "Retourner la roue",
    landed: "Tu tombes sur",
    intro: "Tourne la roue. Vingt-quatre lots, aucun n'a de valeur.",
  },
  en: {
    title: "The wheel",
    spin: "Spin",
    again: "Spin again",
    landed: "You land on",
    intro: "Give it a spin. Twenty-four prizes, not one of them worth having.",
  },
};

const pt = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
};

// a prize can be a video: pull the 11-char id out of any ordinary YouTube link
function youtubeId(url?: string): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  const m =
    u.match(/[?&]v=([\w-]{11})/) ||
    u.match(/youtu\.be\/([\w-]{11})/) ||
    u.match(/\/embed\/([\w-]{11})/) ||
    u.match(/\/shorts\/([\w-]{11})/) ||
    u.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}

export default function WheelScreen() {
  const { locale, setLocale } = useLocale();
  const [rot, setRot] = useState(0);
  // the resting angle: area names re-orient to it once the wheel settles, so
  // none of them ends up upside down. A static rule cannot work — the slice
  // that reads correctly at rest is somewhere else after a spin.
  const [settled, setSettled] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ a: number; p: number } | null>(null);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = COPY[locale];

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const spin = useCallback(() => {
    if (spinning) return;
    setResult(null);
    // the outcome is decided first, then the wheel is told where to stop —
    // never read off the wheel afterwards, which is where rounding errors and
    // "it landed on the line" bugs come from
    const a = Math.floor(Math.random() * AREAS.length);
    const p = Math.floor(Math.random() * AREAS[a].prizes.length);
    // bring that PRIZE cell's centre under the pointer at twelve o'clock
    const cell = a * PER + p;
    const target = (360 - (cell * CELL + CELL / 2)) % 360;
    const cur = ((rot % 360) + 360) % 360;
    const delta = (target - cur + 360) % 360;
    const turns = reduced ? 1 : 5;
    const nextRot = rot + turns * 360 + delta;
    setSpinning(true);
    setRot(nextRot);
    timer.current = setTimeout(
      () => {
        setSpinning(false);
        setSettled(nextRot);
        setResult({ a, p });
      },
      reduced ? 700 : 4400,
    );
  }, [rot, spinning, reduced]);

  const area = result === null ? null : AREAS[result.a];
  const prize = result === null || area === null ? null : area.prizes[result.p];
  const vid = youtubeId(prize?.video);

  // labels: along the radius, flipped in the lower half so nothing reads upside
  // down, and split onto two lines when the name has a space in it
  const cells = useMemo(
    () =>
      AREAS.flatMap((ar, i) =>
        ar.prizes.map((pz, n) => {
          const k = i * PER + n;
          const mid = k * CELL + CELL / 2;
          const [x, y] = pt(mid, R_PRZ - 4); // hard against the area band
          // where this cell actually points once the wheel has stopped
          const onScreen = (((mid + settled) % 360) + 360) % 360;
          const flip = onScreen > 180;
          return {
            k,
            i,
            n,
            x,
            y,
            // flipped labels run inward, so the outer edge is their START
            anchor: flip ? ("start" as const) : ("end" as const),
            rot: flip ? mid + 90 : mid - 90,
            label: locale === "fr" ? pz.shortFr : pz.shortEn,
          };
        }),
      ),
    [locale, settled],
  );

  return (
    <div className="wheel fixed inset-0 z-50 overflow-y-auto">
      <BackToHub />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .wheel {
          background:
            radial-gradient(circle at 50% 50%, rgba(255,252,240,.95) 0%, rgba(255,250,232,.55) 26%, rgba(255,250,232,0) 52%),
            radial-gradient(circle at 50% 50%, #fffdf4 0%, #fdf6e0 55%, #f6e8c8 100%);
        }
        .stripes {
          position: fixed; left: 50%; top: 50%;
          width: 220vmax; height: 220vmax;
          transform: translate(-50%, -50%);
          background: repeating-conic-gradient(from 0deg at 50% 50%,
            rgba(226,196,132,.42) 0deg 4.5deg, rgba(226,196,132,0) 4.5deg 9deg);
        }
        @keyframes rayTurn {
          from { transform: translate(-50%, -50%) rotate(0deg) }
          to   { transform: translate(-50%, -50%) rotate(360deg) }
        }
        .turning { animation: rayTurn 90s linear infinite; }
        @keyframes bulb {
          0%,100% { opacity:.35; box-shadow: 0 0 0 rgba(214,58,48,0) }
          50% { opacity:1; box-shadow: 0 0 10px rgba(255,170,60,.95) }
        }
        @keyframes sway { 0%,100% { transform: rotate(-.5deg) } 50% { transform: rotate(.5deg) } }
        @keyframes riseIn { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: none } }
        @keyframes popIn { from { opacity:0; transform: scale(.9) } to { opacity:1; transform: none } }
        /* the wheel itself: driven by an inline transform, never a keyframe —
           an animation settling on a transform would fight the inline one */
        .disc { transition: transform 4.2s cubic-bezier(.12,.72,.12,1); will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .disc { transition-duration: .6s } }
        @keyframes bulbGlow {
          0%, 100% {
            fill: #c39a4e;
            filter: drop-shadow(0 0 0 rgba(255,196,80,0));
          }
          50% {
            fill: #ffdc7a;
            filter: drop-shadow(0 0 3px rgba(255,190,60,.95)) drop-shadow(0 0 6px rgba(255,170,40,.6));
          }
        }
        .rimbulb { animation: bulbGlow 1s ease-in-out infinite; }
        @keyframes bulbHalo { 0%, 100% { opacity: 0 } 50% { opacity: .95 } }
        .rimglow { animation: bulbHalo 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rimbulb, .rimglow { animation: none }
          .rimglow { opacity: .45 }
        }
        /* the centring lives in the same declaration as the hover scale —
           a bare "transform: scale()" on :hover would DROP the translate and
           throw the button half its own size down and right */
        .hub { transform: translate(-50%, -50%); }
        /* short screens shrink the wheel; wide ones put the result card beside
           it instead of under it, so the wheel keeps its size and the labels
           keep theirs */
        .wheel-size { width: 100%; max-width: min(30rem, 44vh); }
        @media (min-width: 1024px) { .wheel-size { max-width: min(30rem, 62vh); } }
        .spinner { transition: transform 180ms cubic-bezier(.2,1.3,.4,1), margin 600ms cubic-bezier(.2,.9,.25,1); }
        .spinner:hover:not(:disabled) { transform: scale(1.015); }
        .spinner:active:not(:disabled) { transform: scale(.99); }
        .wheel, .wheel * { cursor: auto; }
        .wheel button { cursor: pointer; }
        .wheel button:disabled { cursor: default; }
      `,
        }}
      />

      <div aria-hidden className="stripes turning" />

      {/* bunting, kept short so it never reaches the sign */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-14 sm:h-16"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 90"
        >
          <path
            d="M0 8 Q 600 78 1200 8"
            fill="none"
            stroke="#8a7550"
            strokeWidth="2"
          />
          {Array.from({ length: 26 }).map((_, i) => {
            const x = (i + 0.5) * (1200 / 26);
            const s = x / 1200;
            const y = 8 + 70 * (4 * s * (1 - s)) * 0.72;
            const c = ["#d63a30", "#e8a33d", "#3f8f79", "#e8705f"][i % 4];
            return (
              <polygon
                key={i}
                fill={c}
                points={`${x - 11},${y} ${x + 11},${y} ${x},${y + 26}`}
              />
            );
          })}
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-full max-w-[46rem] lg:max-w-[76rem] flex-col px-6 py-6 sm:px-10">
        <div className="m-auto w-full">
          {/* the sign, same construction as the quiz's */}
          <div
            className="mb-6 mt-14 text-center sm:mb-7 sm:mt-16"
            style={{ animation: "sway 5s ease-in-out infinite" }}
          >
            <span className="relative inline-block rounded-[1.25rem] px-8 py-3">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[1.25rem] border-2 border-[#d63a30]/35"
              />
              {Array.from({ length: BULBS }).map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute h-2 w-2 rounded-full bg-[#ffb43c]"
                  style={{
                    left: `${(i / (BULBS - 1)) * 100}%`,
                    top: i % 2 ? "-4px" : "calc(100% - 4px)",
                    marginLeft: -4,
                    animation: `bulb 1.2s ease-in-out ${i * 90}ms infinite`,
                  }}
                />
              ))}
              <span
                className={`${FUNFAIR} block text-[1.85rem] leading-none text-[#d63a30] sm:text-[2.6rem]`}
                style={{
                  textShadow: "0 2px 0 #a8281f, 0 4px 10px rgba(168,40,31,.35)",
                }}
              >
                {t.title.toUpperCase()}
              </span>
            </span>
          </div>

          <div
            className="mx-auto w-full"
            style={{ animation: "riseIn 500ms cubic-bezier(.16,1,.3,1) both" }}
          >
            <div className="mx-auto flex max-w-[72rem] flex-col items-center lg:flex-row lg:items-center lg:justify-center">
              {/* pointer sits outside the turning disc */}
              <button
                aria-label={result ? t.again : t.spin}
                className="spinner wheel-size relative block shrink-0 disabled:cursor-default"
                disabled={spinning}
                onClick={spin}
                type="button"
              >
                {/* a fixed overlay sharing the disc's coordinates, so the tip lands
                  exactly on the prize ring's outer edge and points at a cell */}
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  viewBox="0 0 200 200"
                >
                  <path
                    d={`M 100 ${100 - R_PRZ + 1} L 94.5 ${
                      100 - R_PRZ - 8
                    } L 105.5 ${100 - R_PRZ - 8} Z`}
                    fill="#d63a30"
                    stroke="#fff6ef"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                    style={{
                      filter: "drop-shadow(0 2px 3px rgba(120,60,20,.45))",
                    }}
                  />
                </svg>

                <svg
                  className="disc block w-full"
                  style={{ transform: `rotate(${rot}deg)` }}
                  viewBox="0 0 200 200"
                >
                  {/* cream ground, so the outer ring's tints have something to sit on */}
                  <circle cx="100" cy="100" fill="#fffdf4" r={R_OUT} />

                  {/* outer band: the six areas — this is the ring the pointer meets */}
                  {AREAS.map((_, i) => {
                    const a0 = i * SLICE;
                    const a1 = a0 + SLICE;
                    const [ox1, oy1] = pt(a0, R_OUT);
                    const [ox2, oy2] = pt(a1, R_OUT);
                    const [ix2, iy2] = pt(a1, R_PRZ);
                    const [ix1, iy1] = pt(a0, R_PRZ);
                    return (
                      <path
                        key={`a${i}`}
                        d={`M ${ox1.toFixed(2)} ${oy1.toFixed(
                          2,
                        )} A ${R_OUT} ${R_OUT} 0 0 1 ${ox2.toFixed(
                          2,
                        )} ${oy2.toFixed(2)} L ${ix2.toFixed(2)} ${iy2.toFixed(
                          2,
                        )} A ${R_PRZ} ${R_PRZ} 0 0 0 ${ix1.toFixed(
                          2,
                        )} ${iy1.toFixed(2)} Z`}
                        fill={hsl(
                          PALETTE[i % PALETTE.length].h,
                          PALETTE[i % PALETTE.length].s,
                          PALETTE[i % PALETTE.length].band,
                        )}
                        stroke="#fffdf4"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {/* inner band: twenty-four prize cells, four steps per area */}
                  {AREAS.flatMap((ar, i) =>
                    ar.prizes.map((_, n) => {
                      const k = i * PER + n;
                      const a0 = k * CELL;
                      const a1 = a0 + CELL;
                      const [ox1, oy1] = pt(a0, R_PRZ);
                      const [ox2, oy2] = pt(a1, R_PRZ);
                      const [ix2, iy2] = pt(a1, R_HUB);
                      const [ix1, iy1] = pt(a0, R_HUB);
                      return (
                        <path
                          key={`p${k}`}
                          d={`M ${ox1.toFixed(2)} ${oy1.toFixed(
                            2,
                          )} A ${R_PRZ} ${R_PRZ} 0 0 1 ${ox2.toFixed(
                            2,
                          )} ${oy2.toFixed(2)} L ${ix2.toFixed(
                            2,
                          )} ${iy2.toFixed(
                            2,
                          )} A ${R_HUB} ${R_HUB} 0 0 0 ${ix1.toFixed(
                            2,
                          )} ${iy1.toFixed(2)} Z`}
                          fill={hsl(
                            PALETTE[i % PALETTE.length].h,
                            PALETTE[i % PALETTE.length].s,
                            cellL(i, n),
                          )}
                          stroke="#fffdf4"
                          strokeWidth="0.8"
                        />
                      );
                    }),
                  )}

                  {cells.map((c) => (
                    <text
                      key={c.k}
                      className={SERIF}
                      dominantBaseline="central"
                      fill={CELL_INK}
                      fontSize="8"
                      textAnchor={c.anchor}
                      transform={`rotate(${c.rot.toFixed(2)} ${c.x.toFixed(
                        2,
                      )} ${c.y.toFixed(2)})`}
                      x={c.x}
                      y={c.y}
                    >
                      {c.label}
                    </text>
                  ))}

                  <circle
                    cx="100"
                    cy="100"
                    fill="none"
                    r={R_PRZ}
                    stroke="#fffdf4"
                    strokeWidth="2"
                  />
                  {/* ivory rim, the bulbs sitting in it rather than on the edge */}
                  <circle
                    cx="100"
                    cy="100"
                    fill="none"
                    r={(R_OUT + R_RIM) / 2}
                    stroke="#f0dfb4"
                    strokeWidth={R_RIM - R_OUT}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    fill="none"
                    r={R_RIM}
                    stroke="#c9ab72"
                    strokeWidth="0.9"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    fill="none"
                    r={R_OUT}
                    stroke="#c9ab72"
                    strokeWidth="0.9"
                  />
                  {/* one arc per area. In the lower half the arc is drawn the other
                    way round and slightly tighter, so the name reads along the
                    curve instead of standing on its head. */}
                  <defs>
                    <filter
                      height="300%"
                      id="bulb-glow"
                      width="300%"
                      x="-100%"
                      y="-100%"
                    >
                      <feGaussianBlur stdDeviation="2.4" />
                    </filter>
                    {AREAS.map((_, i) => {
                      const a0 = i * SLICE + 2;
                      const a1 = (i + 1) * SLICE - 2;
                      const onScreen =
                        (((i * SLICE + SLICE / 2 + settled) % 360) + 360) % 360;
                      const up = onScreen <= 90 || onScreen >= 270;
                      const r = (R_PRZ + R_OUT) / 2; // vertical middle of the band
                      const [sx, sy] = pt(up ? a0 : a1, r);
                      const [ex, ey] = pt(up ? a1 : a0, r);
                      return (
                        <path
                          key={i}
                          d={`M ${sx.toFixed(2)} ${sy.toFixed(
                            2,
                          )} A ${r} ${r} 0 0 ${up ? 1 : 0} ${ex.toFixed(
                            2,
                          )} ${ey.toFixed(2)}`}
                          id={`arc-${i}`}
                        />
                      );
                    })}
                  </defs>
                  {AREAS.map((ar, i) => {
                    const name = (
                      locale === "fr" ? ar.fr : ar.en
                    ).toUpperCase();
                    // "OBJETS INUTILES" ran off the end of its arc and was clipped
                    const size =
                      name.length > 13 ? 6 : name.length > 10 ? 6.8 : 7.6;
                    return (
                      <text
                        key={`t${i}`}
                        className={FUNFAIR}
                        dominantBaseline="central"
                        fill={PALETTE[i % PALETTE.length].ink}
                        fontSize={size}
                      >
                        <textPath
                          href={`#arc-${i}`}
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          {name}
                        </textPath>
                      </text>
                    );
                  })}
                  {Array.from({ length: RIM_BULBS }).map((_, i) => {
                    const [x, y] = pt(
                      (i * 360) / RIM_BULBS,
                      (R_OUT + R_RIM) / 2,
                    );
                    return (
                      <g key={`g${i}`}>
                        <circle
                          className="rimglow"
                          cx={x}
                          cy={y}
                          fill="#ffc44f"
                          filter="url(#bulb-glow)"
                          r="4.2"
                          style={{ animationDelay: `${i % 2 ? 500 : 0}ms` }}
                        />
                        <circle
                          key={i}
                          className="rimbulb"
                          cx={x}
                          cy={y}
                          fill="#f0a92c"
                          r="2.4"
                          stroke="#8a5f1e"
                          strokeWidth="0.35"
                          style={{ animationDelay: `${i % 2 ? 500 : 0}ms` }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* the hub is the button — tapping the wheel is the gesture */}
                {/* a brass boss, not a button — the whole wheel is the tap target */}
                <span
                  aria-hidden
                  className="hub pointer-events-none absolute left-1/2 top-1/2 z-20 block h-[6%] w-[6%] rounded-full border border-[#2e1d12] bg-[radial-gradient(circle_at_34%_28%,#b98a5c,#6d4a2c_55%,#3f2a1c)] shadow-[inset_0_-1px_2px_rgba(0,0,0,.45),0_2px_5px_rgba(60,40,25,.5)]"
                />
              </button>

              {/* the second beat: the area, then the prize inside it */}
              <div
                className={`mt-5 flex min-h-[8rem] w-full max-w-[30rem] flex-col justify-center sm:min-h-[8.5rem] lg:mt-0 lg:overflow-hidden lg:transition-all lg:duration-[600ms] lg:ease-[cubic-bezier(.2,.9,.25,1)] ${
                  result
                    ? "lg:ml-10 lg:max-w-[24rem] lg:opacity-100"
                    : "lg:ml-0 lg:max-w-0 lg:opacity-0"
                }`}
              >
                {result === null ? (
                  <>
                    <p
                      className={`${FUNFAIR} text-center text-[0.95rem] text-[#d63a30] sm:text-[1.1rem]`}
                    >
                      {t.spin.toUpperCase()}
                    </p>
                    <p
                      className={`${SERIF} mt-2 text-center text-[1.05rem] leading-snug text-[#2b1512]/70 sm:text-[1.2rem]`}
                    >
                      {t.intro}
                    </p>
                  </>
                ) : (
                  <div
                    key={`${result.a}-${result.p}`}
                    className="flex flex-col justify-center rounded-[1.75rem] border-2 border-[#d63a30]/25 bg-[#fffdf4] px-6 py-6 text-center shadow-[0_18px_44px_rgba(160,100,40,.18)] lg:px-10 lg:py-8"
                    style={{
                      animation: "popIn 380ms cubic-bezier(.2,1.3,.4,1) both",
                    }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#a8281f]/70">
                      {t.landed}
                    </p>
                    <p
                      className={`${FUNFAIR} mt-2 text-[1.15rem] text-[#d63a30] sm:text-[1.35rem]`}
                    >
                      {(locale === "fr" ? area!.fr : area!.en).toUpperCase()}
                    </p>
                    {vid ? (
                      <div
                        className="mt-3"
                        style={{
                          animation:
                            "riseIn 420ms cubic-bezier(.16,1,.3,1) 260ms both",
                        }}
                      >
                        <div
                          className="relative w-full overflow-hidden rounded-2xl border-2 border-[#d63a30]/25 shadow-[0_10px_28px_rgba(160,100,40,.2)]"
                          style={{ aspectRatio: "16 / 9" }}
                        >
                          <iframe
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="absolute inset-0 h-full w-full"
                            src={`https://www.youtube-nocookie.com/embed/${vid}`}
                            title={locale === "fr" ? prize!.fr : prize!.en}
                          />
                        </div>
                        <p
                          className={`${SERIF} mt-2.5 text-[1.1rem] leading-snug text-[#2b1512] sm:text-[1.25rem]`}
                        >
                          {locale === "fr" ? prize!.fr : prize!.en}
                        </p>
                      </div>
                    ) : (
                      <p
                        className={`${SERIF} mt-3 text-[1.5rem] leading-[1.25] text-[#2b1512] sm:text-[1.85rem]`}
                        style={{
                          animation:
                            "riseIn 420ms cubic-bezier(.16,1,.3,1) 260ms both",
                        }}
                      >
                        {locale === "fr" ? prize!.fr : prize!.en}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* dev toolbar, same as the quiz's — not part of the screen */}
      <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
        <button
          className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
          onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
        >
          {locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
        <button
          className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
          onClick={() => {
            setResult(null);
            setRot(0);
            setSpinning(false);
          }}
        >
          reset
        </button>
      </div>
    </div>
  );
}
