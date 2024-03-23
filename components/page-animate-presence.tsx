"use client";

import { Fragment, useId } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

function PageAnimatePresence({ children }) {
  const pathname = usePathname();
  const id = useId();

  return (
    <AnimatePresence mode="popLayout">
      <Fragment key={`${pathname}-${id}`}>{children}</Fragment>
    </AnimatePresence>
  );
}
PageAnimatePresence.displayName = "PageAnimatePresence";

export { PageAnimatePresence };
