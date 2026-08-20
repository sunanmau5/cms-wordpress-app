// PROTOTYPE — throwaway. Variant A: "Club Nuit" — dark nightclub, brooms burst radially.

import { Broom } from "./broom";

export const nameA = "Club Nuit";

export function VariantA({
  count,
  done,
  onTap,
}: {
  count: number;
  done: boolean;
  onTap: () => void;
}) {
  return (
    <div
      className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden bg-[#0a0616]"
      onPointerDown={onTap}
    >
      {/* light beams */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-1/2 h-[200vh] w-[26vw] -translate-x-1/2 -translate-y-1/2 rotate-[24deg] bg-gradient-to-b from-transparent via-fuchsia-500/20 to-transparent blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-[200vh] w-[18vw] -translate-x-1/2 -translate-y-1/2 -rotate-[38deg] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-[200vh] w-[12vw] -translate-x-1/2 -translate-y-1/2 rotate-[70deg] bg-gradient-to-b from-transparent via-violet-400/20 to-transparent blur-2xl" />
      </div>

      {/* brooms burst outward from the ball */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
        {Array.from({ length: count }).map((_, i) => {
          const angle = (i * 137.5) % 360;
          const dist = 90 + ((i * 37) % 190);
          return (
            <Broom
              key={i}
              className="absolute h-10 w-5 text-fuchsia-300 drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]"
              style={{
                transform: `rotate(${angle}deg) translate(${dist}px) rotate(${angle * 2}deg)`,
                transition: "transform 500ms cubic-bezier(.2,1.4,.4,1)",
              }}
            />
          );
        })}
      </div>

      {/* the ball */}
      <div className="relative">
        <div
          className="h-40 w-40 rounded-full sm:h-52 sm:w-52"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #fff 0%, #d8b4fe 18%, #7c3aed 55%, #2e1065 100%)",
            backgroundSize: "100% 100%, 14px 14px",
            boxShadow:
              "0 0 90px 20px rgba(217,70,239,0.45), inset -12px -18px 40px rgba(0,0,0,0.6)",
            transform: done ? "scale(1.35)" : `scale(${1 + count * 0.008})`,
            transition: "transform 300ms ease-out",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      <p className="z-10 mt-14 font-sans text-6xl font-black tracking-tight text-white sm:text-7xl">
        {count}
      </p>
      <p className="z-10 mt-1 text-xs uppercase tracking-[0.35em] text-fuchsia-300/80">
        {done ? "30 balais !" : "brooms"}
      </p>
      <p className="z-10 mt-10 animate-pulse text-sm text-white/50">
        {done ? "…" : "tap · or press enter"}
      </p>
    </div>
  );
}
