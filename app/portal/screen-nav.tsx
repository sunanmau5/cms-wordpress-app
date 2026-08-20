"use client";

// Cross-route screen transitions for the birthday-portal prototype.
// next-view-transitions drives the View Transition and — crucially — waits for
// the App Router navigation to actually commit before finishing the capture, so
// the animation runs instead of the browser timing out and hard-swapping (which
// is what the hand-rolled version did: "freeze, then just appears").
// We only add the DIRECTION: a data-vt flag on <html> that transitions.css keys
// its slide keyframes off. Where the API is missing it navigates instantly.

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { useTransitionRouter } from "next-view-transitions";

type Dir = "left" | "up" | "fade";
type NavFn = (href: string, dir?: Dir) => void;

const ScreenNavContext = createContext<NavFn>(() => {});
export const useScreenNav = () => useContext(ScreenNavContext);

export function ScreenNavProvider({ children }: { children: ReactNode }) {
  const router = useTransitionRouter();

  // Prefetch the intro chain up front so navigations commit quickly.
  useEffect(() => {
    // the two cross-route destinations in the flow (joke lives inside /portal,
    // the ticket inside /portal/hub — both are same-page stages now)
    for (const href of ["/portal/rsvp", "/portal/hub"]) {
      router.prefetch(href);
    }
  }, [router]);

  const nav = useCallback<NavFn>(
    (href, dir = "left") => {
      // set the direction before the transition captures, so the keyframes match
      document.documentElement.dataset.vt = dir;
      router.push(href, {
        onTransitionReady: () => {
          // clear once the slide has finished (longest is 700ms) so a later
          // default cross-fade is not mistaken for a directional hop
          window.setTimeout(() => {
            delete document.documentElement.dataset.vt;
          }, 900);
        },
      });
    },
    [router],
  );

  return <ScreenNavContext.Provider value={nav}>{children}</ScreenNavContext.Provider>;
}
