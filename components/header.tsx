"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { useMobile } from "@/hooks/use-media";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { MobileMenu } from "@/components/mobile-menu";
import { MobileMenuButton } from "@/components/mobile-menu-button";

import { toRouteName } from "@/utils/to-route-name";

// TODO: make categories dynamic
// TODO: make pages dynamic

function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useMobile();
  const activePage = searchParams.get("page") || pathname;

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [activeOption, setActiveOption] = useState<string>(activePage);

  const navigate = (route: string) => {
    window.history.pushState({ referer: activePage }, "", route);
    setActiveOption(route);
  };

  if (isMobile) {
    return (
      <header
        className={cn(
          isNavOpen ? "drop-shadow h-72" : "h-[4.5rem]",
          "fixed top-0 z-10 w-full bg-white px-4 py-3 transition-height duration-800 overflow-hidden",
        )}
      >
        <div className="flex items-center justify-center relative h-12">
          <h1 className="text-2xl font-bold">RINA WOLF</h1>
          <MobileMenuButton
            className="absolute right-0 top-0"
            isNavOpen={isNavOpen}
            setIsNavOpen={setIsNavOpen}
          />
        </div>

        {isNavOpen ? <MobileMenu setIsNavOpen={setIsNavOpen} /> : null}
      </header>
    );
  }

  return (
    <header className="fixed top-0 z-10 flex w-full items-start justify-between bg-white py-3 px-20 2xl:px-80">
      <NavigationMenu>
        <NavigationMenuList>
          {PAGES.map((route) => (
            //
            //
            <NavigationMenuItem key={route}>
              <NavigationMenuLink
                className={cn(
                  "text-xl font-semibold transition-opacity duration-300",
                  {
                    "opacity-100": route === activeOption,
                    "opacity-50": route !== activeOption,
                  },
                )}
                href={route}
                onClick={() => navigate(route)}
                onMouseLeave={() => setActiveOption(activePage)}
                onMouseOver={() => setActiveOption(route)}
              >
                {toRouteName(route)}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <h1 className="text-2xl font-bold">RINA WOLF</h1>
    </header>
  );
}
Header.displayName = "Header";

export { Header };
