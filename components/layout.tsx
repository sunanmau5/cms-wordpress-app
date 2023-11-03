import Footer from "./footer";
import Header from "./header";
import Meta from "./meta";

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <Header />
      <div className="min-h-screen">
        <main className="flex flex-col gap-4">{children}</main>
      </div>
      <Footer />
    </>
  );
}
