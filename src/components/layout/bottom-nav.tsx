"use client";

// Mobile bottom navigation bar for quick access
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
    color: "text-violet-400",
    bgActive: "bg-violet-500/10",
  },
  {
    title: "Audit",
    href: "/audit",
    icon: ClipboardList,
    color: "text-blue-400",
    bgActive: "bg-blue-500/10",
  },
  {
    title: "Insight",
    href: "/insight",
    icon: LineChart,
    color: "text-emerald-400",
    bgActive: "bg-emerald-500/10",
  },
  {
    title: "Financial",
    href: "/financial",
    icon: Wallet,
    color: "text-amber-400",
    bgActive: "bg-amber-500/10",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 px-4 flex justify-center w-full xl:hidden">
      <div className="flex h-16 w-full max-w-md items-center justify-around rounded-2xl border border-white/10 bg-card/75 px-2 shadow-2xl backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300",
                isActive ? "scale-105" : "opacity-60 hover:opacity-100"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                  isActive ? `${item.bgActive} ring-1 ring-white/10` : ""
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? item.color : "text-muted-foreground")} />
              </div>
              <span className={cn("text-[9px] font-medium tracking-wide transition-all duration-300", isActive ? "text-foreground font-semibold" : "text-muted-foreground")}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
