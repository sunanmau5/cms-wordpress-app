// PROTOTYPE — throwaway route. Activity: the photo gallery.
// Decisions so far (10): photos drift in DEPTH rather than bouncing off each
// other, so it reads as its own screen next to the quote wall; click or tap
// opens on every device; one caption per photo.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BackToHub } from "../BackToHub";

import { useLocale } from "../locale";

import { Instrument_Serif } from "next/font/google";

import { COPY } from "./copy";
import { PHOTOS, full, thumb } from "./photos";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;

const rand = (i: number, salt: number) =>
  Math.round(
    ((((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1) * 1e4,
  ) / 1e4;

const STARS = Array.from({ length: 120 }).map((_, i) => ({
  left: rand(i, 1) * 100,
  top: rand(i, 2) * 100,
  size: 1 + rand(i, 3) * 2.2,
  opacity: 0.12 + rand(i, 4) * 0.4,
  duration: 3 + rand(i, 5) * 4,
  delay: rand(i, 6) * 6,
}));

// the disco balls that come out to dance around an opened photo
const BALLS = Array.from({ length: 8 }).map((_, i) => ({
  left: [6, 18, 30, 44, 58, 72, 84, 93][i],
  top: 10 + rand(i, 41) * 74,
  size: 34 + Math.round(rand(i, 42) * 40),
  dur: 2.4 + rand(i, 43) * 1.7,
  delay: rand(i, 44) * 1.5,
}));

type Body = {
  el: HTMLElement | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  z: number; // 0 = far away and slow, 1 = near and quick
};

// Every photo is on the page at once — which is only possible because they are
// small and because they physically push each other apart.

export default function GalleryScreen() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState<number | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const openRef = useRef<number | null>(null);
  const t = COPY[locale];

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const shown = PHOTOS;

  // Depth field. Every photo gets a z: near ones are bigger, brighter, sharper
  // and travel faster; far ones are small, dim and slightly blurred. That
  // parallax is what keeps this from reading as the quote wall.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const els = Array.from(field.children) as HTMLElement[];

    let W = window.innerWidth;
    let H = window.innerHeight;
    let titleBox: { left: number; right: number; top: number; bottom: number } | null = null;

    // Seeded onto a jittered grid rather than at random points: pure random
    // clumps, and clumping is what made this read as a collage instead of a
    // field with depth.
    const n = els.length;
    const cols = Math.max(1, Math.round(Math.sqrt((n * W) / Math.max(1, H))));
    const rows = Math.ceil(n / cols);

    bodies.current = els.map((el, i) => {
      const z = rand(i, 51);
      const speed = 7 + z * 22;
      const angle = rand(i, 52) * Math.PI * 2;
      const cw = W / cols;
      const ch = H / rows;
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        el,
        x: (col + 0.15 + rand(i, 53) * 0.7) * cw - 40,
        y: (row + 0.15 + rand(i, 54) * 0.7) * ch - 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 0,
        h: 0,
        z,
      };
    });

    const measure = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const tb = titleRef.current?.getBoundingClientRect();
      titleBox = tb
        ? { left: tb.left - 10, right: tb.right + 10, top: tb.top - 8, bottom: tb.bottom + 12 }
        : null;
      bodies.current.forEach((b) => {
        if (!b.el) return;
        b.w = b.el.offsetWidth;
        b.h = b.el.offsetHeight;
        b.x = Math.min(b.x, Math.max(0, W - b.w));
        b.y = Math.min(b.y, Math.max(0, H - b.h));
      });
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // everything slows to a crawl while a photo is open
      const scale = openRef.current === null ? 1 : 0.15;

      for (const b of bodies.current) {
        if (!b.el) continue;
        b.x += b.vx * dt * scale;
        b.y += b.vy * dt * scale;

        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
        if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
        if (b.x + b.w > W) { b.x = W - b.w; b.vx = -Math.abs(b.vx); }
        if (b.y + b.h > H) { b.y = H - b.h; b.vy = -Math.abs(b.vy); }

        // the title is a solid box: nothing drifts across the words
        if (titleBox) {
          const hit =
            b.x < titleBox.right && b.x + b.w > titleBox.left &&
            b.y < titleBox.bottom && b.y + b.h > titleBox.top;
          if (hit) {
            const fromLeft = b.x + b.w - titleBox.left;
            const fromRight = titleBox.right - b.x;
            const fromTop = b.y + b.h - titleBox.top;
            const fromBottom = titleBox.bottom - b.y;
            const m = Math.min(fromLeft, fromRight, fromTop, fromBottom);
            if (m === fromLeft) { b.x = titleBox.left - b.w; b.vx = -Math.abs(b.vx); }
            else if (m === fromRight) { b.x = titleBox.right; b.vx = Math.abs(b.vx); }
            else if (m === fromTop) { b.y = titleBox.top - b.h; b.vy = -Math.abs(b.vy); }
            else { b.y = titleBox.bottom; b.vy = Math.abs(b.vy); }
          }
        }
      }

      // …and they bounce off each other, so two photos are never on top of one
      // another. Separated along whichever axis they overlap least, swapping
      // that component of the velocity — the same resolution the wall uses.
      const list = bodies.current;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const c = list[j];
          if (!a.el || !c.el) continue;
          const dx = Math.min(a.x + a.w - c.x, c.x + c.w - a.x);
          const dy = Math.min(a.y + a.h - c.y, c.y + c.h - a.y);
          if (dx <= 0 || dy <= 0) continue; // not touching

          if (dx < dy) {
            const push = dx / 2;
            if (a.x < c.x) { a.x -= push; c.x += push; }
            else { a.x += push; c.x -= push; }
            const t = a.vx;
            a.vx = c.vx;
            c.vx = t;
          } else {
            const push = dy / 2;
            if (a.y < c.y) { a.y -= push; c.y += push; }
            else { a.y += push; c.y -= push; }
            const t = a.vy;
            a.vy = c.vy;
            c.vy = t;
          }
        }
      }

      for (const b of list) {
        if (!b.el) continue;
        b.el.style.transform = `translate(${Math.round(b.x)}px, ${Math.round(b.y)}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    measure();
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className={`gallery fixed inset-0 z-50 overflow-hidden bg-[#030305] ${
        open !== null ? "frozen" : ""
      }`}
    >
      <BackToHub />
      {/* set as raw HTML rather than a text child: React diffs a <style>'s text
          content on hydration, and dev rebuilds desync it */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle { 0%,100% { opacity:.15 } 50% { opacity:1 } }
        @keyframes dance { 0%,100% { transform: translateY(0) rotate(-8deg) } 50% { transform: translateY(-13px) rotate(8deg) } }
        @keyframes openIn { from { opacity:0; transform: scale(.9) } to { opacity:1; transform: none } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

        /* hover: the photo swells out of the field, comes into focus and
           lifts. !important because the sim owns the button's inline z-index. */
        .photo img {
          transition: transform 320ms cubic-bezier(.2,1.2,.35,1), box-shadow 320ms ease, filter 320ms ease;
          transform-origin: center;
        }
        /* the depth blur and dimming are inline on the button, so clear them
           too or a far-away photo stays soft while it is being looked at */
        .photo:hover { z-index: 999 !important; filter: none !important; opacity: 1 !important; }
        .photo:hover img {
          transform: scale(2.1) rotate(-1.5deg);
          /* the glow: a tight white rim plus a wider halo bleeding into the
             night, over the usual drop shadow so it still sits on the field */
          box-shadow:
            0 0 0 1px rgba(255,255,255,.55),
            0 0 18px rgba(255,255,255,.55),
            0 0 46px rgba(255,255,255,.3),
            0 18px 50px rgba(0,0,0,.75);
          filter: brightness(1.1) saturate(1.08);
        }
        .photo:focus-visible { outline: none; z-index: 999 !important; }
        .photo:focus-visible img { transform: scale(2.1); }
        /* on a touch screen there is no hover, so leave them be */
        @media (hover: none) {
          .photo:hover img { transform: none; box-shadow: 0 8px 24px rgba(0,0,0,.55); filter: none; }
        }

        /* While a photo is open the field must let go of whatever was hovered —
           otherwise the thumbnail underneath stays blown up and glowing until
           the mouse happens to move. */
        .frozen .photo { pointer-events: none; }
        .frozen .photo img {
          transform: none !important;
          box-shadow: 0 8px 24px rgba(0,0,0,.55) !important;
          filter: none !important;
        }

        /* The site paints a big black custom cursor on <html>. On a dark field
           of small photos it swallows the pointer, so this screen uses the
           normal one until a funkier one is chosen. */
        .gallery, .gallery * { cursor: auto; }
        .gallery button { cursor: pointer; }
      ` }} />

      <div className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            className="absolute rounded-full bg-white"
            key={i}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* the drifting field */}
      <div ref={fieldRef}>
        {shown.map((p, i) => {
          const z = rand(i, 51);
          const size = 40 + z * 58; // far ones small, near ones big
          return (
            <button
              className="photo absolute left-0 top-0 transition-[filter,opacity] duration-300"
              key={p.id}
              onClick={() => setOpen(i)}
              style={{
                width: `clamp(34px, ${size / 13}vw, ${size}px)`,
                zIndex: 10 + Math.round(z * 10),
                opacity: open === null ? 0.6 + z * 0.4 : 0.15,
                filter: `blur(${(1 - z) * 1.2}px)`,
              }}
            >
              {/* the hover lives on the img: the button's own transform is
                  written every frame by the sim and must not be fought over */}
              <img
                alt=""
                className="w-full rounded-[3px] shadow-[0_8px_24px_rgba(0,0,0,.55)]"
                draggable={false}
                loading="lazy"
                src={thumb(p.id)}
              />
            </button>
          );
        })}
      </div>

      {/* title + hint, out of the way of the field */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[40] px-6 pt-10 text-center sm:pt-14">
        <div className="mx-auto w-max" ref={titleRef}>
          <h1 className={`${SERIF} text-[2.2rem] text-white sm:text-[3rem]`}>{t.title}</h1>
          <p className="mt-2 text-[13px] uppercase tracking-[0.2em] text-white/55">
            {t.hint}
          </p>
        </div>
      </div>

      {/* opened photo: the field dims, the balls come out to dance */}
      {open !== null && (
        <div
          className="absolute inset-0 z-[50] flex flex-col items-center justify-center px-6"
          onClick={close}
          style={{ animation: "fadeIn 260ms ease both" }}
        >
          <div className="absolute inset-0 bg-[#030305]/85" />

          {BALLS.map((b, i) => (
            <img
              alt=""
              className="pointer-events-none absolute opacity-70"
              draggable={false}
              key={i}
              src="/30ans/disco-ball.png"
              style={{
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: b.size,
                animation: `dance ${b.dur}s ease-in-out ${b.delay}s infinite`,
              }}
            />
          ))}

          <figure
            className="relative z-10 flex max-h-full flex-col items-center"
            style={{ animation: "openIn 380ms cubic-bezier(.2,1,.3,1) both" }}
          >
            {/* the big version is fetched only now, never while floating */}
            <img
              alt=""
              className="max-h-[68vh] w-auto max-w-[90vw] rounded-sm shadow-[0_24px_70px_rgba(0,0,0,.7)]"
              draggable={false}
              src={full(shown[open].id)}
            />
            {shown[open][locale] && (
              <figcaption
                className={`${SERIF} mt-6 max-w-[34rem] text-center text-[1.35rem] leading-[1.4] text-white/90 sm:text-[1.7rem]`}
              >
                {shown[open][locale]}
              </figcaption>
            )}
          </figure>

          <button
            aria-label={t.close}
            className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white/75 transition-colors hover:border-white/70 hover:text-white"
            onClick={close}
          >
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path
                d="M2.5 2.5l11 11m0-11l-11 11"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
            </svg>
          </button>
        </div>
      )}

      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
          >
            {locale === "fr" ? "🇫🇷 FR" : "EN"}
          </button>
        </div>
      )}
    </div>
  );
}
