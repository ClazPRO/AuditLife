"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LineChart,
  Wallet,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-violet-400",
    bgActive: "bg-violet-500/10",
  },
  {
    title: "Weekly Audit",
    href: "/audit",
    icon: ClipboardList,
    color: "text-blue-400",
    bgActive: "bg-blue-500/10",
  },

  {
    title: "AI Insight",
    href: "/insight",
    icon: LineChart,
    color: "text-emerald-400",
    bgActive: "bg-emerald-500/10",
  },
  {
    title: "Financial Audit",
    href: "/financial",
    icon: Wallet,
    color: "text-amber-400",
    bgActive: "bg-amber-500/10",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-3 text-sm font-medium lg:px-4 space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              isActive 
                ? `${item.bgActive} ${item.color} font-semibold` 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive && item.color)} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
