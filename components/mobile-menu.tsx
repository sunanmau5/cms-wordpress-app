import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { PAGES } from "@/lib/constants";

import { toRouteName } from "@/utils/to-route-name";

function MobileMenu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        {PAGES.map((route) => (
          //
          //
          <NavigationMenu.Item key={route}>
            <NavigationMenu.Link href={route}>
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
