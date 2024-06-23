"use client";

import { motion, useScroll } from "framer-motion";

function ProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-1 bg-black z-20"
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
    />
  );
}

export { ProgressBar };
