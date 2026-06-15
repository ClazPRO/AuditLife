"use client";

import { useState, useEffect } from "react";
import { Sparkles, Brain, TrendingUp, Wallet, RefreshCw, Loader2, KeyRound, CheckCircle2, AlertCircle, ChevronRight, Star, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateAIInsight, checkApiKeyConfigured, saveGeminiApiKey } from "./actions";

interface InsightData {
  weeklyHighlight: string;
  productivityScore: number;
  productivityObservation: string;
  productivityTips: string[];
  topProductiveActivity: string;
  financialScore: number;
  financialObservation: string;
  financialTips: string[];
  biggestExpenseCategory: string;
  savingsStatus: string;
  generatedAt: string;
}

// Circular Score Component
function ScoreRing({ score, color }: { score: number; color: "violet" | "emerald" }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colorMap = {
    violet: { stroke: "#7c3aed", bg: "#7c3aed20", text: "text-violet-400" },
    emerald: { stroke: "#10b981", bg: "#10b98120", text: "text-emerald-400" },
  };
  const c = colorMap[color];

  const label = score >= 75 ? "Baik" : score >= 50 ? "Cukup" : "Perlu Tingkatkan";
  const labelColor = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke={c.bg} strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={c.stroke} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${c.text}`}>{score}</span>
          <span className="text-[9px] text-muted-foreground font-medium">/ 100</span>
        </div>
      </div>
      <span className={`text-[11px] font-bold ${labelColor}`}>{label}</span>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: any; color: string; bg: string }> = {
    "Baik": { icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    "Cukup": { icon: Star, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    "Perlu Perhatian": { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  };
  const s = map[status] || map["Cukup"];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${s.color} ${s.bg}`}>
      <Icon className="h-3 w-3" /> {status}
    </span>
  );
}

