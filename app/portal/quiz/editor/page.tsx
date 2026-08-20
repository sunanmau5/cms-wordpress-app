// PROTOTYPE — throwaway, DEV ONLY. The quiz copy editor.
// Intro lines, ten questions with three options and a note each, and the five
// score messages — French and English side by side. Save writes content.ts and
// questions.ts through /api/quiz-content.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { INTRO, SCORES } from "../content";
import { QUESTIONS } from "../questions";

type Option = { fr: string; en: string; correct?: boolean; noteFr: string; noteEn: string };
type Question = { fr: string; en: string; options: Option[] };
type Draft = {
  intro: { fr: string[]; en: string[] };
  scores: { fr: Record<string, string>; en: Record<string, string> };
  questions: Question[];
};

const DRAFT_KEY = "rinaverse-quiz-draft";

const BANDS = [
  { key: "zero", label: "0 / 10 exactly" },
  { key: "low", label: "1–3 out of 10" },
  { key: "mid", label: "4–7 out of 10" },
  { key: "high", label: "8–9 out of 10" },
  { key: "perfect", label: "10 / 10 exactly" },
] as const;

const field =
  "w-full rounded border border-white/15 bg-neutral-900 px-2.5 py-2 text-sm text-white outline-none focus:border-white/50";
const lbl = "mb-1 block text-[11px] uppercase tracking-wider text-white/45";
// A, B, C, D… however many answers a question ends up with
const letter = (n: number) => String.fromCharCode(65 + n);

function Pair({
  fr,
  en,
  onFr,
  onEn,
  placeholder,
  area,
}: {
  fr: string;
  en: string;
  onFr: (v: string) => void;
  onEn: (v: string) => void;
  placeholder?: string;
  area?: boolean;
}) {
  const C = area ? "textarea" : "input";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <span className={lbl}>Français</span>
        <C
          className={`${field} ${area ? "resize-y" : ""}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onFr(e.target.value)}
          placeholder={placeholder}
          rows={area ? 2 : undefined}
          value={fr}
        />
      </div>
      <div>
        <span className={lbl}>English</span>
        <C
          className={`${field} ${area ? "resize-y" : ""}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onEn(e.target.value)}
          placeholder={placeholder}
          rows={area ? 2 : undefined}
          value={en}
        />
      </div>
    </div>
  );
}

