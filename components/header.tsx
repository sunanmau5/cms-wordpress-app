"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Route } from "@/components/route";

import { HoverProvider } from "@/providers";

// TODO - make categories dynamic
// TODO - make pages dynamic

// TODO - make header responsive (especially for mobile)
//      - hamburger menu (?)

const categories = ["portfolio", "other-works"];
const staticPages = ["about", "contact"];

function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activePage = searchParams.get("page") || pathname.substring(1);
  return (
    <header className="fixed top-0 z-10 flex w-full items-center justify-between bg-white px-20 py-4">
      <h1 className="text-2xl font-bold">RINA WOLF</h1>

      <HoverProvider initialActiveOption={activePage}>
        {[...categories, ...staticPages].map((route) => (
          //
          //
          <Route key={route} activePage={activePage} route={route} />
        ))}
      </HoverProvider>
    </header>
  );
}
Header.displayName = "Header";

export { Header };
