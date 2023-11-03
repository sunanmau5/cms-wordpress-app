import cx from "classnames";
import Link from "next/link";
import { useHoverContext } from "./hover-provider";

export default function Route({
  activePage,
  route,
}: {
  activePage: string;
  route: string;
}) {
  const { activeOption, setActiveOption } = useHoverContext();
  return (
    <h2
      onMouseOver={() => setActiveOption(route)}
      onMouseLeave={() => setActiveOption(activePage)}
      className={cx(
        "mx-20 text-2xl font-semibold transition-opacity duration-300",
        {
          "opacity-100": route === activeOption,
          "opacity-50": route !== activeOption,
        },
      )}
    >
      <Link href={`/${route}`}>{route.replace("-", " ")}</Link>
    </h2>
  );
}
