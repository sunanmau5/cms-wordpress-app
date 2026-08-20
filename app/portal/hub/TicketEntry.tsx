// PROTOTYPE — throwaway route. The gate before RINA-LAND: a ticket machine you
// press, a ticket that prints out of the slot, then the ticket full screen.
//
// Vintage circus poster palette from the user's references: cream, pillar-box
// red, navy, gold. Rye for display, Instrument Serif for the small print.

"use client";

import { useCallback, useEffect, useState } from "react";
import { Instrument_Serif, Rye } from "next/font/google";

import { useLocale } from "../locale";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;

const COPY = {
  fr: {
    invite: "Approche…",
    press: "Appuie pour ton billet",
    printing: "Impression…",
    here: "Voici ton billet !",
    admit: "Admet une personne",
    entry: "Vers Rina-Land",
    date: "Pass VIP, valable toute la journée",
    general: "Entrée générale",
    no: "Billet n°",
  },
  en: {
    invite: "Step right up…",
    press: "Press for your ticket",
    printing: "Printing…",
    here: "Here's your ticket!",
    admit: "Admit one",
    entry: "Enter Rina-Land",
    date: "VIP pass, valid all day",
    general: "General admission",
    no: "Ticket no.",
  },
};

type Phase = "idle" | "printing" | "ticket";

