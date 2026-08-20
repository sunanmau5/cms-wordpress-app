"use client";

// A small back arrow for the activity pages, top-left. Returns to the hub with
// a soft cross-fade. Styled to read on both the cream and the dark activities.

import { useScreenNav } from "./screen-nav";

export function BackToHub() {
  const nav = useScreenNav();
  return (
    <button
      aria-label="Retour · Back"
      className="fixed left-3 top-16 z-[70] grid h-10 w-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-transform hover:scale-105"
      onClick={() => nav("/portal/hub", "fade")}
      onPointerDown={(e) => e.stopPropagation()}
      type="button"
    >
      <svg
        fill="none"
        height="20"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.55))" }}
        viewBox="0 0 24 24"
        width="20"
      >
        <path
          d="M15 5l-7 7 7 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
