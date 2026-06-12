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
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight"
            >
              <Image
                src="/tripscale-logo.png"
                alt="TripScale"
                width={71}
                height={32}
                priority
              />
              <span className="text-primary">Stories</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link
                href="/#countries"
                className="transition-colors hover:text-primary"
              >
                Countries
              </Link>
              <Link
                href="/submit"
                className="rounded-full bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
              >
                Share your trip
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
