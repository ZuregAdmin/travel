import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TripScale Stories",
    template: "%s · TripScale Stories",
  },
  description:
    "Real trips, real budgets — travel stories and photos from every country in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-display font-semibold tracking-tight"
            >
              <Image
                src="/tripscale-logo.png"
                alt="TripScale"
                width={213}
                height={96}
                priority
                className="h-10 w-[142px] object-cover drop-shadow-[0_10px_24px_#2f7dff24] sm:h-[52px] sm:w-[184px]"
              />
              <span className="text-lg text-primary sm:text-2xl">Stories</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium sm:gap-5">
              <Link
                href="/#countries"
                className="hidden transition-colors hover:text-primary sm:inline"
              >
                Countries
              </Link>
              <Link
                href="/submit"
                className="rounded-full bg-primary px-3.5 py-2 text-primary-foreground transition-opacity hover:opacity-90 sm:px-4"
              >
                <span className="sm:hidden">Share trip</span>
                <span className="hidden sm:inline">Share your trip</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground sm:px-6">
            <p>© {new Date().getFullYear()} TripScale Stories</p>
            <Link href="/admin" className="transition-colors hover:text-foreground">
              Admin
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
