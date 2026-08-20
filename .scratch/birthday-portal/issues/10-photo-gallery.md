# 10 — Activity: photo gallery

Type: grilling
Status: resolved
Blocked by: — (03 superseded; photos supplied directly)

## Question

- What the gallery is *of*, and what makes it fun rather than a portfolio grid — captions? years? a "guess the year" framing?
- Layout on mobile, tap-to-enlarge behaviour, ordering.
- Image weight: how the photos are sized and lazy-loaded so the page is usable on 4G.
- Confirm publicly visible to anyone with the link is acceptable for every photo in the set.

## Answer

Prototype: `app/30ans-prototype/gallery/` (`page.tsx`, `copy.ts`, generated
`photos.ts`). Titled **Photo Gallery / Galerie photo**.

**What makes it fun: it's a field, not a grid.** All 47 photos are on screen at
once, drifting on a small rAF sim.

**Depth is what separates it from the quote wall**, which was the real risk —
both are "floating things you open". Here every photo has a *z*: near ones are
bigger, brighter, sharper and travel faster; far ones are small, dim and
slightly blurred. The wall is a single plane; this has parallax.

**Nothing ever overlaps.** Photos collide with each other — separated along
whichever axis they overlap least, swapping that component of the velocity, the
same resolution the wall uses — and the title is a solid box they bounce off.
Verified after six seconds of drift: 0 overlapping pairs, 0 off-screen. This is
why they are small (40–95px): the user asked for all of them visible *and*
never overlapping, and those two constraints together set the size.

**Opening: click or tap, on every device.** Hover was rejected as the only
route in because phones don't have it. The field dims and slows to a crawl, the
photo comes up full size with its caption, and disco balls dance around it.
Closes on tap-away, Escape, or an **X** icon (no worded button).

**Hover on desktop** scales a photo to ~2×, clears its depth blur, brightens it
and adds a layered white glow, lifting it above everything. Suppressed on touch
devices, and dropped the instant a photo is opened — otherwise the thumbnail
underneath stayed blown up until the mouse moved.

**Cursor**: the site's big black custom cursor is overridden to the normal one
on this screen only — it swallowed the pointer on a dark field of small photos.
A "funky" replacement may come later.

**Captions: one line per photo, FR and EN, the user's own words.** 46 of 47 are
written; `IMG_6455` is deliberately blank and simply opens without one.

**Weight — the part that mattered.** The folder arrived at **36MB**, unusable on
phone data. Two derived sets are generated with `sips`:
`gallery/thumbs/` at 420px (**1.9MB for all 47**, what floats) and
`gallery/web/` at 1500px (fetched only when a photo is opened). Originals stay
untouched. Thumbnails are `loading="lazy"`.

**Ordering** is alphabetical by filename, i.e. arbitrary — acceptable only
because every photo is now shown at once. If a subset is ever reintroduced,
order has to be decided.

**Consent**: confirmed by the user — every photo in the set is fine being
visible to anyone with the link.

## Tooling built for this

- **Caption editor** at `/30ans-prototype/gallery/captions` (dev only): every
  photo with an FR and EN box, saving through `app/api/gallery-captions/route.ts`
  which rewrites `photos.ts`. Built because 47 opaque filenames can't be
  captioned by hand.
- Filenames must be URL-safe. Eight of the user's files had spaces or
  parentheses and were renamed; the save route now **rejects** unsafe ids rather
  than silently skipping them, which had quietly dropped eight entries.
- The route also **drops entries whose thumbnail no longer exists**: an editor
  tab opened before a photo was deleted otherwise resurrects it on save.

## Gotcha paid for here

A `<style>` element with its CSS as a **text child** fails hydration when dev
rebuilds desync it ("Text content does not match server-rendered HTML"). Set it
with `dangerouslySetInnerHTML` instead.
