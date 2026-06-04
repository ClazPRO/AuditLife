"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LineChart,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Weekly Audit",
    href: "/audit",
    icon: ClipboardList,
  },
  {
    title: "AI Insight",
    href: "/insight",
    icon: LineChart,
  },
  {
    title: "Financial Audit",
    href: "/financial",
    icon: Wallet,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              isActive 
                ? "bg-muted text-primary" 
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
