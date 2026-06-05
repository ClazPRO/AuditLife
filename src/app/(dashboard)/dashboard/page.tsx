import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, TrendingUp, Clock, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.name || "Pengguna";

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-sm text-primary font-medium mb-1">{greeting} 👋</p>
          <h2 className="text-3xl font-bold tracking-tight">{userName}</h2>
          <p className="text-muted-foreground mt-1">
            Berikut adalah ringkasan performa dan aktivitasmu.
          </p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/5 bg-gradient-to-br from-violet-500/10 to-transparent hover:from-violet-500/15 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productivity Score
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Belum ada data audit
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent hover:from-blue-500/15 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Management
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Belum ada data audit
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent hover:from-emerald-500/15 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Belum ada data audit
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent hover:from-amber-500/15 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Financial Score
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Belum ada data audit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-white/5">
          <CardHeader>
            <CardTitle>Overview Mingguan</CardTitle>
            <CardDescription>
              Ringkasan aktivitasmu selama 7 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
            <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
              <ClipboardList className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Mulai Audit Pertamamu</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Kamu belum memiliki data audit minggu ini. Mulai catat aktivitasmu
              sekarang untuk mendapatkan AI Insight.
            </p>
            <Button asChild className="mt-4 glow-primary-hover">
              <Link href="/audit">
                Buat Weekly Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-white/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle>AI Insight & Rekomendasi</CardTitle>
            </div>
            <CardDescription>
              Pola dan saran berdasarkan aktivitasmu
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground px-4">
                Submit audit mingguan terlebih dahulu untuk mendapatkan insight dari AuditLife AI.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
