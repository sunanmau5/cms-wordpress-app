import type { ReactNode } from "react";
import { ViewTransitions } from "next-view-transitions";

import { LocaleProvider } from "./locale";
import { ScreenNavProvider } from "./screen-nav";

import "./transitions.css";

// Scoped to the prototype only — deliberately NOT the shared root layout, so
// nothing here can touch the live portfolio. ViewTransitions must wrap the
// subtree that calls useTransitionRouter.
export default function PrototypeLayout({ children }: { children: ReactNode }) {
  return (
    <ViewTransitions>
      <ScreenNavProvider>
        <LocaleProvider>
          <div className="portal-root">{children}</div>
        </LocaleProvider>
      </ScreenNavProvider>
    </ViewTransitions>
  );
}
