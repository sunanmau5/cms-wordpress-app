// PROTOTYPE — throwaway, DEV ONLY. RINA-LAND sign chooser.
// Red background, white type, light bulbs, one line — a few variations to pick
// from before wiring the winner into the hub header.

"use client";

import { Rye } from "next/font/google";

const rye = Rye({ subsets: ["latin"], weight: "400" });
const FUNFAIR = rye.className;

const RED = "#c4302b";
const DEEPRED = "#9e241f";
const NAVY = "#2f3a66";
const GOLD = "#f2c14e";
const CREAM = "#fdf3d8";

// a rounded-rectangle path (so bulbs can ride the border as a dashed stroke)
function rr(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}
const SCALLOP =
  "M280 14 C233 14 229 33 189 35 C144 37 114 22 86 35 C52 50 39 54 39 86 C39 118 52 122 86 137 C114 150 144 135 189 137 C229 139 233 158 280 158 C327 158 331 139 371 137 C416 135 446 150 474 137 C508 122 521 118 521 86 C521 54 508 50 474 35 C446 22 416 37 371 35 C331 33 327 14 280 14 Z";

type Sign = {
  n: number;
  note: string;
  bg: string;
  border?: string;
  bulb: string;
  bulb2?: string;
  text: string;
  shape: "rect" | "scallop";
};

const RECT = rr(14, 14, 532, 132, 26);

const SIGNS: Sign[] = [
  { n: 1, note: "red · gold bulbs · gold trim", bg: RED, border: GOLD, bulb: GOLD, text: "#ffffff", shape: "rect" },
  { n: 2, note: "red · white bulbs · scalloped", bg: RED, border: CREAM, bulb: CREAM, text: "#ffffff", shape: "scallop" },
  { n: 3, note: "deep red · alternating gold/white bulbs", bg: DEEPRED, border: GOLD, bulb: GOLD, bulb2: "#fff", text: "#ffffff", shape: "rect" },
  { n: 4, note: "red · navy trim · white bulbs", bg: RED, border: NAVY, bulb: "#fff", text: "#ffffff", shape: "rect" },
];

function SignSVG({ s }: { s: Sign }) {
  const d = s.shape === "rect" ? RECT : SCALLOP;
  return (
    <svg viewBox="0 0 560 160" width="100%" style={{ display: "block" }}>
      {s.border && <path d={d} fill="none" stroke={s.border} strokeWidth="10" />}
      <path d={d} fill={s.bg} stroke={s.border ?? s.bg} strokeWidth="3" />
      {/* bulbs riding the border as round dashes */}
      <path className="sign-bulbs" d={d} fill="none" stroke={s.bulb} strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 21" />
      {s.bulb2 && (
        <path className="sign-bulbs2" d={d} fill="none" stroke={s.bulb2} strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 21" strokeDashoffset="10.5" />
      )}
      <text className={FUNFAIR} x="280" y="88" fill={s.text} textAnchor="middle" dominantBaseline="central" fontSize="66" lengthAdjust="spacingAndGlyphs" textLength="420"
        style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.12)", strokeWidth: 1 }}>
        RINA-LAND
      </text>
    </svg>
  );
}

export default function SignChooser() {
  return (
    <div style={{ minHeight: "100vh", background: "#efdcbc", padding: "26px 20px 60px" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sign-bulbs { animation: signChase 7s linear infinite; }
        .sign-bulbs2 { animation: signChase 7s linear infinite; }
        @keyframes signChase { to { stroke-dashoffset: -21.1 } }
      ` }} />
      <h1 className={FUNFAIR} style={{ textAlign: "center", color: RED, fontSize: 30, marginBottom: 4 }}>
        Pick a sign — say the number
      </h1>
      <p style={{ textAlign: "center", color: "#3a2118", opacity: 0.6, marginBottom: 26, fontSize: 14 }}>
        Red background, white type, light bulbs, one line. Bulbs animate (chase).
      </p>
      <div style={{ display: "grid", gap: 22, maxWidth: 620, margin: "0 auto" }}>
        {SIGNS.map((s) => (
          <div key={s.n}>
            <div style={{ fontSize: 13, color: "#3a2118", opacity: 0.7, marginBottom: 6 }}>
              <b style={{ color: RED }}>{s.n}.</b> {s.note}
            </div>
            <SignSVG s={s} />
          </div>
        ))}
      </div>
    </div>
  );
}
