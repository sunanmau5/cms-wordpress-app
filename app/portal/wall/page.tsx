// PROTOTYPE — throwaway route. Three readings of "floating quotes", ?variant=A|B|C.
// Question: .scratch/birthday-portal/issues/09-quote-wall.md

"use client";

import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Fraunces,
  IBM_Plex_Sans,
  Instrument_Serif,
  Inter,
  Newsreader,
  Poppins,
} from "next/font/google";

import { BackToHub } from "../BackToHub";
import { useLocale } from "../locale";

import { type Quote, QUOTES } from "./quotes";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400" });
const fraunces = Fraunces({ subsets: ["latin"], weight: "400" });
const newsreader = Newsreader({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "500" });
// Inter ships no italic face in this Next version, so the attributions use a
// grotesk that has a real one rather than a browser-synthesised slant.
const plexItalic = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const SERIFS = [
  {
    key: "instrument",
    label: "Instrument Serif",
    className: instrument.className,
  },
  { key: "fraunces", label: "Fraunces", className: fraunces.className },
  { key: "newsreader", label: "Newsreader", className: newsreader.className },
];

const ALL: Quote[] = QUOTES;

// paper texture: soft grain over a warm grey, no image asset
const PAPER: React.CSSProperties = {
  backgroundColor: "#f4f3f1",
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E"),
    radial-gradient(circle at 30% 20%, #ffffff 0%, transparent 55%),
    radial-gradient(circle at 75% 80%, #ffffff 0%, transparent 50%)
  `,
};

const rand = (i: number, salt: number) =>
  (((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1) + 1) % 1;

// Scatter without collisions: lay the quotes on a coarse grid, then jitter each
// one inside its own cell. Looks random, never stacks.
const CELL_W = 560;
const CELL_H = 340;
function cellPos(i: number, cols: number) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  return {
    x: (col - (cols - 1) / 2) * CELL_W + (rand(i, 7) - 0.5) * 150,
    y: (row - 1) * CELL_H + (rand(i, 8) - 0.5) * 110,
  };
}

// An Archimedean spiral, wound outward from the centre. Type set along this
// reads as a swirl — the letters themselves spiral, rather than the block of
// text travelling along a curve.
const SPIRAL_PATH =
  "M 300.0,286.0 L 300.6,285.5 L 301.3,285.1 L 302.1,284.7 L 302.8,284.3 L 303.6,283.9 L 304.5,283.7 L 305.3,283.4 L 306.3,283.2 L 307.2,283.0 L 308.1,282.9 L 309.1,282.9 L 310.1,282.9 L 311.2,282.9 L 312.2,283.0 L 313.2,283.2 L 314.3,283.4 L 315.3,283.7 L 316.4,284.1 L 317.5,284.5 L 318.5,285.0 L 319.6,285.5 L 320.6,286.2 L 321.6,286.8 L 322.6,287.6 L 323.6,288.4 L 324.5,289.2 L 325.4,290.2 L 326.3,291.1 L 327.2,292.2 L 328.0,293.3 L 328.7,294.4 L 329.4,295.7 L 330.1,296.9 L 330.7,298.2 L 331.2,299.6 L 331.7,301.0 L 332.1,302.4 L 332.4,303.9 L 332.7,305.4 L 332.9,307.0 L 333.1,308.6 L 333.1,310.2 L 333.1,311.8 L 333.0,313.5 L 332.8,315.1 L 332.5,316.8 L 332.2,318.5 L 331.7,320.1 L 331.2,321.8 L 330.6,323.5 L 329.9,325.1 L 329.1,326.8 L 328.3,328.4 L 327.3,330.0 L 326.2,331.6 L 325.1,333.1 L 323.9,334.6 L 322.6,336.0 L 321.2,337.4 L 319.7,338.8 L 318.2,340.0 L 316.6,341.3 L 314.9,342.4 L 313.1,343.5 L 311.3,344.5 L 309.4,345.5 L 307.5,346.3 L 305.5,347.1 L 303.4,347.8 L 301.3,348.4 L 299.1,348.9 L 296.9,349.3 L 294.7,349.6 L 292.4,349.8 L 290.1,349.9 L 287.7,349.9 L 285.4,349.8 L 283.0,349.5 L 280.7,349.2 L 278.3,348.7 L 275.9,348.1 L 273.6,347.5 L 271.2,346.7 L 268.9,345.7 L 266.6,344.7 L 264.4,343.6 L 262.1,342.3 L 259.9,340.9 L 257.8,339.4 L 255.7,337.8 L 253.7,336.1 L 251.7,334.3 L 249.8,332.4 L 248.0,330.4 L 246.3,328.3 L 244.6,326.1 L 243.1,323.8 L 241.6,321.4 L 240.2,318.9 L 239.0,316.3 L 237.8,313.7 L 236.8,311.0 L 235.9,308.3 L 235.1,305.5 L 234.4,302.6 L 233.9,299.7 L 233.5,296.7 L 233.2,293.7 L 233.1,290.7 L 233.1,287.6 L 233.2,284.5 L 233.5,281.4 L 233.9,278.3 L 234.5,275.2 L 235.2,272.2 L 236.0,269.1 L 237.1,266.0 L 238.2,263.0 L 239.5,260.0 L 240.9,257.1 L 242.5,254.2 L 244.2,251.4 L 246.1,248.6 L 248.1,245.9 L 250.2,243.3 L 252.5,240.7 L 254.9,238.3 L 257.4,235.9 L 260.1,233.7 L 262.8,231.5 L 265.7,229.5 L 268.7,227.6 L 271.7,225.8 L 274.9,224.2 L 278.2,222.6 L 281.5,221.3 L 285.0,220.0 L 288.5,219.0 L 292.0,218.0 L 295.7,217.3 L 299.3,216.7 L 303.1,216.2 L 306.8,216.0 L 310.6,215.9 L 314.4,215.9 L 318.3,216.2 L 322.1,216.6 L 325.9,217.2 L 329.8,218.0 L 333.6,218.9 L 337.4,220.1 L 341.1,221.4 L 344.8,222.8 L 348.5,224.5 L 352.1,226.3 L 355.6,228.3 L 359.0,230.5 L 362.4,232.8 L 365.7,235.3 L 368.9,238.0 L 371.9,240.8 L 374.9,243.8 L 377.7,246.9 L 380.4,250.1 L 383.0,253.5 L 385.4,257.0 L 387.7,260.7 L 389.8,264.4 L 391.8,268.3 L 393.6,272.3 L 395.2,276.4 L 396.6,280.5 L 397.9,284.8 L 398.9,289.1 L 399.8,293.5 L 400.5,297.9 L 401.0,302.4 L 401.3,306.9 L 401.4,311.5 L 401.2,316.0 L 400.9,320.6 L 400.4,325.2 L 399.6,329.8 L 398.7,334.4 L 397.5,338.9 L 396.1,343.4 L 394.5,347.8 L 392.7,352.2 L 390.7,356.6 L 388.5,360.8 L 386.1,365.0 L 383.5,369.1 L 380.7,373.1 L 377.7,376.9 L 374.6,380.7 L 371.2,384.3 L 367.7,387.8 L 364.0,391.1 L 360.2,394.3 L 356.2,397.3 L 352.0,400.1 L 347.7,402.8 L 343.3,405.3 L 338.7,407.5 L 334.0,409.6 L 329.3,411.5 L 324.4,413.2 L 319.4,414.6 L 314.3,415.9 L 309.2,416.9 L 304.0,417.7 L 298.8,418.2 L 293.5,418.5 L 288.2,418.6 L 282.8,418.5 L 277.5,418.1 L 272.1,417.4 L 266.8,416.5 L 261.5,415.4 L 256.2,414.1 L 251.0,412.4 L 245.8,410.6 L 240.7,408.5 L 235.7,406.2 L 230.8,403.6 L 225.9,400.8 L 221.2,397.8 L 216.6,394.6 L 212.1,391.1 L 207.8,387.5 L 203.6,383.6 L 199.6,379.5 L 195.8,375.3 L 192.1,370.9 L 188.7,366.2 L 185.4,361.4 L 182.3,356.5 L 179.5,351.4 L 176.9,346.2 L 174.5,340.8 L 172.3,335.3 L 170.4,329.7 L 168.7,324.0 L 167.3,318.2 L 166.1,312.3 L 165.2,306.4 L 164.6,300.4 L 164.2,294.3 L 164.1,288.2 L 164.3,282.1 L 164.7,276.0 L 165.4,269.9 L 166.4,263.8 L 167.7,257.8 L 169.2,251.8 L 171.1,245.8 L 173.2,239.9 L 175.5,234.1 L 178.2,228.4 L 181.0,222.8 L 184.2,217.3 L 187.6,211.9 L 191.3,206.6 L 195.2,201.6 L 199.3,196.6 L 203.7,191.9 L 208.3,187.3 L 213.1,183.0 L 218.1,178.8 L 223.3,174.9 L 228.7,171.2 L 234.3,167.7 L 240.1,164.4 L 246.0,161.4 L 252.0,158.7 L 258.2,156.2 L 264.6,154.1 L 271.0,152.1 L 277.5,150.5 L 284.1,149.2 L 290.8,148.1 L 297.6,147.4 L 304.4,146.9 L 311.3,146.8 L 318.1,146.9 L 325.0,147.4 L 331.9,148.2 L 338.7,149.3 L 345.5,150.7 L 352.3,152.4 L 359.0,154.4 L 365.6,156.7 L 372.1,159.4 L 378.6,162.3 L 384.9,165.5 L 391.0,169.0 L 397.1,172.8 L 403.0,176.9 L 408.7,181.2 L 414.2,185.8 L 419.5,190.7 L 424.7,195.8 L 429.6,201.1 L 434.2,206.7 L 438.7,212.5 L 442.8,218.5 L 446.8,224.7 L 450.4,231.1 L 453.8,237.7 L 456.9,244.4 L 459.7,251.3 L 462.1,258.4 L 464.3,265.5 L 466.2,272.8 L 467.7,280.2 L 468.9,287.6 L 469.8,295.1 L 470.3,302.7 L 470.5,310.3 L 470.4,317.9 L 469.9,325.5 L 469.1,333.2 L 467.9,340.8 L 466.4,348.3 L 464.6,355.9 L 462.4,363.3 L 459.9,370.7 L 457.0,377.9 L 453.8,385.1 L 450.3,392.1 L 446.4,399.0 L 442.3,405.7 L 437.8,412.2 L 433.1,418.6 L 428.0,424.7 L 422.7,430.6 L 417.1,436.3 L 411.2,441.8 L 405.0,447.0 L 398.7,451.9 L 392.1,456.6 L 385.2,461.0 L 378.2,465.1 L 371.0,468.8 L 363.6,472.3 L 356.0,475.4 L 348.2,478.2 L 340.4,480.6 L 332.4,482.7 L 324.3,484.5 L 316.1,485.9 L 307.8,486.9 L 299.5,487.6 L 291.1,487.8 L 282.7,487.8 L 274.3,487.3 L 265.9,486.4 L 257.6,485.2 L 249.2,483.6 L 241.0,481.7 L 232.8,479.3 L 224.7,476.6 L 216.7,473.5 L 208.8,470.1 L 201.1,466.3 L 193.5,462.1 L 186.1,457.6 L 178.9,452.8 L 171.9,447.6 L 165.1,442.1 L 158.6,436.3 L 152.3,430.2 L 146.3,423.8 L 140.5,417.1 L 135.1,410.2 L 129.9,403.0 L 125.1,395.6 L 120.5,387.9 L 116.3,380.0 L 112.5,372.0 L 109.0,363.7 L 105.9,355.3 L 103.2,346.7 L 100.8,338.0 L 98.8,329.2 L 97.2,320.2 L 96.0,311.2 L 95.2,302.1 L 94.9,293.0 L 94.9,283.9 L 95.3,274.7 L 96.2,265.5 L 97.4,256.4 L 99.1,247.3 L 101.2,238.3 L 103.6,229.3 L 106.5,220.5 L 109.8,211.7 L 113.5,203.1 L 117.6,194.7 L 122.0,186.4 L 126.8,178.3 L 132.0,170.4 L 137.6,162.8 L 143.5,155.3 L 149.7,148.2 L 156.3,141.3 L 163.2,134.6 L 170.4,128.3 L 177.9,122.3 L 185.7,116.7 L 193.7,111.3 L 202.0,106.3 L 210.5,101.7 L 219.2,97.5 L 228.1,93.6 L 237.2,90.2 L 246.5,87.1 L 255.9,84.4 L 265.5,82.2 L 275.2,80.4 L 284.9,79.0 L 294.8,78.1 L 304.7,77.6 L 314.6,77.5 L 324.5,77.9 L 334.5,78.7 L 344.4,80.0 L 354.2,81.7 L 364.0,83.9 L 373.7,86.5 L 383.3,89.5 L 392.8,93.0 L 402.2,96.9 L 411.3,101.2 L 420.3,105.9 L 429.1,111.1 L 437.7,116.6 L 446.0,122.5 L 454.1,128.8 L 461.9,135.5 L 469.4,142.5 L 476.7,149.9 L 483.6,157.6 L 490.1,165.6 L 496.3,174.0 L 502.1,182.6 L 507.6,191.5 L 512.7,200.6 L 517.3,210.0 L 521.6,219.6 L 525.4,229.4 L 528.8,239.3 L 531.8,249.5 L 534.3,259.7 L 536.3,270.1 L 537.9,280.6 L 539.0,291.2 L 539.7,301.9 L 539.8,312.6 L 539.5,323.3 L 538.7,334.0 L 537.5,344.7 L 535.7,355.3 L 533.5,365.9 L 530.8,376.3 L 527.7,386.7 L 524.0,396.9 L 519.9,407.0 L 515.4,416.9 L 510.4,426.7 L 505.0,436.2 L 499.1,445.4 L 492.8,454.5 L 486.1,463.2 L 479.0,471.7 L 471.5,479.8 L 463.7,487.6 L 455.5,495.1 L 446.9,502.3";

function Sparkle({
  size,
  delay,
  left,
  top,
}: {
  size: number;
  delay: number;
  left: string;
  top: string;
}) {
  return (
    <svg
      className="pointer-events-none absolute"
      height={size}
      style={{
        left,
        top,
        filter: "drop-shadow(0 0 5px rgba(255,255,255,.8))",
        animation: `pop 1.9s ease-in-out ${delay}s infinite`,
      }}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 0c.6 7.2 4.2 10.8 12 12-7.8 1.2-11.4 4.8-12 12-.6-7.2-4.2-10.8-12-12C7.8 10.8 11.4 7.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const NIGHT_STARS = Array.from({ length: 90 }).map((_, i) => ({
  left: rand(i, 21) * 100,
  top: rand(i, 22) * 100,
  size: 1 + rand(i, 23) * 2.2,
  opacity: 0.15 + rand(i, 24) * 0.45,
  duration: 3 + rand(i, 25) * 4,
  delay: rand(i, 26) * 6,
}));

// Text mapped onto a sphere. Each character is placed by where it would sit on
// the surface: the middle of a line comes toward you (bigger, pushed outward),
// the ends wrap away (squeezed horizontally, tilted, slightly dimmer).
function SphereLine({
  text,
  row, // -1 top, 0 equator, 1 bottom
  size,
}: {
  text: string;
  row: number;
  size: number;
}) {
  const chars = text.split("");
  const n = chars.length;

  return (
    <span
      className="flex items-center justify-center"
      style={{ fontSize: size }}
    >
      {chars.map((c, i) => {
        // u: -1 at the left edge of the line, +1 at the right
        const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
        const bulge = 1 - u * u; // 1 in the middle, 0 at the ends
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              // Lines of latitude: above the equator the ends ride HIGHER
              // than the middle, below it they hang lower. row = -1 top,
              // 0 equator, +1 bottom.
              transform: [
                `translateY(${-row * 13 * (1 - bulge)}px)`,
                `scaleX(${0.6 + 0.4 * Math.sqrt(bulge)})`,
                `scaleY(${0.94 + 0.06 * bulge})`,
                `rotate(${-row * u * 15}deg)`,
              ].join(" "),
              opacity: 0.72 + 0.28 * bulge,
            }}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
}

// The arriving message. Wound state: the letters are set ALONG an Archimedean
// spiral by arc length — shoulder to shoulder, each rotated tangentially, so it
// reads as a tight coil of text. Then they unwind into their natural line.
function UnwindingMessage({
  text,
  by,
  serif,
  italic,
  x,
  y,
}: {
  text: string;
  by: string;
  serif: string;
  italic: string;
  x: number;
  y: number;
}) {
  const [phase, setPhase] = useState<"measuring" | "coil" | "unwound">(
    "measuring",
  );
  const [coil, setCoil] = useState<string[]>([]);
  // decorative repeats that fill out the coil for short messages
  const [echoes, setEchoes] = useState<{ c: string; t: string }[]>([]);
  // the repeats must share the text block's centre, or you get two spirals
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const outer = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLQuoteElement>(null);
  const chars = text.split("");

  // Measure where each letter naturally sits, then work out the offset that
  // would place it on the spiral instead.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("span[data-c]"));
    const box = el.getBoundingClientRect();
    const host = outer.current?.getBoundingClientRect();
    if (host) {
      setOrigin({
        x: box.left + box.width / 2 - host.left,
        y: box.top + box.height / 2 - host.top,
      });
    }

    // Geometry first: the gap between consecutive turns must exceed the glyph
    // height, or the coil overlaps itself. So the spacing is FIXED and the
    // number of turns varies with the length of the text.
    const SCALE = 0.42;
    const fontPx = parseFloat(getComputedStyle(el).fontSize) || 30;
    // A coiled letter occupies roughly the line box, not the font size, so the
    // turns have to clear that with room to spare.
    const lineH = fontPx * 1.15 * SCALE;
    const GAP = lineH * 1.9; // distance between consecutive turns
    const B = GAP / (2 * Math.PI); // radial gain per radian
    const A = GAP * 1.15; // radius of the innermost turn

    const widths = spans.map((sp) => sp.getBoundingClientRect().width || 8);
    const placed: string[] = [];
    let theta = 0;

    spans.forEach((sp, idx) => {
      const w = widths[idx] * SCALE;
      const rad = A + B * theta;
      const px = Math.cos(theta) * rad;
      const py = Math.sin(theta) * rad;
      const nat = sp.getBoundingClientRect();
      const nx = nat.left + nat.width / 2 - (box.left + box.width / 2);
      const ny = nat.top + nat.height / 2 - (box.top + box.height / 2);
      const deg = (theta * 180) / Math.PI + 90;
      placed.push(
        `translate(${(px - nx).toFixed(1)}px, ${(py - ny).toFixed(
          1,
        )}px) rotate(${deg.toFixed(1)}deg) scale(${SCALE})`,
      );
      theta += (w + 1.5) / Math.max(rad, 1);
    });

    // top the coil up to at least two full turns, repeating the phrase
    const MIN = 2 * Math.PI * 2;
    const repeats: { c: string; t: string }[] = [];
    let guard = 0;
    while (theta < MIN && guard < 300) {
      const seq = "  \u2726  ".split("").concat(chars);
      for (const ch of seq) {
        if (theta >= MIN || guard >= 300) break;
        const wi = chars.indexOf(ch);
        const w = (wi >= 0 ? widths[wi] : 9) * SCALE;
        const rad = A + B * theta;
        repeats.push({
          c: ch,
          t: `translate(-50%, -50%) translate(${(Math.cos(theta) * rad).toFixed(
            1,
          )}px, ${(Math.sin(theta) * rad).toFixed(1)}px) rotate(${(
            (theta * 180) / Math.PI +
            90
          ).toFixed(1)}deg) scale(${SCALE})`,
        });
        theta += (w + 1.5) / Math.max(rad, 1);
        guard++;
      }
    }
    setEchoes(repeats);

    setCoil(placed);
    requestAnimationFrame(() => setPhase("coil"));
    const t = setTimeout(() => setPhase("unwound"), 1500);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <div
      ref={outer}
      className="pointer-events-none absolute z-40"
      style={{
        left: x,
        top: y,
        width: "min(80vw, 30rem)",
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* the repeats that complete the coil */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: origin?.x ?? 0,
          top: origin?.y ?? 0,
          height: 0,
          width: 0,
          opacity: origin ? 1 : 0,
        }}
      >
        {echoes.map((e, i) => (
          <span
            key={i}
            className={serif}
            style={{
              position: "absolute",
              display: "inline-block",
              whiteSpace: "pre",
              fontSize: "1.9rem",
              color: "rgba(255,255,255,.7)",
              WebkitTextStroke: "0.4px currentColor",
              transform: e.t,
              opacity: phase === "coil" ? 1 : 0,
              transition:
                phase === "unwound"
                  ? `opacity 500ms ease ${i * 4}ms`
                  : `opacity 260ms ease ${i * 6}ms`,
            }}
          >
            {e.c}
          </span>
        ))}
      </div>

      <blockquote
        ref={wrap}
        className={`${serif} leading-[1.15]`}
        style={{
          fontSize: "1.9rem",
          color: "rgba(255,255,255,.88)",
          WebkitTextStroke: "0.4px currentColor",
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            data-c
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transform: phase === "unwound" || !coil[i] ? "none" : coil[i],
              opacity: phase === "measuring" ? 0 : 1,
              transition:
                phase === "unwound"
                  ? `transform 1300ms cubic-bezier(.25,.9,.3,1) ${
                      i * 12
                    }ms, opacity 300ms ease`
                  : `opacity 300ms ease ${i * 10}ms`,
            }}
          >
            {c}
          </span>
        ))}
      </blockquote>
      <figcaption
        className={italic}
        style={{
          fontSize: "0.85rem",
          color: "rgba(255,255,255,.5)",
          marginTop: 8,
          opacity: phase === "unwound" ? 1 : 0,
          transition: `opacity 600ms ease ${chars.length * 12 + 500}ms`,
        }}
      >
        {by}
      </figcaption>
    </div>
  );
}

function QuoteCard({
  q,
  locale,
  serif,
  scale = 1,
  night = false,
}: {
  q: Quote;
  locale: "fr" | "en";
  serif: string;
  scale?: number;
  night?: boolean;
}) {
  const { text, by } = q[locale];
  return (
    <figure className="w-[min(80vw,30rem)]">
      <blockquote
        className={`${serif} leading-[1.15]`}
        style={{
          fontSize: `${1.9 * scale}rem`,
          // Instrument Serif ships one weight; a hairline stroke thickens it
          WebkitTextStroke: "0.4px currentColor",
          color: night ? "rgba(255,255,255,.72)" : "#171717",
          transition: "color 700ms ease",
        }}
      >
        “{text}”
      </blockquote>
      <figcaption
        className={`${plexItalic.className} mt-2`}
        style={{
          fontSize: `${0.85 * scale}rem`,
          color: night ? "rgba(255,255,255,.45)" : "#737373",
          transition: "color 700ms ease",
        }}
      >
        {by}
      </figcaption>
    </figure>
  );
}

/* ── A — Constellation: drag to roam a wide field ───────────────────────── */
function VariantA({
  locale,
  serif,
}: {
  locale: "fr" | "en";
  serif: string;
  title?: string;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      className="relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      onPointerDown={(e) => {
        drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        setPos({
          x: e.clientX - drag.current.x,
          y: e.clientY - drag.current.y,
        });
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      style={PAPER}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      >
        {ALL.map((q, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: cellPos(i, 3).x,
              top: cellPos(i, 3).y,
              transform: `rotate(${(rand(i, 3) - 0.5) * 7}deg)`,
              animation: `bob ${7 + rand(i, 4) * 6}s ease-in-out ${
                rand(i, 5) * 3
              }s infinite alternate`,
            }}
          >
            <QuoteCard
              locale={locale}
              q={q}
              scale={0.85 + rand(i, 6) * 0.5}
              serif={serif}
            />
          </div>
        ))}
      </div>

      <p
        className={`${inter.className} pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-neutral-400`}
      >
        drag to explore
      </p>
    </div>
  );
}

/* ── B — Drift: a tiny physics sim. Quotes bounce off the walls, off each
   other, and off the invisible box around the button. ───────────────────── */
type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
};

function VariantB({
  locale,
  serif,
  title,
}: {
  locale: "fr" | "en";
  serif: string;
  title: string;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);

  // Only ever this many cards on screen, whatever the screen size — the field
  // would otherwise become unreadable as messages pile up. Their contents
  // rotate, so everything gets seen.
  const [slotCount, setSlotCount] = useState(9);
  const [scale, setScale] = useState(0.78);
  const [slots, setSlots] = useState<number[]>([]);
  const [fading, setFading] = useState(-1);
  const [night, setNight] = useState(false);
  const [pool, setPool] = useState<Quote[]>(ALL);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [merci, setMerci] = useState(false);
  // stays true from Send until the message has landed, so the wall stays dark
  // through the whole ceremony — on a phone there is no hover to hold it
  const [sending, setSending] = useState(false);
  const [arriving, setArriving] = useState<{
    text: string;
    by: string;
    x: number;
    y: number;
  } | null>(null);
  const [closing, setClosing] = useState(false);
  const [justAdded, setJustAdded] = useState(-1);
  const touch = useRef(false);
  const nextUp = useRef(0);
  const landAt = useRef<{ x: number; y: number } | null>(null);

  // the wall stays dark while the form is open AND until the message lands
  const dark = night || open || sending;

  // the emptiest point on screen — where an arriving message can land without
  // shoving anything important aside
  const freeSpot = useCallback(() => {
    const F = fieldRef.current?.getBoundingClientRect();
    if (!F) return { x: 0, y: 0 };
    let best = { x: F.width / 2, y: F.height / 2, d: -1 };
    for (let gx = 1; gx <= 5; gx++) {
      for (let gy = 1; gy <= 4; gy++) {
        const x = (F.width * gx) / 6;
        const y = (F.height * gy) / 5;
        let d = Math.hypot(x - F.width / 2, y - F.height / 2) < 190 ? 0 : 1e9;
        for (const b of bodies.current) {
          d = Math.min(d, Math.hypot(x - (b.x + b.w / 2), y - (b.y + b.h / 2)));
        }
        if (d > best.d) best = { x, y, d };
      }
    }
    return { x: best.x, y: best.y };
  }, []);

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  }, []);

  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      setSlotCount(w < 640 ? 5 : w < 1024 ? 7 : 9);
      setScale(w < 640 ? 0.72 : w < 1024 ? 0.9 : 1.05);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    const n = Math.min(slotCount, pool.length);
    setSlots(Array.from({ length: n }, (_, i) => i));
    nextUp.current = n % ALL.length;
  }, [slotCount]);

  // every 9s one card fades out and returns as a different quote
  useEffect(() => {
    if (pool.length <= slots.length || slots.length === 0) return;
    const id = setInterval(() => {
      const slot = Math.floor(Math.random() * slots.length);
      setFading(slot);
      setTimeout(() => {
        setSlots((prev) => {
          const copy = [...prev];
          let candidate = nextUp.current;
          let guard = 0;
          while (copy.includes(candidate) && guard++ < pool.length) {
            candidate = (candidate + 1) % pool.length;
          }
          copy[slot] = candidate;
          nextUp.current = (candidate + 1) % pool.length;
          return copy;
        });
        setFading(-1);
      }, 700);
    }, 9000);
    return () => clearInterval(id);
  }, [slots.length, pool.length]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      const F = field.getBoundingClientRect();
      const prev = bodies.current;
      bodies.current = slots.map((_, i) => {
        // keep everyone where they were; only brand-new cards get placed
        const el0 = nodes.current[i];
        if (prev[i]) {
          const kept = {
            ...prev[i],
            w: el0?.offsetWidth ?? prev[i].w,
            h: el0?.offsetHeight ?? prev[i].h,
          };
          if (i === 0 && landAt.current) {
            kept.x = landAt.current.x - kept.w / 2;
            kept.y = landAt.current.y - kept.h / 2;
            // a gentle push away from where it landed
            kept.vx = (rand(i, 31) - 0.5) * 26;
            kept.vy = (rand(i, 32) - 0.5) * 26;
            landAt.current = null;
          }
          return kept;
        }
        return ((): Body => {
          const el = nodes.current[i];
          const w = el?.offsetWidth ?? 240;
          const h = el?.offsetHeight ?? 120;
          const angle = (i / Math.max(slots.length, 1)) * Math.PI * 2;
          const speed = 15 + rand(i, 4) * 13; // px per second — a slow drift
          const spot = i === 0 && landAt.current ? landAt.current : null;
          if (spot) landAt.current = null;
          return {
            x: spot
              ? spot.x - w / 2
              : F.width / 2 + Math.cos(angle) * F.width * 0.34 - w / 2,
            y: spot
              ? spot.y - h / 2
              : F.height / 2 + Math.sin(angle) * F.height * 0.34 - h / 2,
            vx: Math.cos(angle + 1.2) * speed,
            vy: Math.sin(angle + 1.2) * speed,
            w,
            h,
          };
        })();
      });
    };

    const overlap = (a: Body, b: Body) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const F = field.getBoundingClientRect();
      // invisible boxes the quotes bounce off: the button, and the title
      const pad = 26;
      const boxOf = (el: Element | null | undefined) => {
        if (!el) return null;
        const R = el.getBoundingClientRect();
        return {
          x: R.left - F.left - pad,
          y: R.top - F.top - pad,
          w: R.width + pad * 2,
          h: R.height + pad * 2,
        };
      };
      const boxes = [boxOf(buttonRef.current), boxOf(titleRef.current)].filter(
        Boolean,
      ) as { x: number; y: number; w: number; h: number }[];

      const bs = bodies.current;

      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // walls
        if (b.x < 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx);
        }
        if (b.y < 0) {
          b.y = 0;
          b.vy = Math.abs(b.vy);
        }
        if (b.x + b.w > F.width) {
          b.x = F.width - b.w;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y + b.h > F.height) {
          b.y = F.height - b.h;
          b.vy = -Math.abs(b.vy);
        }

        // the invisible boxes (button, title)
        for (const box of boxes) {
          if (!overlap(b, box as Body)) continue;
          const fromLeft = b.x + b.w - box.x;
          const fromRight = box.x + box.w - b.x;
          const fromTop = b.y + b.h - box.y;
          const fromBottom = box.y + box.h - b.y;
          const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);
          if (min === fromLeft) {
            b.x = box.x - b.w;
            b.vx = -Math.abs(b.vx);
          } else if (min === fromRight) {
            b.x = box.x + box.w;
            b.vx = Math.abs(b.vx);
          } else if (min === fromTop) {
            b.y = box.y - b.h;
            b.vy = -Math.abs(b.vy);
          } else {
            b.y = box.y + box.h;
            b.vy = Math.abs(b.vy);
          }
        }

        // each other — push apart along the shallower axis, then swap velocity
        // on that axis. Pushing (rather than rewinding) stops pairs sticking.
        for (let j = 0; j < bs.length; j++) {
          if (j === i) continue;
          const o = bs[j];
          if (!overlap(b, o)) continue;

          const overlapX = Math.min(b.x + b.w, o.x + o.w) - Math.max(b.x, o.x);
          const overlapY = Math.min(b.y + b.h, o.y + o.h) - Math.max(b.y, o.y);

          if (overlapX < overlapY) {
            const dir = b.x + b.w / 2 < o.x + o.w / 2 ? -1 : 1;
            b.x += (dir * overlapX) / 2;
            o.x -= (dir * overlapX) / 2;
            const t = b.vx;
            b.vx = o.vx;
            o.vx = t;
          } else {
            const dir = b.y + b.h / 2 < o.y + o.h / 2 ? -1 : 1;
            b.y += (dir * overlapY) / 2;
            o.y -= (dir * overlapY) / 2;
            const t = b.vy;
            b.vy = o.vy;
            o.vy = t;
          }
        }

        const el = nodes.current[i];
        if (el) el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      layout();
      bodies.current.forEach((b, i) => {
        const el = nodes.current[i];
        if (el) el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      });
      if (!calm) raf = requestAnimationFrame(step);
    };

    // wait a frame so the cards have measured widths
    const t = setTimeout(start, 60);
    window.addEventListener("resize", start);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", start);
    };
  }, [locale, serif, slots]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onTouchStart={() => {
        touch.current = true;
        setNight(false);
      }}
      style={PAPER}
    >
      {/* title, high on the page */}
      <h1
        ref={titleRef}
        className={`${serif} pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 whitespace-nowrap text-center text-3xl sm:top-8 sm:text-5xl`}
        style={{
          color: dark ? "rgba(255,255,255,.55)" : "#171717",
          transition: "color 700ms ease",
        }}
      >
        {title}
      </h1>

      {/* night sky — wipes open from the button, sits under the quotes */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-[#030305]"
        style={{
          clipPath: dark ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
          transition:
            "clip-path 1100ms cubic-bezier(.22,1,.36,1), opacity 600ms ease",
          opacity: dark ? 1 : 0,
        }}
      >
        {NIGHT_STARS.map((st, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${st.left}%`,
              top: `${st.top}%`,
              width: st.size,
              height: st.size,
              opacity: st.opacity,
              animation: `twinkle ${st.duration}s ease-in-out ${st.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* the field */}
      <div ref={fieldRef} className="absolute inset-0 z-10">
        {slots.map((quoteIndex, i) => (
          <div
            key={i}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              opacity: fading === i ? 0 : 1,
              transition: "opacity 700ms ease-in-out",
            }}
          >
            <span
              className="block"
              style={{
                animation:
                  justAdded === i
                    ? "settleIn 850ms cubic-bezier(.2,1.2,.35,1) both"
                    : "none",
              }}
            >
              <QuoteCard
                locale={locale}
                night={dark}
                q={pool[quoteIndex]}
                scale={scale}
                serif={serif}
              />
            </span>
          </div>
        ))}
      </div>

      {/* Merci — plain, and it vanishes off into space */}
      {merci && (
        <p
          className={`${serif} pointer-events-none absolute left-1/2 top-1/2 z-40 text-6xl text-white`}
          style={{
            textShadow: "0 4px 30px rgba(0,0,0,.9)",
            animation: "merciFade 1400ms ease both",
          }}
        >
          {locale === "fr" ? "Merci !" : "Thank you!"}
        </p>
      )}

      {/* the message flies in wound up, and unwinds into its spot */}
      {arriving && (
        <UnwindingMessage
          by={arriving.by}
          italic={plexItalic.className}
          serif={serif}
          text={arriving.text}
          x={arriving.x}
          y={arriving.y}
        />
      )}

      {/* the message form — a blocking modal over the night sky */}
      {open && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center px-5"
          onClick={() => {
            closeModal();
            setSent(false);
          }}
          style={{
            background: "rgba(3,3,5,.72)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            animation: closing
              ? "fadeUp 200ms ease-in both reverse"
              : "fadeUp 260ms ease-out both",
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-7"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(20,20,24,.92)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,.14), 0 30px 60px -20px rgba(0,0,0,.9)",
              animation: closing
                ? "panelIn 200ms ease-in both reverse"
                : "panelIn 320ms cubic-bezier(.2,1,.3,1) both",
            }}
          >
            {sent ? (
              <div className="py-8 text-center">
                <p className={`${serif} text-4xl text-white`}>
                  {locale === "fr" ? "Merci !" : "Thank you!"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-start justify-between">
                  <h2 className={`${serif} text-3xl text-white`}>
                    {locale === "fr" ? "Laisse un message" : "Leave a message"}
                  </h2>
                  <button
                    aria-label={locale === "fr" ? "Fermer" : "Close"}
                    className="-mr-1 -mt-1 p-2 text-2xl leading-none text-white/50 hover:text-white"
                    onClick={closeModal}
                  >
                    ×
                  </button>
                </div>

                <label
                  className={`${inter.className} mb-1 block text-xs uppercase tracking-widest text-white/50`}
                >
                  {locale === "fr" ? "Ton nom" : "Your name"}
                </label>
                <input
                  className={`${inter.className} mb-5 w-full rounded-lg bg-white/10 px-3 py-2.5 text-white outline-none ring-1 ring-white/15 focus:ring-white/40`}
                  maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sunan"
                  value={name}
                />

                <label
                  className={`${inter.className} mb-1 block text-xs uppercase tracking-widest text-white/50`}
                >
                  {locale === "fr" ? "Ton message" : "Your message"}
                </label>
                <textarea
                  className={`${inter.className} w-full resize-none rounded-lg bg-white/10 px-3 py-2.5 text-white outline-none ring-1 ring-white/15 focus:ring-white/40`}
                  maxLength={200}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="I love how you talk about social issues 10 times a day"
                  rows={3}
                  value={msg}
                />
                <p
                  className={`${inter.className} mt-1 text-right text-xs ${
                    msg.length > 180 ? "text-amber-300" : "text-white/40"
                  }`}
                >
                  {msg.length}/200
                </p>

                <div className="mt-6 flex items-center justify-end">
                  <button
                    className={`${
                      inter.className
                    } relative rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 transition-all duration-300 disabled:opacity-30 ${
                      name.trim() && msg.trim()
                        ? "hover:-translate-y-0.5 hover:shadow-[0_0_0_6px_rgba(255,255,255,.10),0_0_28px_6px_rgba(255,255,255,.35)]"
                        : ""
                    }`}
                    disabled={!name.trim() || !msg.trim()}
                    onClick={() => {
                      const text = msg.trim();
                      const who = name.trim();
                      const entry = {
                        en: { text, by: who },
                        fr: { text, by: who },
                      };
                      setMsg("");
                      setName("");
                      closeModal();
                      setSending(true);

                      // Merci shows briefly, then leaves the stage
                      setMerci(true);
                      setTimeout(() => setMerci(false), 1400);

                      // then the message itself flies in wound up and unwinds
                      const spot = freeSpot();
                      setTimeout(
                        () => setArriving({ text, by: who, ...spot }),
                        1500,
                      );

                      // once unwound, it becomes a real card in that spot
                      setTimeout(() => {
                        setPool((prev) => {
                          const next = [...prev, entry];
                          setSlots((cur) =>
                            cur.length
                              ? cur.map((v, i) =>
                                  i === 0 ? next.length - 1 : v,
                                )
                              : cur,
                          );
                          return next;
                        });
                        landAt.current = spot;
                        setArriving(null);
                      }, 4700);

                      // only now does the paper come back
                      setTimeout(() => {
                        setSending(false);
                        setNight(false);
                      }, 5600);
                    }}
                  >
                    {locale === "fr" ? "Envoyer" : "Send"}
                    {name.trim() && msg.trim() && (
                      <span
                        className="pointer-events-none absolute inset-0 block"
                        style={{ color: "#ffe9a8" }}
                      >
                        <Sparkle delay={0} left="-9%" size={13} top="-22%" />
                        <Sparkle delay={0.8} left="99%" size={11} top="-6%" />
                        <Sparkle delay={1.4} left="-6%" size={10} top="88%" />
                        <Sparkle delay={0.5} left="96%" size={12} top="82%" />
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* the button — dead centre, transparent, sparkling */}
      <div
        ref={buttonRef}
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        onClick={() => {
          if (!touch.current) setOpen(true);
        }}
        onFocus={() => setNight(true)}
        // no hover on a phone: the first tap plays the transition, and the
        // second one would open the message form
        onMouseEnter={() => {
          if (!touch.current) setNight(true);
        }}
        onMouseLeave={() => {
          if (!touch.current && !open) setNight(false);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          touch.current = true;
          if (night) setOpen(true);
          else setNight(true);
        }}
      >
        <button
          className={`${serif} relative flex items-center justify-center rounded-full`}
          style={{
            width: 150,
            height: 150,
            boxShadow: dark ? "0 0 40px 6px rgba(226,232,240,.28)" : "none",
            transition: "box-shadow 700ms ease",
            animation: night
              ? "wobble 3s ease-in-out infinite"
              : "balloon 6s ease-in-out infinite",
          }}
        >
          {/* the ball it becomes */}
          <img
            alt=""
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            src="/30ans/disco-ball.png"
            style={{
              opacity: dark ? 1 : 0,
              transform: dark ? "scale(1)" : "scale(.55)",
              transition:
                "opacity 700ms ease 150ms, transform 900ms cubic-bezier(.5,0,.2,1)",
            }}
          />

          {/* by day: a glass sphere with the label sitting on its surface */}
          {/* body: refracts what is behind it, lit from the top-left */}
          <span
            className="absolute inset-0 block rounded-full"
            style={{
              opacity: dark ? 0 : 1,
              transition: "opacity 500ms ease",
              // no fill whatsoever — the sphere is made of light on its edges
              background: "transparent",
              boxShadow: [
                // thick bright rim along the bottom, where light gathers
                "inset 0 -14px 20px -8px rgba(255,255,255,.95)",
                "inset -10px -6px 18px -6px rgba(255,255,255,.8)",
                // thin shadowed edge top-left, giving the glass thickness
                "inset 8px 8px 16px -8px rgba(60,58,54,.35)",
                // the glass edge itself
                "inset 0 0 0 1px rgba(23,23,23,.30)",
                "inset 0 0 0 3px rgba(255,255,255,.35)",
                // contact shadow on the paper below
                "0 16px 26px -14px rgba(23,23,23,.35)",
              ].join(", "),
            }}
          />
          {/* specular highlight */}
          <span
            className="pointer-events-none absolute block rounded-full"
            style={{
              left: "20%",
              top: "13%",
              width: "26%",
              height: "16%",
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 72%)",
              transform: "rotate(-26deg)",
              opacity: dark ? 0 : 0.95,
              transition: "opacity 500ms ease",
            }}
          />
          {/* second, smaller glint low-right — sells the sphere */}
          <span
            className="pointer-events-none absolute block rounded-full"
            style={{
              left: "64%",
              top: "72%",
              width: "14%",
              height: "8%",
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 70%)",
              transform: "rotate(18deg)",
              opacity: dark ? 0 : 0.8,
              transition: "opacity 500ms ease",
            }}
          />

          {/* the label: a supplied PNG, already set on the sphere */}
          <img
            alt={locale === "fr" ? "Laisse un message" : "Leave a message"}
            className="pointer-events-none absolute"
            src={
              locale === "fr"
                ? "/30ans/bubble-text-fr.png"
                : "/30ans/bubble-text-en.png"
            }
            style={{
              width: "62%",
              opacity: dark ? 0 : 1,
              transition: "opacity 400ms ease",
            }}
          />

          {/* at night: the label rides around the ball, hugging its edge.
              The rotation lives on an inner element — putting it on the
              positioned one overwrites the centring transform and the ring
              slides off. */}
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 block"
            style={{
              width: 232,
              height: 232,
              transform: "translate(-50%, -50%)",
              opacity: dark ? 1 : 0,
              transition: "opacity 600ms ease 250ms",
            }}
          >
            <svg
              className="h-full w-full overflow-visible"
              style={{ animation: "spinSlow 16s linear infinite" }}
              viewBox="0 0 232 232"
            >
              <defs>
                <path
                  d="M 116,116 m -104,0 a 104,104 0 1,1 208,0 a 104,104 0 1,1 -208,0"
                  fill="none"
                  id="orbit"
                />
              </defs>
              <text
                fill="#ffffff"
                style={{
                  fontSize: 21,
                  letterSpacing: "0.12em",
                  filter: "drop-shadow(0 1px 6px rgba(0,0,0,.95))",
                }}
                textAnchor="middle"
              >
                {/* one phrase, centred over the top of the ring */}
                <textPath startOffset="25%" xlinkHref="#orbit">
                  {locale === "fr" ? "Laisse un message" : "Leave a message"}
                </textPath>
              </text>
            </svg>
          </span>

          {/* sparkles — on the ring by day, orbiting the ball at night */}
          <span
            className="pointer-events-none absolute inset-0 z-20 block"
            style={{
              color: dark ? "#ffffff" : "#171717",
              transition: "color 500ms ease",
            }}
          >
            <Sparkle
              delay={0}
              left={dark ? "-8%" : "-2%"}
              size={dark ? 20 : 14}
              top={dark ? "-4%" : "6%"}
            />
            <Sparkle
              delay={0.7}
              left={dark ? "96%" : "92%"}
              size={dark ? 16 : 12}
              top={dark ? "10%" : "14%"}
            />
            <Sparkle
              delay={1.3}
              left={dark ? "-6%" : "2%"}
              size={dark ? 15 : 11}
              top={dark ? "78%" : "82%"}
            />
            <Sparkle
              delay={0.4}
              left={dark ? "92%" : "88%"}
              size={dark ? 18 : 13}
              top={dark ? "84%" : "76%"}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── C — Scatter: normal scrolling, but nothing lines up ────────────────── */
function VariantC({
  locale,
  serif,
}: {
  locale: "fr" | "en";
  serif: string;
  title?: string;
}) {
  return (
    <div className="h-full w-full overflow-y-auto" style={PAPER}>
      <div className="relative mx-auto min-h-full w-full max-w-5xl px-5 pb-40 pt-24">
        {ALL.map((q, i) => (
          <div
            key={i}
            className="mb-16"
            style={{
              marginLeft: `${
                i % 2 === 0 ? 2 + rand(i, 1) * 12 : 34 + rand(i, 1) * 14
              }%`,
              transform: `rotate(${(rand(i, 3) - 0.5) * 5}deg)`,
              animation: `bob ${8 + rand(i, 4) * 5}s ease-in-out ${
                rand(i, 5) * 3
              }s infinite alternate`,
            }}
          >
            <QuoteCard
              locale={locale}
              q={q}
              scale={0.9 + rand(i, 6) * 0.4}
              serif={serif}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type WallVariantProps = {
  locale: "fr" | "en";
  serif: string;
  title: string;
};

const VARIANTS: {
  key: string;
  name: string;
  Component: (p: WallVariantProps) => ReactElement;
}[] = [
  { key: "A", name: "Constellation — drag to roam", Component: VariantA },
  { key: "B", name: "Drift — floats by itself", Component: VariantB },
  { key: "C", name: "Scatter — scroll, nothing aligned", Component: VariantC },
];

export default function WallPrototype() {
  const [variantKey, setVariantKey] = useState("B");
  const { locale, setLocale } = useLocale();
  const [serifIndex, setSerifIndex] = useState(0);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("variant");
    if (fromUrl && VARIANTS.some((v) => v.key === fromUrl))
      setVariantKey(fromUrl);
  }, []);

  const go = useCallback((delta: number) => {
    setVariantKey((current) => {
      const i = VARIANTS.findIndex((v) => v.key === current);
      const next = VARIANTS[(i + delta + VARIANTS.length) % VARIANTS.length];
      window.history.replaceState(null, "", `?variant=${next.key}`);
      return next.key;
    });
  }, []);

  const active = VARIANTS.find((v) => v.key === variantKey) ?? VARIANTS[0];
  const { Component } = active;

  return (
    <div className="fixed inset-0 z-50">
      <BackToHub />
      <style suppressHydrationWarning>{`
        @keyframes bob { from { translate: 0 -6px } to { translate: 0 6px } }
        @keyframes twinkle { 0%,100% { opacity:.15 } 50% { opacity:1 } }
        @keyframes pop { 0%,58%,100% { opacity:0; transform: scale(.35) rotate(0deg) } 72%,86% { opacity:.85; transform: scale(1.1) rotate(20deg) } }
        @keyframes spinSlow { to { transform: rotate(360deg) } }
        /* Merci spirals outward into the distance */
        @keyframes settleIn {
          from { opacity:0; transform: scale(.55) }
          to   { opacity:1; transform: scale(1) }
        }
        @keyframes spiralArrive {
          0%   { opacity:0; transform: scale(.25) rotate(-260deg); filter: blur(4px) }
          35%  { opacity:1; transform: scale(1) rotate(0deg); filter: blur(0px) }
          70%  { opacity:1; transform: scale(1) rotate(0deg); filter: blur(0px) }
          100% { opacity:0; transform: scale(.35) rotate(180deg); filter: blur(3px) }
        }
        @keyframes merciFade {
          0%   { opacity:0; transform: translate(-50%,-50%) scale(.94) }
          18%  { opacity:1; transform: translate(-50%,-50%) scale(1) }
          62%  { opacity:1; transform: translate(-50%,-50%) scale(1) }
          100% { opacity:0; transform: translate(-50%,-50%) scale(1) }
        }
        @keyframes merciSwirl {
          0% { opacity:1.00; filter: blur(0.0px); transform: translate(calc(-50% + 0px), calc(-50% + -0px)) scale(1.00) rotate(0deg) }
          6% { opacity:1.00; filter: blur(0.1px); transform: translate(calc(-50% + 1px), calc(-50% + -3px)) scale(0.99) rotate(9deg) }
          12% { opacity:0.99; filter: blur(0.2px); transform: translate(calc(-50% + 7px), calc(-50% + -11px)) scale(0.96) rotate(35deg) }
          19% { opacity:0.96; filter: blur(0.5px); transform: translate(calc(-50% + 27px), calc(-50% + -7px)) scale(0.91) rotate(75deg) }
          25% { opacity:0.93; filter: blur(0.8px); transform: translate(calc(-50% + 38px), calc(-50% + 28px)) scale(0.85) rotate(127deg) }
          31% { opacity:0.87; filter: blur(1.2px); transform: translate(calc(-50% + -10px), calc(-50% + 69px)) scale(0.78) rotate(188deg) }
          38% { opacity:0.80; filter: blur(1.6px); transform: translate(calc(-50% + -92px), calc(-50% + 22px)) scale(0.70) rotate(256deg) }
          44% { opacity:0.72; filter: blur(2.0px); transform: translate(calc(-50% + -62px), calc(-50% + -105px)) scale(0.62) rotate(329deg) }
          50% { opacity:0.62; filter: blur(2.5px); transform: translate(calc(-50% + 106px), calc(-50% + -106px)) scale(0.53) rotate(405deg) }
          56% { opacity:0.52; filter: blur(3.0px); transform: translate(calc(-50% + 153px), calc(-50% + 90px)) scale(0.44) rotate(481deg) }
          62% { opacity:0.41; filter: blur(3.4px); transform: translate(calc(-50% + -49px), calc(-50% + 199px)) scale(0.36) rotate(554deg) }
          69% { opacity:0.31; filter: blur(3.8px); transform: translate(calc(-50% + -228px), calc(-50% + 32px)) scale(0.28) rotate(622deg) }
          75% { opacity:0.21; filter: blur(4.2px); transform: translate(calc(-50% + -151px), calc(-50% + -203px)) scale(0.21) rotate(683deg) }
          81% { opacity:0.13; filter: blur(4.5px); transform: translate(calc(-50% + 72px), calc(-50% + -263px)) scale(0.15) rotate(735deg) }
          88% { opacity:0.06; filter: blur(4.8px); transform: translate(calc(-50% + 236px), calc(-50% + -164px)) scale(0.10) rotate(775deg) }
          94% { opacity:0.02; filter: blur(4.9px); transform: translate(calc(-50% + 293px), calc(-50% + -47px)) scale(0.07) rotate(801deg) }
          100% { opacity:0.00; filter: blur(5.0px); transform: translate(calc(-50% + 300px), calc(-50% + -0px)) scale(0.06) rotate(810deg) }
        }
        /* the new message spirals inward and settles on the wall */
        @keyframes swirlIn {
          0% { opacity:0.15; filter: blur(5.0px); transform: translate(0px, -320px) scale(0.06) rotate(-0deg) }
          6% { opacity:0.16; filter: blur(4.9px); transform: translate(56px, -311px) scale(0.07) rotate(-10deg) }
          12% { opacity:0.19; filter: blur(4.8px); transform: translate(191px, -239px) scale(0.10) rotate(-39deg) }
          19% { opacity:0.23; filter: blur(4.5px); transform: translate(288px, -35px) scale(0.15) rotate(-83deg) }
          25% { opacity:0.28; filter: blur(4.2px); transform: translate(171px, 209px) scale(0.21) rotate(-141deg) }
          31% { opacity:0.35; filter: blur(3.8px); transform: translate(-118px, 216px) scale(0.28) rotate(-209deg) }
          38% { opacity:0.42; filter: blur(3.4px); transform: translate(-212px, -56px) scale(0.36) rotate(-285deg) }
          44% { opacity:0.50; filter: blur(3.0px); transform: translate(20px, -189px) scale(0.44) rotate(-366deg) }
          50% { opacity:0.57; filter: blur(2.5px); transform: translate(160px, -0px) scale(0.53) rotate(-450deg) }
          56% { opacity:0.65; filter: blur(2.0px); transform: translate(14px, 129px) scale(0.62) rotate(-534deg) }
          62% { opacity:0.73; filter: blur(1.6px); transform: translate(-98px, 26px) scale(0.70) rotate(-615deg) }
          69% { opacity:0.80; filter: blur(1.2px); transform: translate(-36px, -65px) scale(0.78) rotate(-691deg) }
          75% { opacity:0.87; filter: blur(0.8px); transform: translate(32px, -39px) scale(0.85) rotate(-759deg) }
          81% { opacity:0.92; filter: blur(0.5px); transform: translate(29px, 4px) scale(0.91) rotate(-817deg) }
          88% { opacity:0.96; filter: blur(0.2px); transform: translate(9px, 11px) scale(0.96) rotate(-861deg) }
          94% { opacity:0.99; filter: blur(0.1px); transform: translate(1px, 4px) scale(0.99) rotate(-890deg) }
          100% { opacity:1.00; filter: blur(0.0px); transform: translate(0px, 0px) scale(1.00) rotate(-900deg) }
        }
        @keyframes fadeUp { from { opacity:0 } to { opacity:1 } }
        @keyframes panelIn { from { opacity:0; transform: translateY(14px) scale(.97) } to { opacity:1; transform: none } }
        @keyframes balloon { 0%,100% { transform: translate(0,0) rotate(-1deg) } 50% { transform: translate(2px,-9px) rotate(1.2deg) } }
        @keyframes wobble { 0%,100% { transform: translate(0,0) rotate(0deg) } 25% { transform: translate(-2px,1px) rotate(-.8deg) } 50% { transform: translate(1px,-2px) rotate(.6deg) } 75% { transform: translate(2px,1px) rotate(.9deg) } }
        @keyframes orbit0 {
          0%   { translate: 0 0 }
          25%  { translate: var(--ax) calc(var(--ay) * -1) }
          50%  { translate: 0 calc(var(--ay) * -1.4) }
          75%  { translate: calc(var(--ax) * -1) var(--ay) }
          100% { translate: 0 0 }
        }
        @keyframes orbit1 {
          0%   { translate: 0 0 }
          25%  { translate: calc(var(--ax) * -1) var(--ay) }
          50%  { translate: calc(var(--ax) * -0.6) calc(var(--ay) * 1.3) }
          75%  { translate: var(--ax) calc(var(--ay) * -1) }
          100% { translate: 0 0 }
        }
      `}</style>

      <Component
        locale={locale}
        serif={SERIFS[serifIndex].className}
        title={locale === "fr" ? "Témoignages" : "What they say about me"}
      />

      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-2 left-1/2 z-[60] flex -translate-x-1/2 scale-90 items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 text-neutral-900 shadow-2xl ring-1 ring-black/20">
          <button className="px-3 py-1 text-lg" onClick={() => go(-1)}>
            ←
          </button>
          <span className="min-w-[14rem] text-center text-sm font-semibold">
            {active.key} — {active.name}
          </span>
          <button className="px-3 py-1 text-lg" onClick={() => go(1)}>
            →
          </button>
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setLocale((l) => (l === "fr" ? "en" : "fr"))}
          >
            {locale === "fr" ? "🇫🇷 FR" : "EN"}
          </button>
          <button
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold"
            onClick={() => setSerifIndex((s) => (s + 1) % SERIFS.length)}
          >
            {SERIFS[serifIndex].label}
          </button>
        </div>
      )}
    </div>
  );
}
