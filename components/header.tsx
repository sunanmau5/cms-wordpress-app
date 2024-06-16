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

  const navigate = (route: string) => {
    window.history.pushState({ referer: activePage }, "", route);
    setActiveOption(route);
  };

  return (
    <header
      className={cn(
        isNavOpen ? "drop-shadow h-56" : "h-[4.5rem]",
        "fixed top-0 z-10 flex w-full items-start justify-between bg-white px-4 py-3 sm:px-20 transition-height duration-800 overflow-hidden sm:h-auto",
      )}
    >
      <MobileBreakpoint>
        {(isMobile) =>
          isMobile ? (
            <>
              <h1 className="text-2xl font-bold mt-2 sm:mt-0 mx-auto">
                RINA WOLF
              </h1>
              {isNavOpen ? <MobileMenu setIsNavOpen={setIsNavOpen} /> : null}
              <MobileMenuButton
                isNavOpen={isNavOpen}
                setIsNavOpen={setIsNavOpen}
              />
            </>
          ) : (
            <>
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

              <h1 className="text-2xl font-bold mt-2 sm:mt-0">RINA WOLF</h1>
            </>
          )
        }
      </MobileBreakpoint>
    </header>
  );
}
Header.displayName = "Header";

export { Header };
