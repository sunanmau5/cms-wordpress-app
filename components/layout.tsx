import { ImageHeightProvider } from "../providers";
import Footer from "./footer";
import Header from "./header";
import Meta from "./meta";

import { useElementSize } from "usehooks-ts";

export default function Layout({ children }) {
  const [ref, { height }] = useElementSize();

  // TODO - show loading when height is calculated

  return (
    <>
      <Meta />
      <Header />
      <main
        ref={ref}
        className="no-scrollbar flex flex-1 snap-y flex-col gap-4 overflow-y-auto"
        // header height is 68px
        // footer height is 56px
        style={{ height: "calc(100vh - 68px - 56px)" }}
      >
        <ImageHeightProvider imageHeight={height}>
          {height === 0 ? (
            //
            //
            <span className="ml-20">Calculating height...</span>
          ) : (
            children
          )}
        </ImageHeightProvider>
      </main>
      <Footer />
    </>
  );
}
