"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export const useElementOnScreen = <T extends HTMLElement>(
  options,
): [RefObject<T>, boolean] => {
  const containerRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFn = (entries: any) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFn, options);
    const curr = containerRef.current;

    if (curr) observer.observe(curr);
    return () => {
      if (curr) observer.unobserve(curr);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};
