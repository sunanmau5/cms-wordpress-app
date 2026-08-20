# 18 — Build the RINA-LAND activities hub

Type: build
Status: open
Blocked by: —

## Question

[08](08-activities-hub.md) decided the hub's content and is resolved — the name, the six
activities, their one-line teases, the save-the-date marquee, and the user's FR/EN copy
recorded verbatim. **None of it is built**: there is no prototype for the hub, while the
disco tap, joke, RSVP, gallery, quiz and wall all have one. It is the screen every
activity is reached from, so it blocks the portal being usable end to end.

This ticket is the build, and the layout questions 08 did not settle:

- **How the six activities are arranged** — a list, a grid, scattered fairground signs?
  Each is a chrome title plus a one-line tease, which is a tall unit; six of them will not
  fit one mobile screen without either scrolling or shrinking.
- **What the background is.** Starfield like the RSVP screen, the quiz's carnival sunburst,
  or something of its own. The hub sits between the two, so it decides which world the
  guest is in.
- **Whether the two unbuilt games (12 Birthday Fit, 13 wheel) appear before they exist** —
  greyed out, hidden, or listed with a "coming soon" tease. If the link goes out before
  they are built, this is what guests will hit.
- **How the guest gets back to the hub** from inside an activity, and whether Disco Tap
  restarting the game from here matches what [05](05-screen-disco-ball.md) decided.
- **The marquee's behaviour** — speed, whether it pauses on hover, and how it reads on
  mobile.

Both breakpoints get checked before this closes: 375px and 1280px, plus the short-laptop
case that [11](11-quiz.md) had to solve separately.
