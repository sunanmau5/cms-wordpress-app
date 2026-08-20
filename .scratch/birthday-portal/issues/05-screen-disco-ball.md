# 05 — Screens 1 & 2: the disco-ball tapping game and the explosion

Type: prototype
Status: resolved
Blocked by: 01

## Question

The opening moment, and the single most important screen — it decides whether people keep going.

- The tap/enter mechanic: what a tap does visually, whether tapping faster matters, whether it can be failed or only completed.
- Where the brooms pop out from, how they accumulate, and how a running count is shown.
- What happens at 30: the confetti explosion, the "30 brooms!" line, and how long it holds before moving on.
- Accessibility and impatience: can a guest skip it? What happens if someone stops tapping at 12 and comes back later?
- Mobile-first: this must feel good under a thumb, not a mouse.

Prototype the mechanic before writing any copy.

## Answer

How the tapping game **plays** (how it *looks* is [01](01-visual-language.md)). Mechanics are built into the prototype (`app/30ans-prototype/`) and tested.

### The tap
- **30 taps, one broom each.** The count is literal — the thirtieth broom earns the explosion. ~8–10 seconds of thumbing.
- **Anywhere on screen, and any key** counts. Not aim-at-the-ball (it moves), not Enter-only.
- **Tapping faster does not give more brooms**, but the ball spins faster and glows harder — responsiveness, not a race. No timer, no score: a score invites comparison and that is a different site.
- **80ms minimum gap between brooms.** Fast taps queue rather than pile up, so the flight animation stays readable. Verified: 20 instant taps → 2 brooms at 120ms, all 20 out by 1.8s, none dropped.
- **Haptics**: 12ms buzz per broom, 60ms at 30. Android only; silently absent on iOS.

### No escape hatch
- **No skip link, no auto-explode.** Guests are all young and will enjoy it.
- **The RSVP is gated behind the game** — everyone plays first.
- **But the RSVP form gets its own URL**, unadvertised, so the user can send it directly when chasing non-repliers. → belongs to [07](07-rsvp-flow.md).

### Return visits
- **Fresh start every visit.** No resume, no memory of having finished.
- **"Restart the disco game" lives in the activities list** at the end, alongside the quiz and the wheel — it counts as one of the fun things to do, needs no new UI, and keeps every other screen clean. → belongs to [08](08-activities-hub.md).

### Loading
- **Starfield and title paint immediately; the ball fades in when ready.** Never a spinner — a spinner on a party invitation reads as a broken site.
- The ball (1MB) and mobile title (1.2MB) **must be compressed before launch**.

### Accessibility
- **`prefers-reduced-motion` respected**: brooms appear in place rather than flying, the ball neither sways nor shakes, stars and sparkles hold steady, confetti drops to 40 brief pieces. Written and type-checked; not yet seen running with the OS setting on.

### Sound
- **None.** Sourcing and licensing audio plus fighting autoplay blocking is an afternoon this deadline doesn't have. A clean v2 addition that changes nothing else.
