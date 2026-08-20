import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

/**
 * DEV ONLY — writes app/portal/gallery/photos.ts from the caption
 * editor, so the gallery captions can be typed in the browser next to the
 * photos instead of hand-edited in code.
 *
 * Refuses to run outside development: it writes into the source tree.
 */

const TARGET = path.join(
  process.cwd(),
  "app",
  "portal",
  "gallery",
  "photos.ts",
);

type Entry = { id: string; fr: string; en: string };

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev only" }, { status: 404 });
  }

  const body = await req.json();
  const photos: Entry[] = body?.photos;
  if (!Array.isArray(photos)) {
    return NextResponse.json({ error: "expected { photos: [] }" }, { status: 400 });
  }

  // ids come from the generated manifest, so keep them to that shape rather
  // than trusting whatever arrives — this writes to disk. REJECT rather than
  // filter: quietly dropping entries once cost eight captions.
  const bad = photos.filter((p) => typeof p?.id !== "string" || !/^[\w.-]+$/.test(p.id));
  if (bad.length) {
    return NextResponse.json(
      { error: "unsafe photo ids — rename the files", ids: bad.map((p) => p?.id) },
      { status: 400 },
    );
  }
  // Drop anything whose thumbnail is gone: an editor tab opened before a photo
  // was deleted still holds it in memory, and saving from that tab would
  // otherwise resurrect the entry as a broken image.
  const thumbs = new Set(
    (await fs.readdir(path.join(process.cwd(), "public", "30ans", "gallery", "thumbs")))
      .filter((f) => f.endsWith(".jpg"))
      .map((f) => f.slice(0, -4)),
  );
  const safe = photos.filter((p) => thumbs.has(p.id));

  const lines = [
    "// PROTOTYPE — throwaway. Generated from public/30ans/gallery/.",
    "// One entry per photo. `fr` / `en` are the one-line captions, written",
    "// through the dev caption editor at /portal/gallery/captions.",
    "",
    "export type Photo = { id: string; fr: string; en: string };",
    "",
    "export const PHOTOS: Photo[] = [",
    ...safe.map(
      (p) =>
        `  { id: ${JSON.stringify(p.id)}, fr: ${JSON.stringify(p.fr ?? "")}, en: ${JSON.stringify(p.en ?? "")} },`,
    ),
    "];",
    "",
    "export const thumb = (id: string) => `/30ans/gallery/thumbs/${id}.jpg`;",
    "export const full = (id: string) => `/30ans/gallery/web/${id}.jpg`;",
    "",
  ];

  await fs.writeFile(TARGET, lines.join("\n"), "utf8");
  return NextResponse.json({ ok: true, count: safe.length });
}
