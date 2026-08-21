// PROTOTYPE — throwaway. Variant D: "Rinaverse" — built to the user's reference images.
// Real disco-ball PNG, brooms fly out in all directions and spin, liquid-chrome title.

import { useEffect, useState } from "react";
import { Anton, Bagel_Fat_One, Rubik_Bubbles } from "next/font/google";

const bagel = Bagel_Fat_One({ subsets: ["latin"], weight: "400" });
const bubbles = Rubik_Bubbles({ subsets: ["latin"], weight: "400" });
const anton = Anton({ subsets: ["latin"], weight: "400" });

export const nameD = "Rinaverse";

export const FONTS = [
  { key: "bagel", label: "Bagel Fat One", className: bagel.className },
  { key: "bubbles", label: "Rubik Bubbles", className: bubbles.className },
  { key: "anton", label: "Anton", className: anton.className },
];

// deterministic pseudo-random so the layout is stable across renders
const rand = (i: number, salt: number) =>
  (((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1;

// faint starfield — many small dots, low light
const STARS = Array.from({ length: 130 }).map((_, i) => ({
  left: rand(i, 1) * 100,
  top: rand(i, 2) * 100,
  size: 1 + rand(i, 3) * 2.4,
  opacity: 0.12 + rand(i, 4) * 0.4,
  delay: rand(i, 5) * 6,
  duration: 3 + rand(i, 6) * 4,
}));

// four-point star drawn as SVG — the ✦ glyph rendered as a dark blob in some
// font fallbacks, so the shape is explicit here.
function Sparkle({
  size,
  delay,
  left,
  top,
  calm,
}: {
  size: number;
  delay: number;
  left: number;
  top: number;
  calm: boolean;
}) {
  return (
    <svg
      className="pointer-events-none absolute"
      height={size}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        filter: "drop-shadow(0 0 6px rgba(255,255,255,.7))",
        animation: calm ? "none" : `pop 1.65s ease-in-out ${delay}s infinite`,
        opacity: calm ? 0.5 : undefined,
      }}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 0c.6 7.2 4.2 10.8 12 12-7.8 1.2-11.4 4.8-12 12-.6-7.2-4.2-10.8-12-12C7.8 10.8 11.4 7.2 12 0Z"
        fill="#fff"
      />
    </svg>
  );
}

// sparkle field for any chrome title
function TitleSparkles({
  points,
  calm,
}: {
  points: number[][];
  calm: boolean;
}) {
  return (
    <>
      {points.map(([x, y, size, delay], i) => (
        <Sparkle
          key={i}
          calm={calm}
          delay={delay}
          left={x}
          size={size}
          top={y}
        />
      ))}
    </>
  );
}

function FlyingBroom({ index, calm }: { index: number; calm: boolean }) {
  // golden-angle base keeps them evenly spread; jitter stops it looking regular
  const angle =
    ((index * 137.508 + (rand(index, 11) - 0.5) * 30) * Math.PI) / 180;
  const dist = 32 + rand(index, 12) * 26; // vmin — clears the ball, then spreads
  const dx = Math.cos(angle) * dist;
  const dy = Math.sin(angle) * dist * 0.82;

  // curve the flight: push sideways at the halfway point, perpendicular to travel
  const swirl = (rand(index, 19) - 0.5) * 26;
  const midX = dx * 0.5 - Math.sin(angle) * swirl;
  const midY = dy * 0.5 + Math.cos(angle) * swirl;

  const restY = dy + 3 + rand(index, 18) * 9; // gravity settle
  const spinDir = rand(index, 20) > 0.5 ? 1 : -1;
  const spin = spinDir * (220 + rand(index, 13) * 700);
  const scale = 0.5 + rand(index, 14) * 0.65;
  const dur = 850 + rand(index, 15) * 800;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20"
      style={
        {
          "--mx": `${midX}vmin`,
          "--my": `${midY}vmin`,
          "--dx": `${dx}vmin`,
          "--dy": `${dy}vmin`,
          "--dy2": `${restY}vmin`,
          "--rotMid": `${spin * 0.45}deg`,
          "--rot": `${spin}deg`,
          "--rot2": `${spin * 1.12}deg`,
          "--scale": scale,
          animation: calm
            ? "fadeIn 240ms ease-out both"
            : `flyOut ${dur}ms cubic-bezier(.16,.7,.32,1) both`,
        } as React.CSSProperties
      }
    >
      <img
        alt=""
        className="w-14 max-w-none sm:w-20 lg:w-24 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        src="/30ans/broom.png"
        style={{
          animation: calm
            ? "none"
            : `drift ${4 + rand(index, 16) * 4}s ease-in-out ${
                rand(index, 17) * 2
              }s infinite alternate`,
        }}
      />
    </div>
  );
}

