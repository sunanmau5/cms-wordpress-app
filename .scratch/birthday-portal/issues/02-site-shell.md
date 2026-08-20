# 02 — Site shell: routes, locales, deploy

Type: grilling
Status: resolved
Blocked by: —

## Question

How does the microsite physically attach to this app?

- The exact route shape (`app/[locale]/30ans/...`) and how it stays isolated from the portfolio routes, layout, header and footer.
- Where the EN/FR dictionary lives and how a screen reads it.
- Where the locale toggle sits on screen and what it does mid-journey (stay on the same screen, keep progress).
- Default locale English; confirm the FR entry point for French guests.
- Unlisted: no nav entry, and whether it should be excluded from sitemap/robots.
- How it deploys and how the user previews it before the link goes out.
- **Carried from [04](04-storage-setup.md)**: `GOOGLE_SHEET_WEBHOOK_URL` and `GOOGLE_SHEET_TOKEN` must be added to Vercel's environment variables, or storage works locally and fails in production.

## Answer

### URLs
- **`rina-wolf.com/portal/en`** and **`/portal/fr`**.
- Bare **`/portal`** sniffs the browser's `Accept-Language`: French-speaking devices → `/portal/fr`, everyone else → `/portal/en`. No language-chooser screen — that would put a chore in front of the disco ball.
- Unknown locale (`/portal/de`) → redirect to `/portal/en`. Any other bad path → the portfolio's normal 404.
- `portal` is a **static** segment so it takes precedence over the existing `app/(dynamic)/[page]` WordPress catch-all. No collision.

### Escaping the portfolio chrome
The root layout (`app/layout.tsx`) wraps every route in the portfolio header, footer and page transitions. **Decision: the root layout hides header and footer when the path starts with `/portal`.** ~5 lines, one file, reversible.

Rejected: separate root layouts via route groups — architecturally correct but it moves every existing route file, which is not a risk worth taking four days out. Also rejected: rendering the microsite as a full-screen overlay (what the prototype does) — the portfolio chrome would still load underneath it.

### Unlisted
- Not in the nav — automatic, the nav is built from the hardcoded `PAGES` list in `lib/constants.ts`.
- Plus a `robots` rule keeping `/portal` out of search results. Matters because the domain is the user's professional portfolio. WhatsApp link previews are unaffected — they don't depend on indexing.

### Language toggle
- **Top-right, small, `FR | EN` as text**, inactive side dimmed. **No flags**: the English version is what the Indonesian guests read, so a Union Jack is actively wrong for them.
- Switching keeps the guest on the same screen. Switching **during the tapping game restarts it** — carrying progress through a language change isn't worth the machinery for a case that will essentially never happen.

### Deploy
- **Straight to master**, no feature branch — the user's call, made knowing master auto-deploys to production. Mitigation: the microsite is unlisted so a half-built `/portal` harms nobody, and **the portfolio gets verified after every change to the shared root layout**.
- `GOOGLE_SHEET_WEBHOOK_URL` and `GOOGLE_SHEET_TOKEN` are already set in Vercel (carried from [04](04-storage-setup.md)) ✅

### Copy strategy
Every string lives in one dictionary per locale. The hero title stays English in both (from [01](01-visual-language.md)).
