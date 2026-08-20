// PROTOTYPE — throwaway route. Screen 3: the joke + drag-to-30-brooms.
// Background treatment: Spotlight (the other three were dropped after review).
// Question: .scratch/birthday-portal/issues/06-screen-broom-joke.md

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useLocale } from "./locale";

import { Instrument_Serif } from "next/font/google";

import { useScreenNav } from "./screen-nav";
import { COPY, TARGET } from "./joke-copy";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
// Instrument Serif ships a true italic; without asking for it the browser only
// slants the roman, which reads as "not italic at all" at this size.
const instrumentItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
const SERIF = instrument.className;
const SERIF_IT = instrumentItalic.className;

// rounded, because Math.sin's last digits differ between Node and the browser
// and the raw values made the starfield fail hydration
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

const DRAG_PER_BROOM = 26;
// measured off cutout2: her broom is 67.7% of the image height, bristles
// stopping 2.4% above the bottom. The loose ones match exactly.
const BROOM_H_PCT = 67.7;
const BROOM_BOTTOM_PCT = 2.4;
// how much of the stage a broom occupies from the floor up — used to keep the
// tips clear of the joke text
const BROOM_REACH = (BROOM_H_PCT + BROOM_BOTTOM_PCT) / 100;
const TEXT_GAP = 18;
const BUST = "?v=4";

// they leave one at a time, each lifting away over EXIT_MS
const EXIT_STEP_MS = 70;
const EXIT_MS = 560;
// how long a half-finished line sits untouched before it folds itself away
const IDLE_FOLD_MS = 6000;

// Instrument Serif's italic draws « » “ ” at roughly half the width a normal
// serif gives them (31.6 vs 55.6 units at the same size, measured), which makes
// the quoted phrases read as mis-set. Scale just those glyphs back up; the
// zero line-height keeps them from opening up the line spacing around them.
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

// editorial stagger — characters rise out of a blur one after the next, but
// each WORD is kept whole so a line break can never split "année" in half.
function StaggerText({
  text,
  className,
  delay = 0,
  step = 24,
  still = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  still?: boolean;
}) {
  const words = text.split(" ");
  let n = 0;
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((c, ci) => (
            <span
              key={ci}
              style={{
                display: "inline-block",
                // `still` is for the hidden measuring copy: identical markup, so
                // identical wrapping, but no animation to measure through
                animation: still
                  ? undefined
                  : `charIn 900ms cubic-bezier(.16,1,.3,1) ${delay + n++ * step}ms both`,
              }}
            >
              {c}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block", width: "0.3em" }} />
          )}
        </span>
      ))}
    </span>
  );
}

