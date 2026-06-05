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
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-950 flex flex-col relative`}
      >
        {/* Subtle Background */}
        <div className="fixed inset-0 bg-neutral-950 -z-10" />
        <div className="fixed inset-0 grid-pattern -z-10 opacity-30" />
        
        {/* Main responsive container */}
        <div className="flex-1 w-full relative flex flex-col min-h-0">
          {children}
        </div>

        <Toaster />
      </body>
    </html>
  );
}
