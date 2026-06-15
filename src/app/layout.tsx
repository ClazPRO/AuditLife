import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AuditLife — Self-Audit & Produktivitas",
  description: "Platform self-audit berbasis data untuk membantu Anda memahami, mengevaluasi, dan meningkatkan kualitas hidup secara berkelanjutan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth h-full overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden bg-neutral-950 flex items-center justify-center p-0 sm:p-6 md:p-8 relative`}
      >
        {/* Subtle Background */}
        <div className="fixed inset-0 bg-neutral-950 -z-10" />
        <div className="fixed inset-0 grid-pattern -z-10 opacity-30" />
        
        {/* Phone Mockup Frame Container */}
        <div className="w-full h-full sm:w-[410px] sm:h-[728px] sm:rounded-[36px] sm:border-[8px] sm:border-neutral-800 bg-background sm:shadow-[0_0_60px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden">
          {/* Status Bar / Notch spacer for desktop */}
          <div className="hidden sm:flex justify-center items-center h-6 bg-background/80 backdrop-blur-md w-full sticky top-0 z-30 shrink-0">
            <div className="h-4 w-28 bg-neutral-900 rounded-full border border-white/5 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mr-2 animate-pulse" />
              <span className="text-[9px] text-muted-foreground/80 font-mono tracking-widest">AUDITLIFE</span>
            </div>
          </div>

          {/* Children container */}
          <div className="flex-1 relative flex flex-col overflow-y-auto overflow-x-hidden min-h-0">
            {children}
          </div>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
