// PROTOTYPE — throwaway, DEV ONLY. The wheel-of-fortune copy editor.
// Six areas, each with a name and three prizes; every prize has a short cell
// label (what fits on the wheel) and a full reveal line — French and English
// side by side. Save writes prizes.ts through /api/wheel-content.
//
// The wheel's geometry is fixed at six areas × three prizes, so there is no
// add/remove here — only the text changes.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AREAS } from "../prizes";

type Prize = { fr: string; en: string; shortFr: string; shortEn: string; video?: string };
type Area = { fr: string; en: string; prizes: Prize[] };

const DRAFT_KEY = "rinaverse-wheel-draft";

// what a cell can hold before it starts to crowd the wheel; a soft nudge, not a block
const SHORT_MAX = 12;

// pull the 11-char id out of any ordinary YouTube link; null if it isn't one
function youtubeId(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  const m =
    u.match(/[?&]v=([\w-]{11})/) ||
    u.match(/youtu\.be\/([\w-]{11})/) ||
    u.match(/\/embed\/([\w-]{11})/) ||
    u.match(/\/shorts\/([\w-]{11})/) ||
    u.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}

const field =
  "w-full rounded border border-white/15 bg-neutral-900 px-2.5 py-2 text-sm text-white outline-none focus:border-white/50";
const lbl = "mb-1 block text-[11px] uppercase tracking-wider text-white/45";

