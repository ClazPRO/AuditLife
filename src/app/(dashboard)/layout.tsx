import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "../(auth)/actions";
import { ChatWidget } from "@/components/chat/chat-widget";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CursorLoader } from "@/components/layout/cursor-loader";
import {
  LogOut,
  Sparkles,
} from "lucide-react";

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
    <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-0 sm:p-6 md:p-8 relative">
      {/* Subtle Background */}
      <div className="fixed inset-0 bg-neutral-950 -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10 opacity-30" />
      
      {/* Phone container */}
      <div className="w-full h-screen sm:w-[410px] sm:h-[728px] sm:rounded-[36px] sm:border-[8px] sm:border-neutral-800 bg-background sm:shadow-[0_0_60px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden">
        {/* Status Bar / Notch spacer for desktop */}
        <div className="hidden sm:flex justify-center items-center h-6 bg-background/80 backdrop-blur-md w-full sticky top-0 z-30 shrink-0">
          <div className="h-4 w-28 bg-neutral-900 rounded-full border border-white/5 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mr-2 animate-pulse" />
            <span className="text-[9px] text-muted-foreground/80 font-mono tracking-widest">AUDITLIFE</span>
          </div>
        </div>

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
        <main className="flex-1 overflow-y-auto p-4 pb-28 no-scrollbar">
          {children}
        </main>
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Utility Components */}
      <CursorLoader />
      <ChatWidget />
    </div>
  );
}
