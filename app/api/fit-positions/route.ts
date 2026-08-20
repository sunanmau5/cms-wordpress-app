// DEV-ONLY. Writes accessory positions back into
// app/portal/fit/accessories.ts so the editor's drag/resize survives a
// reload. Refuses to run in production, and rejects any id it does not already
// find in the file rather than silently dropping it.

import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "app/portal/fit/accessories.ts");

type Pos = { id: string; x: number; y: number; w: number; rot: number };

const num = (v: unknown, lo: number, hi: number) =>
  typeof v === "number" && Number.isFinite(v)
    ? Math.max(lo, Math.min(hi, Math.round(v)))
    : null;

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "editor is dev-only" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { items?: Pos[] } | null;
  if (!body?.items?.length) {
    return NextResponse.json({ error: "no items" }, { status: 400 });
  }

  let src = await readFile(FILE, "utf8");
  const written: string[] = [];
  const rejected: string[] = [];

  for (const item of body.items) {
    const x = num(item.x, -60, 160);
    const y = num(item.y, -60, 160);
    const w = num(item.w, 2, 200);
    const rot = num(item.rot, -180, 180);
    if (
      !/^[a-z0-9-]+$/.test(String(item.id)) ||
      x === null ||
      y === null ||
      w === null ||
      rot === null
    ) {
      rejected.push(String(item.id));
      continue;
    }
    const re = new RegExp(
      `(\\{ id: "${item.id}", fr:[\\s\\S]*?src: "[^"]+", x: )-?\\d+(, y: )-?\\d+(, w: )-?\\d+(, rot: )-?\\d+`,
    );
    if (!re.test(src)) {
      rejected.push(item.id);
      continue;
    }
    src = src.replace(re, `$1${x}$2${y}$3${w}$4${rot}`);
    written.push(item.id);
  }

  if (rejected.length) {
    return NextResponse.json(
      { error: "unknown or invalid ids", rejected },
      { status: 400 },
    );
  }

  await writeFile(FILE, src, "utf8");
  return NextResponse.json({ ok: true, written });
}
