import { NextRequest, NextResponse } from "next/server";

/**
 * Storage bridge for the 30ans microsite.
 *
 * The Google Apps Script webhook is open to the internet and guarded by a
 * shared token, so the token stays server-side and the browser only ever talks
 * to this route.
 *
 * POST — append an RSVP or a wall message.
 * GET  — read back the wall messages approved in the sheet.
 */

const WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK_URL;
const TOKEN = process.env.GOOGLE_SHEET_TOKEN;

export async function POST(req: NextRequest) {
  if (!WEBHOOK || !TOKEN) {
    return NextResponse.json({ error: "storage not configured" }, { status: 500 });
  }

  const body = await req.json();

  if (body.kind !== "rsvp" && body.kind !== "wall") {
    return NextResponse.json({ error: "unknown kind" }, { status: 400 });
  }

  // NB: no `method: POST` override on the redirect — Apps Script answers with a
  // 302 and the follow-up must not stay a POST, or Google returns 405.
  const res = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, token: TOKEN }),
    redirect: "follow",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: data.ok ? 200 : 502 });
}

export async function GET() {
  if (!WEBHOOK) {
    return NextResponse.json({ error: "storage not configured" }, { status: 500 });
  }

  const res = await fetch(WEBHOOK, { next: { revalidate: 60 } });
  const data = await res.json();

  return NextResponse.json(data);
}
