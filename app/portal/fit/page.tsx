// PROTOTYPE — throwaway route. Activity: Birthday Fit.
// Accessories at FIXED positions on the photo: an arrow cycles the variants in a
// slot, ✕ takes it off. No dragging, resizing or rotating (settled in grilling).
//
// Visual language is the quiz's and the wheel's: sunburst, bunting, Rye sign.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BackToHub } from "../BackToHub";

import { useLocale } from "../locale";

import { Instrument_Serif, Rye } from "next/font/google";

import { PHOTO, SLOTS } from "./accessories";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;

const BULBS = 13;

const COPY = {
  fr: {
    title: "Le look",
    intro: "Habille-moi pour la soirée. Change de style avec les flèches.",
    none: "rien",
    off: "Enlever",
    nudge: "Réglage",
  },
  en: {
    title: "The fit",
    intro: "Dress me for the party. Change each piece with the arrows.",
    none: "none",
    off: "Take it off",
    nudge: "Nudge",
  },
};

export default function FitScreen() {
  const { locale, setLocale } = useLocale();
  // -1 means the slot is empty; the arrows walk through the variants and back to
  // empty, so "no hat" is always one press away
  const [picked, setPicked] = useState<Record<string, number>>({ hat: -1, glasses: -1 });
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const [nudge, setNudge] = useState(false);
  const [photo, setPhoto] = useState(PHOTO.src);
  // every change of piece throws confetti and knocks the frame
  const [burst, setBurst] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<Record<string, { dx: number; dy: number; dw: number }>>({});
  const t = COPY[locale];

  const cycle = useCallback((slotId: string, count: number, dir: number) => {
    setPicked((p) => {
      const next = (p[slotId] ?? -1) + dir;
      // -1 … count-1, wrapping at both ends
      if (next < -1) return { ...p, [slotId]: count - 1 };
      if (next > count - 1) return { ...p, [slotId]: -1 };
      return { ...p, [slotId]: next };
    });
    setBurst((b) => b + 1);
  }, []);

  // driven from JS, not a CSS class: the animation has to REPLAY on every
  // change, and re-keying the wrapper would remount the portrait
  useEffect(() => {
    if (!burst || !frameRef.current) return;
    frameRef.current.animate(
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(-2.2deg) scale(1.02)", offset: 0.25 },
        { transform: "rotate(1.8deg) scale(1.01)", offset: 0.55 },
        { transform: "rotate(-0.8deg) scale(1)", offset: 0.8 },
        { transform: "rotate(0deg) scale(1)" },
      ],
      { duration: 520, easing: "cubic-bezier(.2,1.3,.4,1)" },
    );
  }, [burst]);

  const bump = (id: string, dx: number, dy: number, dw: number) =>
    setOffset((o) => {
      const cur = o[id] ?? { dx: 0, dy: 0, dw: 0 };
      return { ...o, [id]: { dx: cur.dx + dx, dy: cur.dy + dy, dw: cur.dw + dw } };
    });

  return (
    <div className="fit fixed inset-0 z-50 overflow-y-auto">
      <BackToHub />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fit {
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
        .turning { animation: rayTurn 120s linear infinite; }
        @keyframes bulb {
          0%,100% { opacity:.35 } 50% { opacity:1 }
        }
        @keyframes sway { 0%,100% { transform: rotate(-.5deg) } 50% { transform: rotate(.5deg) } }
        @keyframes confettiFly {
          0%   { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) scale(.5) }
          8%   { opacity: .95 }
          40%  { opacity: .6 }
          70%  { opacity: .3 }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy) + 40px)) rotate(var(--spin)) scale(1.1) }
        }
        .confetto { animation: confettiFly 1150ms cubic-bezier(.12,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .confetto { display: none } }
        @keyframes popOn { from { opacity:0; transform: translate(-50%,-8px) scale(.92) } to { opacity:1; transform: translate(-50%,0) scale(1) } }
        /* every accessory is centred on its own x, so the centring translate has
           to ride along inside the keyframes */
        .acc { animation: popOn 260ms cubic-bezier(.2,1.3,.4,1) both; }
        .fit, .fit * { cursor: auto; }
        .fit button { cursor: pointer; }
      `,
        }}
      />

      <div aria-hidden className="stripes turning" />

      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-14 sm:h-16">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 90">
          <path d="M0 8 Q 600 78 1200 8" fill="none" stroke="#8a7550" strokeWidth="2" />
          {Array.from({ length: 26 }).map((_, i) => {
            const x = (i + 0.5) * (1200 / 26);
            const s = x / 1200;
            const y = 8 + 70 * (4 * s * (1 - s)) * 0.72;
            const c = ["#d63a30", "#e8a33d", "#3f8f79", "#e8705f"][i % 4];
            return <polygon key={i} fill={c} points={`${x - 11},${y} ${x + 11},${y} ${x},${y + 26}`} />;
          })}
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-full max-w-[46rem] flex-col px-6 py-6 sm:px-10 lg:max-w-[70rem]">
        <div className="m-auto w-full">
          <div className="mb-5 mt-9 text-center sm:mb-7 sm:mt-16" style={{ animation: "sway 5s ease-in-out infinite" }}>
            <span className="relative inline-block rounded-[1.25rem] px-8 py-3">
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] border-2 border-[#d63a30]/35" />
              {Array.from({ length: BULBS }).map((_, i) => (
                <span
                  aria-hidden
                  className="pointer-events-none absolute h-2 w-2 rounded-full bg-[#ffb43c]"
                  key={i}
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
                style={{ textShadow: "0 2px 0 #a8281f, 0 4px 10px rgba(168,40,31,.35)" }}
              >
                {t.title.toUpperCase()}
              </span>
            </span>
          </div>

          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
            {/* the photo, with the accessories pinned on top of it */}
            <div className="relative w-full shrink-0" style={{ maxWidth: "min(22rem, 43vh)" }}>
              {/* behind the frame, so pieces fly out from under it */}
              {burst > 0 && (
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" key={burst}>
                  {Array.from({ length: 26 }).map((_, i) => {
                    const a = (i / 26) * Math.PI * 2 + (burst % 7) * 0.3;
                    // far enough to clear the frame, which is ~350px across
                    const dist = 240 + ((i * 53) % 190);
                    const c = ["#d63a30", "#e8a33d", "#3f8f79", "#2f6fd0", "#c9257e", "#ffd166"][i % 6];
                    return (
                      <span
                        className="confetto absolute left-1/2 top-1/2 block h-3.5 w-2 rounded-[1px] shadow-[0_1px_2px_rgba(120,80,30,.35)]"
                        key={i}
                        style={{
                          background: c,
                          animationDelay: `${(i % 6) * 30}ms`,
                          ["--dx" as string]: `${Math.cos(a) * dist}px`,
                          ["--dy" as string]: `${Math.sin(a) * dist}px`,
                          ["--spin" as string]: `${((i * 97) % 360) - 180}deg`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
              {/* NOT overflow-hidden: a hat riding up out of the frame is the joke */}
              <div className="relative z-10" ref={frameRef}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="block w-full rounded-[1.5rem]"
                  onError={() => setPhoto(PHOTO.fallback)}
                  src={photo}
                />

                {SLOTS.map((slot) => {
                  const n = picked[slot.id] ?? -1;
                  if (n < 0) return null;
                  const item = slot.items[n];
                  const o = offset[item.id] ?? { dx: 0, dy: 0, dw: 0 };
                  const style = {
                    left: `${item.x + o.dx}%`,
                    top: `${item.y + o.dy}%`,
                    width: `${item.w + o.dw}%`,
                    transform: `translateX(-50%) rotate(${item.rot}deg)`,
                  };
                  return missing[item.src] ? (
                    // the art is not in public/30ans/fit yet — show its footprint
                    <div
                      className="acc absolute grid place-items-center rounded-lg border-2 border-dashed border-[#d63a30]/60 bg-[#d63a30]/10 py-6 text-center text-[11px] uppercase tracking-wider text-[#a8281f]"
                      key={item.id}
                      style={style}
                    >
                      {locale === "fr" ? item.fr : item.en}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="acc absolute"
                      key={item.id}
                      onError={() => setMissing((m) => ({ ...m, [item.src]: true }))}
                      src={item.src}
                      style={style}
                    />
                  );
                })}
              </div>
            </div>

            {/* the controls */}
            <div className="relative z-20 w-full max-w-[24rem]">
              <p className={`${SERIF} mb-5 text-center text-[1.05rem] leading-snug text-[#2b1512]/70 sm:text-[1.2rem] lg:text-left`}>
                {t.intro}
              </p>

              {SLOTS.map((slot) => {
                const n = picked[slot.id] ?? -1;
                const item = n >= 0 ? slot.items[n] : null;
                return (
                  <div className="mb-3 rounded-[1rem] border border-[#d63a30]/20 bg-[#fffdf4] px-3 py-2" key={slot.id}>
                    <div className="flex items-center gap-2">
                      <span className="w-[4.5rem] shrink-0 text-[10px] uppercase tracking-[0.18em] text-[#a8281f]/70">
                        {locale === "fr" ? slot.fr : slot.en}
                      </span>
                      <button
                        aria-label="previous"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#d63a30]/40 text-[15px] leading-none text-[#d63a30] hover:bg-[#d63a30] hover:text-[#fff6ef]"
                        onClick={() => cycle(slot.id, slot.items.length, -1)}
                      >
                        ‹
                      </button>
                      <span className={`${SERIF} flex-1 text-center text-[1.05rem] leading-tight text-[#2b1512]`}>
                        {item ? (locale === "fr" ? item.fr : item.en) : t.none}
                      </span>
                      <button
                        aria-label="next"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#d63a30]/40 text-[15px] leading-none text-[#d63a30] hover:bg-[#d63a30] hover:text-[#fff6ef]"
                        onClick={() => cycle(slot.id, slot.items.length, 1)}
                      >
                        ›
                      </button>
                    </div>

                    {nudge && item && (
                      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-[#d63a30]/15 pt-2 text-[11px]">
                        {([
                          ["←", -1, 0, 0], ["→", 1, 0, 0], ["↑", 0, -1, 0], ["↓", 0, 1, 0],
                          ["−", 0, 0, -2], ["+", 0, 0, 2],
                        ] as const).map(([label, dx, dy, dw]) => (
                          <button
                            className="rounded-md border border-[#d63a30]/30 px-2 py-1 text-[#a8281f]"
                            key={label}
                            onClick={() => bump(item.id, dx, dy, dw)}
                          >
                            {label}
                          </button>
                        ))}
                        <code className="ml-auto text-[10px] text-[#2b1512]/60">
                          x{(item.x + (offset[item.id]?.dx ?? 0)).toFixed(0)} y
                          {(item.y + (offset[item.id]?.dy ?? 0)).toFixed(0)} w
                          {(item.w + (offset[item.id]?.dw ?? 0)).toFixed(0)}
                        </code>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* dev toolbar — not part of the screen */}
      <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
        <button
          className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
          onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
        >
          {locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
        <button
          className={`rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200 ${nudge ? "bg-neutral-900 text-white" : ""}`}
          onClick={() => setNudge((v) => !v)}
        >
          {COPY[locale].nudge}
        </button>
        <button
          className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
          onClick={() => { setPicked({ hat: -1, glasses: -1 }); setOffset({}); }}
        >
          reset
        </button>
      </div>
    </div>
  );
}
