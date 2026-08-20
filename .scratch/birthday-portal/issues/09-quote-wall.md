# 09 — Activity: "What they say about me" wall

Type: grilling
Status: resolved
Blocked by: 04

## Question

- How the wall of quotes looks: cards, sizes, colours, ordering, and what it looks like with 3 quotes versus 60.
- How the seeded quotes are attributed (name? relationship? anonymous?).
- The submission field: what a guest fills in, what they see immediately after submitting given their message is not yet approved.
- The moderation loop in practice: the user ticks `approved` in the sheet, and the site picks it up how fast.
- Abuse floor: length limit, and what happens to a message the user never approves.

## Answer

**"Témoignages" / "What they say about me" — a drifting field of quotes on paper, with a glass bubble at its centre that becomes the disco ball.** Designed by prototyping three readings of "floating" (`app/30ans-prototype/wall/`, variants A/B/C); **B won**, then ~15 rounds of refinement.

### The wall
- **Warm off-white paper** (`#f4f3f1`) with fine SVG grain. Quotes in **Instrument Serif** (a hairline stroke thickens its single weight), attributions in **IBM Plex Sans Italic** — chosen because Inter ships no italic face in this Next version, so `italic` was silently rendering upright.
- **A physics field, not a layout.** Each card has a position and velocity and bounces off the screen edges, the page title, the invisible box around the centre button, and **each other** (colliding pairs push apart by their overlap and swap velocities). Slow: 15–28 px/s.
- **A fixed number of cards on screen** — 9 desktop / 7 tablet / 5 mobile, type scaling down with them. Every 9s one card fades out and returns as a different quote, so the wall never crowds however many messages arrive.
- Rejected: **A — Constellation** (drag to roam a wide field; lovely on desktop, wrong for thumbs) and **C — Scatter** (safe, unmagical).

### The five seeded quotes
Recorded verbatim in `app/30ans-prototype/wall/quotes.ts`, FR + EN, attributed **name + relationship** ("Mon père", "Ma mère", "Une inconnue dans un bar parisien") — the relationship is where the comedy lives.

### The button: a glass bubble that becomes the disco ball
- **By day**: a transparent glass sphere — no fill, only light: a bright rim gathering along the bottom inside edge, a shadowed edge top-left, a hairline outer edge, two catch-lights and a contact shadow. It floats on a slow 6s drift. The label is a **supplied PNG** (`bubble-text-fr.png` / `bubble-text-en.png`) set across its face at 62% width.
- **On hover, or first tap on mobile**: the night sky **wipes open in an expanding circle** from the centre (1.1s), ~90 bokeh stars fade in, the quotes turn white in place, and the bubble **becomes the disco ball**, with "Laisse un message" **orbiting it once** on a ring 104px out, turning slowly.
- Rejected along the way: a pill button, a border, the disco texture filling the *label*, text set around the rim, per-letter spherized text.

### Leaving a message
1. Second tap / click opens a **blocking modal** over the night: name + message, live **200-character counter** turning amber near the limit, **×** top-right (no Cancel), placeholders "Sunan" / "I love how you talk about social issues 10 times a day". Both fields required. Backdrop click closes. Open and close both animate (200–320ms).
2. **Send** → modal closes → **"Merci !"** fades in place and fades out (no movement).
3. The message **arrives wound up as a spiral** at the emptiest point on screen: letters set **by arc length along an Archimedean spiral**, shoulder to shoulder, each rotated tangentially, type shrunk to 42%. Short messages **repeat the phrase with a ✦ separator** to complete two turns; the repeats fade as the real one unwinds.
4. The coil **holds ~1.5s, then unwinds** — letters travelling to their natural places, staggered 12ms — and the block straightens into the finished quote.
5. It becomes a **real card in that exact spot** and drifts off with the others, its neighbours pushed aside by the physics.
6. **The disco-ball world persists through all of it** — ball, orbiting label, stars — and only returns to paper ~0.9s after the card lands.

**Send button**: inert until both fields have content, then four **gold** sparkles appear around it and it lifts with a soft halo on hover.

### Geometry that had to be got right (recorded because it was hard-won)
- **Turn spacing is fixed, turn count varies.** The gap between turns is 1.9× a coiled letter's line box; the number of turns falls out of the message length. Deriving it the other way round made the coil overlap itself.
- **Everything on the coil must be centre-anchored.** The repeats were positioned from their top-left while the real letters were positioned from their centre — that half-glyph offset read as a **second ghost spiral**.
- Verified: 137 glyphs, radius 32→88px, **0 cross-turn collisions**, 27px between turns.

### Moderation — changed from [04](04-storage-setup.md)
**No approval step.** Messages publish **immediately**; the user removes anything unwanted from the sheet. `Code.gs` now writes `approved = YES` and `doGet` hides a row only if it says `NO`. The risk was named and accepted: with ~30 known guests, "visible until you notice" is a fair trade. **Needs re-pasting into Apps Script and redeploying with Version: New version.**

### Language
Seeded quotes swap with the locale. **Guest messages show on both versions** in whatever language they were written — storing a locale per message buys nothing, and a half-empty English wall would look broken.
