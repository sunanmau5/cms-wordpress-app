import { useEffect, useRef, useState } from "react";
import { throttle } from "lodash";

interface ScrollEvent {
  scrollY: number;
  scrollX: number;
}

interface IsScrollingValue {
  isScrolling: boolean;
  isScrollingX: boolean;
  isScrollingY: boolean;
  scrollDirectionX: HorizontalScrollDirection;
  scrollDirectionY: VerticalScrollDirection;
}

enum HorizontalScrollDirection {
  Left = "left",
  Right = "right",
  None = "none",
}

enum VerticalScrollDirection {
  Up = "up",
  Down = "down",
  None = "none",
}

const DEFAULT_VALUE: IsScrollingValue = {
  isScrolling: false,
  isScrollingX: false,
  isScrollingY: false,
  scrollDirectionX: HorizontalScrollDirection.None,
  scrollDirectionY: VerticalScrollDirection.None,
};

export const useIsScrolling = (): IsScrollingValue => {
  const [value, setValue] = useState(DEFAULT_VALUE);

  const lastEventRef = useRef<ScrollEvent | undefined>(undefined);
  const scrollTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const resetValues = () => {
      setValue(DEFAULT_VALUE);
    };

    const clearTimer = () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = undefined;
      }
    };

    const onTimerEnded = () => {
      clearTimer();
      setValue(DEFAULT_VALUE);
    };

    const resetTimer = () => {
      clearTimer();
      scrollTimerRef.current = window.setTimeout(onTimerEnded, 250);
    };

    const listener = () => {
      const { scrollX, scrollY } = window;

      if (lastEventRef.current) {
        const lastEvent = lastEventRef.current;
        const nextIsScrollingX = scrollX !== lastEvent.scrollX;
        const nextIsScrollingY = scrollY !== lastEvent.scrollY;
        const nextIsScrolling = nextIsScrollingX || nextIsScrollingY;

        let nextScrollDirectionX = HorizontalScrollDirection.None;
        if (nextIsScrollingX) {
          nextScrollDirectionX =
            scrollX < lastEvent.scrollX
              ? HorizontalScrollDirection.Left
              : HorizontalScrollDirection.Right;
        }

        let nextScrollDirectionY = VerticalScrollDirection.None;
        if (nextIsScrollingY) {
          nextScrollDirectionY =
            scrollY < lastEvent.scrollY
              ? VerticalScrollDirection.Up
              : VerticalScrollDirection.Down;
        }

        setValue({
          isScrolling: nextIsScrolling,
          isScrollingX: nextIsScrollingX,
          isScrollingY: nextIsScrollingY,
          scrollDirectionX: nextScrollDirectionX,
          scrollDirectionY: nextScrollDirectionY,
        });

        if (nextIsScrolling) {
          resetTimer();
        } else {
          resetValues();
        }
      }

      lastEventRef.current = { scrollX, scrollY };
    };

    const throttledListener = throttle(listener, 75);

    window.addEventListener("scroll", throttledListener);
    return () => {
      window.removeEventListener("scroll", throttledListener);
      clearTimer();
    };
  }, []);

  return value;
};
