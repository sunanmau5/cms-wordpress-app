"use client";

import { useMediaQuery } from "react-responsive";

import { breakpoints } from "@/utils/breakpoints";

function useMobile() {
  return useMediaQuery(breakpoints.Mobile);
}

function useTabletOrSmaller() {
  return useMediaQuery(breakpoints.TabletOrSmaller);
}

export { useMobile, useTabletOrSmaller };
