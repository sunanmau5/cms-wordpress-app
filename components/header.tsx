import Link from "next/link";
import { useRouter } from "next/router";

// TODO - make categories dynamic
// TODO - make pages dynamic

const categories = ["other-works"];
const staticPages = ["about", "contact"];

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex items-center">
      <h1 className="m-20 text-4xl font-bold">
        <Link href="/">RINA WOLF</Link>
      </h1>

      {[...categories, ...staticPages].map((route) => (
        //
        //
        <h2 key={route} className="m-20 text-2xl font-semibold">
          <Link href={`/${route}`}>{route}</Link>
        </h2>
      ))}
    </header>
  );
}
