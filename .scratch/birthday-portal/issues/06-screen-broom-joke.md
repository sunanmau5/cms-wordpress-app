# 06 — Screen 3: the joke explainer and the drag-to-30-brooms photo

Type: prototype
Status: resolved
Blocked by: 01  (03 no longer blocks — assets now arrive screen by screen)

## Question

The screen that lands the "j'ai 30 balais" wordplay and shows the user's face.

- How the joke is explained, and how the explanation differs in FR (a wink) versus EN (an actual explanation) — plus where the Indonesian note appears.
- The drag interaction: what "drag" means on a phone here, what the first broom appearing looks like, how brooms accumulate to 30 without becoming visual soup.
- What happens when 30 is reached, and how the guest moves on to the RSVP question.
- Whether this screen repeats the counter from screens 1–2 or does something different.

## Answer

Prototype: `app/30ans-prototype/joke/` (`page.tsx` + `copy.ts`), served at
`/30ans-prototype/joke`. Assets in `public/30ans/`: `cutout1`, `cutout2`,
`surprised-cutout`, `broom-full` — the `-web` 1400px variants are the ones used.

**Background — Spotlight.** A single beam from above-left landing on her, over
the persistent starfield, with a soft elliptical pool at her feet. Three other
treatments (rim light, paper wave, paper arch) were prototyped side by side and
dropped; only Spotlight ships. Ink-on-paper is off the table for this screen —
the night sky carries through.

**The beats are timed, never gated on the drag.** Title and joke note (0s) →
the surprised photo drifts in top-right, tumbling once every 90s (2.6s) → she
and the spotlight arrive (4.4s) → the continue cue (7.2s). A guest who never
touches anything still sees the whole screen and can move on.

**The joke.** Copy is the user's own words, FR and EN, in `copy.ts`. FR is a
wink; EN spells the expression out. It is **two parts with a line break between
them** — the break is in the copy, not the layout. The Indonesian note does not
live here.

**The surprised photo** sits top-right, drifting back towards the title rather
than staying parked in the corner, and tumbling once every 90s.

**The drag.** Rightwards adds brooms, leftwards removes them, 26px per broom,
from anywhere on the screen — not just on her. The first broom appears by
cross-fading her empty-handed cutout (`cutout1`) into the broom-holding one
(`cutout2`) over 450ms, so she picks it up rather than one materialising. Loose
brooms match the one she holds exactly: **67.7% of the cutout height, bristles
stopping 2.4% above the bottom**, both measured off `cutout2` by canvas.

**No counter.** The line of brooms *is* the count — the screen never repeats the
number from screens 1–2.

**Reaching 30.** It holds 1.4s, then the brooms leave one at a time, 70ms apart,
each lifting, tilting and fading over 560ms. Pressing during that cancels it;
releasing at 30 restarts it. There is deliberately no input lock — an earlier
locked version could wedge the screen with dragging dead until a reload.

**Stopping halfway does the same, after longer.** A part-built line left
untouched for **6s** folds itself away from wherever it got to, so nobody is
left looking at a stranded half-row. The wait restarts on every broom added and
again on letting go, and never fires while a finger or the mouse is still down;
a press during the fold cancels it and the brooms settle back.

**The note's typography.** Instrument Serif's italic draws « » “ ” at about half
the width a normal serif gives them (31.6 against 55.6 units at the same size,
measured), which made the quoted phrases look mis-set. Those glyphs alone are
scaled to 1.32em with zero line-height, so the line spacing is untouched. The
note also got a wider measure, more leading and more contrast than the first
pass — italic serif at 70% white on black was hard going.

**Layout.** Desktop fits all 30 across the viewport. Mobile keeps fixed spacing
and pans the row by a *measured* amount so the newest broom sits just inside the
right edge. Only the **title** keeps clear of the surprised photo — the note
below runs the full width, with the same margin left and right.

Under 900px of window height the title and note tighten (smaller type, less
padding) rather than the stage shrinking, because a smaller title costs less
than a smaller cutout of her. Below that the stage is capped against the text as
a backstop, so the brooms can never grow up through the joke.

**Her cutout is the same size regardless of language and regardless of how many
brooms there are.** Both were bugs worth naming, because both were invisible
until measured:

- the stage was sized against the *live* text, so the longer English copy made
  her smaller. It is now measured against a hidden twin of the column rendered
  in **both** locales, taking the taller.
- the row is absolutely positioned, so it shrink-to-fit the viewport; once the
  brooms outgrew it, flex squeezed the row and her image shrank as the count
  rose. Fixed with `w-max` plus `shrink-0`.

Verified at 1280×800, 1076×640 and 375×812, in both languages.

**Moving on** is a tap or Enter, cued by a line at the bottom — it leads to the
RSVP question.
