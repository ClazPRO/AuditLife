import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "../(auth)/actions";
import {
  LayoutDashboard,
  ClipboardList,
  LineChart,
  Wallet,
  LogOut,
  User,
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

  // Coba ambil profile name dari database jika diperlukan
  // Untuk MVP, pakai email
  const userName = user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-primary tracking-tight">AuditLife</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/audit"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ClipboardList className="h-4 w-4" />
              Weekly Audit
            </Link>
            <Link
              href="/insight"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              AI Insight
            </Link>
            <Link
              href="/financial"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Wallet className="h-4 w-4" />
              Financial Audit
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[150px]">{userName}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</span>
            </div>
          </div>
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile menu trigger could go here */}
          <div className="w-full flex-1">
            <h1 className="text-xl font-semibold sm:hidden">AuditLife</h1>
          </div>
        </header>
        <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
