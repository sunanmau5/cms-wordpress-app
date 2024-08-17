import dynamic from "next/dynamic";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";

import Transitions, { Animate } from "@/components/hoc/transitions";

import "@/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const NoSSRHeader = dynamic(() => import("@/components/header"), {
  ssr: false,
});

const NoSSRFooter = dynamic(() => import("@/components/footer"), {
  ssr: false,
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="no-scrollbar overscroll-none" lang="en">
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <Transitions className="flex flex-col">
          <NoSSRHeader />
          <Animate className="flex-1 no-scrollbar">{children}</Animate>
          <NoSSRFooter />
        </Transitions>

        <Toaster />
      </body>
    </html>
  );
}
