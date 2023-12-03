import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Meta } from "@/components/meta";

export default function Layout({ children }) {
  // TODO: show loading when height is calculated

  // TODO: make header and footer sticky

  // TODO: use scroll distance value / scroll top value to advance to the next post.
  //        Maybe use position absolute for the content too(?) so when user scrolls,
  //        the content is not moving. Only when the scroll distance exceeds the
  //        threshold, the content is moved to the next post.

  return (
    <div className="relative h-screen">
      <Meta />
      <Header />
      {/* <div className="fixed left-1/2 top-1/4 z-50 flex -translate-x-1/2 flex-col rounded-md bg-white px-4 py-2 shadow">
        <span>Scroll distance: {scrollDistance}</span>
      </div> */}
      <main className="absolute top-14 flex-1 pb-14">{children}</main>
      <Footer />
    </div>
  );
}
Layout.displayName = "Layout";

export { Layout };
