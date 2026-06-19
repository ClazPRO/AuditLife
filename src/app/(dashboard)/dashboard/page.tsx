import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, TrendingUp, Clock, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getWeeklyAudits } from "../audit/actions";
import { getFinancialRecords } from "../financial/actions";
import { PrayerTimes } from "@/components/dashboard/prayer-times";

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

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

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
            <p className="text-[11px] text-primary font-semibold tracking-wider uppercase mb-1">{greeting} 👋</p>
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

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="neon-card-violet group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productivity Score
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasAudits ? `${productivityScore}/100` : "--"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasAudits ? "Berdasarkan audit terakhir" : "Belum ada data audit"}
            </p>
          </CardContent>
        </Card>

        <Card className="neon-card-blue group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Logged
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeManagement}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasAudits ? "Total jam audit terakhir" : "Belum ada data audit"}
            </p>
          </CardContent>
        </Card>

        <Card className="neon-card-emerald group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consistencyStr}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasAudits ? "Total minggu tercatat" : "Belum ada data audit"}
            </p>
          </CardContent>
        </Card>

        <Card className="neon-card-amber group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Balance
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance < 0 ? "text-red-400" : ""}`}>
              {financialStr}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasFinances ? "Sisa saldo tersimpan" : "Belum ada data keuangan"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Times Widget */}
      <PrayerTimes />

      {/* Main Content Grid */}
      <div className="flex flex-col gap-4">
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Overview Mingguan</CardTitle>
            <CardDescription>
              Ringkasan aktivitasmu selama 7 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
            {latestAudit ? (
              <div className="w-full space-y-4 text-left p-4">
                <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Audit Terakhir</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal</span>
                    <span>{new Date(latestAudit.week_start_date).toLocaleDateString("id-ID")} - {new Date(latestAudit.week_end_date).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Waktu</span>
                    <span>{Math.floor(latestAudit.total_time / 60)}j {latestAudit.total_time % 60}m</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                    <span className="text-muted-foreground">Catatan</span>
                    <span className="text-right max-w-[200px] truncate">{latestAudit.summary || "-"}</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-4 glow-primary-hover">
                  <Link href="/audit">Lihat Semua Audit</Link>
                </Button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/5">
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
            {hasAudits ? (
              <div className="p-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 text-center space-y-3 w-full">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-foreground px-2 font-medium">
                  &ldquo;{productivityScore > 50 ? 'Produktivitasmu minggu ini cukup baik! Pertahankan momentum ini.' : 'Sepertinya minggu ini kamu butuh fokus lebih untuk meningkatkan produktivitas.'}&rdquo;
                </p>
                <Button variant="outline" asChild className="w-full mt-2">
                  <Link href="/insight">Tanya AI Lebih Lanjut</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground px-4">
                  Submit audit mingguan terlebih dahulu untuk mendapatkan insight dari AuditLife AI.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
