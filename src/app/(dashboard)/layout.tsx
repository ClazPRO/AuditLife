import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "../(auth)/actions";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CursorLoader } from "@/components/layout/cursor-loader";
import { LogOut, Sparkles } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/80 backdrop-blur-md px-4 shrink-0">
        <div className="w-full flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">AuditLife</span>
          </Link>
          {/* Header user info/logout button */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium truncate max-w-[120px]">{userName}</span>
            <form action={logout}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Scrollable Main Body */}
      <main className="flex-1 overflow-y-auto p-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] no-scrollbar">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />

      {/* Utility Components */}
      <CursorLoader />
    </div>
  );
}
