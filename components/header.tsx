import Link from "next/link"

// TODO - make header nav responsive
// TODO - make routes dynamic

export default function Header() {
  return (
    <header className="flex items-center">
      <h1 className="m-20 text-4xl font-bold">
        <Link href="/">RINA WOLF</Link>
      </h1>

      <h2 className="m-20 text-2xl font-semibold">
        <Link href="/other-works">other works</Link>
      </h2>
    </header>
  )
}
