import { Dispatch, SetStateAction } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { PAGES } from "@/lib/constants";

import { toRouteName } from "@/utils/to-route-name";

interface MobileMenuProps {
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
}

function MobileMenu(props: MobileMenuProps) {
  const handleClick = () => {
    props.setIsNavOpen(false);
  };

  return (
    <NavigationMenu.Root className="mt-2">
      <NavigationMenu.List className="space-y-4 text-center">
        {PAGES.map((route) => (
          //
          //
          <NavigationMenu.Item key={route}>
            <NavigationMenu.Link href={route} onClick={handleClick}>
              {toRouteName(route)}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
}
MobileMenu.displayName = "MobileMenu";

export { MobileMenu };
