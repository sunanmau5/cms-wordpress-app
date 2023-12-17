"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { PAGES } from "@/lib/constants";

const variants = {
  // TODO: direction based on index of route in array
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? -200 : 200,
    y: 0,
  }),
  enter: { opacity: 1, x: 0, y: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? -1000 : 1000,
    y: -100,
  }),
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

  const currentPathnameIdx = PAGES.findIndex((page) => page === pathname);
  const previousPathnameIdx = PAGES.findIndex(
    (page) => page === refererPathname,
  );

  const direction = currentPathnameIdx - previousPathnameIdx;

  return (
    <AnimatePresence
      custom={direction}
      mode="wait"
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.main
        key={pathname}
        animate="enter"
        className="absolute top-14 flex-1 pb-14"
        custom={direction}
        exit="exit"
        initial="hidden"
        transition={{ type: "spring", ease: "circIn", duration: 0.9 }}
        variants={variants}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
MainAnimation.displayName = "MainAnimation";

export { MainAnimation };
