// PROTOTYPE — throwaway route. Screens 4 & 5: the RSVP question, the form,
// the confirmation, and the "no" path.
// Decisions: .scratch/birthday-portal/issues/07-rsvp-flow.md
// Visual language: starfield + Instrument Serif, carried from the joke screen.
// No spotlight here — dropped on review.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useLocale } from "../locale";

import { Instrument_Serif } from "next/font/google";

import { useScreenNav } from "../screen-nav";
import { COPY, DATES } from "./copy";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const instrumentItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
const SERIF = instrument.className;
const SERIF_IT = instrumentItalic.className;

// rounded — Math.sin's last digits differ between Node and the browser, which
// otherwise fails hydration (paid for on the joke screen)
const rand = (i: number, salt: number) =>
  Math.round(
    ((((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1) * 1e4,
  ) / 1e4;

const STARS = Array.from({ length: 110 }).map((_, i) => ({
  left: rand(i, 1) * 100,
  top: rand(i, 2) * 100,
  size: 1 + rand(i, 3) * 2.2,
  opacity: 0.12 + rand(i, 4) * 0.4,
  duration: 3 + rand(i, 5) * 4,
  delay: rand(i, 6) * 6,
}));

const REPLIED_KEY = "rinaverse-rsvp-replied";

// View Transitions: wrap a state change so the browser cross-fades old -> new.
// A no-op (instant) where the API is missing, so nothing breaks on older phones.
function vt(update: () => void) {
  const d = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (typeof document !== "undefined" && d.startViewTransition) {
    // swallow the rejection if the transition is aborted (inactive tab / re-tap)
    d.startViewTransition(update).finished.catch(() => {});
  } else {
    update();
  }
}

const QUOTE_CHARS = new Set(["«", "»", "“", "”"]);
function Quoted({ text }: { text: string }) {
  return (
    <>
      {text.split(/([«»“”])/).map((part, i) =>
        QUOTE_CHARS.has(part) ? (
          <span key={i} style={{ fontSize: "1.32em", lineHeight: 0 }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Sparkle({
  size,
  delay,
  left,
  top,
}: {
  size: number;
  delay: number;
  left: string;
  top: string;
}) {
  return (
    <svg
      className="pointer-events-none absolute"
      height={size}
      style={{
        left,
        top,
        filter: "drop-shadow(0 0 6px rgba(255,255,255,.85))",
        animation: `pop 1.9s ease-in-out ${delay}s infinite`,
      }}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 0c.6 7.2 4.2 10.8 12 12-7.8 1.2-11.4 4.8-12 12-.6-7.2-4.2-10.8-12-12C7.8 10.8 11.4 7.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TitleSparkles() {
  return (
    <span className="pointer-events-none absolute inset-0 block text-white">
      <Sparkle delay={0} left="-3%" size={18} top="-22%" />
      <Sparkle delay={0.9} left="96%" size={14} top="-6%" />
      <Sparkle delay={1.6} left="10%" size={12} top="94%" />
      <Sparkle delay={0.5} left="82%" size={15} top="88%" />
    </span>
  );
}

// Confetti that bursts on hover. Lives inside any .btn-festive.
const CONFETTI = [
  { left: "8%", dx: "-30px", rot: "-40deg", d: "0s", c: "#ffd166" },
  { left: "26%", dx: "-12px", rot: "25deg", d: ".1s", c: "#e96eb6" },
  { left: "46%", dx: "4px", rot: "-22deg", d: ".2s", c: "#7e78ff" },
  { left: "66%", dx: "16px", rot: "34deg", d: ".3s", c: "#8ef0c8" },
  { left: "86%", dx: "32px", rot: "-16deg", d: ".4s", c: "#fff" },
];
function Confetti() {
  return (
    <>
      {CONFETTI.map((p, i) => (
        <span
          aria-hidden
          className="confetti pointer-events-none absolute top-1 block h-2 w-2 rounded-[2px]"
          key={i}
          style={
            {
              left: p.left,
              background: p.c,
              animationDelay: p.d,
              "--dx": p.dx,
              "--rot": p.rot,
            } as React.CSSProperties
          }
        />
      ))}
      <span className="sparks pointer-events-none absolute inset-0 block text-white">
        <Sparkle delay={0} left="-6%" size={14} top="-30%" />
        <Sparkle delay={0.45} left="98%" size={12} top="-10%" />
        <Sparkle delay={0.9} left="46%" size={11} top="105%" />
      </span>
    </>
  );
}

// The way into Rina-Land: no panel and no background of its own.
// Desktop puts the dancing disco balls on BOTH SIDES of the words, everything
// sitting on the same bottom line. Mobile keeps the words above a single row of
// balls. The letters jump either way.
function ball(i: number) {
  return {
    size: 26 + Math.round(rand(i, 21) * 26),
    dur: 2.4 + rand(i, 22) * 1.8,
    delay: rand(i, 23) * 1.6,
  };
}

function Balls({ from, count, className = "" }: { from: number; count: number; className?: string }) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, n) => {
        const b = ball(from + n);
        return (
          <img
            alt=""
            className="rl-ball"
            draggable={false}
            key={n}
            src="/30ans/disco-ball.png"
            style={{
              width: b.size,
              animation: `dance ${b.dur}s ease-in-out ${b.delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function JumpingText({ text, className }: { text: string; className?: string }) {
  let n = 0;
  return (
    <span className={className}>
      {text.split("").map((c, i) =>
        c === " " ? (
          <span key={i} style={{ display: "inline-block", width: "0.32em" }} />
        ) : (
          <span
            key={i}
            style={{
              display: "inline-block",
              animation: `letterJump 1.8s ease-in-out ${n++ * 0.06}s infinite`,
            }}
          >
            {c}
          </span>
        ),
      )}
    </span>
  );
}

// Party horns drifting down the left and right edges, spinning as they go and
// turning back when they reach the side of the screen. The drift and the spin
// live on separate elements — an animation that ends on a transform would
// otherwise stamp over the other one.
// One big horn drifting on each side, moved by the same kind of tiny physics
// sim the wall page uses for its quotes: real velocities, bouncing off the
// walls and off an invisible box around the text rather than a canned path.
//
// The sim writes translate() on the OUTER element and the spin is a CSS
// animation on the img inside — an animation ending on a transform would
// otherwise stamp over the position.
function PartyHorns({ boxRef }: { boxRef: React.RefObject<HTMLDivElement | null> }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(wrap.current?.children ?? []) as HTMLElement[];
    if (!els.length) return;

    let W = 0;
    let H = 0;
    let narrow = false;
    let box: DOMRect | null = null;

    const bodies = els.map((el, i) => ({
      el,
      x: 0,
      y: 0,
      // opposite corners, drifting across
      vx: i === 0 ? 24 : -21,
      vy: i === 0 ? 19 : -17,
      w: 0,
      h: 0,
      // the cutout is portrait AND spinning, so what it actually covers is its
      // diagonal, not its width. Collide with that or it laps over the text.
      s: 0,
      // the horizontal band this one is allowed to roam
      yMin: 0,
      yMax: 0,
    }));

    const measure = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      narrow = W < 640;
      box = boxRef.current?.getBoundingClientRect() ?? null;
      bodies.forEach((b, i) => {
        b.w = b.el.offsetWidth;
        b.h = b.el.offsetHeight;
        b.s = Math.hypot(b.w, b.h);

        // On a phone there is no room beside the text, so each horn gets its
        // own strip: the first above the title, the second below the buttons.
        if (narrow && box) {
          if (i === 0) {
            b.yMin = 0;
            b.yMax = Math.max(b.s, box.top - 14);
          } else {
            b.yMin = Math.min(box.bottom + 14, H - b.s);
            b.yMax = H;
          }
        } else {
          b.yMin = 0;
          b.yMax = H;
        }

        // keep everyone inside after a resize
        b.x = Math.min(Math.max(0, b.x), Math.max(0, W - b.s));
        b.y = Math.min(Math.max(b.yMin, b.y), Math.max(b.yMin, b.yMax - b.s));
      });
    };

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const b of bodies) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
        if (b.y < b.yMin) { b.y = b.yMin; b.vy = Math.abs(b.vy); }
        if (b.x + b.s > W) { b.x = W - b.s; b.vx = -Math.abs(b.vx); }
        if (b.y + b.s > b.yMax) { b.y = b.yMax - b.s; b.vy = -Math.abs(b.vy); }

        // on wide screens the text column is a solid obstacle: push out along
        // whichever side it overlaps least, exactly as the wall does
        if (!narrow && box) {
          const hit =
            b.x < box.right && b.x + b.s > box.left &&
            b.y < box.bottom && b.y + b.s > box.top;
          if (hit) {
            const fromLeft = b.x + b.s - box.left;
            const fromRight = box.right - b.x;
            const fromTop = b.y + b.s - box.top;
            const fromBottom = box.bottom - b.y;
            const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);
            if (min === fromLeft) { b.x = box.left - b.s; b.vx = -Math.abs(b.vx); }
            else if (min === fromRight) { b.x = box.right; b.vx = Math.abs(b.vx); }
            else if (min === fromTop) { b.y = box.top - b.s; b.vy = -Math.abs(b.vy); }
            else { b.y = box.bottom; b.vy = Math.abs(b.vy); }
          }
        }

        // b.x/b.y track the diagonal box; centre the artwork inside it
        b.el.style.transform = `translate(${Math.round(b.x + (b.s - b.w) / 2)}px, ${Math.round(b.y + (b.s - b.h) / 2)}px)`;
      }

      raf = requestAnimationFrame(step);
    };

    measure();
    bodies[0].x = 6;
    bodies[0].y = bodies[0].yMin + 8;
    if (bodies[1]) {
      bodies[1].x = Math.max(0, W - bodies[1].s - 6);
      bodies[1].y = Math.max(bodies[1].yMin, bodies[1].yMax - bodies[1].s - 8);
    }

    // the entry animation still has the text 26px low at mount, which would
    // leave the ceiling that much too generous — measure again once it lands
    const settle = setTimeout(measure, 1100);

    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, [boxRef]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0" ref={wrap}>
      {[
        { w: "w-[96px] sm:w-[190px]", spin: 26, rev: false },
        { w: "w-[82px] sm:w-[165px]", spin: 33, rev: true },
      ].map((h, i) => (
        <div className={`absolute left-0 top-0 ${h.w}`} key={i}>
          <img
            alt=""
            className="w-full max-w-none opacity-75"
            draggable={false}
            src="/30ans/cutout-party-horn.png"
            style={{
              animation: `${h.rev ? "spinRev" : "spin"} ${h.spin}s linear infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function RinaLandBanner({ intro, cta }: { intro?: string; cta: string }) {
  const nav = useScreenNav();
  const Arrow = () => (
    <svg
      aria-hidden
      className="rl-arrow shrink-0"
      fill="none"
      height="34"
      viewBox="0 0 24 34"
      width="24"
    >
      <path
        d="M12 3v26M4 21l8 8 8-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );

  const words = (
    <button
      className="rl-cta flex w-max items-center gap-4 text-white sm:gap-7"
      onClick={() => nav("/portal/hub", "up")}
      type="button"
    >
      <Arrow />
      <JumpingText
        className={`${SERIF} whitespace-nowrap text-[1.7rem] uppercase tracking-[0.06em] sm:text-[2.5rem]`}
        text={cta}
      />
      <Arrow />
    </button>
  );

  return (
    // full-bleed: breaks out of the centred column so the balls can run edge
    // to edge
    <div className="rl-banner fixed inset-x-0 bottom-0 z-40 px-4 pb-3 sm:px-6">
      {intro && (
        <p
          className={`rl-intro ${SERIF} mx-auto max-w-[32rem] text-center text-[1.3rem] leading-[1.45] text-white/85 sm:max-w-none sm:whitespace-nowrap sm:text-[clamp(0.9rem,1.85vw,1.7rem)]`}
        >
          {intro}
        </p>
      )}

      {/* desktop: balls · words · balls, the balls filling all the width left */}
      <div className="mt-9 hidden items-end gap-8 sm:flex">
        <Balls className="min-w-0 flex-1 justify-evenly" count={6} from={0} />
        {words}
        <Balls className="min-w-0 flex-1 justify-evenly" count={6} from={6} />
      </div>

      {/* mobile: the layout she liked — words, then a row of balls beneath */}
      <div className="rl-mobile sm:hidden">
        <div className="mx-auto mt-8 w-max">{words}</div>
        {/* justify-between so the row spans edge to edge; a count small enough
            not to overflow 375px and get clipped at the sides */}
        <Balls className="mt-8 justify-between" count={7} from={0} />
      </div>
    </div>
  );
}

type Stage = "ask" | "form" | "sent" | "no" | "noSent";

export default function RsvpScreen() {
  const { locale, setLocale } = useLocale();
  const [stage, setStage] = useState<Stage>("ask");
  const [name, setName] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [diet, setDiet] = useState("");
  const [message, setMessage] = useState("");
  const [noName, setNoName] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; dates?: boolean; send?: boolean }>({});
  const [replied, setReplied] = useState(false);
  const sentRef = useRef<{ name: string; dates: string[]; diet: string; message: string } | null>(null);
  // the text block the horns bounce off
  const askRef = useRef<HTMLDivElement>(null);
  const t = COPY[locale];

  // one smooth cross-fade between RSVP stages
  const go = (s: Stage) => vt(() => setStage(s));

  useEffect(() => {
    setReplied(!!window.localStorage.getItem(REPLIED_KEY));
  }, []);

  const dateLabels = useMemo(
    () =>
      dates
        .map((k) => DATES.find((d) => d.key === k)?.[locale])
        .filter(Boolean)
        .join(" · "),
    [dates, locale],
  );

  const toggleDate = (key: string) =>
    setDates((cur) =>
      cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
    );

  async function post(payload: Record<string, string>) {
    const res = await fetch("/api/rinaverse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "rsvp", ...payload }),
    });
    if (!res.ok) throw new Error("send failed");
    return res.json();
  }

  async function submitYes() {
    const bad = { name: !name.trim(), dates: dates.length === 0 };
    setErrors(bad);
    if (bad.name || bad.dates) return;
    setBusy(true);
    try {
      await post({
        response: "yes",
        name: name.trim(),
        dates: dates.map((k) => DATES.find((d) => d.key === k)?.en ?? k).join(", "),
        diet: diet.trim(),
        message: message.trim(),
      });
      sentRef.current = { name: name.trim(), dates: [...dates], diet, message };
      window.localStorage.setItem(REPLIED_KEY, "1");
      go("sent");
    } catch {
      setErrors({ send: true });
    } finally {
      setBusy(false);
    }
  }

  async function submitNo() {
    // a row is written only if a name was given, so the sheet can tell
    // "declined" apart from "never opened the link"
    if (!noName.trim()) {
      go("noSent");
      return;
    }
    setBusy(true);
    try {
      await post({ response: "no", name: noName.trim(), dates: "", diet: "", message: "" });
      window.localStorage.setItem(REPLIED_KEY, "1");
      go("noSent");
    } catch {
      setErrors({ send: true });
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-none border-0 border-b border-white/25 bg-transparent px-0 py-2.5 text-[1.15rem] text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/70 sm:text-[1.25rem]";
  const label =
    "block text-[13px] uppercase tracking-[0.16em] text-white/70 sm:text-[14px]";
  // deliberately NOT the italic serif — at this size it reads as too thin
  const hint = "mt-1.5 text-[14px] text-white/60";
  const narrow = "mx-auto w-full max-w-[46rem]";

  return (
    // overflow-x-hidden because the full-bleed banner is sized in vw, which
    // ignores this container's scrollbar and would otherwise scroll sideways
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#030305]">
      <style>{`
        @keyframes twinkle { 0%,100% { opacity:.15 } 50% { opacity:1 } }
        @keyframes riseIn { from { opacity:0; transform: translateX(48px) } to { opacity:1; transform: none } }
        @keyframes pop { 0%,58%,100% { opacity:0; transform: scale(.35) rotate(0deg) } 72%,86% { opacity:.9; transform: scale(1.1) rotate(20deg) } }
        @keyframes arrowDown { 0%,100% { transform: translateY(0); opacity:.5 } 50% { transform: translateY(8px); opacity:1 } }
        @keyframes confettiUp {
          0%   { opacity:0; transform: translate(0,0) rotate(0deg) scale(.6) }
          25%  { opacity:1 }
          100% { opacity:0; transform: translate(var(--dx), -46px) rotate(var(--rot)) scale(1) }
        }
        @keyframes tearFall { 0% { opacity:0; transform: translateY(-2px) scale(.7) } 30% { opacity:.9 } 100% { opacity:0; transform: translateY(16px) scale(1) } }
        /* the balls keep their feet on the floor and sway */
        @keyframes dance {
          0%,100% { transform: translateY(0) rotate(-7deg) }
          50%     { transform: translateY(-11px) rotate(7deg) }
        }
        @keyframes letterJump { 0%,100% { transform: translateY(0) } 45% { transform: translateY(-7px) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes spinRev { to { transform: rotate(-360deg) } }
        /* drift away from the edge and back into it */
        @keyframes hornL { 0%,100% { transform: translate(0,0) } 50% { transform: translate(30px,54px) } }
        @keyframes hornR { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-30px,54px) } }

        /* anything festive: lifts, throws confetti and sparkles on hover */
        .btn-festive { transition: transform 260ms cubic-bezier(.2,1.3,.4,1), box-shadow 260ms ease, border-color 260ms ease, color 260ms ease; }
        .btn-festive:hover { transform: translateY(-3px) scale(1.035); }
        .btn-festive .confetti, .btn-festive .sparks { opacity: 0; }
        .btn-festive:hover .confetti { animation: confettiUp 1.1s ease-out infinite; }
        .btn-festive:hover .sparks { opacity: 1; }
        .btn-solid:hover { box-shadow: 0 12px 34px rgba(255,255,255,.28); }
        .btn-outline:hover { border-color: rgba(255,255,255,.75); color: #fff; }

        /* the sad button: it sinks, dims, and lets go of a single tear */
        .btn-no { transition: transform 420ms ease, opacity 420ms ease, border-color 420ms ease; }
        .btn-no:hover { transform: translateY(3px) rotate(-.6deg); opacity: .72; border-color: rgba(255,255,255,.18); }
        .btn-no .tear { opacity: 0; }
        .btn-no:hover .tear { animation: tearFall 1.6s ease-in-out .15s infinite; }

        .rl-arrow { animation: arrowDown 1.8s ease-in-out infinite; }
        .rl-cta { transition: transform 300ms cubic-bezier(.2,1.3,.4,1), filter 300ms ease; }
        .rl-cta:hover { transform: translateY(-3px) scale(1.03); filter: drop-shadow(0 0 22px rgba(255,255,255,.45)); }
        .rl-cta:hover .rl-arrow { animation-duration: .9s; }
        .rl-ball { transform-origin: 50% 100%; filter: drop-shadow(0 6px 16px rgba(255,255,255,.18)); }

        /* Short viewports (13-inch laptops, small phones): the sent recap plus
           the fixed disco footer do not both fit, so the page scrolled. On
           short heights only, compress the recap and the column padding; tall
           screens stay untouched. NOTE: keep this block free of the characters
           React escapes inside a style text node (quotes, apostrophe, and the
           child combinator) or hydration mismatches. */
        /* the footer is shorter on desktop, so its clearance reserve can shrink;
           on mobile the footer is tall, so leave that reserve alone */
        @media (min-width: 640px) and (max-height: 800px) {
          .rsvp-sent-wrap { padding-bottom: 160px !important; }
        }
        @media (max-height: 800px) {
          .rsvp-col { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .sent-sub { margin-top: 0.4rem !important; }
          .sent-recap { margin-top: 1.1rem !important; }
          .sent-row { padding-bottom: 0.45rem !important; }
          .sent-row + .sent-row { margin-top: 0.55rem !important; }
          .sent-recap dd { font-size: 1.1rem !important; margin-top: 0.2rem !important; }
        }
        @media (max-height: 680px) {
          .rsvp-col { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          .sent-recap { margin-top: 0.7rem !important; }
          .sent-recap dd { font-size: 1rem !important; }
        }
        /* Small phones (e.g. iPhone 12 mini): the tall mobile footer + a real
           message overflowed. Shrink the footer's intro and gaps, and the recap,
           so a typical reply fits without scrolling. */
        @media (max-width: 639px) and (max-height: 760px) {
          .rl-intro { font-size: 1.02rem !important; line-height: 1.3 !important; }
          .rl-mobile > div { margin-top: 0.9rem !important; }
          .rsvp-sent-wrap { padding-bottom: 200px !important; }
          .sent-recap { margin-top: 0.7rem !important; }
          .sent-row { padding-bottom: 0.35rem !important; }
          .sent-row + .sent-row { margin-top: 0.4rem !important; }
        }
      `}</style>

      <div className="rinaverse-bg pointer-events-none fixed inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
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

      <div className="rsvp-col relative mx-auto flex min-h-full max-w-[62rem] flex-col justify-center px-6 py-16 sm:px-10">
        {stage === "ask" && (
          <>
            {/* outside the animated block on purpose: riseIn settles on
                filter: blur(0px), and a non-none filter makes that element the
                containing block for position:fixed children — which pinned the
                horns to the text instead of the viewport */}
            <PartyHorns boxRef={askRef} />
            <div className="relative" ref={askRef} style={{ animation: "riseIn 900ms cubic-bezier(.16,1,.3,1) both" }}>
            {/* one line from the sm breakpoint up: the size follows the viewport
                so neither language ever wraps onto a second line */}
            <h1
              className={`${SERIF} relative text-[2.2rem] leading-[1.05] tracking-tight text-white sm:whitespace-nowrap sm:text-center sm:text-[clamp(1.7rem,4.3vw,3.9rem)]`}
            >
              {t.askTitle}
              <TitleSparkles />
            </h1>

            <div className={`${narrow} mt-10 space-y-2.5 sm:text-center`}>
              <p className={`${SERIF} text-[1.45rem] text-white/95 sm:text-[1.8rem]`}>
                {t.askWhen}
              </p>
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/65 sm:text-[13px]">
                {t.askEvening}
              </p>
              <p
                className={`${SERIF} mx-auto max-w-[34rem] pt-2 text-[1.3rem] leading-[1.45] text-white/85 sm:text-[1.55rem]`}
              >
                <Quoted text={t.askVenue} />
              </p>
            </div>

            <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                className="btn-festive btn-solid relative rounded-full bg-white px-9 py-4 text-[13px] uppercase tracking-[0.2em] text-neutral-900"
                onClick={() => go("form")}
              >
                {t.yes}
                <Confetti />
              </button>

              <button
                className="btn-no relative rounded-full border border-white/30 px-9 py-4 text-[13px] uppercase tracking-[0.2em] text-white/70"
                onClick={() => go("no")}
              >
                {t.no}
                <span
                  aria-hidden
                  className="tear pointer-events-none absolute left-1/2 top-full block h-2.5 w-2 -translate-x-1/2 rounded-b-full rounded-t-[60%] bg-sky-200/70"
                />
              </button>
              </div>
            </div>
          </>
        )}

        {stage === "form" && (
          <div className={narrow}>
            <h1 className={`${SERIF} relative text-[2.1rem] leading-[1.1] text-white sm:text-[3rem]`}>
              {t.formTitle}
              <TitleSparkles />
            </h1>

            {replied && (
              <p className={`${SERIF_IT} mt-5 text-[1.1rem] leading-[1.6] text-amber-200/85`}>
                {t.already}
              </p>
            )}

            <div className="mt-11 space-y-10">
              <div>
                <label className={label} htmlFor="rsvp-name">
                  {t.name}
                </label>
                <input
                  className={`${field} mt-2`}
                  id="rsvp-name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  value={name}
                />
                {errors.name && (
                  <p className="mt-2 text-[14px] text-rose-300">{t.errName}</p>
                )}
              </div>

              <fieldset>
                <legend className={label}>{t.dates}</legend>
                <p className={hint}>{t.datesHint}</p>
                <div className="mt-4 space-y-3.5">
                  {DATES.map((d) => {
                    const on = dates.includes(d.key);
                    return (
                      <button
                        className="flex w-full items-center gap-3 text-left"
                        key={d.key}
                        onClick={() => toggleDate(d.key)}
                        type="button"
                      >
                        <span
                          aria-hidden
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-sm border transition-colors ${
                            on ? "border-white bg-white" : "border-white/35"
                          }`}
                        >
                          {on && (
                            <svg height="13" viewBox="0 0 12 12" width="13">
                              <path
                                d="M2 6.5 4.6 9 10 3.5"
                                fill="none"
                                stroke="#111"
                                strokeLinecap="round"
                                strokeWidth="1.8"
                              />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`${SERIF} text-[1.3rem] ${
                            on ? "text-white" : "text-white/70"
                          }`}
                        >
                          {d[locale]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.dates && (
                  <p className="mt-3 text-[14px] text-rose-300">{t.errDates}</p>
                )}
              </fieldset>

              <div>
                <label className={label} htmlFor="rsvp-diet">
                  {t.diet}
                </label>
                <p className={hint}>{t.dietHint}</p>
                <input
                  className={`${field} mt-2`}
                  id="rsvp-diet"
                  onChange={(e) => setDiet(e.target.value)}
                  placeholder={t.dietPlaceholder}
                  value={diet}
                />
              </div>

              <div>
                <label className={label} htmlFor="rsvp-message">
                  {t.message}
                </label>
                <p className={hint}>{t.messageHint}</p>
                <textarea
                  className={`${field} mt-2 resize-none`}
                  id="rsvp-message"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={3}
                  value={message}
                />
              </div>
            </div>

            {errors.send && <p className="mt-6 text-[14px] text-rose-300">{t.errSend}</p>}

            <button
              className="btn-festive btn-solid relative mt-11 w-full rounded-full bg-white px-9 py-4 text-[13px] uppercase tracking-[0.2em] text-neutral-900 disabled:opacity-50 sm:w-auto"
              disabled={busy}
              onClick={submitYes}
            >
              {busy ? t.sending : t.send}
              <Confetti />
            </button>
          </div>
        )}

        {stage === "sent" && (
          <>
          <div className="rsvp-sent-wrap pb-[240px] sm:pb-[200px]">
            <div className={narrow}>
              <h1
                className={`${SERIF} relative text-[2.4rem] text-white sm:text-center sm:text-[3.4rem]`}
              >
                {t.sentTitle}
                <TitleSparkles />
              </h1>
              {/* same face and size as "Le lieu arrive bientôt" — the roman
                  serif reads fine, it was the italic that was too thin */}
              <p
                className={`sent-sub ${SERIF} mx-auto mt-4 max-w-[34rem] text-[1.3rem] leading-[1.45] text-white/85 sm:text-center sm:text-[1.55rem]`}
              >
                {t.sentSub}
              </p>

              {/* echo it back — kills "did that actually send?" */}
              <dl className="sent-recap mx-auto mt-11 max-w-[28rem] space-y-5">
                {[
                  [t.sentName, sentRef.current?.name],
                  [t.sentDates, dateLabels],
                  [t.sentDiet, sentRef.current?.diet],
                  [t.sentMessage, sentRef.current?.message],
                ].map(([k, v]) => (
                  <div className="sent-row border-b border-white/10 pb-3" key={k as string}>
                    <dt className={label}>{k}</dt>
                    <dd className={`${SERIF} mt-1.5 text-[1.35rem] text-white/90`}>
                      {(v as string)?.trim() ? (v as string) : t.sentNothing}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <RinaLandBanner cta={t.bannerCta} intro={t.bannerIntro} />
          </>
        )}

        {stage === "no" && (
          <div className={narrow}>
            <h1 className={`${SERIF} text-[2.2rem] leading-[1.1] text-white sm:text-[3rem]`}>
              {t.noTitle}
            </h1>
            <p
              className={`${SERIF} mt-7 max-w-[34rem] text-[1.25rem] leading-[1.55] text-white/85 sm:text-[1.45rem]`}
            >
              {t.noBody}
            </p>

            <div className="mt-11 max-w-[24rem]">
              <label className={label} htmlFor="rsvp-noname">
                {t.noName}
              </label>
              <input
                className={`${field} mt-2`}
                id="rsvp-noname"
                onChange={(e) => setNoName(e.target.value)}
                placeholder={t.noNamePlaceholder}
                value={noName}
              />
            </div>

            {errors.send && <p className="mt-6 text-[14px] text-rose-300">{t.errSend}</p>}

            {/* the way back sits beside Send — people misclick, and plans change */}
            <div className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                className="btn-festive btn-solid relative rounded-full bg-white px-9 py-4 text-[13px] uppercase tracking-[0.2em] text-neutral-900 disabled:opacity-50"
                disabled={busy}
                onClick={submitNo}
              >
                {busy ? t.sending : t.noSend}
                <Confetti />
              </button>
              <button
                className="btn-festive btn-outline relative rounded-full border border-white/30 px-9 py-4 text-[13px] uppercase tracking-[0.2em] text-white/75"
                onClick={() => go("form")}
              >
                {t.backToYes}
                <Confetti />
              </button>
            </div>
          </div>
        )}

        {stage === "noSent" && (
          <>
          <div className="pb-[240px] sm:pb-[200px]">
            <div className={narrow}>
              <h1
                className={`${SERIF} relative text-[2.2rem] text-white sm:text-center sm:text-[3rem]`}
              >
                {t.noSentTitle}
                <TitleSparkles />
              </h1>
            </div>

            {/* mobile: left-aligned, in-flow. desktop: full-bleed one line */}
            <div className="relative mt-7 sm:left-1/2 sm:w-screen sm:-translate-x-1/2 sm:px-6">
              <p
                className={`${SERIF} max-w-[34rem] text-left text-[1.3rem] leading-[1.45] text-white/85 sm:mx-auto sm:max-w-none sm:whitespace-nowrap sm:text-center sm:text-[clamp(0.9rem,1.75vw,1.6rem)]`}
              >
                {t.noSentBody}
              </p>
            </div>

            <div className={`${narrow} mt-10 text-left sm:text-center`}>
              <button
                className="btn-festive btn-outline relative rounded-full border border-white/30 px-9 py-4 text-[13px] uppercase tracking-[0.2em] text-white/75"
                onClick={() => go("form")}
              >
                {t.backToYes}
                <Confetti />
              </button>
            </div>

          </div>

          {/* no intro sentence here — the line above already says it */}
          <RinaLandBanner cta={t.bannerCta} />
          </>
        )}
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 scale-90 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
          >
            {locale === "fr" ? "🇫🇷 FR" : "EN"}
          </button>
          {(["ask", "form", "sent", "no", "noSent"] as Stage[]).map((s) => (
            <button
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                s === stage ? "bg-neutral-900 text-white" : "bg-neutral-200"
              }`}
              key={s}
              onClick={() => go(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
