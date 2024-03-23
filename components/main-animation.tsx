"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { PAGES } from "@/lib/constants";

const variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? -200 : 200,
    y: 0,
  }),
  enter: { opacity: 1, x: 0, y: 0 },
  exit: (direction: number) => {
    return {
      opacity: 0,
      x: direction < 0 ? -200 : 200,
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
  const pageIndices = {};

  PAGES.forEach((page, index) => {
    pageIndices[page] = index;
  });

  const currentPathnameIdx = pageIndices[pathname];
  const previousPathnameIdx = pageIndices[refererPathname];

  const direction = currentPathnameIdx - previousPathnameIdx;

  return (
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
  );
}
MainAnimation.displayName = "MainAnimation";

export { MainAnimation };
