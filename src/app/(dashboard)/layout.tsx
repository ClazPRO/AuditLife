import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "../(auth)/actions";
import { ChatWidget } from "@/components/chat/chat-widget";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CursorLoader } from "@/components/layout/cursor-loader";
import {
  LogOut,
  User,
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
    <div className="flex min-h-screen relative">
      {/* Subtle Background */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10 opacity-50" />
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-white/5 bg-card/50 backdrop-blur-xl sm:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/5 px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">AuditLife</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <SidebarNav />
        </div>
        
        {/* User Info */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-white/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col pb-24 sm:pb-0 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/80 backdrop-blur-md px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-xl font-semibold sm:hidden">AuditLife</h1>
            {/* Header user info/logout button on mobile only */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium truncate max-w-[120px]">{userName}</span>
              <form action={logout}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
      
      {/* Utility Components */}
      <BottomNav />
      <CursorLoader />
      <ChatWidget />
    </div>
  );
}
