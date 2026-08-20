# Map: 30th Birthday Portal

Label: `wayfinder:map`

## Destination

A complete, agreed build spec for `rina-wolf.com/[en|fr]/30ans` — every screen's content, copy, and behaviour pinned down, plus storage and deploy settled — such that Claude Code can build it screen by screen and it goes live before the invitation link is sent.

## Notes

**Domain**: a one-off, unlisted party-invitation microsite living as a new route inside this existing Next.js + WordPress app, deployed via the app's existing Vercel pipeline. Playful, mobile-first, French/English.

**Hard dates**

- Invitation link sent by WhatsApp: **Mon 17 Aug 2026**, may slip to **18–19 Aug**.
- Party: **Sat 5 Sept** or **Sat 12 Sept 2026**, evening, dinner and drinks — the RSVP form decides between them. (Changed from 28 Aug / 4 Sept while resolving 07.) Venue depends on headcount and is deliberately **not** on the site.

**Working rhythm**: page by page. One ticket per screen; the user decides that screen's content and behaviour, then we move on. The user is not a developer — tickets must ask product questions, never assume technical fluency.

**Settled before charting** (Rounds 1–5 grilling):

- Lives as a new route in this repo, completely separate from the portfolio app. Unlisted — not in the main site's nav.
- Deployed with the app's existing Vercel setup. No new hosting, no SFTP, no cost.
- Storage: RSVPs **and** wall messages → a Google Sheet via a Google Apps Script webhook, called from a Next.js API route. **No email notifications** — Resend is not used by the microsite (decided in 07). Wall messages publish **immediately** (approval dropped in 09); the user deletes anything unwanted from the sheet. **WordPress stays read-only — no WP writes.**
- Languages: full EN + FR from one dictionary file per locale, routes `/[locale]/30ans`, **default English**, toggle in the corner. Indonesian gets a short translated note explaining the "balais" joke only — not a third locale.
- Gallery photos ship in the app's `public/` folder.
- Accessories page: fixed-position layered accessories with a style arrow (hat 1/2/3) and a colour swatch row plus a remove button — **not** drag/resize/rotate stickers.
- Quiz questions written entirely by the user. Wheel-of-fortune prizes are gags, no real prizes.

**Two CSS traps this project keeps paying for** (both cost a session):

- An animation ending on `transform: none` with `fill-mode: both` **overrides
  inline transforms**. Put the animation on an inner element.
- An element whose animation settles on `filter: blur(0px)` becomes the
  **containing block for its `position: fixed` descendants** — `riseIn` does
  exactly this, so floating decorations must live outside the animated wrapper.
- A `<style>` whose CSS is a **text child** fails hydration when dev rebuilds
  desync it. Use `dangerouslySetInnerHTML`.

**Instrument Serif's italic is unreadable at body size on black** — its roman at
the same size is fine. If small text looks too thin, drop the italic, never the
family. Utility text under ~15px should be plain sans.

**Every screen must be composed for mobile (375px) *and* desktop (1280px)** — both get checked before a ticket closes. Established while resolving 01.

**Skills every session should consult**: `/grilling` and `/domain-modeling` by default; `/prototype` for any screen where "how should it look/feel" is the open question.

**Risk, named once**: eleven screens, six activities, two languages, and unwritten content in five days. Screens 1–5 plus the wall and gallery are safe; quiz, accessories and wheel are the ones at risk. The user has chosen to ship everything before sending the link. Ticket order therefore puts the invitation path first — if anything slips, it slips a game, never the invitation.

## Decisions so far

<!-- one line per closed ticket -->

