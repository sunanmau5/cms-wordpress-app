// PROTOTYPE — throwaway, DEV ONLY. The caption editor.
// Every photo with two boxes under it, FR and EN. Save writes photos.ts
// through /api/gallery-captions, so captions are typed next to the picture
// rather than hand-edited in code.

"use client";

import { useEffect, useState } from "react";

import { PHOTOS, thumb } from "../photos";

type Row = { id: string; fr: string; en: string };

export default function CaptionEditor() {
  const [rows, setRows] = useState<Row[]>(PHOTOS.map((p) => ({ ...p })));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // warn before losing typing
  useEffect(() => {
    const dirty = () => rows.some((r, i) => r.fr !== PHOTOS[i]?.fr || r.en !== PHOTOS[i]?.en);
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty()) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [rows]);

  const set = (i: number, key: "fr" | "en", v: string) =>
    setRows((cur) => cur.map((r, n) => (n === i ? { ...r, [key]: v } : r)));

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/gallery-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: rows }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  const done = rows.filter((r) => r.fr.trim() || r.en.trim()).length;

  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-[70rem]">
        <div className="sticky top-0 z-10 -mx-5 mb-8 flex flex-wrap items-center gap-4 border-b border-white/10 bg-neutral-950/95 px-5 py-4 backdrop-blur">
          <h1 className="text-xl font-semibold">Gallery captions</h1>
          <span className="text-sm text-white/60">
            {done} / {rows.length} captioned
          </span>
          <button
            className="ml-auto rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 disabled:opacity-50"
            disabled={status === "saving"}
            onClick={save}
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && <span className="text-sm text-emerald-400">Saved ✓</span>}
          {status === "error" && <span className="text-sm text-rose-400">Save failed</span>}
        </div>

        <p className="mb-8 max-w-[42rem] text-sm leading-relaxed text-white/60">
          One line per photo. Leave any of them blank and that photo simply opens
          without a caption. Only the first 16 photos float on desktop (9 on
          mobile), so the ones you care most about are best near the top — tell
          Claude if you want the order changed.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r, i) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3" key={r.id}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs text-white/40">#{i + 1}</span>
                {i < 16 && (
                  <span className="text-[10px] uppercase tracking-wider text-amber-300/80">
                    floats
                  </span>
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="mb-3 h-48 w-full rounded object-cover"
                src={thumb(r.id)}
              />
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">
                Français
              </label>
              <input
                className="mb-3 w-full rounded border border-white/15 bg-neutral-900 px-2.5 py-2 text-sm outline-none focus:border-white/50"
                onChange={(e) => set(i, "fr", e.target.value)}
                placeholder="Une ligne…"
                value={r.fr}
              />
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">
                English
              </label>
              <input
                className="w-full rounded border border-white/15 bg-neutral-900 px-2.5 py-2 text-sm outline-none focus:border-white/50"
                onChange={(e) => set(i, "en", e.target.value)}
                placeholder="One line…"
                value={r.en}
              />
            </div>
          ))}
        </div>

        <div className="py-10 text-center">
          <button
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 disabled:opacity-50"
            disabled={status === "saving"}
            onClick={save}
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
