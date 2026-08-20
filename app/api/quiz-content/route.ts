import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

/**
 * DEV ONLY — writes the quiz's content files from the editor at
 * /portal/quiz/editor, so ten questions, thirty notes, the intro
 * lines and the score messages can be written in the browser rather than by
 * hand in code.
 *
 * Refuses to run outside development: it writes into the source tree.
 */

const DIR = path.join(process.cwd(), "app", "portal", "quiz");
const s = (v: unknown) => JSON.stringify(typeof v === "string" ? v : "");

type Option = { fr: string; en: string; correct?: boolean; noteFr: string; noteEn: string };
type Question = { fr: string; en: string; options: Option[] };

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev only" }, { status: 404 });
  }

  const body = await req.json();
  const { intro, scores, questions } = body ?? {};

  if (!Array.isArray(questions) || !intro?.fr || !scores?.fr) {
    return NextResponse.json({ error: "unexpected shape" }, { status: 400 });
  }

  const contentFile = [
    "// PROTOTYPE — throwaway. Quiz intro lines and score messages.",
    "// Written through the editor at /portal/quiz/editor.",
    "",
    "export type Scores = {",
    "  zero: string; // 0/10 exactly",
    "  low: string; // under 4",
    "  mid: string; // 4–7",
    "  high: string; // 8–9",
    "  perfect: string; // 10/10 exactly",
    "};",
    "",
    "export const INTRO: { fr: string[]; en: string[] } = {",
    ...(["fr", "en"] as const).map(
      (l) =>
        `  ${l}: [\n${(intro[l] ?? [])
          .map((line: string) => `    ${s(line)},`)
          .join("\n")}\n  ],`,
    ),
    "};",
    "",
    "export const SCORES: { fr: Scores; en: Scores } = {",
    ...(["fr", "en"] as const).map((l) =>
      [
        `  ${l}: {`,
        ...(["zero", "low", "mid", "high", "perfect"] as const).map(
          (k) => `    ${k}: ${s(scores[l]?.[k])},`,
        ),
        "  },",
      ].join("\n"),
    ),
    "};",
    "",
  ].join("\n");

  const questionsFile = [
    "// PROTOTYPE — throwaway. Quiz content.",
    "// Written through the editor at /portal/quiz/editor.",
    "// Ten is fixed: the Rina-Land tease already promises ten.",
    "",
    "export type Option = {",
    "  fr: string;",
    "  en: string;",
    "  correct?: boolean;",
    "  noteFr: string;",
    "  noteEn: string;",
    "};",
    "",
    "export type Question = {",
    "  fr: string;",
    "  en: string;",
    "  options: Option[];",
    "};",
    "",
    "export const QUESTIONS: Question[] = [",
    ...(questions as Question[]).map((q) =>
      [
        "  {",
        `    fr: ${s(q.fr)},`,
        `    en: ${s(q.en)},`,
        "    options: [",
        ...(q.options ?? []).map(
          (o) =>
            `      { fr: ${s(o.fr)}, en: ${s(o.en)},${o.correct ? " correct: true," : ""} noteFr: ${s(o.noteFr)}, noteEn: ${s(o.noteEn)} },`,
        ),
        "    ],",
        "  },",
      ].join("\n"),
    ),
    "];",
    "",
  ].join("\n");

  await fs.writeFile(path.join(DIR, "content.ts"), contentFile, "utf8");
  await fs.writeFile(path.join(DIR, "questions.ts"), questionsFile, "utf8");

  return NextResponse.json({ ok: true, questions: questions.length });
}
