"use client";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";

import { PageAnimatePresence } from "@/components/page-animate-presence";

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
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background no-scrollbar font-sans antialiased",
          fontSans.variable,
        )}
      >
        <PageAnimatePresence>{children}</PageAnimatePresence>

        <Toaster />
      </body>
    </html>
  );
}
