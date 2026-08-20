# 13 — Activity: wheel of fortune

Type: prototype
Status: pending — prototype built, content and background still with the user
Blocked by: — (01 resolved long ago)

## Question

- The eight (or however many) gag prizes — the user writes the list, in both languages.
- The spin mechanic: tap to spin, how long it spins, whether the result is genuinely random or weighted.
- What the guest sees on landing a prize, and whether they can spin again.
- Whether a prize is ever "claimable" at the party or purely a joke on screen.

## Progress so far (18 Aug) — prototype built, NOT resolved

Prototype: `app/30ans-prototype/wheel/` — `page.tsx`, `prizes.ts`.

### Mechanic, settled
- **Six named areas on the outer band, three prizes each — eighteen cells.** Started at four
  per area; the labels overflowed their 15° cells, so it went to three at 20°.
- The wheel stops on a **prize cell**, and the reveal names the area then the prize. The
  outcome is drawn first and the wheel is *told* where to stop — never read off the angle
  afterwards, which is where "it landed on the line" bugs come from. Verified repeatedly:
  the announced prize is always the cell under the pointer.
- **The whole wheel is the tap target.** No spin button — an early one was too big and out
  of place. The centre is a small embossed dot, 4% of the wheel.
- Pointer sits at the **prize ring's** outer edge, not on the rim, so it points at a cell.
- Reduced motion gets one turn instead of five.

### Look, settled
- The quiz's world: sunburst, bunting, Rye sign, cream card.
- **Spectrum order** around the wheel — red, orange, green, blue, indigo, magenta. An
  earlier arbitrary order read as random; mustard and mint were rejected outright.
- Each area's three prizes run **dark → light** in a fixed order, lightness 56/68/80 —
  gentle steps. Opacity tints (washed out) and 12-point jumps (too harsh) were both tried.
- **Ivory-gold rim** with 24 bulbs set *into* it, each with a blurred halo pulsing in
  antiphase. White was too harsh; a brown frame was worse. NB: `box-shadow` does nothing on
  an SVG circle — an early "glow" never rendered.
- Area names curve along the band in white; prize labels sit in Instrument Serif, all one
  ink, anchored so they **all end on the same radius** and line up.
- **Label direction must be computed from where the wheel SETTLED**, not from the slice's
  design angle. This was got wrong three times: a static rule is correct at rest and wrong
  after every spin. Both the area arcs and the prize labels now use the settled angle.
- Wide screens: the result card **opens out of nothing and pushes the wheel off centre**,
  then closes and lets it return. Short screens cap the wheel against viewport height.

### Still with the user
- **The wording of all 18 prizes and the 6 area names** — everything currently in
  `prizes.ts` is placeholder text written by Claude, in both languages.
  Each prize needs TWO strings: a one-word label for its cell (~10 characters) and the full
  line for the reveal. Area names must stay short — long ones are auto-shrunk to fit.
- **The background colour** — user wants a quick review of it.
- Six prizes were dropped when the wheel went from four per area to three; re-add whichever
  are worth keeping.
- A content editor like the quiz's, once the wording settles.
