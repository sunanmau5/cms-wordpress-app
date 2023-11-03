import { useRouter } from "next/router";
import { HoverProvider } from "./hover-provider";
import Route from "./route";

// TODO - make categories dynamic
// TODO - make pages dynamic

const categories = ["portfolio", "other-works"];
const staticPages = ["about", "contact"];

export default function Header() {
  const { query, pathname } = useRouter();
  const activePage = (query.page as string) || pathname.substring(1);
  return (
    <header className="sticky top-0 flex items-center bg-white py-4">
      <h1 className="mx-20 text-4xl font-bold">RINA WOLF</h1>

      <HoverProvider initialActiveOption={activePage}>
        {[...categories, ...staticPages].map((route) => (
          //
          //
          <Route key={route} activePage={activePage} route={route} />
        ))}
      </HoverProvider>
    </header>
  );
}
