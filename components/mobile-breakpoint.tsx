import React from "react";

import { useMobile } from "@/hooks/use-media";

interface IMobileBreakpointProps {
  children: (isMobile: boolean) => React.ReactNode;
}

function MobileBreakpoint(props: IMobileBreakpointProps) {
  const isMobile = useMobile();
  return <>{props.children(isMobile)}</>;
}
MobileBreakpoint.displayName = "MobileBreakpoint";

export { MobileBreakpoint };
