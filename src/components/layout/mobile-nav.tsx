"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./sidebar-nav";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  userName: string;
  userEmail: string;
}

export function MobileNav({ userName, userEmail }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 h-9 w-9"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm flex-col bg-background/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out sm:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="h-8 w-8 relative rounded-lg overflow-hidden border border-primary/20 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
              <img src="/logo.png" alt="AuditLife Logo" className="object-cover w-full h-full" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">AuditLife</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-6">
          <SidebarNav />
        </div>

        {/* User Info */}
        <div className="border-t border-white/5 p-4 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-white/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
            </div>
          </div>
          <form action="/auth/logout" method="post">
            <Button type="submit" variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
