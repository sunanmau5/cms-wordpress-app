import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";

import RootFrame from "./RootFrame";

import "@/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
        <RootFrame>{children}</RootFrame>

        <Toaster />
      </body>
    </html>
  );
}
