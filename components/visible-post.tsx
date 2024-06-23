"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";

import { usePageTransition } from "./hoc/transitions";
import { PostGallery } from "./post-gallery";
import { PostTitle } from "./post-title";

type IVisiblePost = {
  edges: {
    node: {
      title: string;
      content: string;
    };
  }[];
};

function VisiblePost({ edges }: IVisiblePost) {
  const { pending } = usePageTransition();

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visibleEdge, setVisibleEdge] = useState(edges[0]);

  const prevScrollYRef = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = prevScrollYRef.current;

      if (currentScrollY > prevScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      prevScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollYProgress.on("change", (scrollPercent) => {
      if (edges.length > 0) {
        const index = Math.min(
          Math.max(Math.floor(scrollPercent * edges.length), 0),
          edges.length - 1,
        );
        setVisibleIndex(index);
      }
    });
  }, [scrollYProgress, edges.length]);

  useEffect(() => {
    setVisibleEdge(edges[visibleIndex]);
  }, [visibleIndex, edges]);

  useEffect(() => {
    document.body.style.setProperty("min-height", `${edges.length * 100}vh`);
  }, [edges.length]);

  return (
    <div className="fixed">
      <AnimatePresence>
        {!pending && (
          <motion.article
            key={visibleEdge.node.title}
            animate="visible"
            className="2xl:flex 2xl:pl-[17.75rem] 2xl:gap-4 2xl:pr-80"
            exit={scrollDirection === "down" ? "down" : "up"}
            initial={scrollDirection === "down" ? "up" : "down"}
            transition={_transition}
            variants={variants}
          >
            <PostTitle
              className="hidden 2xl:block"
              title={visibleEdge.node.title}
            />
            <PostGallery post={visibleEdge.node} />
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
VisiblePost.displayName = "VisiblePost";

export { VisiblePost };

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