- [01 — Visual language and tone](issues/01-visual-language.md) — Dark starfield, floating disco-ball PNG, brooms bursting from its centre on golden-angle curved paths, supplied chrome title PNGs (one-line on desktop, stacked on mobile, English in both locales) with SVG sparkles and a soft glow, no counter, and a silver-and-gold confetti ending that holds 2s then waits for a tap. Prototype: `app/30ans-prototype/` (variant D).
- [05 — Screens 1 & 2: the tapping game](issues/05-screen-disco-ball.md) — 30 taps, one broom each, anywhere/any-key, 80ms between brooms, haptics; no skip and the RSVP gated behind it (but the form gets an unadvertised direct URL for chasing); fresh start each visit with "restart the disco game" living in the activities list; ball fades in over an instant starfield; reduced-motion respected; no sound.
- [04 — Storage setup](issues/04-storage-setup.md) — Google Sheet (`rsvps` + `wall` tabs) behind an Apps Script webhook, guarded by a shared token, fronted by `app/api/rinaverse/route.ts` so the token stays server-side; wall messages publish only when `approved` is flipped to `YES`, picked up within a 60s cache. Proven end to end.
- [02 — Site shell](issues/02-site-shell.md) — `/portal/en` and `/portal/fr`, bare `/portal` routed by browser language; the root layout hides the portfolio header/footer under `/portal` (route-group restructuring rejected as too risky); unlisted plus a robots rule; small text `FR | EN` toggle top-right, restarting the game if switched mid-play; deployed straight to master with the portfolio verified after each shared-layout change.
- [07 — RSVP flow](issues/07-rsvp-flow.md) — Yes/no screen carrying both dates and "venue follows once numbers are in"; four-field form (name, date checkboxes incl. "neither", diet, message) with no contact or plus-one; confirmation echoes the answer then leads to the activities; the no path records an optional name and offers a way back; newest row per name wins; no email notifications; form reachable directly at `/portal/[locale]/rsvp`.
- [08 — Activities hub "RINA-LAND"](issues/08-activities-hub.md) — Named hub reached from both the RSVP confirmation and the absent screen, same six ungated activities for everyone (quiz, Birthday Fit, wheel, gallery, testimonials, Disco Tap), each a chrome title plus a one-line tease, with a slow save-the-date marquee at the bottom; user's own FR/EN copy recorded verbatim.
- [15 — RSVP sheet columns](issues/15-sheet-columns.md) — `when | response | name | dates | diet | message`, script and sheet aligned and verified end to end.
- [14 — WhatsApp link preview](issues/14-link-preview.md) — One link for everyone, `rina-wolf.com/portal`; card is the opening frame (disco ball + chrome title), titled "Enter the Rinaverse" with the English-only description "Tap the disco ball to get started"; must be final before any send because WhatsApp caches cards hard.
- [09 — Quote wall "Témoignages"](issues/09-quote-wall.md) — A physics field of quotes drifting on paper and bouncing off each other, capped per breakpoint with rotating content; a glass bubble at the centre that becomes the disco ball on hover/tap and wipes the page to night; messages left through a blocking modal then arriving wound up as an Archimedean spiral that unwinds into a card at the emptiest spot; **approval dropped — messages publish immediately** and are removed from the sheet if unwanted.
- [06 — Screen 3: the joke and drag-to-30-brooms](issues/06-screen-broom-joke.md) — Spotlight background over the starfield; timed beats (title+joke → surprised photo tumbling → her + spotlight → continue) that never gate on the drag; drag anywhere, right adds and left removes at 26px per broom, her cutout cross-fading as she picks the first one up; loose brooms matched to hers at 67.7% height / 2.4% bottom; no counter — the line of brooms is the count; at 30 it holds 1.4s then they lift away one at a time, and a line left halfway folds itself away after 6s, both cancellable by a press; desktop fits all 30, mobile pans by a measured amount; her size is measured against a hidden twin of the text in both locales so it never changes with language or broom count.
- [17 — Screens 4 & 5 built: the RSVP screen](issues/17-rsvp-screen-build.md) — Starfield, no spotlight; single-line title sized by viewport; venue as a subtitle; festive hover on Yes/Send/"actually I can come" and a sad one on the decline; party-horn cutouts driven by the wall's physics approach, one per side on desktop and one band each above the title / below the buttons on mobile; Rina-Land banner with no background of its own — dancing disco balls filling the width either side of `↓ TO RINA-LAND ↓` with jumping letters; dates corrected to **Saturday** 5 / 12 Sept.
- [10 — Photo gallery](issues/10-photo-gallery.md) — "Photo Gallery / Galerie photo": all 47 photos drifting at once in a **depth** field (near = big, sharp, fast; far = small, dim, blurred) so it reads apart from the wall's single plane; photos collide with each other and bounce off the title so nothing ever overlaps, which is what forces them small; click or tap opens full size with its caption over a dimmed field and dancing disco balls, closed by X/Escape/tap-away; desktop hover scales, clears the blur and glows, suppressed on touch and released on open; normal cursor overriding the site's custom one; one user-written line per photo (46 of 47); 36MB of originals reduced to a 1.9MB floating set with full versions fetched only on open, plus a dev caption editor at `/30ans-prototype/gallery/captions`.
- [16 — Apps Script republished for instant publishing](issues/16-apps-script-instant-publish.md) — Wall messages go live on submit; the `approved` column is now a kill switch (`NO` hides a row) rather than a gate. Verified without manual approval.
- [11 — The quiz](issues/11-quiz.md) — Ten multiple-choice questions, four options, one correct, every option carrying its own note and **all** notes shown on reveal; immediate per-question feedback with lit lamps and confetti, the score seen only at the end by the guest alone and recorded nowhere, five bands with a gold medal on 10/10, unlimited retries; carnival cream-and-red with a timed intro that flies the sign up to the card via FLIP, the card pinned to one screen with only the answers scrolling, and Next as an arrow — outside the card on desktop, inside its bottom-right corner on mobile; short-but-wide screens (<800px tall) tighten the chrome so all four answers and notes fit, and the bunting shortens rather than the sign moving, since the sign is the intro's FLIP target; content and both languages are the user's own, editable through a dev-only editor at `/quiz/editor`.

## Not yet specified

- **Opening language gate (supersedes part of [02](issues/02-site-shell.md))** —
  decided 16 Aug: the site opens on the starfield with *nothing but a language
  picker*; choosing a language starts the experience. Replaces "bare `/portal`
  routed by browser language, default English, toggle in the corner".
  **Conflicts with [14](issues/14-link-preview.md)**: the WhatsApp card says
  "Tap the disco ball to get started" and shows the disco-ball opening frame,
  which is no longer the first screen. Must be resolved before the first send —
  WhatsApp caches cards hard.

- **Final EN/FR copy pass** across every screen once each screen's content is decided — including the Indonesian joke note.
- **Performance and asset weight** on mobile data — the disco ball (1MB) and stacked mobile title (1.2MB) must be compressed before launch, plus the photo gallery over 4G.

## Out of scope

- **Coconut shy game** — ruled out in grilling Round 4: aim/physics/collision is the worst effort-to-payoff item on the list and reads badly on mobile.
- **Writing data into WordPress** — the app's WPGraphQL connection is read-only with auth disabled; adding write auth is the riskiest possible dependency this week.
- **Any login, account, or private/gated content** — anyone with the link sees everything, including gallery photos.
- **A third full Indonesian locale** — only the joke explanation is translated.
- **Touching the existing portfolio site's navigation, layout, or content.**
