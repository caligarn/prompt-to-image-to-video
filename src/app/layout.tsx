import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptCraft — AI Image & Video Prompt Helper",
  description: "Build, refine, and manage prompts for AI image and video generation tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight">PromptCraft</span>
              <span className="text-[10px] uppercase tracking-widest text-accent bg-accent-dim px-1.5 py-0.5 rounded">beta</span>
            </a>
            <div className="flex items-center gap-4 text-sm">
              <a href="/" className="text-muted hover:text-foreground transition-colors">Builder</a>
              <a href="/templates" className="text-muted hover:text-foreground transition-colors">Templates</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
