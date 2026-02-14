import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTA V Natives Reference",
  description:
    "Complete documentation of GTA V native functions for FiveM development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-lg font-bold tracking-tight text-[var(--accent)]">
                GTA V Natives
              </span>
            </a>
            <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
              Native Function Reference
            </span>
            <div className="ml-auto">
              <a
                href="https://github.com/AIdotfly/natives"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
