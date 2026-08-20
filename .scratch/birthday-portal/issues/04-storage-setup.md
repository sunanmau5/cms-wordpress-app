# 04 — Storage setup: Google Sheet + webhook

Type: task (HITL)
Status: resolved
Blocked by: —

## Question

Stand up the one piece of infrastructure this site needs, before any form or wall is specified.

- Create the Google Sheet with two tabs: RSVPs and wall messages (the wall tab carries an `approved` column).
- Create the Google Apps Script webhook that appends rows, and deploy it.
- Store its URL as an env var in the app and on Vercel.
- Prove a write end-to-end from a Next.js API route, and a read back of approved rows.
- Confirm the Resend notification path still works for RSVP pings.

Walk the user through it with `/wizard` — the Google-side steps are theirs to click. Resolution records the sheet URL, the env var names, the column layout, and how often the wall re-reads.

## Answer

**Storage is live and proven end to end.** Google Sheet + Apps Script webhook, fronted by a Next.js API route. No database, no new account, no cost. WordPress untouched.

### What exists
- **Spreadsheet "Rinaverse"** on the user's personal Gmail, two tabs:
  - `rsvps` — `when | name | contact | dates | diet | plus_one | message` (columns are provisional until [07](07-rsvp-flow.md) fixes the real fields; adding one later is a 30-second job)
  - `wall` — `when | name | message | approved`
- **Apps Script web app**, source kept at `.scratch/birthday-portal/apps-script/Code.gs`. Deployed as *Execute as: Me / Who has access: Anyone*.
  - `doPost` — appends an RSVP or a wall message. Wall rows are written with `approved = NO`.
  - `doGet` — returns only rows where `approved = YES`. **No token on reads**: the data is already public on the site, and that keeps secrets out of URLs.
- **Shared token** guarding writes, 40 random chars, in `.env.local` as `GOOGLE_SHEET_TOKEN`.
- **API route** `app/api/rinaverse/route.ts` — the browser talks only to this; the token stays server-side. `GET` caches for **60 seconds**, so an approved message appears on the site within about a minute. Deliberate: invisible to guests, and far inside Google's quotas.

### Env vars
`GOOGLE_SHEET_WEBHOOK_URL` and `GOOGLE_SHEET_TOKEN`, both in `.env.local`. **They must also be added to Vercel before launch** or storage works locally and fails in production → noted on [02](02-site-shell.md).

### Verified
- Write direct to the webhook → `{"ok":true}`, row lands in the sheet.
- Write through the Next.js route → `{"ok":true}`.
- Flip `approved` to `YES` in the sheet → message returned by `doGet`, and through the app within the cache window (measured: 12s after expiry).

### Gotcha, recorded because it cost time
`curl -X POST` (and any forced method) **breaks against Apps Script**: `/exec` answers with a 302, the forced method persists across the redirect, and Google returns `405` with an HTML page — *while the write itself succeeds*. Symptom is the worst kind: rows appear in the sheet but the caller sees failure. Use `curl -L -d …` with no `-X`, and `redirect: "follow"` without a method override on the redirect in fetch.

### Tooling left behind
- `.scratch/birthday-portal/setup-storage.sh` — 5-stage wizard, re-runnable, remembers saved values.
- `.scratch/birthday-portal/test-storage.sh` — standalone re-test with named diagnoses for the three common failures.
