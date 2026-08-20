"use client";

import {
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  use,
  useTransition,
} from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";

const DELAY = 200;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
const noop = () => {};

type TransitionContext = {
  pending: boolean;
  navigate: (_: string) => void;
};
const Context = createContext<TransitionContext>({
  pending: false,
  navigate: noop,
});
const usePageTransition = () => use(Context);

type Props = PropsWithChildren<{
  className?: string;
}>;

export default function Transitions({ children, className }: Props) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const navigate = (href: string) => {
    start(async () => {
      router.push(href);
      await sleep(DELAY);
    });
  };

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    if (e.shiftKey || e.altKey) return;

    const anchor = (e.target as Element).closest("a");
    const href = anchor?.getAttribute("href");

    if (!anchor || !href || anchor.target || anchor.hasAttribute("download")) {
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    e.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <Context.Provider value={{ pending, navigate }}>
      <div className={className} onClickCapture={onClick}>
        {children}
      </div>
    </Context.Provider>
  );
}

export function Animate({ children, className }: Props) {
  const { pending } = usePageTransition();
  const overflow = useMotionValue("scroll");

  return (
    <AnimatePresence>
      {!pending && (
        <motion.div
          animate={{ opacity: 1 }}
          className={className}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onAnimationComplete={() => overflow.set("auto")}
          onAnimationStart={() => overflow.set("hidden")}
          style={{ overflow }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
