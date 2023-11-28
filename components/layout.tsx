import { useState } from "react";

import { useElementSize, useScrollDistance } from "../hooks";

import Footer from "./footer";
import Header from "./header";
import Meta from "./meta";

export default function Layout({ children }) {
  const [ref, { height }] = useElementSize<HTMLDivElement>();

  // TODO - show loading when height is calculated

  // TODO - make header and footer sticky

  // TODO - use scroll distance value / scroll top value to advance to the next post.
  //        Maybe use position absolute for the content too(?) so when user scrolls,
  //        the content is not moving.Only when the scroll distance exceeds the
  //        threshold, the content is moved to the next post.

  const [scrollDistance, setScrollDistance] = useState<number>(0);

  useScrollDistance((distance) => {
    console.log({ distance });
    setScrollDistance(distance);
  });

  return (
    <div className="relative h-screen w-screen">
      <Meta />
      <Header />
      {/* <div className="fixed left-1/2 top-1/4 z-50 flex -translate-x-1/2 flex-col rounded-md bg-white px-4 py-2 shadow">
        <span>Scroll distance: {scrollDistance}</span>
      </div> */}
      <main className="absolute top-16 z-0 flex w-full flex-1 flex-col gap-4 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
