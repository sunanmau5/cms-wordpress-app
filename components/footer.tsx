"use client";

import { useMobile } from "@/hooks/use-media";

import { Icons } from "./icons";

function Footer() {
  const isMobile = useMobile();

  const username = "waworu";
  const href = isMobile
    ? `instagram://user?username=${username}`
    : `https://instagram.com/${username}`;

  return (
    <footer className="fixed bottom-0 z-10 w-full bg-white">
      <div className="p-4 sm:px-20 2xl:px-80 flex justify-between items-center">
        <a
          className="flex items-center gap-2"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icons.instagram />
        </a>
      </div>
    </footer>
  );
}
Footer.displayName = "Footer";

export { Footer };
