"use client";

// The very first thing a guest sees: one link (/portal) opens this, so a
// mixed-language group all land here and choose. Same tracked-uppercase style
// as the "tap to continue" hint; flags centred on a dark ground that matches
// the opening.

import { useLocale, type Locale } from "./locale";

export function LanguagePicker({ onPick }: { onPick: () => void }) {
  const { setLocale } = useLocale();

  const choose = (l: Locale) => {
    setLocale(l);
    onPick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030305] px-6 text-white">
      {/* flags are the centred element; the prompt floats above them so the
          flags themselves sit dead-centre horizontally and vertically */}
      <div className="relative flex items-center justify-center gap-10 sm:gap-14">
        <p className="absolute -top-16 left-1/2 w-max -translate-x-1/2 text-center text-xs uppercase tracking-[0.35em] text-white/50 sm:-top-20 sm:text-sm">
          Choisis une langue · Pick a language
        </p>
        <button
          aria-label="Français"
          className="text-6xl leading-none transition-transform duration-200 hover:scale-110 sm:text-7xl"
          onClick={() => choose("fr")}
          type="button"
        >
          🇫🇷
        </button>
        <button
          aria-label="English"
          className="text-6xl leading-none transition-transform duration-200 hover:scale-110 sm:text-7xl"
          onClick={() => choose("en")}
          type="button"
        >
          🇬🇧
        </button>
      </div>
    </div>
  );
}
