# 01 — Visual language and tone

Type: prototype
Status: resolved
Blocked by: —

## Question

What does this site *look and feel* like? Colours, typography, the disco/party register, how the broom motif is drawn, how "silly" versus "stylish" it sits. Every screen ticket inherits this, so it is decided first.

Resolve by building two or three cheap visual takes of the opening disco-ball screen (via `/prototype`) for the user to react to, rather than describing them in words.

Constraints already fixed: mobile-first, sits at `rina-wolf.com/[en|fr]/30ans`, must not inherit or disturb the portfolio site's design system.

## Answer

**Visual language: "Rinaverse" — dark, chrome, photographic.** Settled by prototyping four variants (`app/30ans-prototype/`); variant D won, A/B/C rejected. Refined over ~10 rounds of the user reacting to the running prototype.

### Background and stage
- Near-black `#030305` with ~130 small, faint, slowly twinkling stars. No bokeh, no colour washes.
- A very restrained white halo behind the ball, swelling slightly with the tap count.

### The ball
- The user's real disco-ball PNG (`public/30ans/disco-ball.png`). **No cord** — it floats, swaying gently.
- Grows ~7% and glows brighter as the count climbs. From **24 brooms** it shakes.

### The brooms
- The user's broom PNG (`public/30ans/broom.png`, gold sparkles baked in).
- One per tap, bursting **from the ball's centre**, flying **in front** of it.
- Direction by **golden angle plus a ±15° wobble** — evenly spread, never patterned. A hash-based random was tried first and clustered badly.
- Each flies a **curved path** (pushed sideways at the halfway point, perpendicular to travel), spins 220–920° in a **random direction**, then settles under light gravity and drifts slowly.
- Launch distance clears the ball (32–58vmin) so they ring it rather than cover it.

### Titles — supplied chrome PNGs, not web type
- **Desktop (≥640px)**: one-line `title-chrome-v21.png` (1400×204, 524KB).
- **Mobile (<640px)**: stacked two-line `title-chrome-v3.png` (1100px wide, 1.2MB — **needs compressing before launch**).
- The swap is automatic by screen width. Kept in **English in both locales** — "Enter the Rinaverse" is a brand, not a sentence.
- **Payoff titles**: `30-balais.png` (FR) / `30-brooms.png` (EN), landing with a slight overshoot.
- **Glow**: soft CSS drop-shadows following each PNG's alpha — a white edge, a silver halo, a faint gold bloom. Two separate strengths: hero `.12/.08/.05`, payoff `.20/.13/.08`.
- **Sparkles**: white four-point stars drawn as **SVG, not the ✦ glyph** (which rendered as a dark blob in some font fallbacks). 12 on the desktop title, 9 on mobile, 8 on the payoff. Peak opacity 0.6, 1.65s cycle, staggered.
- A specular **sweep** across the letters was built and rejected.

### No counter
No number, no progress bar. Tension is carried by animation alone.

### The ending
White flash → ball vanishes → **260 confetti pieces, silver and gold only** → payoff title lands → hero title fades to 25–35% → **2-second silent hold** → "Appuie ou tape sur Entrée pour continuer" fades in with a slow pulse and waits for a tap. **Never auto-advances.**

### Bottom line copy (four states)
| State | FR | EN |
|---|---|---|
| Before first tap | Appuie ou tape sur Entrée pour commencer | Tap or hit Enter to start |
| 1–14 brooms | *(empty)* | *(empty)* |
| From 15 brooms | Encore un peu… | Almost there… |
| 2s after the burst | Appuie ou tape sur Entrée pour continuer | Tap or hit Enter to continue |

### Both breakpoints are first-class
Mobile (375px) and desktop (1280px) are each explicitly composed: title version and width, ball size, broom size and spread all step per breakpoint.

### Rejected along the way
Nightclub-purple "Club Nuit", paper-cutout "Papier Fête", arcade-neon "Arcade 84"; a CSS-drawn mirror ball; web-font chrome (Bagel Fat One / Rubik Bubbles / Anton) for the hero title; the specular sweep; the hanging cord; a broom ring; the hash-based broom spread; a visible counter and progress bar.

### Carried forward
- The stacked mobile title must be compressed before launch (build task, not a design decision).
- Bagel Fat One + CSS chrome remains the stand-in for any heading without its own PNG.
