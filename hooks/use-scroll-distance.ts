import { useEffect, useRef } from "react";

type ScrollCallback = (distance: number, start: number, end: number) => void;

export const useScrollDistance = (
  callback: ScrollCallback,
  refresh = 66,
): void => {
  const isScrolling = useRef<NodeJS.Timeout | null>(null);
  const start = useRef<number | null>(null);
  const end = useRef<number | null>(null);
  const distance = useRef<number | null>(null);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Set starting position
      if (start.current === null) {
        start.current = window.scrollY;
      }

      // Clear the timeout throughout the scroll
      if (isScrolling.current) {
        clearTimeout(isScrolling.current);
      }

      // Set a timeout to run after scrolling ends
      isScrolling.current = setTimeout(() => {
        // Calculate distance
        end.current = window.scrollY;
        distance.current = end.current - start.current;

        // Run the callback
        if (
          distance.current !== null &&
          start.current !== null &&
          end.current !== null
        ) {
          callback(distance.current, start.current, end.current);
        }

        // Reset calculations
        start.current = null;
        end.current = null;
        distance.current = null;
      }, refresh || 66);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      if (isScrolling.current) {
        clearTimeout(isScrolling.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback, refresh]);
};
