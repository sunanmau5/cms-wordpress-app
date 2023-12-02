import Link from "next/link";

import { cn } from "@/lib/utils";

import { useHoverContext } from "@/providers";

function Route({ activePage, route }: { activePage: string; route: string }) {
  const { activeOption, setActiveOption } = useHoverContext();
  return (
    <h2
      className={cn("text-xl font-semibold transition-opacity duration-300", {
        "opacity-100": route === activeOption,
        "opacity-50": route !== activeOption,
      })}
      onMouseLeave={() => setActiveOption(activePage)}
      onMouseOver={() => setActiveOption(route)}
    >
      <Link href={`/${route}`}>{route.replace("-", " ")}</Link>
    </h2>
  );
}
Route.displayName = "Route";

export { Route };
