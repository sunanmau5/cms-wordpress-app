import { useCallback, useLayoutEffect, useState } from "react";

const pageYfromTouch = (e: TouchEvent) => {
  return e.changedTouches[0].pageY;
};

const pageXfromTouch = (e: TouchEvent) => {
  return e.changedTouches[0].pageX;
};

const pageYfromClick = (e: MouseEvent) => {
  return e.pageY;
};

const deltaDiff = (startPos: number, endPos: number) => {
  return startPos - endPos;
};

export type Direction = "up" | "down" | null;
const threshold = 100;

function useWindowsScroll() {
  const [direction, setDirection] = useState<Direction>(null);
  const [startPosY, setStartPosY] = useState<number>(0);
  const [startPosX, setStartPosX] = useState<number>(0);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [trigger, setTrigger] = useState<boolean>(false);

  const updateDirection = useCallback((delta: number) => {
    if (Math.abs(delta) < threshold) return;
    let dir: Direction;

    if (delta < 0) {
      dir = "up";
    } else if (delta > 0) {
      dir = "down";
    } else {
      dir = null;
    }
    setDirection(dir);
    setTrigger((prev) => !prev);
  }, []);

  const handleScroll = (e: WheelEvent) => {
    const delta = e.deltaY;
    updateDirection(delta);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setStartPosY(pageYfromTouch(e));
    setStartPosX(pageXfromTouch(e));
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const endPosY = pageYfromTouch(e);
      const endPosX = pageXfromTouch(e);
      const deltaY = deltaDiff(startPosY, endPosY);
      const deltaX = deltaDiff(startPosX, endPosX);

      // Only update direction if the vertical movement is greater than horizontal
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        updateDirection(deltaY);
      }

      setStartPosY(0);
      setStartPosX(0);
      setOffset(0);
    },
    [startPosY, startPosX, updateDirection],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const currentPosY = pageYfromTouch(e);
      const currentPosX = pageXfromTouch(e);
      const deltaY = deltaDiff(startPosY, currentPosY);
      const deltaX = deltaDiff(startPosX, currentPosX);

      // Only set offset if the vertical movement is greater than horizontal
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        setOffset(deltaY);
      }
    },
    [startPosY, startPosX],
  );

  const handleMouseDown = (e: MouseEvent) => {
    setStartPosY(pageYfromClick(e));
    setMouseDown(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!mouseDown) return;
    const currentPos = pageYfromClick(e);
    setOffset(deltaDiff(startPosY, currentPos));
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!mouseDown) return;
    const endPos = pageYfromClick(e);
    const delta = deltaDiff(startPosY, endPos);
    updateDirection(delta);
    setMouseDown(false);
    setStartPosY(0);
    setOffset(0);
  };

  useLayoutEffect(() => {
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return { direction, trigger, offset };
}

export { useWindowsScroll };
