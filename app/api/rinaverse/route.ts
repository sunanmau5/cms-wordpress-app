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
    return NextResponse.json(
      { error: "storage not configured" },
      { status: 500 },
    );
  }

  let body: { kind?: string; [k: string]: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (body.kind !== "rsvp" && body.kind !== "wall") {
    return NextResponse.json({ error: "unknown kind" }, { status: 400 });
  }

  try {
    // NB: no `method: POST` override on the redirect — Apps Script answers with
    // a 302 and the follow-up must not stay a POST, or Google returns 405.
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, token: TOKEN }),
      redirect: "follow",
    });

    // Apps Script sometimes answers a POST with a redirect to an HTML page
    // rather than JSON; read as text first so a non-JSON reply can't crash the
    // route, and surface it for diagnosis instead of a bare 500.
    const text = await res.text();
    let data: { ok?: boolean; [k: string]: unknown };
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: "webhook did not return JSON",
          upstreamStatus: res.status,
          upstreamBody: text.slice(0, 800),
        },
        { status: 502 },
      );
    }
    return NextResponse.json(data, { status: data.ok ? 200 : 502 });
  } catch (err) {
    return NextResponse.json(
      { error: "webhook request failed", detail: String(err) },
      { status: 502 },
    );
  }
}

export async function GET() {
  if (!WEBHOOK) {
    return NextResponse.json(
      { error: "storage not configured" },
      { status: 500 },
    );
  }

  const res = await fetch(WEBHOOK, { next: { revalidate: 10 } });
  const data = await res.json();

  return NextResponse.json(data);
}