export default function InsightPage() {
  const { toast } = useToast();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showLedger, setShowLedger] = useState(false);
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  const loadingTexts = [
    "Mengambil data audit produktivitas...",
    "Membaca riwayat keuangan Anda...",
    "Mengirim ke Google Gemini AI...",
    "Membuat analisis personal...",
    "Menyusun rekomendasi...",
  ];

  useEffect(() => {
    async function init() {
      const isConfigured = await checkApiKeyConfigured();
      setHasApiKey(isConfigured);
      const cached = localStorage.getItem("auditlife_ai_insights_v2");
      if (cached) {
        try { setInsight(JSON.parse(cached)); } catch {}
      }
    }
    init();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => setLoadingStep((p) => (p + 1) % loadingTexts.length), 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setIsSavingKey(true);
    try {
      const res = await saveGeminiApiKey(apiKeyInput);
      if (res.error) {
        toast({ title: "Gagal menyimpan", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "API Key Disimpan!", description: "AI Insight siap digunakan." });
        setHasApiKey(true);
        setApiKeyInput("");
      }
    } catch {
      toast({ title: "Kesalahan", description: "Terjadi kesalahan.", variant: "destructive" });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateAIInsight();
      if (res.error) {
        toast({ title: "Gagal", description: res.error, variant: "destructive" });
      } else if (res.success && res.insight) {
        const newInsight: InsightData = {
          ...res.insight,
          generatedAt: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
        };
        setInsight(newInsight);
        localStorage.setItem("auditlife_ai_insights_v2", JSON.stringify(newInsight));
        toast({ title: "✨ Insight Diperbarui!", description: "Wawasan AI terbaru siap dibaca." });
      }
    } catch {
      toast({ title: "Kesalahan", description: "Gagal memproses data AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLedger = async () => {
    if (!showLedger && ledgerData.length === 0) {
      setLoadingLedger(true);
      try {
        const { getFinancialRecords } = await import('../financial/actions');
        const res = await getFinancialRecords();
        if (res.records) {
          setLedgerData(res.records);
        }
      } catch (err) {
        toast({ title: "Gagal", description: "Gagal memuat laporan keuangan", variant: "destructive" });
      } finally {
        setLoadingLedger(false);
      }
    }
    setShowLedger(!showLedger);
  };

  if (hasApiKey === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            AI Insight
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Analisis personal berbasis Google Gemini</p>
        </div>
        {hasApiKey && !isLoading && (
          <Button onClick={handleGenerate} size="sm" className="glow-primary-hover flex items-center gap-1.5 text-xs h-9 px-4 rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" />
            {insight ? "Generate Ulang" : "Generate"}
          </Button>
        )}
      </div>

      {/* API Key Setup */}
      {!hasApiKey ? (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-6 max-w-md mx-auto mt-6">
          <div className="flex flex-col items-center text-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Sambungkan API Key Gemini</p>
              <p className="text-xs text-muted-foreground mt-1">Dapatkan gratis di aistudio.google.com</p>
            </div>
          </div>
          <form onSubmit={handleSaveApiKey} className="space-y-3">
            <Input
              type="password"
              placeholder="Paste API Key di sini..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="bg-background/80 border-white/10 text-xs rounded-xl h-11"
              required
            />
            <Button type="submit" className="w-full h-10 rounded-xl text-xs" disabled={isSavingKey || !apiKeyInput.trim()}>
              {isSavingKey ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />Menyimpan...</> : <><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Simpan & Aktifkan</>}
            </Button>
          </form>
        </div>
      ) : isLoading ? (
        /* Loading */
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-white animate-spin" />
            </div>
          </div>
          <div>
            <p className="font-bold text-sm">Menganalisis Data Anda</p>
            <p className="text-xs text-primary animate-pulse mt-1">{loadingTexts[loadingStep]}</p>
          </div>
          <div className="flex gap-1.5">
            {loadingTexts.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === loadingStep ? "w-6 bg-primary" : "w-1.5 bg-white/10"}`} />
            ))}
          </div>
        </div>
      ) : insight ? (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Weekly Highlight Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-violet-600/5 border border-primary/15 p-4 flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center mt-0.5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Highlight Minggu Ini</p>
              <p className="text-xs text-foreground leading-relaxed">{insight.weeklyHighlight}</p>
            </div>
            <div className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">{insight.generatedAt}</div>
          </div>

          {/* Score Cards Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Productivity Score Card */}
            <div className="rounded-2xl border border-violet-500/15 bg-gradient-to-b from-violet-500/5 to-transparent p-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 self-start">
                <Brain className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Produktivitas</span>
              </div>
              <ScoreRing score={insight.productivityScore} color="violet" />
              <div className="w-full space-y-1 text-center">
                <p className="text-[10px] text-muted-foreground">Aktivitas unggulan:</p>
                <p className="text-[11px] font-semibold text-foreground truncate">{insight.topProductiveActivity}</p>
              </div>
            </div>

            {/* Financial Score Card */}
            <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-emerald-500/5 to-transparent p-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 self-start">
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Keuangan</span>
              </div>
              <ScoreRing score={insight.financialScore} color="emerald" />
              <div className="w-full space-y-1 text-center">
                <p className="text-[10px] text-muted-foreground">Status tabungan:</p>
                <StatusBadge status={insight.savingsStatus} />
              </div>
            </div>
          </div>

          {/* Observations Row */}
          <div className="grid grid-cols-1 gap-3">
            {/* Productivity Observation + Tips */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="text-xs font-bold">Analisis Produktivitas</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed border-l-2 border-violet-500/30 pl-3">
                {insight.productivityObservation}
              </p>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Tips</p>
                {insight.productivityTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-violet-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Observation + Tips */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold">Pola Keuangan</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed border-l-2 border-emerald-500/30 pl-3">
                {insight.financialObservation}
              </p>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Tips</p>
                {insight.financialTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Pengeluaran terbesar: <span className="font-semibold text-foreground">{insight.biggestExpenseCategory}</span>
              </div>
            </div>
          </div>

          {/* Collapsible Ledger */}
          <div className="pt-2 pb-4">
            <Button 
              variant="outline" 
              className="w-full h-11 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-semibold gap-2 transition-all"
              onClick={handleToggleLedger}
            >
              <Wallet className="h-4 w-4" />
              {showLedger ? "Tutup Laporan Keuangan" : "Lihat Laporan Keuangan Lengkap"}
              {loadingLedger && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
            </Button>
            
            {showLedger && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    Buku Besar Akuntansi
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Riwayat transaksi lengkap sesuai standar akuntansi dasar.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.02] text-[10px] uppercase text-muted-foreground border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Tanggal</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Kategori</th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">Keterangan</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Debit (Masuk)</th>
                        <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Kredit (Keluar)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ledgerData.length > 0 ? ledgerData.map((record, i) => (
                        <tr key={i} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(record.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{record.category}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[120px] truncate">{record.description || "-"}</td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-mono">
                            {record.type === "income" ? `Rp ${record.amount.toLocaleString("id-ID")}` : "-"}
                          </td>
                          <td className="px-4 py-3 text-right text-red-400 font-mono">
                            {record.type === "expense" ? `Rp ${record.amount.toLocaleString("id-ID")}` : "-"}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Belum ada catatan keuangan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty CTA */
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h3 className="font-bold text-sm">Dapatkan AI Insight Pertama Anda</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Analisis produktivitas dan keuangan mingguan berbasis data real Anda.
            </p>
          </div>
          <Button onClick={handleGenerate} className="glow-primary-hover h-10 px-6 rounded-xl flex items-center gap-2 text-xs">
            <Sparkles className="h-4 w-4" /> Mulai Analisis AI
          </Button>
        </div>
      )}
    </div>
  );
}
