// PROTOTYPE — throwaway. Variant C: "Arcade 84" — retro arcade, brooms orbit in a ring, score HUD.

import { Broom } from "./broom";

export const nameC = "Arcade 84";

export function VariantC({
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
      className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden bg-[#120024]"
      onPointerDown={onTap}
    >
      {/* horizon grid */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,0,170,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(255,0,170,0.55) 2px, transparent 2px)",
          backgroundSize: "60px 40px",
          transform: "perspective(300px) rotateX(62deg)",
          transformOrigin: "bottom",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-52 w-52 -translate-x-1/2 rounded-full bg-orange-500/30 blur-3xl" />

      {/* score HUD */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 font-mono text-xs tracking-widest text-cyan-300">
        <span>BROOMS</span>
        <span className="tabular-nums">
          {String(count).padStart(2, "0")} / 30
        </span>
      </div>

      {/* orb + orbiting brooms */}
      <div className="relative flex h-72 w-72 items-center justify-center">
        <div
          className="absolute h-full w-full rounded-full border-2 border-cyan-400/30"
          style={{
            transform: `rotate(${count * 12}deg)`,
            transition: "transform 240ms linear",
          }}
        >
          {Array.from({ length: count }).map((_, i) => {
            const angle = (i / 30) * 360;
            return (
              <Broom
                key={i}
                className="absolute left-1/2 top-1/2 h-9 w-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                style={{
                  transform: `rotate(${angle}deg) translateY(-140px)`,
                }}
              />
            );
          })}
        </div>

        <div
          className="h-32 w-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #fff 0%, #fde68a 20%, #fb7185 55%, #7c2d92 100%)",
            boxShadow: "0 0 60px 12px rgba(251,113,133,0.6)",
            transform: done ? "scale(1.4)" : "scale(1)",
            transition: "transform 300ms ease-out",
          }}
        />
      </div>

      <h1
        className="mt-10 font-mono text-4xl font-bold uppercase tracking-tight sm:text-5xl"
        style={{
          background: "linear-gradient(#fff 35%, #22d3ee 60%, #a21caf 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {done ? "30 brooms!" : "30 brooms"}
      </h1>

      <p className="mt-6 font-mono text-sm uppercase tracking-[0.3em] text-cyan-300">
        {done ? (
          "▶ continue"
        ) : (
          <span className="animate-pulse">press enter to play</span>
        )}
      </p>
    </div>
  );
}
