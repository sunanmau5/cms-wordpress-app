"use client";

import { useMediaQuery } from "react-responsive";

import { breakpoints } from "@/utils/breakpoints";

function useMobile() {
  return useMediaQuery(breakpoints.Mobile);
}

function useTabletOrSmaller() {
  return useMediaQuery(breakpoints.TabletOrSmaller);
}

function useDesktop() {
  return useMediaQuery(breakpoints.Desktop);
}
function Desktop({ children }: { children: React.ReactNode }) {
  const isDesktop = useDesktop();
  return isDesktop ? <>{children}</> : null;
}
function useDesktop2xl() {
  return useMediaQuery(breakpoints.Desktop2xl);
}

function Desktop2xl({ children }: { children: React.ReactNode }) {
  const isDesktop2xl = useDesktop2xl();
  return isDesktop2xl ? <>{children}</> : null;
}

function useDesktop3xl() {
  return useMediaQuery(breakpoints.Desktop3xl);
}

export {
  Desktop,
  Desktop2xl,
  useDesktop2xl,
  useDesktop3xl,
  useMobile,
  useTabletOrSmaller,
};
