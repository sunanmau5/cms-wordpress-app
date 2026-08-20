"use client";

// The first chapter, all on one URL (/portal): the opening "30 balais" reveal,
// then the joke. The opening -> joke hop is a same-page left slide (the joke's
// own arrow then navigates cross-route to /portal/rsvp). The language picker is
// added ahead of the opening in a later step.

import { useState } from "react";

import { JokeScreen } from "./JokeScreen";
import { LanguagePicker } from "./LanguagePicker";
import { OpeningScreen } from "./OpeningScreen";

type Stage = "picker" | "opening" | "joke";

// same-page directional slide via the View Transitions API; transitions.css
// keys its slide keyframes off data-vt on <html>. Instant where unsupported.
function slide(dir: "left", update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (!doc.startViewTransition) {
    update();
    return;
  }
  document.documentElement.dataset.vt = dir;
  doc
    .startViewTransition(update)
    .finished.catch(() => {})
    .finally(() => {
      delete document.documentElement.dataset.vt;
    });
}

export default function PortalPage() {
  const [stage, setStage] = useState<Stage>("picker");

  if (stage === "picker") {
    return <LanguagePicker onPick={() => slide("left", () => setStage("opening"))} />;
  }
  if (stage === "joke") return <JokeScreen />;
  return <OpeningScreen onDone={() => slide("left", () => setStage("joke"))} />;
}
