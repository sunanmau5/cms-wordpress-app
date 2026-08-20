# 17 — Screens 4 & 5 built: the RSVP screen

Type: prototype
Status: resolved
Blocked by: 07 (decisions), 01 (visual language)

## Question

[07](07-rsvp-flow.md) settled *what* the RSVP flow does but nothing was built.
This ticket covers how it looks and behaves.

## Answer

Prototype: `app/30ans-prototype/rsvp/` (`page.tsx` + `copy.ts`). Five states,
switchable from the dev bar: `ask · form · sent · no · noSent`.

**Party facts corrected**: the dates are **Saturday** 5 and 12 September 2026 —
the map and 07 both said Friday. Fixed in all three places.

**Visual language.** Starfield and Instrument Serif, carried from the joke
screen. **No spotlight** — tried and dropped.

**Typography, the hard-won rule.** Instrument Serif's *italic* is too thin to
read at body size on black; its *roman* at the same size is fine. Three
sentences were switched to a sans face first, which looked wrong — the fix is
to drop the italic, never the family. Body copy on this screen is roman
Instrument Serif at 1.3rem / 1.55rem, 85% white. Small utility text (field
hints such as "Facultatif") is plain sans at 14px, because the serif goes
spidery at that size.

**Ask.** Title on a single line in both languages — the size follows the
viewport (`clamp` + `nowrap` from `sm`) rather than being fixed, so neither
language can wrap. Dates, "evening — dinner and drinks", then the venue line as
a subtitle beneath. **Yes** lifts and throws confetti and sparkles on hover;
**I can't make it** sinks, dims, tilts and sheds a single tear. Party-horn
cutouts drift at the sides (see below).

**Form.** Sparkled title, four fields, placeholders in the user's words
("Guillaume de Coco" / "Guy de Coco"; "Pierre Fregonas" on the no path). Send is
festive like the Yes button.

**Sent.** Title plus the "details as soon as a table's booked" subtitle, the
answer echoed back, then the Rina-Land banner.

**No / NoSent.** "Actually, I can come" is a full festive button beside Send,
and sits **above** the banner on NoSent. NoSent carries its own one-line
sentence and drops the banner's intro line so the two don't say the same thing.

**The Rina-Land banner.** No panel, no background of its own — it sits straight
on the starfield. Desktop: dancing disco balls filling the full width on **both
sides** of `↓ TO RINA-LAND ↓`, everything standing on one bottom line. Mobile:
words above a single row of balls. The letters jump in a stagger either way.
Full-bleed, which needs `overflow-x-hidden` on the scroll container because
`100vw` ignores its scrollbar.

**The party horns** use the same approach as the wall's quotes: a small rAF sim
with real velocities bouncing off the walls, not a canned CSS path. One big horn
each side on desktop, bouncing off an invisible box around the text column. On
mobile each horn gets its own band — one above the title, one below the buttons
— so neither can ever drift into the copy.

Collision uses the **diagonal** of the artwork, not its width: the cutout is
portrait and spinning, so its rotated extent is what actually covers the text.

## Gotcha paid for here

**An element whose animation settles on `filter: blur(0px)` becomes the
containing block for its `position: fixed` descendants.** `riseIn` ends that
way, so the horns were positioned against the text block instead of the
viewport and every ceiling computed for them was right while every result was
wrong. Floating elements must live *outside* the animated wrapper. Same family
as the `transform: none` gotcha already on the list.

## Still open

- Copy the user has not yet replaced with her own words: `sentSub` (FR),
  `bannerCta` (FR — "Vers Rina-Land" replaced her earlier "Visite Rina-Land").
- **No test row has been written to the sheet from this screen.** The form is
  wired to `/api/rinaverse` with `kind: "rsvp"` and the 15 column set, but the
  write path is unproven from here.
