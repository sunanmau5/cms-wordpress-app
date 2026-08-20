import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

/**
 * DEV ONLY — rewrites the wheel's content file from the editor at
 * /portal/wheel/editor, so the six area names and eighteen prizes
 * (each with a short cell label and a full reveal line, in both languages) can
 * be written in the browser rather than by hand in code.
 *
 * The wheel geometry is fixed: SIX areas, THREE prizes each. This route keeps
 * that shape and only rewrites the text. Refuses to run outside development:
 * it writes into the source tree.
 */

const FILE = path.join(process.cwd(), "app", "portal", "wheel", "prizes.ts");
const s = (v: unknown) => JSON.stringify(typeof v === "string" ? v : "");

type Prize = { fr: string; en: string; shortFr: string; shortEn: string; video?: string };
type Area = { fr: string; en: string; prizes: Prize[] };

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev only" }, { status: 404 });
  }

  const body = await req.json();
  const areas = body?.areas;

  if (!Array.isArray(areas) || areas.length !== 6) {
    return NextResponse.json({ error: "expected six areas" }, { status: 400 });
  }
  if (!areas.every((a) => Array.isArray(a?.prizes) && a.prizes.length === 3)) {
    return NextResponse.json({ error: "each area needs three prizes" }, { status: 400 });
  }

  const file = [
    "// PROTOTYPE — placeholder content. The real gag prizes are the user's to write,",
    "// in both languages. Written through the editor at /portal/wheel/editor.",
    "//",
    "// SIX AREAS on the outer band, THREE prizes each on the outer ring — eighteen",
    "// visible cells, like a wheel of emotions. The pointer lands on a prize cell.",
    "//",
    "// TWO LABELS PER PRIZE: `shortFr`/`shortEn` is what fits in an outer cell (one",
    "// word, ~10 characters), `fr`/`en` is the full line shown in the reveal.",
    "// Area names must stay short too — they are drawn along a 60° slice.",
    "//",
    "// A prize may also be a VIDEO: set `video` to a YouTube link and the reveal",
    "// plays it, with the `fr`/`en` line shown underneath as its legend.",
    "",
    "export type Area = {",
    "  fr: string;",
    "  en: string;",
    "  prizes: { fr: string; en: string; shortFr: string; shortEn: string; video?: string }[];",
    "};",
    "",
    "export const AREAS: Area[] = [",
    ...(areas as Area[]).map((a) =>
      [
        "  {",
        `    fr: ${s(a.fr)},`,
        `    en: ${s(a.en)},`,
        "    prizes: [",
        ...a.prizes.map((p) => {
          const vid = (p.video ?? "").trim();
          const tail = vid ? `, video: ${s(vid)}` : "";
          return `      { fr: ${s(p.fr)}, en: ${s(p.en)}, shortFr: ${s(p.shortFr)}, shortEn: ${s(p.shortEn)}${tail} },`;
        }),
        "    ],",
        "  },",
      ].join("\n"),
    ),
    "];",
    "",
  ].join("\n");

  await fs.writeFile(FILE, file, "utf8");

  return NextResponse.json({ ok: true, areas: areas.length });
}
