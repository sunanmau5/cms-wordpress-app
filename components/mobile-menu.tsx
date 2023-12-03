import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const routes = ["portfolio", "other-works", "about", "contact", "services"];

function MobileMenu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        {routes.map((route) => (
          <NavigationMenu.Item key={route}>
            <NavigationMenu.Link href={`/${route}`}>
              {route.replace("-", " ")}
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
