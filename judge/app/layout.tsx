import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { History, UserCircle, SunMoon } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlmostFiesta",
  description: "Production-grade LLM evaluation arena.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans overflow-x-hidden">
        
        {/* Sticky Premium Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-6 sm:px-10">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <span className="font-semibold tracking-tight text-lg">AlmostFiesta</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="hover:text-foreground transition-colors h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
                <History className="h-4 w-4" />
              </button>
              <button className="hover:text-foreground transition-colors h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
                <SunMoon className="h-4 w-4" />
              </button>
              <Link href="https://github.com" target="_blank" className="hover:text-foreground transition-colors h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Link>
              <div className="h-4 w-px bg-border mx-1"></div>
              <button className="h-8 w-8 overflow-hidden rounded-full border border-border hover:border-foreground/30 transition-colors ml-1">
                <UserCircle className="h-full w-full text-muted-foreground/50 bg-muted/20" strokeWidth={1} />
              </button>
            </div>
          </div>
        </header>

        {/* Subtle Background Glow */}
        <div className="fixed inset-0 z-[-1] pointer-events-none flex justify-center">
          <div className="absolute top-[-10%] w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50 mix-blend-screen" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-[1500px] mx-auto flex flex-col">
          {children}
        </div>

      </body>
    </html>
  );
}