export default function QuizEditor() {
  const [intro, setIntro] = useState({ fr: [...INTRO.fr], en: [...INTRO.en] });
  const [scores, setScores] = useState({ fr: { ...SCORES.fr }, en: { ...SCORES.en } });
  const [questions, setQuestions] = useState<Question[]>(
    QUESTIONS.map((q) => ({ ...q, options: q.options.map((o) => ({ ...o })) })),
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  // A draft is kept in the browser on every keystroke. Editing this file while
  // the page is open hot-reloads the component and wipes its state, which once
  // cost a session's typing — the draft survives that, and a reload.
  const [draftAt, setDraftAt] = useState<string | null>(null);
  const [offer, setOffer] = useState<null | { at: string; data: Draft }>(null);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { at, data } = JSON.parse(raw);
      // compare EVERYTHING against what is on disk — checking only the
      // questions missed edits made to the intro lines or score messages
      const onDisk = JSON.stringify({ intro: INTRO, scores: SCORES, questions: QUESTIONS });
      const inDraft = JSON.stringify({
        intro: data.intro,
        scores: data.scores,
        questions: data.questions,
      });
      if (inDraft !== onDisk) setOffer({ at, data });
    } catch {
      /* a corrupt draft is not worth blocking the editor for */
    }
  }, []);

  // keep the draft current
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    const at = new Date().toLocaleTimeString();
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ at, data: { intro, scores, questions } }),
    );
    setDraftAt(at);
  }, [intro, scores, questions]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (status !== "saved") e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  const setQ = (qi: number, patch: Partial<Question>) =>
    setQuestions((cur) => cur.map((q, n) => (n === qi ? { ...q, ...patch } : q)));

  const setOpt = (qi: number, oi: number, patch: Partial<Option>) =>
    setQuestions((cur) =>
      cur.map((q, n) =>
        n === qi
          ? { ...q, options: q.options.map((o, m) => (m === oi ? { ...o, ...patch } : o)) }
          : q,
      ),
    );

  const MIN_OPTS = 2;
  const MAX_OPTS = 6;

  const addOption = (qi: number) =>
    setQuestions((cur) =>
      cur.map((q, n) =>
        n === qi && q.options.length < MAX_OPTS
          ? { ...q, options: [...q.options, { fr: "", en: "", noteFr: "", noteEn: "" }] }
          : q,
      ),
    );

  const removeOption = (qi: number, oi: number) =>
    setQuestions((cur) =>
      cur.map((q, n) =>
        n === qi && q.options.length > MIN_OPTS
          ? { ...q, options: q.options.filter((_, m) => m !== oi) }
          : q,
      ),
    );

  // exactly one right answer per question
  const setCorrect = (qi: number, oi: number) =>
    setQuestions((cur) =>
      cur.map((q, n) =>
        n === qi
          ? { ...q, options: q.options.map((o, m) => ({ ...o, correct: m === oi })) }
          : q,
      ),
    );

  const problems = useMemo(() => {
    const out: string[] = [];
    questions.forEach((q, n) => {
      const label = `Q${n + 1}`;
      if (!q.fr.trim() || !q.en.trim()) out.push(`${label}: question missing a language`);
      const rights = q.options.filter((o) => o.correct).length;
      if (rights === 0) out.push(`${label}: no correct answer marked`);
      if (rights > 1) out.push(`${label}: more than one correct answer`);
      q.options.forEach((o, m) => {
        if (!o.fr.trim() || !o.en.trim())
          out.push(`${label} option ${letter(m)}: answer missing a language`);
        if (!o.noteFr.trim() || !o.noteEn.trim())
          out.push(`${label} option ${letter(m)}: note missing a language`);
      });
    });
    intro.fr.forEach((l, n) => {
      if (!l.trim() || !intro.en[n]?.trim()) out.push(`Intro line ${n + 1} missing a language`);
    });
    BANDS.forEach(({ key, label }) => {
      if (!scores.fr[key]?.trim() || !scores.en[key]?.trim())
        out.push(`Score message "${label}" missing a language`);
    });
    return out;
  }, [questions, intro, scores]);

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/quiz-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intro, scores, questions }),
      });
      if (!res.ok) throw new Error();
      window.localStorage.removeItem(DRAFT_KEY); // it is on disk now
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
          <h1 className="text-xl font-semibold">Quiz copy</h1>
          <span className={`text-sm ${problems.length ? "text-amber-400" : "text-emerald-400"}`}>
            {problems.length ? `${problems.length} still to fill` : "all complete"}
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
                  setIntro(offer.data.intro);
                  setScores(offer.data.scores as typeof scores);
                  setQuestions(offer.data.questions);
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
          Everything is pre-filled with my placeholder text — edit over it. Saving
          rewrites the quiz&apos;s content files directly; you can save part-way
          and come back. Incomplete fields are listed at the bottom.
        </p>

        {/* intro */}
        <section className="mb-10 rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-1 text-lg font-semibold">Intro card</h2>
          <p className="mb-5 text-sm text-white/50">
            The three lines beside the lamps, before the quiz starts.
          </p>
          <div className="space-y-5">
            {intro.fr.map((_, n) => (
              <Pair
                en={intro.en[n] ?? ""}
                fr={intro.fr[n] ?? ""}
                key={n}
                onEn={(v) =>
                  setIntro((c) => ({ ...c, en: c.en.map((x, m) => (m === n ? v : x)) }))
                }
                onFr={(v) =>
                  setIntro((c) => ({ ...c, fr: c.fr.map((x, m) => (m === n ? v : x)) }))
                }
              />
            ))}
          </div>
        </section>

        {/* score messages */}
        <section className="mb-10 rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-1 text-lg font-semibold">Score messages</h2>
          <p className="mb-5 text-sm text-white/50">
            Shown under the score at the end, one per band.
          </p>
          <div className="space-y-6">
            {BANDS.map(({ key, label }) => (
              <div key={key}>
                <p className="mb-2 text-[12px] uppercase tracking-wider text-amber-300/80">
                  {label}
                </p>
                <Pair
                  area
                  en={scores.en[key]}
                  fr={scores.fr[key]}
                  onEn={(v) => setScores((c) => ({ ...c, en: { ...c.en, [key]: v } }))}
                  onFr={(v) => setScores((c) => ({ ...c, fr: { ...c.fr, [key]: v } }))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* questions */}
        {questions.map((q, qi) => (
          <section
            className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-5"
            key={qi}
          >
            <h2 className="mb-4 text-lg font-semibold">Question {qi + 1}</h2>
            <Pair
              area
              en={q.en}
              fr={q.fr}
              onEn={(v) => setQ(qi, { en: v })}
              onFr={(v) => setQ(qi, { fr: v })}
              placeholder="The question"
            />

            <div className="mt-6 space-y-5">
              {q.options.map((o, oi) => (
                <div
                  className={`rounded border p-4 ${
                    o.correct ? "border-emerald-500/50 bg-emerald-500/[0.06]" : "border-white/10"
                  }`}
                  key={oi}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
                      {letter(oi)}
                    </span>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
                      <input
                        checked={!!o.correct}
                        name={`correct-${qi}`}
                        onChange={() => setCorrect(qi, oi)}
                        type="radio"
                      />
                      correct answer
                    </label>
                    <button
                      className="ml-auto rounded border border-white/15 px-2.5 py-1 text-xs text-white/60 hover:border-rose-400/60 hover:text-rose-300 disabled:opacity-30"
                      disabled={q.options.length <= MIN_OPTS}
                      onClick={() => removeOption(qi, oi)}
                      title={
                        q.options.length <= MIN_OPTS
                          ? `A question needs at least ${MIN_OPTS} answers`
                          : "Remove this answer"
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <Pair
                    en={o.en}
                    fr={o.fr}
                    onEn={(v) => setOpt(qi, oi, { en: v })}
                    onFr={(v) => setOpt(qi, oi, { fr: v })}
                    placeholder="The answer"
                  />

                  <div className="mt-3">
                    <p className="mb-1 text-[11px] uppercase tracking-wider text-white/40">
                      Note shown when this answer is picked
                    </p>
                    <Pair
                      area
                      en={o.noteEn}
                      fr={o.noteFr}
                      onEn={(v) => setOpt(qi, oi, { noteEn: v })}
                      onFr={(v) => setOpt(qi, oi, { noteFr: v })}
                      placeholder="Why it's right, why it's wrong, or a fun fact"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-4 rounded border border-white/20 px-3.5 py-2 text-sm text-white/75 hover:border-white/50 hover:text-white disabled:opacity-30"
              disabled={q.options.length >= MAX_OPTS}
              onClick={() => addOption(qi)}
            >
              + Add an answer
              <span className="ml-2 text-white/40">
                {q.options.length}/{MAX_OPTS}
              </span>
            </button>
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
