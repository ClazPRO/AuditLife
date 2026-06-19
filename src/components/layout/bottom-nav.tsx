"use client";

// Mobile bottom navigation bar for quick access
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LineChart,
  Wallet,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Beranda",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-violet-400",
    bgActive: "bg-violet-500/10",
  },
  {
    title: "Audit Hidup",
    href: "/audit",
    icon: ClipboardList,
    color: "text-blue-400",
    bgActive: "bg-blue-500/10",
  },
  {
    title: "Mutabaah",
    href: "/mutabaah",
    icon: BookOpen,
    color: "text-rose-400",
    bgActive: "bg-rose-500/10",
  },
  {
    title: "Keuangan",
    href: "/financial",
    icon: Wallet,
    color: "text-amber-400",
    bgActive: "bg-amber-500/10",
  },
  {
    title: "Laporan",
    href: "/insight",
    icon: LineChart,
    color: "text-emerald-400",
    bgActive: "bg-emerald-500/10",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 inset-x-0 z-40 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] flex justify-center w-full pointer-events-none">
      <div className="flex h-16 w-full max-w-md items-center justify-around rounded-2xl border border-white/10 bg-card/75 px-2 shadow-2xl backdrop-blur-xl pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all duration-300 min-h-[52px]",
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
              <span className={cn("text-[10px] font-medium tracking-wide transition-all duration-300", isActive ? "text-foreground font-semibold" : "text-muted-foreground")}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
