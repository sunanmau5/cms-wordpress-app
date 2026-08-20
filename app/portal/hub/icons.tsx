// PROTOTYPE — no longer icons: what you see through each ENTRANCE of the big
// top. The illustration is the activity, so it has to read at ~90px and carry
// its own motion. Poster palette, flat shapes.
"use client";

const RED = "#c4302b";
const DEEPRED = "#9e241f";
const NAVY = "#2f3a66";
const GOLD = "#f2c14e";
const CREAM = "#fdf3d8";

export function Icon({ name }: { name: string }) {
  switch (name) {
    case "quiz": // a lamp on a plinth, glass lit
      return (
        <svg className="scene" height="100" viewBox="0 0 120 100" width="120">
          <circle className="lamp-glass" cx="60" cy="42" fill={GOLD} r="26" />
          <path d="M46 36a14 14 0 1 1 16 14v7" fill="none" stroke={DEEPRED} strokeLinecap="round" strokeWidth="6" />
          <circle cx="62" cy="66" fill={DEEPRED} r="4" />
          <path d="M34 74h52l6 16H28z" fill={RED} />
          <path d="M28 90h64" stroke={CREAM} strokeLinecap="round" strokeWidth="4" />
        </svg>
      );
    case "fit": // hat and spectacles on a stand
      return (
        <svg className="scene" height="100" viewBox="0 0 120 100" width="120">
          <path className="ic-hat" d="M60 8 78 44H42z" fill={RED} />
          <circle className="ic-hat" cx="60" cy="8" fill={GOLD} r="5" />
          <ellipse cx="60" cy="46" fill={DEEPRED} rx="22" ry="5" />
          <circle cx="46" cy="64" fill={NAVY} r="11" />
          <circle cx="74" cy="64" fill={NAVY} r="11" />
          <path d="M57 64h6M35 60h-8M85 60h8" stroke={NAVY} strokeLinecap="round" strokeWidth="4" />
          <path d="M52 78h16v16H52z" fill={RED} />
          <path d="M40 94h40" stroke={CREAM} strokeLinecap="round" strokeWidth="5" />
        </svg>
      );
    case "wheel": // a wheel that never stops
      return (
        <svg className="scene" height="100" viewBox="0 0 120 100" width="120">
          <g className="turn-slow" style={{ transformOrigin: "60px 48px" }}>
            <circle cx="60" cy="48" fill={CREAM} r="34" />
            <path d="M60 14a34 34 0 0 1 34 34z" fill={RED} />
            <path d="M60 82a34 34 0 0 1-34-34z" fill={GOLD} />
            <path d="M60 48H26a34 34 0 0 1 34-34z" fill={NAVY} />
            <path d="M60 48h34a34 34 0 0 1-34 34z" fill={DEEPRED} />
            <circle cx="60" cy="48" fill={CREAM} r="7" />
            <circle cx="60" cy="48" fill="none" r="34" stroke={DEEPRED} strokeWidth="4" />
          </g>
          <path d="M60 8 66 17H54z" fill={NAVY} />
          <path d="M36 92h48" stroke={CREAM} strokeLinecap="round" strokeWidth="5" />
        </svg>
      );
    case "gallery": // three plates hung on a wire
      return (
        <svg className="scene" height="100" viewBox="0 0 120 100" width="120">
          <path d="M8 16q52 16 104 0" fill="none" stroke={CREAM} strokeWidth="3" />
          <g className="sway-a" style={{ transformOrigin: "26px 20px" }}>
            <path d="M26 20v8" stroke={CREAM} strokeWidth="3" />
            <rect fill={RED} height="34" rx="2" width="30" x="11" y="28" />
            <rect fill={CREAM} height="22" width="22" x="15" y="32" />
            <circle cx="22" cy="40" fill={GOLD} r="4" />
          </g>
          <g className="sway-b" style={{ transformOrigin: "60px 26px" }}>
            <path d="M60 26v8" stroke={CREAM} strokeWidth="3" />
            <rect fill={NAVY} height="40" rx="2" width="34" x="43" y="34" />
            <rect fill={CREAM} height="28" width="26" x="47" y="38" />
            <path d="m47 62 8-9 6 6 5-4 7 9z" fill={RED} />
          </g>
          <g className="sway-a" style={{ transformOrigin: "94px 20px", animationDelay: "-1.1s" }}>
            <path d="M94 20v8" stroke={CREAM} strokeWidth="3" />
            <rect fill={GOLD} height="34" rx="2" width="30" x="79" y="28" />
            <rect fill={CREAM} height="22" width="22" x="83" y="32" />
            <circle cx="90" cy="40" fill={NAVY} r="4" />
          </g>
        </svg>
      );
    case "quotes": // speech banners strung up
      return (
        <svg className="scene" height="100" viewBox="0 0 120 100" width="120">
          <g className="sway-a" style={{ transformOrigin: "40px 12px" }}>
            <path d="M14 22h52v26H40l-10 9v-9H14z" fill={CREAM} />
            <circle cx="28" cy="35" fill={RED} r="4" />
            <circle cx="40" cy="35" fill={RED} r="4" />
            <circle cx="52" cy="35" fill={RED} r="4" />
          </g>
          <g className="sway-b" style={{ transformOrigin: "80px 50px" }}>
            <path d="M54 56h52v26H80l-10 9v-9H54z" fill={NAVY} />
            <circle cx="68" cy="69" fill={GOLD} r="4" />
            <circle cx="80" cy="69" fill={GOLD} r="4" />
            <circle cx="92" cy="69" fill={GOLD} r="4" />
          </g>
        </svg>
      );
    default: // a mirror ball hanging in the dark
      return (
        <svg className="scene" height="100" viewBox="0 0 120 100" width="120">
          <path d="M60 4v14" stroke={CREAM} strokeWidth="3" />
          <g className="turn-slow" style={{ transformOrigin: "60px 52px" }}>
            <circle cx="60" cy="52" fill={NAVY} r="30" />
            <path d="M30 52h60M60 22v60" stroke={CREAM} strokeWidth="2.4" opacity=".85" />
            <path d="M38 33c13 8 31 8 44 0M38 71c13-8 31-8 44 0" fill="none" stroke={CREAM} strokeWidth="2.4" opacity=".85" />
            <circle cx="48" cy="40" fill={GOLD} r="5" />
            <circle cx="70" cy="62" fill={CREAM} r="3.4" opacity=".9" />
          </g>
        </svg>
      );
  }
}
