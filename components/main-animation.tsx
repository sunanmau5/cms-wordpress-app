"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { PAGES } from "@/lib/constants";

// TODO: update animation to exit to where the
// next route is going to be
const variants = {
  hidden: (direction: number) => {
    return {
      opacity: 0,
      x: 0,
      y: 0,
    };
  },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: (direction: number) => {
    return {
      opacity: 0,
      x: 0,
      y: 0,
    };
  },
};

interface IMainAnimationProps {
  refererPathname?: string;
  children: React.ReactNode;
}

function MainAnimation({
  refererPathname = "/portfolio",
  children,
}: IMainAnimationProps) {
  const pathname = usePathname();

  let referer = refererPathname;
  if (typeof window !== "undefined") {
    referer = window.history.state?.referer;
  }

  // Memoize pageIndices to avoid recalculating on every render
  const pageIndices = useMemo(() => {
    const indices = {};
    PAGES.forEach((page, index) => {
      indices[page] = index;
    });
    return indices;
  }, []);

  const currentPathnameIdx = pageIndices[pathname] ?? -1;
  const previousPathnameIdx = pageIndices[referer] ?? -1;

  const directionIdx = currentPathnameIdx - previousPathnameIdx;

  return (
    <motion.main
      key={pathname}
      animate="enter"
      className="pt-[4.5rem] sm:pt-14 flex-1 pb-14"
      custom={directionIdx}
      exit="exit"
      initial="hidden"
      transition={{ type: "spring", ease: "circIn", duration: 0.8 }}
      variants={variants}
    >
      {children}
    </motion.main>
  );
}
MainAnimation.displayName = "MainAnimation";

export { MainAnimation };
