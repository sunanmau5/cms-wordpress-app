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
      <div className="my-0.5 px-4 py-4 sm:px-20 flex justify-between items-center">
        <a
          className="flex items-center gap-2"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icons.instagram />
          <h2 className="text-base font-semibold">@{username}</h2>
        </a>
      </div>
    </footer>
  );
}
Footer.displayName = "Footer";

export { Footer };
