import { cn } from "@/lib/utils";

import type { Page } from "./scroll";

export interface ScrollNavigationProps {
  pages: Page[];
  currentPage: number;
  forcePageChange: (_page: number) => void;
}

function ScrollNavigation({
  pages,
  currentPage,
  forcePageChange,
}: ScrollNavigationProps): JSX.Element {
  return (
    <div className="fixed w-full flex z-10 pl-[30%] justify-around text-xl my-4">
      {pages.map((page, i) => (
        //
        //
        <div
          key={i}
          className={cn(
            "cursor-pointer",
            currentPage === i ? "underline" : "no-underline",
          )}
          onClick={() => forcePageChange(i)}
        >
          {page.props.pageName || `Page ${i + 1}`}
        </div>
      ))}
    </div>
  );
}

export default ScrollNavigation;
