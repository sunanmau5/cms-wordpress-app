// PROTOTYPE — throwaway. Variant B: "Papier Fête" — light paper/scrapbook, brooms collect on a shelf.

import { Broom } from "./broom";

export const nameB = "Papier Fête";

export function VariantB({
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
      className="relative flex h-full w-full select-none flex-col items-center justify-between overflow-hidden bg-[#fdf6e8] px-6 pb-24 pt-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      {/* ticker */}
      <div className="w-full max-w-md">
        <div className="flex items-end justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            balais récoltés
          </span>
          <span className="font-sans text-3xl font-black text-neutral-900">
            {count}
            <span className="text-neutral-400">/30</span>
          </span>
        </div>
        <div className="mt-2 h-4 w-full rounded-full border-[3px] border-neutral-900 bg-white p-[2px]">
          <div
            className="h-full rounded-full bg-[#ff5c8a]"
            style={{
              width: `${(count / 30) * 100}%`,
              transition: "width 220ms ease-out",
            }}
          />
        </div>
      </div>

      {/* the ball as a paper sticker */}
      <div className="relative flex flex-col items-center">
        <div
          className="relative h-36 w-36 rounded-full border-[5px] border-neutral-900 sm:h-44 sm:w-44"
          style={{
            background:
              "conic-gradient(#ffd66b 0 25%, #ff5c8a 0 50%, #7dd3fc 0 75%, #a78bfa 0)",
            transform: done
              ? "rotate(14deg) scale(1.25)"
              : `rotate(${count * 6}deg)`,
            transition: "transform 260ms cubic-bezier(.34,1.56,.64,1)",
            boxShadow: "8px 8px 0 rgba(0,0,0,0.9)",
          }}
        >
          <div className="absolute inset-4 rounded-full border-[3px] border-neutral-900 bg-[#fdf6e8]" />
        </div>

        <h1 className="mt-8 whitespace-pre-line text-center font-sans text-4xl font-black leading-none text-neutral-900 sm:text-5xl">
          {done ? "30 BALAIS !" : "TAPE POUR\nCOMMENCER"}
        </h1>

        <button
          className="mt-6 rounded-full border-[4px] border-neutral-900 bg-[#ffd66b] px-10 py-4 text-lg font-black uppercase tracking-wide text-neutral-900 active:translate-x-[3px] active:translate-y-[3px]"
          style={{ boxShadow: "5px 5px 0 rgba(0,0,0,0.9)" }}
          onPointerDown={onTap}
        >
          {done ? "→ suite" : "tape !"}
        </button>
      </div>

      {/* the shelf */}
      <div className="w-full max-w-lg">
        <div className="flex min-h-[3.5rem] flex-wrap items-end justify-center gap-x-[2px] gap-y-1 border-b-[5px] border-neutral-900 pb-1">
          {Array.from({ length: count }).map((_, i) => (
            <Broom
              key={i}
              className="h-14 w-4 shrink-0 text-neutral-900"
              style={{ transform: `rotate(${((i * 13) % 17) - 8}deg)` }}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-neutral-500">
          ou appuie sur entrée
        </p>
      </div>
    </div>
  );
}
