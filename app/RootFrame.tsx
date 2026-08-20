"use client";

import type { ReactNode } from "react";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import Transitions, { Animate } from "@/components/hoc/transitions";

const NoSSRHeader = dynamic(() => import("@/components/header"), { ssr: false });
const NoSSRFooter = dynamic(() => import("@/components/footer"), { ssr: false });

// The birthday portal is a full-screen, standalone experience. Everywhere else
// (the portfolio) keeps the header, footer, and page-transition chrome exactly
// as before; under /portal we render the children bare so no portfolio UI
// flashes in behind the portal and no global <a>-click interception applies.
export default function RootFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/portal")) {
    return <>{children}</>;
  }

  return (
    <Transitions className="flex flex-col">
      <NoSSRHeader />
      <Animate className="flex-1 no-scrollbar">{children}</Animate>
      <NoSSRFooter />
    </Transitions>
  );
}