// The ticket machine, now the entry stage of the hub route. Instead of
// navigating, it calls onEnter() after the spin, so the parent swaps to the hub
// content in place (same chapter, same fairground).
export function TicketEntry({ onEnter }: { onEnter: () => void }) {
  const { locale, setLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("idle");
  // leaving to the hub: spin the ticket a few turns, fade it, then hand off so
  // the hub content mounts and its entrances pop in
  const [leaving, setLeaving] = useState(false);
  const toHub = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onEnter, 1150);
  }, [leaving, onEnter]);
  const t = COPY[locale];

  const press = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("printing");
  }, [phase]);

  useEffect(() => {
    if (phase !== "printing") return;
    // the ticket takes 2.1s to come out of the slot before it flies up
    const id = setTimeout(() => setPhase("ticket"), 2400);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <div
      className={`tick fixed inset-0 z-50 overflow-hidden${
        leaving ? " leaving" : ""
      }`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tick { background: #f7ead0; }
        /* the poster's ray burst, red on cream */
        .rays {
          position: fixed; left: 50%; top: 50%;
          width: 240vmax; height: 240vmax;
          transform: translate(-50%, -50%);
          z-index: 0;
          background: repeating-conic-gradient(from 0deg at 50% 50%,
            #d1372f 0deg 6deg, rgba(209,55,47,0) 6deg 12deg);
          opacity: .16;
        }
        @keyframes rayTurn {
          from { transform: translate(-50%,-50%) rotate(0) }
          to   { transform: translate(-50%,-50%) rotate(360deg) }
        }
        .rays { animation: rayTurn 160s linear infinite; }

        @keyframes bulb { 0%,100% { opacity:.4 } 50% { opacity:1 } }
        @keyframes shake {
          0%,100% { transform: translate(0,0) rotate(0) }
          20% { transform: translate(-3px,1px) rotate(-.8deg) }
          45% { transform: translate(3px,-1px) rotate(.8deg) }
          70% { transform: translate(-2px,0) rotate(-.5deg) }
        }
        .machine-shake { animation: shake .38s ease-in-out 5; }
        @keyframes press { 0%,100% { transform: translateY(0) } 40% { transform: translateY(5px) } }
        .btn-press { animation: press .3s ease-out; }

        /* the ticket creeping out of the slot */
        @keyframes feed {
          from { transform: translate(-50%, -86%) }
          to   { transform: translate(-50%, 26%) }
        }
        .feeding { animation: feed 2.1s cubic-bezier(.35,.02,.3,1) both; }

        /* then it flies up and fills the screen */
        @keyframes present {
          from { opacity: 0; transform: translateY(40px) scale(.82) rotate(-3deg) }
          to   { opacity: 1; transform: none }
        }
        .presented { animation: present 620ms cubic-bezier(.2,1.15,.3,1) both; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        .fade-up { animation: fadeUp 520ms ease both; }

        /* leaving to the hub: the ticket spins a few turns then fades out, while
           the cream + rays world stays put. The prompt + button fade first. */
        @keyframes ticketSpinAway {
          0%   { transform: perspective(1400px) rotateY(0deg) scale(1); opacity: 1; }
          72%  { transform: perspective(1400px) rotateY(1080deg) scale(1); opacity: 1; }
          100% { transform: perspective(1400px) rotateY(1260deg) scale(0.82); opacity: 0; }
        }
        .tick.leaving .presented { animation: ticketSpinAway 1150ms cubic-bezier(0.45, 0, 0.25, 1) forwards; }
        .tick.leaving .fade-up { opacity: 0; transition: opacity 250ms ease; pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
          .rays, .machine-shake, .btn-press, .feeding, .presented, .fade-up { animation: none }
          .feeding { transform: translate(-50%, 26%) }
        }
        .tick, .tick * { cursor: auto; }
        .tick button, .tick a { cursor: pointer; }
      `,
        }}
      />

      <div aria-hidden className="rays" />

      {phase !== "ticket" ? (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
          <p
            className={`${FUNFAIR} mb-6 text-[1.2rem] tracking-wide text-[#c4302b] sm:text-[1.6rem]`}
          >
            {phase === "printing" ? t.printing : t.invite}
          </p>

          {/* the machine */}
          <div
            className={
              phase === "printing" ? "machine-shake relative" : "relative"
            }
          >
            <svg
              className="block w-[16rem] sm:w-[19rem]"
              height="300"
              viewBox="0 0 240 300"
              width="240"
            >
              {/* canopy */}
              <path
                d="M14 44 120 8l106 36z"
                fill="#c4302b"
                stroke="#3a2118"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              {Array.from({ length: 7 }).map((_, i) => (
                <circle
                  key={i}
                  cx={30 + i * 30}
                  cy={46 + Math.abs(3 - i) * 2}
                  fill="#f2c14e"
                  r="5"
                  stroke="#3a2118"
                  strokeWidth="3"
                  style={{
                    animation: `bulb 1.2s ease-in-out ${i * 130}ms infinite`,
                  }}
                />
              ))}
              {/* body */}
              <rect
                fill="#f7ead0"
                height="220"
                rx="14"
                stroke="#3a2118"
                strokeWidth="4"
                width="196"
                x="22"
                y="56"
              />
              {/* red panel */}
              <rect
                fill="#c4302b"
                height="86"
                rx="8"
                stroke="#3a2118"
                strokeWidth="4"
                width="164"
                x="38"
                y="72"
              />
              <text
                className={FUNFAIR}
                fill="#f7ead0"
                fontSize="21"
                textAnchor="middle"
                x="120"
                y="112"
              >
                RINA-LAND
              </text>
              <text
                className={SERIF}
                fill="#f2c14e"
                fontSize="15"
                textAnchor="middle"
                x="120"
                y="138"
              >
                {t.admit}
              </text>

              {/* the button */}
              <g className={phase === "printing" ? "btn-press" : undefined}>
                <circle cx="120" cy="192" fill="#3a2118" r="30" />
                <circle
                  cx="120"
                  cy="188"
                  fill="#e8462f"
                  r="27"
                  stroke="#3a2118"
                  strokeWidth="4"
                />
                <circle cx="112" cy="180" fill="#fff" opacity=".35" r="7" />
              </g>

              {/* the slot */}
              <rect
                fill="#3a2118"
                height="12"
                rx="3"
                width="120"
                x="60"
                y="240"
              />
              <rect
                fill="#f7ead0"
                height="4"
                opacity=".25"
                rx="2"
                width="104"
                x="68"
                y="244"
              />
              <path
                d="M50 268h140"
                opacity=".35"
                stroke="#3a2118"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>

            {/* the ticket feeding out of the slot */}
            {phase === "printing" && (
              <div
                aria-hidden
                className="feeding absolute left-1/2 top-[80%] w-[13rem] sm:w-[15rem]"
                style={{ zIndex: -1 }}
              >
                <MiniTicket copy={t} locale={locale} />
              </div>
            )}
          </div>

          {phase === "idle" && (
            <button
              className={`${FUNFAIR} mt-8 rounded-full border-[3px] border-[#3a2118] bg-[#f2c14e] px-7 py-3 text-[0.95rem] text-[#3a2118] shadow-[4px_4px_0_#3a2118] transition-transform hover:-translate-y-0.5 sm:text-[1.1rem]`}
              onClick={press}
            >
              {t.press}
            </button>
          )}
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5">
          <p
            className={`${FUNFAIR} fade-up mb-5 text-[1.4rem] text-[#c4302b] sm:text-[2rem]`}
          >
            {t.here}
          </p>

          <div className="presented w-full max-w-[44rem]">
            <BigTicket copy={t} locale={locale} />
          </div>

          <button
            className={`${FUNFAIR} fade-up mt-7 rounded-full border-[3px] border-[#3a2118] bg-[#c4302b] px-7 py-3 text-[0.95rem] text-[#f7ead0] shadow-[4px_4px_0_#3a2118] transition-transform hover:-translate-y-0.5 sm:text-[1.05rem]`}
            onClick={toHub}
            style={{ animationDelay: "420ms" }}
            type="button"
          >
            {t.entry} →
          </button>
        </div>
      )}

      <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
        <button
          className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
          onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
        >
          {locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
        <button
          className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-neutral-200"
          onClick={() => setPhase("idle")}
        >
          reset
        </button>
      </div>
    </div>
  );
}

/* the ticket as it appears coming out of the slot — same design, small */
function MiniTicket({
  copy,
  locale,
}: {
  copy: (typeof COPY)["fr"];
  locale: "fr" | "en";
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border-[3px] border-[#c4302b] bg-[#fdf3d8] px-3 py-2.5">
      <p className={`${FUNFAIR} text-center text-[0.8rem] text-[#c4302b]`}>
        RINA-LAND
      </p>
      <p className={`${SERIF} text-center text-[0.7rem] text-[#3a2118]/70`}>
        {copy.date}
      </p>
      <div className="mt-1.5 flex justify-center gap-[3px]">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="block h-3 bg-[#3a2118]"
            style={{ width: i % 3 ? 1 : 2.5 }}
          />
        ))}
      </div>
      <p className="sr-only">{locale}</p>
    </div>
  );
}

/* the full-screen ticket: stub, sunburst cartouche, barcode */
function BigTicket({
  copy,
  locale,
}: {
  copy: (typeof COPY)["fr"];
  locale: "fr" | "en";
}) {
  return (
    <div className="rounded-[18px] border-[6px] border-[#c4302b] bg-[#c4302b] p-2 shadow-[0_18px_50px_rgba(90,30,20,.28)]">
      <div className="flex overflow-hidden rounded-[10px] bg-[#fdf3d8]">
        {/* main panel */}
        <div className="relative flex-1 p-3 sm:p-5">
          <div
            className="relative overflow-hidden rounded-[6px] border-2 border-[#c4302b] p-4 sm:p-6"
            style={{
              background:
                "repeating-conic-gradient(from 0deg at 50% 50%, #c4302b 0deg 7deg, #fdf3d8 7deg 14deg)",
            }}
          >
            {/* the cartouche */}
            <div className="mx-auto max-w-[22rem] rounded-[36%_36%_36%_36%/22%_22%_22%_22%] border-2 border-[#c4302b] bg-[#fdf3d8] px-5 py-4 text-center">
              <p
                className={`${FUNFAIR} text-[1.4rem] leading-none text-[#c4302b] sm:text-[2.1rem]`}
              >
                RINA-LAND
              </p>
              <p
                className={`${SERIF} mt-2 text-[0.95rem] text-[#3a2118]/80 sm:text-[1.1rem]`}
              >
                ✦ {copy.admit} ✦
              </p>
              <p
                className={`${SERIF} mt-1 text-[0.85rem] text-[#3a2118]/60 sm:text-[0.95rem]`}
              >
                {copy.date}
              </p>
            </div>
          </div>
        </div>

        {/* perforation */}
        <div className="relative w-0 border-l-[3px] border-dashed border-[#c4302b]/70" />

        {/* stub */}
        <div className="flex w-[5.5rem] shrink-0 items-center justify-center gap-2 p-2 sm:w-[8rem] sm:p-3">
          <p
            className={`${SERIF} whitespace-nowrap text-[0.7rem] uppercase tracking-[0.2em] text-[#c4302b] sm:text-[0.8rem]`}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {copy.general}
          </p>
          <div className="flex h-[70%] items-stretch gap-[2px]">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="block bg-[#3a2118]"
                style={{ width: i % 3 ? 2 : 4 }}
              />
            ))}
          </div>
          <p className="sr-only">
            {copy.no} 30-{locale.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
