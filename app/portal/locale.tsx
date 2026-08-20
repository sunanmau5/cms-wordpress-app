"use client";

// One shared language for the whole portal. The provider lives in the portal
// layout, which stays mounted across /portal, /portal/rsvp, /portal/hub and the
// activities — so the language picked once at the start carries through, with
// no language in the URL. Persisted to localStorage so a hard refresh keeps it.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";

export type Locale = "fr" | "en";

const KEY = "portal-lang";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: SetStateAction<Locale>) => void;
}>({ locale: "fr", setLocale: () => {} });

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  // restore a previously chosen language (e.g. after a hard refresh mid-flow)
  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "fr" || saved === "en") setLocaleState(saved);
  }, []);

  // accepts a value or an updater, so callers can toggle off the current locale
  const setLocale = (update: SetStateAction<Locale>) => {
    setLocaleState((prev) => {
      const next = typeof update === "function" ? update(prev) : update;
      try {
        window.localStorage.setItem(KEY, next);
      } catch {
        /* ignore storage failures */
      }
      return next;
    });
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
