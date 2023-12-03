"use client";

import { useWindowDimensions } from "@/hooks/use-window-dimensions";

import { breakpoints } from "@/utils/breakpoints";

function useMobile() {
  const { width } = useWindowDimensions();
  return width <= breakpoints.Mobile.maxWidth;
}

function useTabletOrSmaller() {
  const { width } = useWindowDimensions();
  return width <= breakpoints.TabletOrSmaller.maxWidth;
}

export { useMobile, useTabletOrSmaller };