export function VariantD({
  count,
  done,
  onTap,
  fontIndex = 0,
  locale = "fr",
}: {
  count: number;
  done: boolean;
  onTap: () => void;
  fontIndex?: number;
  locale?: "fr" | "en";
}) {
  const font = FONTS[fontIndex % FONTS.length];
  const [showContinue, setShowContinue] = useState(false);
  const [calm, setCalm] = useState(false); // Q7: prefers-reduced-motion

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCalm(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // let the confetti finish before inviting the next tap
  useEffect(() => {
    if (!done) {
      setShowContinue(false);
      return;
    }
    const t = setTimeout(() => setShowContinue(true), 2500);
    return () => clearTimeout(t);
  }, [done]);
  const nearly = count >= 15 && !done; // the "encore un peu…" nudge
  const shaking = count >= 24 && !done; // the ball only rattles at the very end
  const progress = count / 30;

  // softer halo, used on every chrome title
  const titleGlow =
    "drop-shadow(0 0 4px rgba(255,255,255,.20)) drop-shadow(0 0 16px rgba(226,232,240,.13)) drop-shadow(0 0 40px rgba(255,214,107,.08))";

  // hero title sits a touch fainter than the payoff
  const heroGlow =
    "drop-shadow(0 0 4px rgba(255,255,255,.12)) drop-shadow(0 0 16px rgba(226,232,240,.08)) drop-shadow(0 0 40px rgba(255,214,107,.05))";

  const chrome: React.CSSProperties = {
    background:
      "linear-gradient(178deg,#ffffff 0%,#eef3f7 10%,#a9b7c3 26%,#39424c 44%,#8f9ea9 50%,#ffffff 57%,#c6d2dc 66%,#5c6873 82%,#222930 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter:
      "drop-shadow(0 1px 0 rgba(255,255,255,.55)) drop-shadow(0 6px 14px rgba(0,0,0,.85))",
  };

  return (
    <div
      className="relative flex h-full w-full select-none flex-col items-center overflow-hidden bg-[#030305]"
      onPointerDown={onTap}
    >
      <style>{`
        @keyframes flyOut {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(.15); opacity:0 }
          16%  { opacity:1 }
          46%  { transform: translate(calc(-50% + var(--mx)), calc(-50% + var(--my))) rotate(var(--rotMid)) scale(calc(var(--scale) * .88)); opacity:1 }
          72%  { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)) scale(var(--scale)); opacity:1 }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy2))) rotate(var(--rot2)) scale(var(--scale)); opacity:1 }
        }
        @keyframes drift { from { transform: translateY(-5px) rotate(-6deg) } to { transform: translateY(5px) rotate(6deg) } }
        @keyframes twinkle { 0%,100% { opacity:.15 } 50% { opacity:1 } }
        @keyframes hang { 0%,100% { transform: rotate(-1.2deg) } 50% { transform: rotate(1.2deg) } }
        @keyframes shake { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-3px,2px)} 40%{transform:translate(3px,-2px)} 60%{transform:translate(-2px,-3px)} 80%{transform:translate(2px,3px)} }
        @keyframes confetti { from { transform: translate(0,0) rotate(0); opacity:1 } to { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity:0 } }
        @keyframes flash { from { opacity:.85 } to { opacity:0 } }
        @keyframes spinSlow { to { transform: rotate(360deg) } }
        @keyframes hint { 0%,100% { opacity:.35 } 50% { opacity:.9 } }
        @keyframes fadeIn { from { opacity:0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy2))) rotate(var(--rot2)) scale(var(--scale)) } to { opacity:1; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy2))) rotate(var(--rot2)) scale(var(--scale)) } }
        @keyframes landIn { 0% { opacity:0; transform: scale(.55) } 100% { opacity:1; transform: scale(1) } }
        @keyframes pop { 0%,58%,100% { opacity:0; transform: scale(.35) rotate(0deg) } 72%,86% { opacity:.6; transform: scale(1.1) rotate(20deg) } }
      `}</style>

      {/* starfield */}
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
              animation: calm
                ? "none"
                : `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* restrained halo behind the ball */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200 blur-[110px]"
        style={{
          width: 220 + progress * 120,
          height: 220 + progress * 120,
          opacity: 0.03 + progress * 0.12,
          transition: "all 300ms ease-out",
        }}
      />

      {/* chrome title — stacked v3 on mobile, one-line v2.1 from sm up */}
      <div
        className="relative z-10 flex w-full justify-center"
        style={{
          opacity: done ? 0 : 1,
          pointerEvents: done ? "none" : undefined,
          transition: "opacity 900ms ease-out",
        }}
      >
        {/* mobile: stacked */}
        <div className="relative mt-6 w-[62%] max-w-[280px] sm:hidden">
          <img
            alt="Enter the Rinaverse"
            className="w-full"
            src="/30ans/title-chrome-v3.png"
            style={{ filter: heroGlow }}
          />
          <TitleSparkles
            calm={calm}
            points={[
              [8, 12, 14, 0],
              [78, 8, 12, 0.9],
              [16, 62, 13, 1.5],
              [88, 58, 15, 0.5],
              [46, 44, 10, 2.1],
              [33, 6, 11, 1.2],
              [62, 70, 13, 0.3],
              [4, 40, 10, 2.6],
              [95, 30, 12, 1.8],
            ]}
          />
        </div>

        {/* desktop: one line */}
        <div className="relative mt-12 hidden w-[74%] max-w-[680px] px-2 sm:block lg:max-w-[820px]">
          <img
            alt="Enter the Rinaverse"
            className="w-full"
            src="/30ans/title-chrome-v21.png"
            style={{ filter: heroGlow }}
          />
          <TitleSparkles
            calm={calm}
            points={[
              [10, 18, 15, 0],
              [37, 66, 12, 0.7],
              [58, 12, 13, 1.4],
              [83, 58, 16, 0.4],
              [24, 80, 11, 1.8],
              [70, 76, 12, 1.1],
              [48, 30, 10, 2.2],
              [93, 22, 13, 1.6],
              [3, 62, 11, 0.9],
              [30, 8, 12, 2],
              [64, 44, 10, 0.2],
              [77, 6, 13, 2.5],
            ]}
          />
        </div>
      </div>

      {/* the ball */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* brooms burst from the ball's centre */}
        {!done &&
          Array.from({ length: count }).map((_, i) => (
            <FlyingBroom key={i} calm={calm} index={i} />
          ))}

        {!done && (
          <div
            className="relative"
            style={{
              animation: calm
                ? "none"
                : shaking
                  ? "shake 200ms linear infinite"
                  : "hang 5s ease-in-out infinite",
              transformOrigin: "top center",
            }}
          >
            <img
              alt="disco ball"
              className="w-52 sm:w-72 lg:w-[24rem]"
              src="/30ans/disco-ball.png"
              style={{
                filter: `drop-shadow(0 0 ${
                  20 + progress * 60
                }px rgba(203,213,225,${0.2 + progress * 0.5}))`,
                transform: `scale(${1 + progress * 0.07})`,
                transition: "transform 240ms ease-out, filter 240ms ease-out",
              }}
            />
          </div>
        )}

        {/* the explosion */}
        {done && (
          <>
            <div
              className="pointer-events-none absolute h-40 w-40 rounded-full bg-white blur-2xl"
              style={{ animation: "flash 700ms ease-out forwards" }}
            />
            {Array.from({ length: calm ? 40 : 260 }).map((_, i) => {
              const a = rand(i, 21) * Math.PI * 2;
              const d = 110 + rand(i, 22) * 340;
              // silver + gold only
              const colors = [
                "#f8fafc",
                "#cbd5e1",
                "#94a3b8",
                "#ffe9a8",
                "#ffd66b",
                "#d4a017",
              ];
              const sparkle = i % 4 === 0;
              return (
                <span
                  key={i}
                  className="pointer-events-none absolute"
                  style={
                    {
                      "--dx": `${Math.cos(a) * d}px`,
                      "--dy": `${Math.sin(a) * d + 140}px`,
                      "--rot": `${rand(i, 23) * 1080}deg`,
                      width: sparkle ? 8 : 5,
                      height: sparkle ? 8 : 11,
                      borderRadius: sparkle ? "50%" : 1,
                      background: colors[i % colors.length],
                      boxShadow: sparkle
                        ? `0 0 8px ${colors[i % colors.length]}`
                        : "none",
                      animation: `confetti ${
                        1100 + rand(i, 24) * 1400
                      }ms cubic-bezier(.15,.8,.3,1) forwards`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
            {/* payoff title — chrome PNG, one per language */}
            <div className="relative z-10 w-[86%] max-w-[420px] sm:max-w-[620px] lg:max-w-[720px]">
              <img
                alt={locale === "fr" ? "30 balais !" : "30 brooms !"}
                className="w-full"
                src={
                  locale === "fr"
                    ? "/30ans/30-balais.png"
                    : "/30ans/30-brooms.png"
                }
                style={{
                  animation: "landIn 620ms cubic-bezier(.2,1.5,.4,1) both",
                  filter: titleGlow,
                }}
              />
              <TitleSparkles
                calm={calm}
                points={[
                  [7, 20, 15, 0.3],
                  [44, 74, 12, 0.9],
                  [72, 14, 14, 1.4],
                  [92, 60, 12, 1.9],
                  [28, 52, 10, 1.2],
                  [58, 40, 11, 0.6],
                  [16, 78, 13, 1.7],
                  [84, 30, 11, 2.3],
                ]}
              />
            </div>
          </>
        )}
      </div>

      <p
        className="z-10 mb-24 mx-auto max-w-[92vw] px-4 text-center text-xs uppercase leading-relaxed tracking-[0.35em] text-white/40 sm:mb-14 sm:text-sm"
        style={{
          animation:
            done && !showContinue
              ? "none"
              : done
                ? "hint 1.8s ease-in-out infinite"
                : "twinkle 2.4s ease-in-out infinite",
        }}
      >
        {done
          ? showContinue
            ? locale === "fr"
              ? "Appuie ou tape sur Entrée pour continuer"
              : "Tap or hit Enter to continue"
            : ""
          : count === 0
            ? locale === "fr"
              ? "Appuie ou tape sur Entrée pour commencer"
              : "Tap or hit Enter to start"
            : nearly
              ? locale === "fr"
                ? "encore un peu…"
                : "almost there…"
              : ""}
      </p>
    </div>
  );
}
