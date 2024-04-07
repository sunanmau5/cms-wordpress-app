import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Transitions, { Animate } from "@/components/hoc/transitions";

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
        <Transitions className="flex h-screen flex-col">
          <Header />
          <Animate className="flex-1">{children}</Animate>
          <Footer />
        </Transitions>

        <Toaster />
      </body>
    </html>
  );
}
