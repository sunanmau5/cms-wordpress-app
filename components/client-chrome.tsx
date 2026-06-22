"use client";

import dynamic from "next/dynamic";

const NoSSRHeader = dynamic(() => import("@/components/header"), {
  ssr: false,
});

const NoSSRFooter = dynamic(() => import("@/components/footer"), {
  ssr: false,
});

export function ClientChrome() {
  return (
    <>
      <NoSSRHeader />
      <NoSSRFooter />
    </>
  );
}
