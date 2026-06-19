import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, TrendingUp, Clock, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getWeeklyAudits } from "../audit/actions";
import { getFinancialRecords } from "../financial/actions";
import { PrayerTimes } from "@/components/dashboard/prayer-times";
import { ClientGreeting } from "@/components/dashboard/client-greeting";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.name || "Pengguna";

  // Ambil data asli dari database
  const { records: audits } = await getWeeklyAudits();
  const { records: finances } = await getFinancialRecords();

  const hasAudits = audits && audits.length > 0;
  const hasFinances = finances && finances.length > 0;
  const latestAudit = hasAudits ? audits[0] : null;

  // Kalkulasi Skor
  const totalTimeInHours = latestAudit ? latestAudit.total_time / 60 : 0;
  // 1. Productivity: berdasarkan total jam minggu ini (asumsi 40 jam = 100%)
  const productivityScore = latestAudit ? Math.min(100, Math.round((totalTimeInHours / 40) * 100)) : 0;
  
  // 2. Time Management: total jam minggu ini
  const timeManagement = latestAudit ? `${Math.floor(totalTimeInHours)}j ${latestAudit.total_time % 60}m` : "--";
  
  // 3. Consistency: jumlah minggu berturut-turut atau total audit
  const consistencyStr = hasAudits ? `${audits.length} Minggu` : "--";

  // 4. Financial: Total Saldo
  let balance = 0;
  if (hasFinances) {
    finances.forEach((record: { type: string; amount: number | string }) => {
      if (record.type === "income") {
        balance += Number(record.amount);
      } else {
        balance -= Number(record.amount);
      }
    });
  }
  const financialStr = hasFinances ? `Rp ${(balance/1000).toFixed(0)}k` : "--";


  // Kumpulan Kutipan Islami Harian
  const islamicQuotes = [
    "Maka sesungguhnya bersama kesulitan ada kemudahan. (QS. Al-Insyirah: 5)",
    "Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu. (QS. Al-Baqarah: 216)",
    "Dan bersabarlah, karena sesungguhnya Allah beserta orang-orang yang berbuat kebaikan. (QS. Hud: 115)",
    "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. (QS. Al-Baqarah: 286)",
    "Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya. (QS. At-Talaq: 2)",
    "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya. (HR. Ahmad)",
    "Dua kenikmatan yang banyak manusia tertipu di dalamnya: Kesehatan dan Waktu Luang. (HR. Bukhari)",
    "Setiap amal perbuatan tergantung pada niatnya. (HR. Bukhari & Muslim)"
  ];
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyQuote = islamicQuotes[dayOfYear % islamicQuotes.length];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Welcome & Motivation Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/15 via-blue-600/10 to-transparent p-6 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative flex flex-col gap-4">
          <div>
            <ClientGreeting />
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">{userName}</h2>
            
            <div className="flex items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 neon-badge">
                🔥 Streak: {hasAudits ? audits.length : 0} Minggu
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 neon-badge">
                🏆 Level {hasAudits ? Math.min(5, Math.floor(audits.length / 2) + 1) : 1} Auditor
              </span>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-3.5 mt-1">
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;{dailyQuote}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Prayer Times Widget */}
      <PrayerTimes />

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl hover:bg-violet-500/10 transition-all duration-500 shadow-lg shadow-violet-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-foreground/80">
              Productivity Score
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold tracking-tight text-white">{hasAudits ? `${productivityScore}/100` : "--"}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              {hasAudits ? "Berdasarkan audit terakhir" : "Belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl hover:bg-blue-500/10 transition-all duration-500 shadow-lg shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-foreground/80">
              Time Logged
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold tracking-tight text-white">{timeManagement}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              {hasAudits ? "Total jam terakhir" : "Belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl hover:bg-emerald-500/10 transition-all duration-500 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-foreground/80">
              Consistency
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold tracking-tight text-white">{consistencyStr}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              {hasAudits ? "Total minggu" : "Belum ada data"}
            </p>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl hover:bg-amber-500/10 transition-all duration-500 shadow-lg shadow-amber-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-foreground/80">
              Balance
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold tracking-tight ${balance < 0 ? "text-red-400" : "text-white"}`}>
              {financialStr}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              {hasFinances ? "Sisa saldo tersimpan" : "Belum ada data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-4">


        <Card className="border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-violet-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">AI Insight & Rekomendasi</CardTitle>
            </div>
            <CardDescription className="text-foreground/60">
              Analisis cerdas berdasarkan log aktivitas & keuanganmu
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
            {hasAudits ? (
              <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center space-y-4 w-full shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm text-foreground/90 px-2 font-medium leading-relaxed italic">
                  &ldquo;{productivityScore > 50 ? 'Produktivitasmu minggu ini cukup baik! Pertahankan momentum ini agar targetmu cepat tercapai.' : 'Melihat log waktumu, sepertinya minggu ini kamu terlalu santai. Ayo tingkatkan disiplinmu minggu depan!'}&rdquo;
                </p>
                <Button className="w-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary),0.2)]" asChild>
                  <Link href="/insight">Minta Roasting Lengkap dari AI</Link>
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-3 w-full">
                <div className="mx-auto w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground px-4">
                  Submit audit mingguan terlebih dahulu untuk mendapatkan insight tajam dari AuditLife AI.
                </p>
                <Button asChild className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10">
                  <Link href="/audit">
                    Mulai Audit Aktivitas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
