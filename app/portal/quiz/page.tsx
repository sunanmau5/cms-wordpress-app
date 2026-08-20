// PROTOTYPE — throwaway route. Activity: the quiz.
// Ten questions, one right answer each, and EVERY answer carries its own note
// shown once it's picked — right or wrong.

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Instrument_Serif, Rye } from "next/font/google";

import { BackToHub } from "../BackToHub";
import { useLocale } from "../locale";

import { INTRO, SCORES } from "./content";
import { QUESTIONS } from "./questions";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
// the circus slab — only for the hero, nothing else
const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;

// the bulbs running along the top and bottom of the sign
const BULBS = 13;

const rand = (i: number, salt: number) =>
  Math.round(
    ((((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1) * 1e4,
  ) / 1e4;

const COPY = {
  fr: {
    title: "Le quiz",
    of: "sur",
    start: "C'est parti !",
    next: "Question suivante",
    finish: "Voir mon score",
    answerIs: "Bonne réponse",
    scoreTitle: "Ton score",
    again: "Recommencer",
  },
  en: {
    title: "The quiz",
    of: "of",
    start: "Let's go!",
    next: "Next question",
    finish: "See my score",
    answerIs: "Correct answer",
    scoreTitle: "Your score",
    again: "Play again",
  },
};

export default function QuizScreen() {
  const { locale, setLocale } = useLocale();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  // opening sequence: 0 background · 1 bunting · 2 title centred · 3 title
  // rises, card in, sunburst turns · 4 explanations
  const [beat, setBeat] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const centredTop = useRef<number | null>(null);
  const [flip, setFlip] = useState(0);
  const [gliding, setGliding] = useState(false);
  const [medal, setMedal] = useState(false);
  // Below this the card cannot hold a question, four answers and a button at a
  // readable size — so the page is allowed to scroll instead of squeezing the
  // answers into an 85px slot.
  const [tallEnough, setTallEnough] = useState(true);
  // A 13" laptop is wide but short: the pinned card was sized for phones and
  // leaves the answers a ~356px slot, so the last one never lands on screen.
  // On these only, the chrome around the answers is tightened.
  const [compact, setCompact] = useState(false);
  const t = COPY[locale];

  const q = QUESTIONS[i];
  const last = i === QUESTIONS.length - 1;
  const celebrate = picked !== null && !done && !!q.options[picked].correct;

  const pick = useCallback(
    (n: number) => {
      if (picked !== null) return; // locked once answered
      setPicked(n);
      if (q.options[n].correct) setScore((s) => s + 1);
    },
    [picked, q],
  );

  const next = useCallback(() => {
    if (last) {
      setDone(true);
      return;
    }
    setI((n) => n + 1);
    setPicked(null);
  }, [last]);

  const restart = () => {
    setMedal(false);
    setStarted(true); // back to question 1, not the intro
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  useEffect(() => {
    if (started) return;
    const ts = [
      setTimeout(() => setBeat(1), 400),
      setTimeout(() => setBeat(2), 1500),
      setTimeout(() => setBeat(3), 4000),
      setTimeout(() => setBeat(4), 4850),
    ];
    return () => ts.forEach(clearTimeout);
  }, [started]);

  // FLIP: the card genuinely is not in the page until beat 3, so the title is
  // centred on its own. Remember where it sat, let the card mount and shove it
  // up, then put it back where it was and animate the difference away.
  useLayoutEffect(() => {
    if (beat < 3 && !started) {
      centredTop.current = heroRef.current?.getBoundingClientRect().top ?? null;
    }
  }, [beat, started]);

  useLayoutEffect(() => {
    if (started || beat !== 3 || centredTop.current === null) return;
    const now = heroRef.current?.getBoundingClientRect().top ?? 0;
    const delta = centredTop.current - now;
    if (!delta) return;
    setGliding(false);
    setFlip(delta);
    const id = requestAnimationFrame(() => {
      setGliding(true);
      setFlip(0);
    });
    return () => cancelAnimationFrame(id);
  }, [beat, started]);

  // full marks: let them read the score first, then the medal drops in
  const perfect = done && score === QUESTIONS.length;
  useEffect(() => {
    if (!perfect) return;
    const id = setTimeout(() => setMedal(true), 1100);
    return () => clearTimeout(id);
  }, [perfect]);

  useEffect(() => {
    const check = () => {
      setTallEnough(window.innerHeight >= 660);
      setCompact(window.innerHeight < 800 && window.innerWidth >= 640);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // five bands: nought and full marks get their own line
  const verdict = useMemo(() => {
    const n = QUESTIONS.length;
    const m = SCORES[locale];
    if (score === 0) return m.zero;
    if (score === n) return m.perfect;
    const r = score / n;
    return r < 0.4 ? m.low : r < 0.8 ? m.mid : m.high;
  }, [score, locale]);

  return (
    <div className="quiz fixed inset-0 z-50 overflow-y-auto">
      <BackToHub />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Light yellow ground with rays firing out from behind the card —
           tone-on-tone, no rainbow: the reference's colours would fight the
           red and the green/red answers. */
        /* The still part of the ground — the wash and the centre glow never
           move, so only the rays need to rotate. */
        .quiz {
          background:
            radial-gradient(circle at 50% 50%, rgba(255,252,240,.95) 0%, rgba(255,250,232,.55) 26%, rgba(255,250,232,0) 52%),
            radial-gradient(circle at 50% 50%, #fffdf4 0%, #fdf6e0 55%, #f6e8c8 100%);
        }
        /* A square of 220vmax centred on the screen: whatever the aspect ratio,
           its edges stay well outside the viewport at every angle. A
           viewport-sized box scaled 1.9x only just covered 16:10, which is why
           a straight seam appeared in the corners mid-turn. */
        .stripes {
          position: fixed;
          left: 50%;
          top: 50%;
          width: 220vmax;
          height: 220vmax;
          transform: translate(-50%, -50%);
          background: repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(226,196,132,.42) 0deg 4.5deg,
            rgba(226,196,132,0) 4.5deg 9deg
          );
        }
        /* the centring translate must ride along in the keyframes */
        @keyframes rayTurn {
          from { transform: translate(-50%, -50%) rotate(0deg) }
          to   { transform: translate(-50%, -50%) rotate(360deg) }
        }
        .turning { animation: rayTurn 90s linear infinite; }
        /* only the play state changes, so the rays stop where they are rather
           than snapping back to zero */
        .paused { animation-play-state: paused; }
        @keyframes bulb { 0%,100% { opacity:.35; box-shadow: 0 0 0 rgba(214,58,48,0) } 50% { opacity:1; box-shadow: 0 0 10px rgba(255,170,60,.95) } }
        @keyframes swing { 0%,100% { transform: rotate(-1.1deg) } 50% { transform: rotate(1.1deg) } }
        @keyframes signPop {
          0%   { opacity: 0; transform: scale(.82) rotate(-2.5deg) }
          35%  { opacity: .55; transform: scale(.97) rotate(-.8deg) }
          65%  { opacity: 1; transform: scale(1.045) rotate(.9deg) }
          100% { opacity: 1; transform: scale(1) rotate(0deg) }
        }
        @keyframes signWiggle {
          0%,100% { transform: rotate(-2.4deg) }
          50%     { transform: rotate(2.4deg) }
        }
        /* the card arrives without the blur the other screens use — at this
           size it read as a hard snap */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(.985) }
          to   { opacity: 1; transform: none }
        }
        @keyframes spinSlow { to { transform: rotate(360deg) } }
        /* the medal swings in on its ribbon, overshoots, then settles */
        @keyframes medalDrop {
          0%   { opacity: 0; transform: translateY(-120px) rotate(-16deg) scale(.7) }
          55%  { opacity: 1; transform: translateY(10px) rotate(7deg) scale(1.06) }
          75%  { transform: translateY(-4px) rotate(-4deg) scale(.99) }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1) }
        }
        @keyframes medalSway {
          0%,100% { transform: rotate(-3deg) }
          50%     { transform: rotate(3deg) }
        }
        /* a highlight sweeping across the face of the disc */
        @keyframes shine {
          0%   { transform: translateX(-140%) rotate(18deg); opacity: 0 }
          35%  { opacity: .85 }
          100% { transform: translateX(140%) rotate(18deg); opacity: 0 }
        }
        @keyframes flap { 0%,100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2.5deg) } }
        @keyframes riseIn { from { opacity:0; filter: blur(10px); transform: translateY(20px) } to { opacity:1; filter: blur(0px); transform: none } }
        @keyframes noteIn { from { opacity:0; transform: translateY(-6px) } to { opacity:1; transform: none } }
        @keyframes pop { 0%,58%,100% { opacity:0; transform: scale(.35) rotate(0deg) } 72%,86% { opacity:.9; transform: scale(1.1) rotate(20deg) } }
        .quiz, .quiz * { cursor: auto; }
        .quiz button { cursor: pointer; }
        .quiz button:disabled { cursor: default; }
        /* the arrow to the next question: lives outside the card */
        .next-arrow {
          animation: arrowIn 420ms cubic-bezier(.2,1.3,.4,1) both;
          transition: transform 220ms cubic-bezier(.2,1.3,.4,1), box-shadow 220ms ease;
        }
        .next-arrow:hover { box-shadow: 0 10px 30px rgba(214,58,48,.6); }
        /* the mobile placement keeps its half-off-the-rim offset while it pops */
        @keyframes arrowIn {
          from { opacity: 0; transform: scale(.6) }
          to   { opacity: 1; transform: scale(1) }
        }
        /* the desktop placement keeps its centring transform while it pops */
        @media (min-width: 640px) {
          @keyframes arrowIn {
            from { opacity: 0; transform: translateX(calc(100% + 18px)) translateY(-50%) scale(.6) }
            to   { opacity: 1; transform: translateX(calc(100% + 18px)) translateY(-50%) scale(1) }
          }
          .next-arrow:hover {
            transform: translateX(calc(100% + 18px)) translateY(-50%) scale(1.08);
            box-shadow: 0 10px 30px rgba(214,58,48,.6);
          }
        }
        /* a soft fade at the foot of the scroller, hinting there is more */
        .quiz-scroll {
          -webkit-mask-image: linear-gradient(180deg, #000 0, #000 calc(100% - 26px), transparent 100%);
          mask-image: linear-gradient(180deg, #000 0, #000 calc(100% - 26px), transparent 100%);
          scrollbar-width: thin;
        }
        .opt { transition: transform 220ms cubic-bezier(.2,1.2,.4,1), border-color 220ms ease, background 220ms ease, box-shadow 220ms ease; }
        .opt:not(:disabled):hover {
          transform: translateX(4px);
          border-color: rgba(200,50,44,.65);
          box-shadow: 0 6px 18px rgba(150,60,50,.12);
        }

        /* LED indicators: a dark bezel with a flat lens sunk in it. Unlit until
           the answer is given, then the lens fires and throws light around it.
           Flat and emissive on purpose — a gloss highlight made them read as
           billiard balls. */
        /* Warm brass bezel, not charcoal — it has to belong on a cream card. */
        .buzzer-base {
          border-radius: 999px;
          padding: 3px;
          background: linear-gradient(180deg, #e6d5b4 0%, #c1a97f 100%);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,.75),
            inset 0 -1px 2px rgba(120,85,40,.35),
            0 1px 2px rgba(140,100,50,.3);
        }
        .buzzer-dome {
          border-radius: 999px;
          /* unlit lens: a dulled bulb, still light */
          background: radial-gradient(circle at 50% 45%, #f4ead4 0%, #d9c8a6 58%, #bda887 100%);
          box-shadow: inset 0 0 5px rgba(120,90,45,.35);
          transition: background 220ms ease, box-shadow 260ms ease, color 200ms ease;
        }
        .opt:not(:disabled):hover .buzzer-dome {
          background: radial-gradient(circle at 50% 45%, #fffaea 0%, #eadcbc 58%, #cdb894 100%);
        }
        /* Lit, but mid-tone rather than white-hot: a blown-out centre swallowed
           the letter sitting on it. */
        .dome-right {
          background: radial-gradient(circle at 50% 42%, #6fce9b 0%, #35a468 48%, #1d7146 100%);
          box-shadow:
            inset 0 0 4px rgba(255,255,255,.35),
            0 0 8px rgba(53,164,104,.6),
            0 0 18px rgba(53,164,104,.32);
        }
        .dome-wrong {
          background: radial-gradient(circle at 50% 42%, #f0887c 0%, #d24d40 48%, #98261d 100%);
          box-shadow:
            inset 0 0 4px rgba(255,255,255,.3),
            0 0 8px rgba(210,77,64,.6),
            0 0 18px rgba(210,77,64,.32);
        }

        /* the card reacts to the answer */
        @keyframes cheer {
          0% { transform: none }
          25% { transform: translateY(-10px) rotate(.7deg) }
          50% { transform: translateY(0) rotate(-.5deg) }
          70% { transform: translateY(-4px) rotate(.3deg) }
          100% { transform: none }
        }
        @keyframes nope {
          0%,100% { transform: none }
          12% { transform: translateX(-10px) rotate(-.6deg) }
          28% { transform: translateX(9px) rotate(.6deg) }
          44% { transform: translateX(-7px) rotate(-.4deg) }
          60% { transform: translateX(5px) rotate(.3deg) }
          80% { transform: translateX(-2px) }
        }
        /* it's the answer that reacts, not the card */
        .opt-right { animation: cheer 700ms cubic-bezier(.2,1.1,.3,1) both; }
        .opt-wrong { animation: nope 620ms ease-in-out both; }

        /* confetti thrown out from behind the card on a right answer */
        @keyframes burst {
          0%   { opacity: 0; transform: translate(0,0) rotate(0deg) scale(.5) }
          12%  { opacity: 1 }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1) }
        }
        .confetto { animation: burst 1400ms cubic-bezier(.15,.75,.3,1) both; }

        /* trim: bulbs around the card and a run of bunting over the top */
        @keyframes flap { 0%,100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2.5deg) } }
      `,
        }}
      />

      <div
        className={`stripes pointer-events-none ${
          started || beat >= 3 ? "turning" : ""
        } ${started ? "paused" : ""}`}
      />

      {/* Bunting slung corner to corner across the whole screen, sagging in the
          middle. Flags follow the curve and hang straight down from it. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-[5] ${
          started && !done
            ? /* on a short screen the sign lands 72px down, inside a 96px
                 bunting band — so the bunting is what gives way, not the sign,
                 whose position is the intro's FLIP target */
              compact
              ? "h-16"
              : "h-16 sm:h-24"
            : "h-24 sm:h-40"
        }`}
        style={{
          transform: started || beat >= 1 ? "translateY(0)" : "translateY(-110%)",
          opacity: started || beat >= 1 ? 1 : 0,
          transition: "transform 1200ms cubic-bezier(.22,.61,.36,1), opacity 900ms ease",
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M0,2 Q50,64 100,2"
            fill="none"
            stroke="rgba(160,110,50,.45)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {Array.from({ length: 21 }).map((_, n) => {
          const t = n / 20;
          // the same quadratic the string is drawn with, so flags sit on it
          const y = 2 * (1 - t) ** 2 + 64 * 2 * t * (1 - t) + 2 * t ** 2;
          return (
            <span
              key={n}
              className="absolute block h-5 w-4"
              style={{
                left: `${t * 100}%`,
                top: `${y}%`,
                marginLeft: -8,
                background: ["#d63a30", "#f0b73f", "#3f9f7f", "#e8836a"][n % 4],
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                animation: `flap 2.8s ease-in-out ${(n % 5) * 0.2}s infinite`,
              }}
            />
          );
        })}
      </div>

      <div
        className={`relative mx-auto flex max-w-[46rem] flex-col px-6 sm:px-10 ${
          started && !done && tallEnough
            ? "h-full py-4 sm:py-6"
            : started && !done
              ? "min-h-full py-6"
              : compact
              ? "min-h-full py-6"
              : "min-h-full py-14"
        }`}
      >
        {/* m-auto, not justify-center: centring a flex column clips the
            top once the content is taller than the viewport */}
        <div className={`w-full ${started && !done && tallEnough ? "flex h-full min-h-0 flex-col" : "m-auto"}`}>
        {/* the hero sign, swinging very slightly, bulbs chasing along it */}
        <div
          ref={heroRef}
          className={`shrink-0 text-center ${
            started && !done
              ? compact
                /* the sign's top margin is NOT part of the compact tightening:
                   the bunting is 96px tall while the quiz runs, so pulling the
                   sign up lands it in the flags */
                ? "mb-4 mt-9 sm:mb-2 sm:mt-10"
                : "mb-4 mt-9 sm:mb-5 sm:mt-10"
              : compact
              ? "mb-6 mt-8 sm:mt-10"
              : "mb-12 mt-16 sm:mt-28"
          }`}
          style={{
            transform: `translateY(${flip}px)`,
            transition: gliding
              ? "transform 1250ms cubic-bezier(.22,.61,.36,1)"
              : "none",
          }}
        >
        {(started || beat >= 2) && (
        <div
          style={{
            animation:
              started || beat >= 3
                ? "swing 6s ease-in-out infinite"
                : "signPop 1150ms cubic-bezier(.25,.9,.3,1) both, signWiggle 640ms ease-in-out 1150ms 2",
          }}
        >
          <div
            className={`relative inline-block ${
              started && !done ? "px-6 py-2.5" : "px-9 py-5"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 rounded-[1.25rem] border-2 border-[#d63a30]/35" />
            {(["top", "bottom"] as const).map((edge) =>
              Array.from({ length: BULBS }).map((_, n) => (
                <span
                  key={`${edge}-${n}`}
                  className="pointer-events-none absolute h-2 w-2 rounded-full bg-[#ffb43c]"
                  style={{
                    left: `${((n + 0.5) / BULBS) * 100}%`,
                    [edge]: -4,
                    animation: `bulb 1.6s ease-in-out ${(n % 5) * 0.18}s infinite`,
                  }}
                />
              )),
            )}
            <h1
              className={`${FUNFAIR} uppercase leading-none tracking-[0.04em] text-[#d63a30] ${
                started && !done ? "text-[1.3rem] sm:text-[1.9rem]" : "text-[1.85rem] sm:text-[3rem]"
              }`}
              style={{
                // the fairground sign: cream inner highlight, then a stack of
                // darker reds under it so the letters sit up off the canvas
                textShadow:
                  "0 1px 0 rgba(255,245,235,.85), 0 3px 0 #a8281f, 0 5px 0 #8d1f18, 0 8px 14px rgba(140,40,30,.35)",
              }}
            >
              Rina Quiz
            </h1>
          </div>
        </div>
        )}
        </div>

        {/* the presenter's card: everything the guest reads sits on it */}
        <div
          className={`relative mx-auto w-full ${
            started && !done && tallEnough ? "flex min-h-0 flex-1 flex-col" : ""
          }`}
        >
          {/* thrown from the middle of the card, behind it, so the pieces
              appear to come out from its edges */}
          {celebrate && (
            <div
              key={`burst-${i}`}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0"
            >
              {Array.from({ length: 30 }).map((_, n) => {
                const a = rand(n, 71) * Math.PI * 2;
                const d = 180 + rand(n, 72) * 260;
                return (
                  <span
                    key={n}
                    className="confetto absolute left-1/2 top-1/2 block h-2.5 w-1.5 rounded-[1px]"
                    style={
                      {
                        background: ["#d63a30", "#f0b73f", "#3f9f7f", "#e8836a", "#fff3d6"][n % 5],
                        animationDelay: `${(n % 6) * 40}ms`,
                        "--dx": `${Math.cos(a) * d}px`,
                        "--dy": `${Math.sin(a) * d - 60}px`,
                        "--rot": `${(rand(n, 73) - 0.5) * 900}deg`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          )}

        {!started && beat >= 3 && (
          <div
            className="card relative z-10 mx-auto w-full rounded-[2.25rem] border-2 border-[#d63a30]/25 bg-[#fffdf4] px-6 py-8 shadow-[0_22px_60px_rgba(160,100,40,.20)] sm:px-10 sm:py-10"
            style={{ animation: "cardIn 900ms cubic-bezier(.22,.61,.36,1) both" }}
          >
            <div
              style={{
                opacity: beat >= 4 ? 1 : 0,
                transform: beat >= 4 ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 800ms ease, transform 800ms cubic-bezier(.22,.61,.36,1)",
              }}
            >
            {/* a fixed column, so all three lines share one left edge —
                w-max sized the block to its longest line, which put that edge
                somewhere arbitrary */}
            <div className="mx-auto max-w-[30rem]">
            <ul className="space-y-4">
              {INTRO[locale].map((line) => (
                <li key={line} className="flex items-center gap-4">
                  {/* the same lamp the answers use */}
                  <span aria-hidden className="buzzer-base grid h-9 w-9 shrink-0 place-items-center">
                    <span className="buzzer-dome h-full w-full" />
                  </span>
                  <span className={`${SERIF} text-[1.05rem] leading-snug text-[#2b1512] sm:text-[1.25rem]`}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <button
                className="rounded-full bg-[#d63a30] px-10 py-4 text-[12px] uppercase tracking-[0.2em] text-[#fff6ef] shadow-[0_6px_20px_rgba(214,58,48,.35)] transition-transform hover:scale-[1.04]"
                onClick={() => setStarted(true)}
              >
                {t.start}
              </button>
            </div>
            </div>
            </div>
          </div>
        )}

        {started && !done && picked !== null && (
          <button
            aria-label={last ? t.finish : t.next}
            /* mobile: sitting on the card's bottom-right rim, half on and half off,
               so it belongs to the card rather than to the screen and can never
               come down over the notes */
            className="next-arrow absolute bottom-4 right-4 z-[60] grid h-12 w-12 place-items-center rounded-full bg-[#d63a30] text-[#fff6ef] shadow-[0_8px_24px_rgba(214,58,48,.45)] sm:bottom-auto sm:right-0 sm:top-1/2 sm:h-16 sm:w-16 sm:translate-x-[calc(100%+18px)] sm:-translate-y-1/2"
            onClick={next}
            title={last ? t.finish : t.next}
          >
            <svg className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 12h15m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        )}

        {started && (
        <div
          className={`card relative z-10 mx-auto flex w-full flex-col rounded-[2.25rem] border-2 border-[#d63a30]/25 bg-[#fffdf4] shadow-[0_22px_60px_rgba(160,100,40,.20)] ${
            started && !done && tallEnough
              ? `min-h-0 flex-1 px-5 py-6 sm:px-8 ${compact ? "sm:py-4" : "sm:py-7"}`
              : "px-6 py-8 sm:px-10 sm:py-10"
          }`}
        >
        {started && !done && (
          <div
            key={i}
            className="flex min-h-0 flex-1 flex-col"
            style={{ animation: "riseIn 500ms cubic-bezier(.16,1,.3,1) both" }}
          >
            <div className="shrink-0">
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#a8281f]/70">
              {i + 1} {t.of} {QUESTIONS.length}
            </p>

            {/* how far along, without a number to read */}
            <div className="mt-4 h-px w-full bg-[#d63a30]/15">
              <div
                className="h-px bg-[#d63a30] transition-[width] duration-500"
                style={{ width: `${((i + (picked !== null ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* once answered the question shrinks: it has done its job, and
                the room goes to the answers */}
            <h1
              className={`${SERIF} leading-[1.15] text-[#2b1512] transition-all duration-500 ${
                picked === null
                  ? "mt-6 text-[1.3rem] sm:text-[1.7rem]"
                  : "mt-4 text-[1.05rem] text-[#2b1512]/75 sm:text-[1.25rem]"
              }`}
            >
              {q[locale]}
            </h1>

            {/* a printer's rule: line, diamond, line */}
            <div
              aria-hidden
              className={`flex items-center gap-3 overflow-hidden text-[#d63a30]/45 transition-all duration-500 ${
                picked === null ? "mt-6 max-h-6 opacity-100" : "mt-3 max-h-0 opacity-0"
              }`}
            >
              <span className="h-px flex-1 bg-current" />
              <svg fill="none" height="9" viewBox="0 0 40 9" width="40">
                <path d="M20 .5 24 4.5 20 8.5 16 4.5z" fill="currentColor" />
                <path d="M8 4.5 11 2v5zM32 4.5 29 2v5z" fill="currentColor" />
              </svg>
              <span className="h-px flex-1 bg-current" />
            </div>
            </div>

            {/* only this part scrolls, so the question stays put above it and
                the button stays put below */}
            <div
              /* mb-7 on mobile, not pb-7: the 28px the arrow's on-card half
                 covers must be card, not scrollable text passing underneath */
              className={`-mr-2 mb-12 space-y-3 pr-2 sm:mb-0 ${
                compact ? "mt-5 sm:mt-3 sm:space-y-2" : "mt-5"
              } ${
                started && !done && tallEnough
                  ? "quiz-scroll min-h-0 flex-1 overflow-y-auto"
                  : ""
              }`}
            >
              {q.options.map((o, n) => {
                const isPicked = picked === n;
                const reveal = picked !== null;
                const showAsRight = reveal && o.correct;
                const showAsWrong = reveal && isPicked && !o.correct;
                return (
                  <div key={n} data-correct={o.correct ? "true" : undefined}>
                    <button
                      className={`opt flex w-full items-center gap-4 rounded-xl border px-3.5 py-2.5 text-left ${compact ? "sm:py-1" : ""} ${
                        isPicked ? (o.correct ? "opt-right" : "opt-wrong") : ""
                      } ${
                        showAsRight
                          ? "border-emerald-600/70 bg-emerald-500/10"
                          : showAsWrong
                            ? "border-[#d63a30]/70 bg-[#d63a30]/10"
                            : reveal
                              ? "border-[#2b1512]/10 opacity-45"
                              : "border-[#2b1512]/20 bg-white/55"
                      }`}
                      disabled={reveal}
                      onClick={() => pick(n)}
                    >
                      <span className={`buzzer-base grid h-8 w-8 shrink-0 place-items-center ${compact ? "sm:h-7 sm:w-7" : ""}`}>
                        <span
                          className={`buzzer-dome grid h-full w-full place-items-center text-[12px] font-bold tracking-wider ${
                            showAsRight
                              ? "dome-right text-white"
                              : showAsWrong
                                ? "dome-wrong text-white"
                                : "text-[#8a7550]"
                          }`}
                          style={
                            showAsRight || showAsWrong
                              ? { textShadow: "0 1px 2px rgba(0,0,0,.45)" }
                              : undefined
                          }
                        >
                          {String.fromCharCode(65 + n)}
                        </span>
                      </span>
                      <span className={`${SERIF} text-[1.25rem] text-[#2b1512] ${compact ? "sm:text-[1.15rem]" : "sm:text-[1.4rem]"}`}>
                        {o[locale]}
                      </span>
                    </button>

                    {/* every note, not just the picked one — the wrong answers
                        are where the jokes are */}
                    {reveal && (
                      <p
                        className={`mt-1.5 pl-[2.7rem] pr-1 text-[0.8rem] leading-[1.45] ${
                          isPicked || o.correct ? "text-[#2b1512]/75" : "text-[#2b1512]/50"
                        }`}
                        style={{ animation: `noteIn 320ms ease ${n * 70}ms both` }}
                      >
                        {locale === "fr" ? o.noteFr : o.noteEn}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {done && (
          <div
            className="text-center"
            style={{ animation: "riseIn 600ms cubic-bezier(.16,1,.3,1) both" }}
          >
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#a8281f]/70">
              {t.scoreTitle}
            </p>

            {/* full marks only: the medal drops in a beat after the score */}
            {medal && (
              <div
                aria-label="10 / 10"
                className="relative mx-auto mt-6 h-[124px] w-[104px]"
                style={{ animation: "medalDrop 1100ms cubic-bezier(.24,1.25,.36,1) both" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    animation: "medalSway 3.4s ease-in-out 1100ms infinite",
                    transformOrigin: "50% 8%",
                  }}
                >
                  {/* ribbon */}
                  <span
                    className="absolute left-1/2 top-0 block h-16 w-6 -translate-x-[22px]"
                    style={{ background: "linear-gradient(180deg,#d63a30,#a8281f)", transform: "rotate(12deg)" }}
                  />
                  <span
                    className="absolute left-1/2 top-0 block h-16 w-6 translate-x-[-2px]"
                    style={{ background: "linear-gradient(180deg,#e8836a,#c0342a)", transform: "rotate(-12deg)" }}
                  />
                  {/* disc */}
                  <span
                    className="absolute bottom-0 left-1/2 grid h-[78px] w-[78px] -translate-x-1/2 place-items-center overflow-hidden rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 34% 28%, #fff6d4 0%, #edc45c 42%, #c9973a 72%, #a87a2c 100%)",
                      boxShadow:
                        "inset 0 2px 4px rgba(255,255,255,.8), inset 0 -4px 8px rgba(120,80,20,.45), 0 6px 16px rgba(140,100,30,.45)",
                    }}
                  >
                    <span
                      className="absolute inset-[7px] rounded-full"
                      style={{ boxShadow: "inset 0 0 0 2px rgba(255,246,214,.55)" }}
                    />
                    <span className={`${FUNFAIR} relative text-[1.45rem] leading-none text-[#7a5518]`}>
                      10
                    </span>
                    {/* the shine sweep */}
                    <span
                      className="pointer-events-none absolute inset-y-[-40%] left-0 w-8 bg-white/70 blur-[3px]"
                      style={{ animation: "shine 2.6s ease-in-out 1500ms infinite" }}
                    />
                  </span>
                </div>
              </div>
            )}
            <p className={`${SERIF} mt-4 text-[4.5rem] leading-none text-[#d63a30] sm:text-[6rem]`}>
              {score}
              <span className="text-[#2b1512]/30">/{QUESTIONS.length}</span>
            </p>
            <p
              className={`${SERIF} mx-auto mt-6 max-w-[30rem] text-[1.3rem] leading-[1.45] text-[#2b1512]/85 sm:text-[1.55rem]`}
            >
              {verdict}
            </p>
            <button
              className="mt-10 rounded-full border-2 border-[#d63a30]/45 px-8 py-3.5 text-[12px] uppercase tracking-[0.2em] text-[#a8281f] transition-colors hover:border-[#d63a30] hover:bg-[#d63a30]/10"
              onClick={restart}
            >
              {t.again}
            </button>
          </div>
        )}
        </div>
        )}
        </div>
        </div>
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
          >
            {locale === "fr" ? "🇫🇷 FR" : "EN"}
          </button>
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={restart}
          >
            reset
          </button>
        </div>
      )}
    </div>
  );
}
