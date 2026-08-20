// DEV-ONLY editor for the Birthday Fit positions.
// Drag a piece to move it, use the sliders for size and tilt, then Save — it
// writes straight into accessories.ts, so no more reading numbers out loud.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PHOTO, SLOTS } from "../accessories";

type Pos = { x: number; y: number; w: number; rot: number };

const ALL = SLOTS.flatMap((s) => s.items.map((i) => ({ ...i, slot: s.id })));

export default function FitEditor() {
  const [pos, setPos] = useState<Record<string, Pos>>(() =>
    Object.fromEntries(ALL.map((i) => [i.id, { x: i.x, y: i.y, w: i.w, rot: i.rot }])),
  );
  const [active, setActive] = useState(ALL[0].id);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; ox: number; oy: number } | null>(null);

  const item = ALL.find((i) => i.id === active)!;
  const p = pos[active];

  const set = (id: string, patch: Partial<Pos>) =>
    setPos((all) => ({ ...all, [id]: { ...all[id], ...patch } }));

  const onDown = (id: string) => (e: React.PointerEvent) => {
    const box = frameRef.current!.getBoundingClientRect();
    setActive(id);
    drag.current = {
      id,
      ox: ((e.clientX - box.left) / box.width) * 100 - pos[id].x,
      oy: ((e.clientY - box.top) / box.height) * 100 - pos[id].y,
    };
    (e.target as Element).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const box = frameRef.current!.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 100 - drag.current.ox;
    const y = ((e.clientY - box.top) / box.height) * 100 - drag.current.oy;
    set(drag.current.id, { x: Math.round(x), y: Math.round(y) });
  };

  const onUp = () => { drag.current = null; };

  // arrow keys nudge the selected piece by one point, shift for five
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 5 : 1;
      const map: Record<string, Partial<Pos>> = {
        ArrowLeft: { x: p.x - step }, ArrowRight: { x: p.x + step },
        ArrowUp: { y: p.y - step }, ArrowDown: { y: p.y + step },
      };
      if (map[e.key]) { e.preventDefault(); set(active, map[e.key]); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, p]);

  const save = useCallback(async () => {
    setSaving("saving");
    const res = await fetch("/api/fit-positions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: ALL.map((i) => ({ id: i.id, ...pos[i.id] })) }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) { setSaving("saved"); setMsg(`written: ${(json.written ?? []).length} pieces`); }
    else { setSaving("error"); setMsg(json.error ?? "failed"); }
    setTimeout(() => setSaving("idle"), 2500);
  }, [pos]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-100 p-4 text-neutral-900">
      <div className="mx-auto flex max-w-[74rem] flex-col gap-6 lg:flex-row">
        {/* the portrait — drag anything on it */}
        <div className="mx-auto w-full max-w-[26rem] shrink-0">
          <div ref={frameRef} className="relative" onPointerMove={onMove} onPointerUp={onUp}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="block w-full select-none rounded-xl" draggable={false} src={PHOTO.src} />
            {ALL.map((i) => {
              const q = pos[i.id];
              const on = i.id === active;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i.id}
                  alt=""
                  className={`absolute cursor-grab select-none touch-none active:cursor-grabbing ${
                    on ? "outline-dashed outline-2 outline-sky-500" : "opacity-25 hover:opacity-60"
                  }`}
                  draggable={false}
                  onPointerDown={onDown(i.id)}
                  src={i.src}
                  style={{
                    left: `${q.x}%`,
                    top: `${q.y}%`,
                    width: `${q.w}%`,
                    transform: `translateX(-50%) rotate(${q.rot}deg)`,
                    zIndex: on ? 20 : 10,
                  }}
                />
              );
            })}
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Drag to move · arrow keys nudge (shift = 5) · only the selected piece is solid
          </p>
        </div>

        {/* controls */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Birthday Fit — positions</h1>
          <p className="mb-4 text-sm text-neutral-600">
            Dev only. Save writes straight into <code>accessories.ts</code>.
          </p>

          <div className="mb-4 flex flex-wrap gap-1">
            {ALL.map((i) => (
              <button
                key={i.id}
                className={`rounded-full border px-3 py-1 text-sm ${
                  i.id === active ? "border-sky-600 bg-sky-600 text-white" : "border-neutral-300 bg-white"
                }`}
                onClick={() => setActive(i.id)}
              >
                {i.fr}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-300 bg-white p-4">
            <p className="mb-3 text-sm font-semibold">{item.fr}</p>
            {([
              ["size", "w", 5, 120],
              ["tilt", "rot", -45, 45],
              ["x", "x", -20, 120],
              ["y", "y", -40, 120],
            ] as const).map(([label, key, lo, hi]) => (
              <label key={key} className="mb-3 block text-sm">
                <span className="mb-1 flex justify-between text-neutral-600">
                  <span>{label}</span>
                  <code>{p[key]}</code>
                </span>
                <input
                  className="w-full"
                  max={hi}
                  min={lo}
                  onChange={(e) => set(active, { [key]: Number(e.target.value) } as Partial<Pos>)}
                  type="range"
                  value={p[key]}
                />
              </label>
            ))}

            <button
              className="mt-2 w-full rounded-lg bg-neutral-900 px-4 py-2 font-semibold text-white disabled:opacity-50"
              disabled={saving === "saving"}
              onClick={save}
            >
              {saving === "saving" ? "Saving…" : saving === "saved" ? "Saved ✓" : "Save all positions"}
            </button>
            {msg && (
              <p className={`mt-2 text-sm ${saving === "error" ? "text-red-600" : "text-neutral-600"}`}>{msg}</p>
            )}
          </div>

          <pre className="mt-4 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-[11px] text-neutral-100">
{ALL.map((i) => `${i.id}: x ${pos[i.id].x}, y ${pos[i.id].y}, w ${pos[i.id].w}, rot ${pos[i.id].rot}`).join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
