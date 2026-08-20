// PROTOTYPE — throwaway, DEV ONLY. Arrow chooser for the fortune-cookie hint.
// Round 2: the user picked the "steep drop, open head" arrow but wants it
// SHORTER with the word ABOVE it. Four short variants at real size against the
// real cookie on the real background — pick by number.

"use client";

import { Instrument_Serif } from "next/font/google";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const SERIF = instrument.className;
const DEEPRED = "#9e241f";
const PACK = "/30ans/cookie-packaging.png";

// same family as the chosen arrow: a steep drop with an open head
function V1() {
  return (
    <svg fill="none" height="34" viewBox="0 0 44 40" width="37">
      <path d="M7 5 C5 19 12 28 30 32" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2.2" />
      <path d="M32 33 L21 36 M32 33 L24 26" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}
function V2() {
  return (
    <svg fill="none" height="28" viewBox="0 0 38 34" width="32">
      <path d="M6 4 C5 15 10 22 24 26" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2.1" />
      <path d="M26 27 L16 29 M26 27 L19 21" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2.1" />
    </svg>
  );
}
function V3() {
  return (
    <svg fill="none" height="24" viewBox="0 0 32 28" width="27">
      <path d="M5 4 C4 12 8 18 19 21" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2" />
      <path d="M21 22 L13 24 M21 22 L15 17" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
function V4() {
  return (
    <svg fill="none" height="30" viewBox="0 0 30 36" width="25">
      <path d="M8 4 C5 14 6 22 16 28" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2.1" />
      <path d="M18 29 L9 29 M18 29 L14 21" stroke={DEEPRED} strokeLinecap="round" strokeWidth="2.1" />
    </svg>
  );
}

// the chosen arrow (V1), shown at three positions: higher, and further right
const ARROWS = [
  { n: 1, el: <V1 />, note: "higher + right", right: 58, bottom: 84 },
  { n: 2, el: <V1 />, note: "higher still + more right", right: 48, bottom: 98 },
  { n: 3, el: <V1 />, note: "highest + furthest right", right: 38, bottom: 112 },
];

export default function ArrowChooser() {
  return (
    <div style={{ minHeight: "100vh", background: "#efdcbc", padding: "24px 20px 60px" }}>
      <h1 className={SERIF} style={{ textAlign: "center", color: DEEPRED, fontSize: 26, marginBottom: 4 }}>
        Arrow 1 — pick the position
      </h1>
      <p className={SERIF} style={{ textAlign: "center", color: "#3a2118", opacity: 0.7, marginBottom: 24, fontSize: 15 }}>
        Real size, real cookie, real background.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {ARROWS.map((a) => (
          <div
            key={a.n}
            style={{
              position: "relative",
              background: "rgba(255,253,244,.5)",
              border: "2px solid rgba(158,36,31,.25)",
              borderRadius: 12,
              height: 210,
            }}
          >
            <span className={SERIF} style={{ position: "absolute", top: 8, left: 12, color: DEEPRED, fontSize: 22 }}>
              {a.n}
            </span>
            <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, color: "#3a2118", opacity: 0.5 }}>
              {a.note}
            </span>

            {/* the hint: word ABOVE the arrow, as asked */}
            <div
              style={{
                position: "absolute",
                right: a.right,
                bottom: a.bottom,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span className={SERIF} style={{ fontSize: 15, color: DEEPRED, lineHeight: 1, whiteSpace: "nowrap" }}>
                Ouvre-moi !
              </span>
              {a.el}
            </div>

            <img alt="" src={PACK} style={{ position: "absolute", right: 12, bottom: 10, width: 56, height: "auto" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
