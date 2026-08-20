# 11 — Activity: the quiz

Type: grilling
Status: resolved
Blocked by: —

## Question

The user writes the questions entirely; this ticket decides everything around them.

- **Ten questions** — fixed by the Rina-Land tease in [08](08-activities-hub.md), which promises "10 questions". The answer format is still open (multiple choice? true/false? mixed?).
- Feedback: immediate right/wrong per question, or a score at the end.
- The end screen: score bands with funny labels? Does the user get to see who scored what, or is it purely for the guest?
- Whether a guest can retake it, and whether results go anywhere (sheet? nowhere?).
- Both languages: the questions need FR and EN versions — who writes which.

## Answer

Prototype: `app/30ans-prototype/quiz/` — `page.tsx`, `questions.ts`, `content.ts`, `editor/`.

### Format and content
- **Ten multiple-choice questions, four options each, exactly one correct.** Not true/false, not mixed.
- **Every option carries its own note**, and on reveal **all** notes are shown, not just the picked one — the wrong answers are where the jokes are.
- Content is **entirely the user's own**, both languages, written directly in `questions.ts` and `content.ts`: ten questions, their options and notes, the three intro lines, and all five score messages. **Never overwrite these files by hand.**
- A dev-only copy editor lives at `/30ans-prototype/quiz/editor` (API: `app/api/quiz-content/route.ts`). Add/remove answers (2–6), one-correct enforcement, a completeness list, and a localStorage draft with a restore banner. It **refuses to run in production** — a local authoring tool, so edits still need committing and deploying.

### Feedback and scoring
- **Immediate feedback per question.** Picking locks the question; the picked lamp lights green or red and wiggles, the correct one is always shown green, a right answer throws confetti.
- Score is **shown only at the end, only to the guest**. Nothing is recorded — no sheet row, no leaderboard. The intro says so in as many words ("your answers aren't saved", "there's no ranking at the end").
- **Five score bands**: nought, low (<40%), mid, high (≥80%), and full marks — full marks additionally drops a gold medal in 1.1s after the score, so the number is read first.
- **Retaking is free and unlimited** via "Play again", which returns to question 1 rather than the intro.

### Look and behaviour
- **Carnival treatment**: cream and red, rotating sunburst rays behind everything, bunting slung across the top, LED-lamp buttons as answers. **Rye is used for the sign only**; body copy stays Instrument Serif.
- **Timed intro**: background → bunting → the sign pops in centre-screen → the card mounts and the sign travels up to meet it via FLIP → the explanation lines. The sunburst rays turn during the intro and freeze on start.
- **The card is pinned to one screen and only the answers scroll**, so the question stays put above them and the button below. Below 660px of viewport height the page scrolls instead — a card that short cannot hold a question, four answers and a button at a readable size.
- **Next is an arrow, not a labelled button.** On desktop it sits outside the card, vertically centred, 18px clear of the right edge. On mobile it sits **inside** the card's bottom-right corner, 48px across with 26px insets, and the notes column gives up its whole footprint so no line ever passes underneath. (Three earlier placements were rejected: floating fixed over the notes covered up to 38px of the text column; padding the column cost 21% of every line's width; parking it below the card cost 72px of card height.)

### Short screens (settled 18 Aug)
A 13" laptop is wide but short, and the pinned card was sized for phones: it left the answers a 356px slot, so the last answer never landed on screen and the longest question hid 92px of its notes. Below 800px of height **and** 640px of width, the chrome around the answers tightens — card padding 28→16px, sign bottom margin 20→8px, row gaps 12→8px, answer pills 10→4px of padding with the label at 1.15rem and the lamp at 28px. All four answers and all their notes now fit whole on a 1440×760 screen.

Two things this ticket paid for and the map now carries as standing notes:
- The bunting is **96px tall while the quiz runs**, so the sign cannot be moved up on short screens — the bunting is what gives way (64px when compact). The sign's position is the intro's FLIP target.
- The **score screen reused the intro's spacing** (`mt-28` + `py-14`) and so fell below the fold on short screens; it needed the compact treatment too.
