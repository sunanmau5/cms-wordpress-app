"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { MobileBreakpoint } from "@/components/mobile-breakpoint";
import { MobileMenu } from "@/components/mobile-menu";
import { MobileMenuButton } from "@/components/mobile-menu-button";

import { toRouteName } from "@/utils/to-route-name";

// TODO: make categories dynamic
// TODO: make pages dynamic

function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePage = searchParams.get("page") || pathname;

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [activeOption, setActiveOption] = useState<string>(activePage);

  return (
    <header
      className={cn(
        isNavOpen && "drop-shadow-md",
        "fixed top-0 z-10 flex w-full items-start justify-between bg-white px-4 py-3 sm:items-center sm:px-20",
      )}
    >
      <h1 className="text-2xl font-bold">RINA WOLF</h1>

      <MobileBreakpoint>
        {(isMobile) =>
          isMobile ? (
            <>
              {isNavOpen ? <MobileMenu /> : null}
              <MobileMenuButton
                isNavOpen={isNavOpen}
                setIsNavOpen={setIsNavOpen}
              />
            </>
          ) : (
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
                      onMouseLeave={() => setActiveOption(activePage)}
                      onMouseOver={() => setActiveOption(route)}
                    >
                      {toRouteName(route)}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )
        }
      </MobileBreakpoint>
    </header>
  );
}
Header.displayName = "Header";

export { Header };