function Pair({
  fr,
  en,
  onFr,
  onEn,
  placeholder,
  area,
  max,
}: {
  fr: string;
  en: string;
  onFr: (v: string) => void;
  onEn: (v: string) => void;
  placeholder?: string;
  area?: boolean;
  max?: number;
}) {
  const C = area ? "textarea" : "input";
  const over = (v: string) => (max && v.trim().length > max ? v.trim().length : null);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {([
        ["Français", fr, onFr],
        ["English", en, onEn],
      ] as const).map(([name, val, on]) => (
        <div key={name}>
          <span className={lbl}>
            {name}
            {max && (
              <span className={over(val) ? "ml-2 text-amber-400" : "ml-2 text-white/25"}>
                {val.trim().length}/{max}
              </span>
            )}
          </span>
          <C
            className={`${field} ${area ? "resize-y" : ""} ${over(val) ? "border-amber-500/50" : ""}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => on(e.target.value)}
            placeholder={placeholder}
            rows={area ? 2 : undefined}
            value={val}
          />
        </div>
      ))}
    </div>
  );
}

const clone = (): Area[] =>
  AREAS.map((a) => ({ ...a, prizes: a.prizes.map((p) => ({ ...p })) }));

export default function WheelEditor() {
  const [areas, setAreas] = useState<Area[]>(clone);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [draftAt, setDraftAt] = useState<string | null>(null);
  const [offer, setOffer] = useState<null | { at: string; data: Area[] }>(null);
  const loaded = useRef(false);

  // A draft is kept in the browser on every keystroke. Editing this file while
  // the page is open hot-reloads the component and wipes its state; the draft
  // survives that, and a reload.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { at, data } = JSON.parse(raw);
      if (JSON.stringify(data) !== JSON.stringify(AREAS)) setOffer({ at, data });
    } catch {
      /* a corrupt draft is not worth blocking the editor for */
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    const at = new Date().toLocaleTimeString();
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ at, data: areas }));
    setDraftAt(at);
  }, [areas]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (status !== "saved") e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  const setArea = (ai: number, patch: Partial<Area>) =>
    setAreas((cur) => cur.map((a, n) => (n === ai ? { ...a, ...patch } : a)));

  const setPrize = (ai: number, pi: number, patch: Partial<Prize>) =>
    setAreas((cur) =>
      cur.map((a, n) =>
        n === ai
          ? { ...a, prizes: a.prizes.map((p, m) => (m === pi ? { ...p, ...patch } : p)) }
          : a,
      ),
    );

  const videoCount = useMemo(
    () => areas.reduce((n, a) => n + a.prizes.filter((p) => (p.video ?? "").trim()).length, 0),
    [areas],
  );

  const problems = useMemo(() => {
    const out: string[] = [];
    areas.forEach((a, n) => {
      const label = a.en.trim() || a.fr.trim() || `Area ${n + 1}`;
      if (!a.fr.trim() || !a.en.trim()) out.push(`${label}: area name missing a language`);
      a.prizes.forEach((p, m) => {
        const at = `${label} — prize ${m + 1}`;
        if (!p.fr.trim() || !p.en.trim()) out.push(`${at}: full line missing a language`);
        if (!p.shortFr.trim() || !p.shortEn.trim()) out.push(`${at}: cell label missing a language`);
        const v = (p.video ?? "").trim();
        if (v && !youtubeId(v)) out.push(`${at}: video isn't a recognisable YouTube link`);
      });
    });
    return out;
  }, [areas]);

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/wheel-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ areas }),
      });
      if (!res.ok) throw new Error();
      window.localStorage.removeItem(DRAFT_KEY);
      setDraftAt(null);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-[62rem]">
        <div className="sticky top-0 z-10 -mx-5 mb-8 flex flex-wrap items-center gap-4 border-b border-white/10 bg-neutral-950/95 px-5 py-4 backdrop-blur">
          <h1 className="text-xl font-semibold">Wheel of fortune</h1>
          <span className={`text-sm ${problems.length ? "text-amber-400" : "text-emerald-400"}`}>
            {problems.length ? `${problems.length} still to fill` : "all complete"}
          </span>
          <span className="text-xs text-white/40">
            🎬 {videoCount} video{videoCount === 1 ? "" : "s"}
          </span>
          <button
            className="ml-auto rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 disabled:opacity-50"
            disabled={status === "saving"}
            onClick={save}
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && <span className="text-sm text-emerald-400">Saved ✓</span>}
          {draftAt && status !== "saved" && (
            <span className="text-xs text-white/40">draft kept {draftAt}</span>
          )}
          {status === "error" && <span className="text-sm text-rose-400">Save failed</span>}
        </div>

        {offer && (
          <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/[0.08] p-4">
            <p className="mb-3 text-sm text-amber-200">
              An unsaved draft from <strong>{offer.at}</strong> is stored in this
              browser, and it differs from what is on disk.
            </p>
            <div className="flex gap-3">
              <button
                className="rounded bg-amber-300 px-4 py-2 text-sm font-semibold text-neutral-900"
                onClick={() => {
                  setAreas(offer.data);
                  setOffer(null);
                }}
              >
                Restore the draft
              </button>
              <button
                className="rounded border border-white/20 px-4 py-2 text-sm text-white/70"
                onClick={() => {
                  window.localStorage.removeItem(DRAFT_KEY);
                  setOffer(null);
                }}
              >
                Discard it
              </button>
            </div>
          </div>
        )}

        <p className="mb-8 max-w-[46rem] text-sm leading-relaxed text-white/55">
          Everything is pre-filled with my placeholder gags — edit over it. Each
          area has a name and three prizes. The <strong>cell label</strong> is the
          short word painted on the wheel (keep it tight — the counter turns amber
          past {SHORT_MAX}); the <strong>full line</strong> is what the guest reads
          when the pointer lands. Saving rewrites the wheel&apos;s content file
          directly; you can save part-way and come back.
        </p>

        {areas.map((a, ai) => (
          <section
            key={ai}
            className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400/20 text-[12px] font-bold text-amber-300">
                {ai + 1}
              </span>
              <h2 className="text-lg font-semibold">Area</h2>
            </div>

            <div className="mb-2">
              <p className="mb-1 text-[11px] uppercase tracking-wider text-amber-300/80">
                Area name (drawn along the slice — keep it short)
              </p>
              <Pair
                en={a.en}
                fr={a.fr}
                max={SHORT_MAX}
                onEn={(v) => setArea(ai, { en: v })}
                onFr={(v) => setArea(ai, { fr: v })}
                placeholder="e.g. Jackpot"
              />
            </div>

            <div className="mt-5 space-y-5">
              {a.prizes.map((p, pi) => {
                const vraw = (p.video ?? "").trim();
                const isVideo = !!vraw;
                const vidOk = isVideo && !!youtubeId(vraw);
                return (
                  <div
                    key={pi}
                    className={`rounded border p-4 ${isVideo ? "border-fuchsia-500/40 bg-fuchsia-500/[0.05]" : "border-white/10"}`}
                  >
                    <p className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
                      Prize {pi + 1}
                      {isVideo && <span className="ml-2 text-fuchsia-300">🎬 video</span>}
                    </p>

                    <p className="mb-1 text-[11px] uppercase tracking-wider text-white/40">
                      Cell label — the short word on the wheel
                    </p>
                    <Pair
                      en={p.shortEn}
                      fr={p.shortFr}
                      max={SHORT_MAX}
                      onEn={(v) => setPrize(ai, pi, { shortEn: v })}
                      onFr={(v) => setPrize(ai, pi, { shortFr: v })}
                      placeholder="e.g. Broom"
                    />

                    <div className="mt-3">
                      <p className="mb-1 text-[11px] uppercase tracking-wider text-white/40">
                        {isVideo ? "Legend — shown under the video" : "Full line — shown when the pointer lands here"}
                      </p>
                      <Pair
                        area
                        en={p.en}
                        fr={p.fr}
                        onEn={(v) => setPrize(ai, pi, { en: v })}
                        onFr={(v) => setPrize(ai, pi, { fr: v })}
                        placeholder="e.g. A brand-new broom"
                      />
                    </div>

                    <div className="mt-3">
                      <p className="mb-1 text-[11px] uppercase tracking-wider text-white/40">
                        YouTube video <span className="text-white/30">(optional — makes this a video prize)</span>
                      </p>
                      <input
                        className={`${field} ${isVideo && !vidOk ? "border-rose-500/60" : isVideo ? "border-fuchsia-500/50" : ""}`}
                        onChange={(e) => setPrize(ai, pi, { video: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=…  or  https://youtu.be/…"
                        value={p.video ?? ""}
                      />
                      {isVideo && (
                        <p className={`mt-1 text-[11px] ${vidOk ? "text-fuchsia-300/80" : "text-rose-300"}`}>
                          {vidOk
                            ? "Plays on the wheel; the line above is its legend."
                            : "Not a recognisable YouTube link yet."}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {problems.length > 0 && (
          <div className="mb-10 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-5">
            <p className="mb-2 font-semibold text-amber-300">Still to fill</p>
            <ul className="space-y-1 text-sm text-white/70">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pb-16 text-center">
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