// The title, rule and note. Rendered once for real and once per locale, hidden,
// so the stage can be sized against the TALLER locale and her cutout comes out
// the same size in French and English.
function ColumnBody({
  t,
  short,
  still = false,
}: {
  t: (typeof COPY)["fr"];
  short: boolean;
  still?: boolean;
}) {
  return (
    <>
      {/* only the title keeps clear of the surprised photo; the note below it
          runs the full width, with the same margin as the left edge */}
      <h1 className="relative pr-[38vw] text-left sm:pr-0 sm:text-center">
        <StaggerText
          className={`${SERIF} block text-[2.4rem] leading-[1.05] tracking-tight text-white ${
            short ? "sm:text-[3.1rem]" : "sm:text-[4.25rem]"
          }`}
          still={still}
          text={t.title}
        />
        {!still && (
          <span className="pointer-events-none absolute inset-0 block text-white">
            <Sparkle delay={0} left="-4%" size={18} top="-24%" />
            <Sparkle delay={0.9} left="97%" size={14} top="-6%" />
            <Sparkle delay={1.6} left="12%" size={12} top="92%" />
            <Sparkle delay={0.5} left="80%" size={15} top="88%" />
          </span>
        )}
      </h1>

      <div
        className={`mt-7 h-px w-16 bg-white/25 sm:mx-auto ${
          short ? "sm:mt-5" : "sm:mt-9"
        }`}
        style={still ? undefined : { animation: "fadeIn 900ms ease 900ms both" }}
      />

      {/* the note is two parts; the break between them comes from copy.ts */}
      <p
        // wider measure, more leading and more contrast than the first pass —
        // italic serif at low opacity on black was hard going
        className={`${SERIF_IT} mt-6 max-w-[38rem] whitespace-pre-line text-left text-[1.25rem] leading-[1.7] text-white/85 sm:mx-auto sm:text-center ${
          short ? "sm:mt-5 sm:text-[1.3rem]" : "sm:mt-8 sm:text-[1.7rem]"
        }`}
        style={
          still
            ? undefined
            : { animation: "riseIn 1000ms cubic-bezier(.16,1,.3,1) 1100ms both" }
        }
      >
        <Quoted text={t.joke} />
      </p>
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

// The joke, now a stage of /portal (not its own route). It still navigates to
// the RSVP itself (that hop IS cross-route); the opening -> joke hop is driven
// by the parent.
export function JokeScreen() {
  const nav = useScreenNav();
  const { locale, setLocale } = useLocale();
  // 0 title+joke · 1 surprised photo · 2 her + spotlight · 3 continue
  const [beat, setBeat] = useState(0);
  const [brooms, setBrooms] = useState(0);
  // every broom from this index up is on its way out; TARGET means none are
  const [exitFrom, setExitFrom] = useState(TARGET);
  // bumped on every release, purely to restart the idle wait
  const [idleTick, setIdleTick] = useState(0);
  const [step, setStep] = useState(34);
  const [narrow, setNarrow] = useState(false);
  // a desktop window that is short rather than narrow — the text block has to
  // give up room, otherwise the brooms have nowhere to grow
  const [short, setShort] = useState(false);
  const [herW, setHerW] = useState(0);
  const [broomW, setBroomW] = useState(0);
  const [stageH, setStageH] = useState(0);
  const drag = useRef<{ x: number; acc: number } | null>(null);
  const beatRef = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState(0);
  const t = COPY[locale];

  // Stage height differs per breakpoint, and the broom spacing is derived from
  // it so the full 30 always land inside the viewport.
  //
  // The stage is also CAPPED by where the joke text actually ends: the text
  // block keeps its size in a short window while a percentage-of-height stage
  // does not, so without the cap the brooms grow up through the paragraph.
  // The column is measured rather than estimated — its height changes with the
  // locale and with how the title wraps.
  useEffect(() => {
    const sync = () => {
      const isNarrow = window.innerWidth < 640;
      setNarrow(isNarrow);
      // tighten the text well before the stage would have to be capped — a
      // slightly smaller title costs less than a smaller cutout of her
      setShort(!isNarrow && window.innerHeight < 900);
      const wanted = window.innerHeight * (isNarrow ? 0.44 : 0.82);
      // measured off the hidden twin — the TALLER locale wins, so her size is
      // the same in FR and EN. The twins are absolutely positioned, so `top: 0`
      // lands on the padding BOX and their own rects skip the container's
      // padding-top; it has to be added back by hand.
      const mirror = mirrorRef.current;
      const twins = Array.from(mirror?.children ?? []) as HTMLElement[];
      const padTop = mirror
        ? parseFloat(getComputedStyle(mirror).paddingTop) || 0
        : 0;
      const colBottom = twins.length
        ? (mirror?.getBoundingClientRect().top ?? 0) +
          padTop +
          Math.max(...twins.map((c) => c.getBoundingClientRect().height))
        : 0;
      const headroom =
        (window.innerHeight - colBottom - TEXT_GAP) / BROOM_REACH;
      const sh = Math.max(
        isNarrow ? 180 : 240,
        Math.min(wanted, headroom),
      );
      const hw = sh * (742 / 1400); // the wider, broom-holding cutout
      const bw = sh * (BROOM_H_PCT / 100) * (236 / 1400);
      const stageLeft = window.innerWidth * 0.04;
      const room = window.innerWidth - stageLeft - hw - bw - 20;
      setStageH(sh);
      setHerW(hw);
      setBroomW(bw);
      // Narrow screens keep the accordion: fixed spacing, and the view pans so
      // the newest broom stays in frame while older ones slide off to the left.
      // Wide screens fit all thirty instead, because they can.
      setStep(isNarrow ? Math.max(16, bw * 0.5) : Math.max(6, room / (TARGET - 1)));
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
    // re-measured on each beat to catch late webfont metrics, and after the
    // short-window layout has been applied. Deliberately NOT on locale — the
    // measurement covers both languages, so her size must not move.
  }, [beat, short]);

  // beats arrive on their own; reaching 30 never gates moving on
  useEffect(() => {
    const ts = [
      setTimeout(() => setBeat(1), 2600),
      setTimeout(() => setBeat(2), 4400),
      setTimeout(() => setBeat(3), 7200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  // At 30 it holds, then the brooms leave one at a time.
  //
  // There is deliberately NO lock on input. An earlier version disabled
  // dragging during this sequence, guarded by a ref plus a timer — and React's
  // dev-mode double-invocation could cancel the timer while leaving the guard
  // set, which wedged the screen with "done" stuck true and dragging dead until
  // a reload. Now a press simply cancels the countdown instead.
  //
  // Leaving is a TRANSITION on a wrapper element, not an unmount: the broom
  // lifts and fades over EXIT_MS. That also makes cancelling free — the
  // brooms are still mounted, so they simply settle back down.
  const timers = useRef<{
    hold?: ReturnType<typeof setTimeout>;
    tick?: ReturnType<typeof setInterval>;
    clear?: ReturnType<typeof setTimeout>;
  }>({});
  const broomsRef = useRef(0);
  useEffect(() => {
    broomsRef.current = brooms;
  }, [brooms]);

  const stopCountdown = useCallback(() => {
    if (timers.current.hold) clearTimeout(timers.current.hold);
    if (timers.current.tick) clearInterval(timers.current.tick);
    if (timers.current.clear) clearTimeout(timers.current.clear);
    timers.current = {};
    setExitFrom(TARGET);
  }, []);

  // `hold` is how long the brooms sit there before folding away: a short beat
  // when the line is full, a longer one when the guest simply stopped halfway.
  const startCountdown = useCallback((hold = 1400) => {
    stopCountdown();
    timers.current.hold = setTimeout(() => {
      // from wherever the line actually got to, not always from 30
      let n = broomsRef.current;
      timers.current.tick = setInterval(() => {
        n -= 1;
        setExitFrom(Math.max(0, n));
        if (n <= 0) {
          if (timers.current.tick) clearInterval(timers.current.tick);
          timers.current.tick = undefined;
          // only drop them from the row once the last one has finished fading
          timers.current.clear = setTimeout(() => {
            setBrooms(0);
            setExitFrom(TARGET);
          }, EXIT_MS + 60);
        }
      }, EXIT_STEP_MS);
    }, hold);
  }, [stopCountdown]);

  // reaching 30 starts the countdown; letting go at 30 restarts it, so a press
  // that cancelled it never leaves the screen stuck full of brooms
  useEffect(() => {
    if (brooms >= TARGET) startCountdown();
  }, [brooms, startCountdown]);

  // Stopping halfway folds the brooms away too, just after a longer wait — the
  // screen tidies itself up instead of sitting on a stranded half-line. The
  // wait restarts on every broom, and on letting go (idleTick), and it will not
  // fire while a finger or the mouse is still down.
  useEffect(() => {
    if (brooms <= 0 || brooms >= TARGET) return;
    const id = setTimeout(() => {
      if (!drag.current) startCountdownRef.current(0);
    }, IDLE_FOLD_MS);
    return () => clearTimeout(id);
  }, [brooms, idleTick]);

  useEffect(() => () => stopCountdown(), [stopCountdown]);

  const startCountdownRef = useRef((_hold?: number) => {});
  useEffect(() => {
    startCountdownRef.current = startCountdown;
  }, [startCountdown]);

  useEffect(() => {
    beatRef.current = beat;
  }, [beat]);

  // Once the joke has landed, wait a few seconds before offering the way
  // forward — the pause leaves room to keep playing with the broom drag, and
  // the drag itself no longer risks navigating.
  const [showNext, setShowNext] = useState(false);
  const showNextRef = useRef(false);
  useEffect(() => {
    showNextRef.current = showNext;
  }, [showNext]);
  useEffect(() => {
    if (beat < 3) return;
    const id = setTimeout(() => setShowNext(true), 3200);
    return () => clearTimeout(id);
  }, [beat]);

  // Enter is a keyboard shortcut for the same arrow, once it is offered
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter" && showNextRef.current) {
        nav("/portal/rsvp", "left");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  // ONE set of listeners, attached for the life of the screen. Nothing is added
  // or removed per drag, nothing captures the pointer, and the guards are read
  // from refs — so there is no state left behind that can wedge a second drag.
  // Mouse events are handled too, because a browser that starts its own native
  // drag stops sending pointer events but keeps sending mouse ones.
  useEffect(() => {
    const advance = (dx: number) => {
      const d = drag.current;
      if (!d) return;
      // distance per broom scales to the viewport, so ~60% of a full-width swipe
      // reaches 30 on any screen. On a narrow phone the old fixed 26px needed
      // 780px of drag — more than the screen is wide — so it got stuck.
      const per = Math.min(
        DRAG_PER_BROOM,
        Math.max(9, (window.innerWidth * 0.6) / TARGET),
      );
      d.acc += dx;
      while (d.acc >= per) {
        d.acc -= per;
        setBrooms((b) => Math.min(TARGET, b + 1));
      }
      while (d.acc <= -per) {
        d.acc += per;
        setBrooms((b) => Math.max(0, b - 1));
      }
    };
    const move = (e: PointerEvent | MouseEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      d.x = e.clientX;
      advance(dx);
    };
    const end = () => {
      const wasDragging = !!drag.current;
      drag.current = null;
      if (!wasDragging) return;
      if (broomsRef.current >= TARGET) startCountdownRef.current();
      else setIdleTick((n) => n + 1); // restart the idle wait from the release
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("blur", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("blur", end);
    };
  }, []);

  const onDown = useCallback(
    (clientX: number) => {
      stopCountdown(); // a press always wins over the auto-clear
      if (beatRef.current < 2) return;
      drag.current = { x: clientX, acc: 0 };
    },
    [stopCountdown],
  );

  // The pan is MEASURED, not estimated: whatever the row actually is, we shift
  // it so its right edge lands just inside the viewport. Estimating from image
  // ratios kept leaving a gap on the right on narrow screens.
  useEffect(() => {
    if (!narrow) {
      setPan(0);
      return;
    }
    const row = rowRef.current;
    if (!row) return;
    const stageLeft = window.innerWidth * 0.04;
    const width = row.scrollWidth;
    setPan(Math.max(0, stageLeft + width + 10 - window.innerWidth));
  }, [brooms, narrow, step]);

  return (
    <div
      className="fixed inset-0 z-50 touch-none select-none overflow-hidden bg-[#030305]"
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={(e) => onDown(e.clientX)}
      onPointerDown={(e) => onDown(e.clientX)}
      onTouchStart={(e) => onDown(e.touches[0]?.clientX ?? 0)}
    >
      <style>{`
        img { -webkit-user-drag: none; user-select: none; }
        @keyframes twinkle { 0%,100% { opacity:.15 } 50% { opacity:1 } }
        @keyframes hint { 0%,100% { opacity:.3 } 50% { opacity:.85 } }
        /* the forward arrow (vertical middle, hard right): a soft fade-in, then
           a slow horizontal nudge. transforms keep the -50% vertical centring */
        @keyframes nextIn { from { opacity:0; transform: translate(8px, -50%) } to { opacity:1; transform: translate(0, -50%) } }
        @keyframes nextNudge { 0%,100% { transform: translate(0, -50%) } 50% { transform: translate(6px, -50%) } }
        .joke-next { animation: nextIn 700ms ease both, nextNudge 1.9s ease-in-out 700ms infinite; }
        @keyframes pop { 0%,58%,100% { opacity:0; transform: scale(.35) rotate(0deg) } 72%,86% { opacity:.9; transform: scale(1.1) rotate(20deg) } }
        @keyframes charIn { from { opacity:0; filter: blur(10px); transform: translateY(0.5em) } to { opacity:1; filter: blur(0px); transform: none } }
        @keyframes riseIn { from { opacity:0; filter: blur(12px); transform: translateY(26px) } to { opacity:1; filter: blur(0px); transform: none } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes floatA { 0%,100% { transform: translateY(-5px) } 50% { transform: translateY(5px) } }
        /* travels back towards the title rather than sitting in the corner —
           far enough to read as movement, short of landing on the words */
        @keyframes drift { 0%,100% { transform: translate(0,-10px) } 50% { transform: translate(-22px,14px) } }
        @media (min-width: 640px) {
          @keyframes drift { 0%,100% { transform: translate(0,-10px) } 50% { transform: translate(-40px,18px) } }
        }
        @keyframes tumble { to { transform: rotate(360deg) } }
        @keyframes broomIn { from { opacity:0; transform: translateY(50px) rotate(-14deg) } to { opacity:1; transform: none } }
      `}</style>

      <div className="rinaverse-bg pointer-events-none absolute inset-0">
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

      {/* the spotlight, arriving with her */}
      {beat >= 2 && (
        <div style={{ animation: "fadeIn 1200ms ease both" }}>
          <div
            className="pointer-events-none absolute left-[15%] top-0 -translate-x-1/2"
            style={{
              width: "min(64vw, 520px)",
              height: "100%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,.16), rgba(255,255,255,.05) 55%, transparent 88%)",
              clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)",
              filter: "blur(8px)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-[2%] left-[15%] -translate-x-1/2 rounded-[50%]"
            style={{
              width: "min(64vw, 520px)",
              height: 110,
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,.28), rgba(255,255,255,0) 70%)",
              filter: "blur(12px)",
            }}
          />
        </div>
      )}

      {/* editorial column: title, rule, note */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-12 sm:px-10 ${
          short ? "sm:pt-6" : "sm:pt-16"
        }`}
        style={{ animation: "floatA 10s ease-in-out infinite" }}
      >
        <div className="relative mx-auto max-w-[46rem]">
          <ColumnBody short={short} t={t} />
        </div>
      </div>

      {/* hidden twin of the column, one copy per locale, laid out identically.
          The stage is measured against the taller of the two so switching
          language never changes how big she is. */}
      <div
        aria-hidden
        ref={mirrorRef}
        className={`pointer-events-none invisible absolute inset-x-0 top-0 z-0 px-6 pt-12 sm:px-10 ${
          short ? "sm:pt-6" : "sm:pt-16"
        }`}
      >
        {(["fr", "en"] as const).map((l) => (
          <div
            key={l}
            className="absolute inset-x-0 top-0 mx-auto max-w-[46rem]"
          >
            <ColumnBody still short={short} t={COPY[l]} />
          </div>
        ))}
      </div>

      {/* the surprised photo — arrives second, tumbling slowly in space */}
      {beat >= 1 && (
        <div
          className="pointer-events-none absolute right-3 top-3 z-30 sm:right-8 sm:top-6"
          style={{ animation: "drift 9s ease-in-out infinite" }}
        >
          <div style={{ animation: "tumble 90s linear infinite" }}>
            <img
              draggable={false}
              alt=""
              className="w-[32vw] max-w-[178px] sm:max-w-[226px]"
              src={`/30ans/surprised-cutout-web.png${BUST}`}
              style={{ animation: "riseIn 1100ms cubic-bezier(.16,1,.3,1) both" }}
            />
          </div>
        </div>
      )}

      {/* her, and the growing line of brooms */}
      {beat >= 2 && (
        <div
          // w-max, because an absolutely positioned box otherwise shrink-to-fits
          // to the viewport: once the brooms outgrew it flex squeezed the row and
          // her cutout came out smaller the more brooms there were
          className="absolute bottom-0 left-[4%] z-10 w-max"
          style={{
            height: stageH,
            transform: `translateX(${-pan}px)`,
            transition: "transform 420ms cubic-bezier(.2,.9,.3,1)",
          }}
        >
          <div
            ref={rowRef}
            className="flex h-full w-max items-end"
            style={{ animation: "riseIn 1100ms cubic-bezier(.16,1,.3,1) both" }}
          >
            <div className="relative h-full shrink-0">
              {/* both photos are stacked and cross-faded, so picking up the
                  broom is a dissolve rather than a jump cut */}
              <img
                draggable={false}
                alt=""
                className="pointer-events-none h-full w-auto max-w-none opacity-0"
                src={`/30ans/cutout2-web.png${BUST}`}
                style={{ visibility: "hidden" }}
              />
              {[
                { src: `/30ans/cutout1-web.png${BUST}`, on: brooms === 0 },
                { src: `/30ans/cutout2-web.png${BUST}`, on: brooms > 0 },
              ].map((img) => (
                <img
                  draggable={false}
                  key={img.src}
                  alt=""
                  className="pointer-events-none absolute bottom-0 left-0 h-full w-auto max-w-none"
                  src={img.src}
                  style={{
                    opacity: img.on ? 1 : 0,
                    transition: "opacity 450ms ease",
                  }}
                />
              ))}

              {brooms === 0 && !narrow && (
                <p
                  className="pointer-events-none absolute left-full top-[47%] -ml-2 flex w-max items-center gap-2 text-xs uppercase leading-[1.9] tracking-[0.18em] text-white/70"
                  style={{ animation: "hint 1.9s ease-in-out infinite" }}
                >
                  <span className="text-lg leading-none">←</span>
                  <span className="whitespace-pre-line">{t.drag}</span>
                </p>
              )}
            </div>

            <div
              className="relative h-full shrink-0"
              style={{ width: brooms ? (brooms - 1) * step + broomW : 0 }}
            >
              {Array.from({ length: brooms }).map((_, i) => {
                const leaving = i >= exitFrom;
                return (
                  // the wrapper carries the exit, because an animation that
                  // ends on `transform: none` would otherwise stamp over it
                  <div
                    key={i}
                    className="pointer-events-none absolute"
                    style={{
                      height: `${BROOM_H_PCT}%`,
                      bottom: `${BROOM_BOTTOM_PCT}%`,
                      left: i * step,
                      transformOrigin: "bottom center",
                      opacity: leaving ? 0 : 1,
                      transform: leaving
                        ? `translateY(-${Math.round(stageH * 0.22)}px) rotate(${(rand(i, 11) - 0.5) * 26}deg) scale(.94)`
                        : "none",
                      filter: leaving ? "blur(3px)" : "blur(0px)",
                      transition: `opacity ${EXIT_MS}ms ease, transform ${EXIT_MS}ms cubic-bezier(.36,0,.24,1), filter ${EXIT_MS}ms ease`,
                    }}
                  >
                    <img
                      draggable={false}
                      alt=""
                      className="h-full w-auto max-w-none"
                      src="/30ans/broom-full-web.png"
                      style={{
                        transformOrigin: "bottom center",
                        animation: "broomIn 420ms cubic-bezier(.2,1.3,.4,1) both",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* mobile nudge: just past her hand, wrapped to the space that is left */}
      {beat >= 2 && brooms === 0 && narrow && (
        <p
          className="pointer-events-none absolute z-20 flex items-start gap-2 text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-white/70"
          style={{
            left: `calc(4% + ${herW * 0.82}px)`,
            bottom: stageH * 0.55,
            width: `calc(96vw - 4% - ${herW * 0.82}px - 10px)`,
            animation: "hint 1.9s ease-in-out infinite",
          }}
        >
          <span className="text-base leading-none">←</span>
          <span>{t.drag}</span>
        </p>
      )}

      {/* the way forward: a discreet, transparent arrow that fades in after a
          pause, so the broom drag gets a quiet moment to itself first */}
      {showNext && (
        <button
          aria-label={t.continue}
          className="joke-next absolute right-1 top-1/2 z-30 -translate-y-1/2 p-3 text-white/40 transition-colors hover:text-white/80 sm:right-2"
          onClick={() => nav("/portal/rsvp", "left")}
          type="button"
        >
          <svg aria-hidden fill="none" height="24" viewBox="0 0 40 24" width="40">
            <path
              d="M3 12h33M26 3l10 9-10 9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}

      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 scale-90 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
          >
            {locale === "fr" ? "🇫🇷 FR" : "EN"}
          </button>
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => {
              setBrooms(0);
              stopCountdown();
            }}
          >
            reset
          </button>
        </div>
      )}
    </div>
  );
}
