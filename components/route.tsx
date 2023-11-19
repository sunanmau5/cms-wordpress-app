import cx from "classnames";
import Link from "next/link";
import { useHoverContext } from "../providers";

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
      className={cx(
        "mx-20 text-xl font-semibold transition-opacity duration-300",
        {
          "opacity-100": route === activeOption,
          "opacity-50": route !== activeOption,
        },
      )}
      onMouseLeave={() => setActiveOption(activePage)}
      onMouseOver={() => setActiveOption(route)}
    >
      <Link href={`/${route}`}>{route.replace("-", " ")}</Link>
    </h2>
  );
}
