// PROTOTYPE — throwaway route. Delete before merging to main.
// Three variants of the opening disco-ball screen, switchable via ?variant=A|B|C.
// Question: .scratch/birthday-portal/issues/01-visual-language.md

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useLocale } from "./locale";

import { VariantA, nameA } from "./variant-a";
import { VariantB, nameB } from "./variant-b";
import { VariantC, nameC } from "./variant-c";
import { FONTS, VariantD, nameD } from "./variant-d";

type VariantProps = {
  count: number;
  done: boolean;
  onTap: () => void;
  fontIndex?: number;
  locale?: "fr" | "en";
};

const VARIANTS: {
  key: string;
  name: string;
  Component: (props: VariantProps) => JSX.Element;
}[] = [
  { key: "D", name: nameD, Component: VariantD },
  { key: "A", name: nameA, Component: VariantA },
  { key: "B", name: nameB, Component: VariantB },
  { key: "C", name: nameC, Component: VariantC },
];

const TARGET = 30;
const MIN_GAP_MS = 80;

// The opening ("30 balais") reveal, now a stage of /portal. When it is done and
// the guest taps/keys once more, it calls onDone() and the parent slides to the
// joke stage.
export function OpeningScreen({ onDone }: { onDone: () => void }) {
  const [variantKey, setVariantKey] = useState("D");
  const [count, setCount] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const { locale, setLocale } = useLocale();

  // once the 30 brooms are in ("30 balais"), a tap/key continues to the joke —
  // but only after a short pause, so someone tapping fast to reach 30 doesn't
  // blow straight past the payoff screen
  const doneRef = useRef(false);
  const canContinueRef = useRef(false);
  useEffect(() => {
    doneRef.current = count >= TARGET;
    if (count < TARGET) {
      canContinueRef.current = false;
      return;
    }
    const t = setTimeout(() => {
      canContinueRef.current = true;
    }, 2500);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("variant");
    if (fromUrl && VARIANTS.some((v) => v.key === fromUrl)) {
      setVariantKey(fromUrl);
    }
  }, []);

  const go = useCallback((delta: number) => {
    setVariantKey((current) => {
      const index = VARIANTS.findIndex((v) => v.key === current);
      const next = VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length];
      window.history.replaceState(null, "", `?variant=${next.key}`);
      return next.key;
    });
    setCount(0);
  }, []);

  // Q9: brooms come out no faster than one per 80ms. Extra-fast taps queue
  // rather than pile up, so the flight animation stays readable.
  const queued = useRef(0);
  const lastAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emit = useCallback(() => {
    lastAt.current = Date.now();
    setCount((c) => {
      const next = Math.min(TARGET, c + 1);
      // Q6: a short buzz per broom, a longer one at 30. No-op where unsupported.
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(next === TARGET ? 60 : 12);
      }
      return next;
    });
  }, []);

  const drain = useCallback(() => {
    if (queued.current <= 0) {
      timer.current = null;
      return;
    }
    queued.current -= 1;
    emit();
    timer.current = setTimeout(drain, MIN_GAP_MS);
  }, [emit]);

  const tap = useCallback(() => {
    const since = Date.now() - lastAt.current;
    if (!timer.current && since >= MIN_GAP_MS) {
      emit();
      timer.current = setTimeout(drain, MIN_GAP_MS);
      return;
    }
    queued.current += 1;
    if (!timer.current) timer.current = setTimeout(drain, MIN_GAP_MS - since);
  }, [drain, emit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft") return go(-1);
      if (e.key === "ArrowRight") return go(1);
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Tab" || e.key === "Shift") return;
      // done: a key continues to the joke — but only after the pause; taps in
      // between are absorbed, never counted or skipped
      if (doneRef.current) {
        if (canContinueRef.current) onDone();
        return;
      }
      tap(); // Q8: any key counts
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onDone, tap]);

  const active = VARIANTS.find((v) => v.key === variantKey) ?? VARIANTS[0];
  const { Component } = active;

  return (
    <div className="fixed inset-0 z-50">
      <Component
        count={count}
        done={count >= TARGET}
        fontIndex={fontIndex}
        locale={locale}
        onTap={() => {
          if (doneRef.current) {
            if (canContinueRef.current) onDone();
            return;
          }
          tap();
        }}
      />

      {/* prototype switcher — never ships */}
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 scale-90 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
          <button className="px-3 py-1 text-lg" onClick={() => go(-1)}>
            ←
          </button>
          <span className="min-w-[9rem] text-center text-sm font-semibold">
            {active.key} — {active.name}
          </span>
          <button className="px-3 py-1 text-lg" onClick={() => go(1)}>
            →
          </button>
          <button
            className="ml-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white"
            onClick={() => {
              queued.current = 0;
              if (timer.current) clearTimeout(timer.current);
              timer.current = null;
              setCount(0);
            }}
          >
            reset
          </button>
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setCount(TARGET)}
          >
            skip to 30
          </button>
          {active.key === "D" && (
            <button
              className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
              onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
            >
              {locale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
          )}
          {active.key === "D" && (
            <button
              className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
              onClick={() => setFontIndex((f) => (f + 1) % FONTS.length)}
            >
              font: {FONTS[fontIndex].label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
