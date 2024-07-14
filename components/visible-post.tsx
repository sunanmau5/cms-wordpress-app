"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";

import { useIsScrolling } from "@/hooks/use-is-scrolling";

import { PostGallery } from "./post-gallery";
import { PostTitle } from "./post-title";

type IVisiblePostProps = {
  edges: {
    node: {
      title: string;
      content: string;
    };
  }[];
};

const _transition = { type: "spring", ease: "circIn", duration: 0.8 };

const variants = {
  down: {
    y: "-100%",
    opacity: 0,
  },
  up: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
  },
};

function VisiblePost({ edges }: IVisiblePostProps) {
  const { isScrollingY } = useIsScrolling();

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visibleEdge, setVisibleEdge] = useState(edges[0]);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("down");

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScrollProgress = (scrollPercent: number) => {
      const index = Math.min(
        Math.max(Math.floor(scrollPercent * edges.length), 0),
        edges.length - 1,
      );
      setVisibleIndex((prevIndex) => {
        if (prevIndex < index) {
          setScrollDir("down");
        } else if (prevIndex > index) {
          setScrollDir("up");
        }
        return prevIndex !== index ? index : prevIndex;
      });
    };

    scrollYProgress.on("change", handleScrollProgress);
    return () => {
      scrollYProgress.clearListeners();
    };
  }, [scrollYProgress, edges.length]);

  useEffect(() => {
    if (!isScrollingY) {
      setVisibleEdge(edges[visibleIndex]);
    }
  }, [visibleIndex, edges, isScrollingY]);

  useEffect(() => {
    document.body.style.setProperty("min-height", `${edges.length * 100}vh`);
    return () => {
      document.body.style.removeProperty("min-height");
    };
  }, [edges.length]);

  return (
    <div className="fixed">
      <AnimatePresence mode="popLayout">
        <motion.article
          key={visibleEdge.node.title}
          animate="visible"
          className="2xl:flex 2xl:pl-[17.75rem] 2xl:gap-4 2xl:pr-80"
          exit={scrollDir === "down" ? "down" : "up"}
          initial={scrollDir === "down" ? "up" : "down"}
          transition={_transition}
          variants={variants}
        >
          <PostTitle
            className="hidden 2xl:block"
            title={visibleEdge.node.title}
          />
          <PostGallery post={visibleEdge.node} />
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

VisiblePost.displayName = "VisiblePost";

export { VisiblePost };
