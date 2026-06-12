"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, Lightbulb, AlertCircle, Loader2, RefreshCw, KeyRound, CheckCircle2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateAIInsight, checkApiKeyConfigured, saveGeminiApiKey } from "./actions";

interface InsightData {
  productivityObservation: string;
  productivitySuggestion: string;
  financialObservation: string;
  financialSuggestion: string;
  generatedAt: string;
}

export default function InsightPage() {
  const { toast } = useToast();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingTexts = [
    "Menghubungkan ke database Supabase...",
    "Mengambil log audit produktivitas Anda...",
    "Membaca riwayat catatan keuangan Anda...",
    "Mengirimkan data ke Google Gemini AI...",
    "Membuat analisis dan rekomendasi personal..."
  ];

  // Check API Key and load cached insights on mount
  useEffect(() => {
    async function init() {
      const isConfigured = await checkApiKeyConfigured();
      setHasApiKey(isConfigured);

      const cached = localStorage.getItem("auditlife_ai_insights");
      if (cached) {
        try {
          setInsight(JSON.parse(cached));
        } catch (e) {
          console.error("Failed to parse cached insights", e);
        }
      }
    }
    init();
  }, []);

  // Loading text rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
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
        toast({
          title: "Gagal menyimpan",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "API Key Disimpan!",
          description: "API Key Gemini Anda berhasil dikonfigurasi. Anda sekarang dapat menggunakan AI.",
        });
        setHasApiKey(true);
        setApiKeyInput("");
      }
    } catch (err) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat menyimpan API Key.",
        variant: "destructive",
      });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateAIInsight();
      if (res.error) {
        toast({
          title: "Gagal membuat insight",
          description: res.error,
          variant: "destructive",
        });
      } else if (res.success && res.insight) {
        const newInsight: InsightData = {
          ...res.insight,
          generatedAt: new Date().toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        };
        setInsight(newInsight);
        localStorage.setItem("auditlife_ai_insights", JSON.stringify(newInsight));
        toast({
          title: "Insight Berhasil Dibuat",
          description: "Wawasan produktivitas dan finansial Anda telah diperbarui.",
        });
      }
    } catch (err) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat memproses data AI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show page loader while initial check is running
  if (hasApiKey === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Memeriksa konfigurasi AI...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            AI Insight
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Wawasan cerdas personal yang di-generate menggunakan Google Gemini berdasarkan data harian Anda.
          </p>
        </div>

        {hasApiKey && insight && !isLoading && (
          <Button 
            onClick={handleGenerate} 
            className="flex items-center gap-2 glow-primary-hover self-start md:self-auto"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Generate Ulang
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      {!hasApiKey ? (
        /* Configuration Screen (If API Key is missing) */
        <Card className="border-dashed border-primary/20 bg-primary/5 max-w-xl mx-auto mt-10">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Sambungkan API Key Gemini Anda</CardTitle>
            <CardDescription className="text-xs">
              AuditLife menggunakan Google Gemini untuk menganalisis data produktivitas dan finansial secara lokal dan privat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Google Gemini API Key</label>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="bg-background/80 border-white/10 text-xs rounded-xl h-11 focus:border-primary/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl glow-primary-hover flex items-center justify-center gap-2 text-xs"
                disabled={isSavingKey || !apiKeyInput.trim()}
              >
                {isSavingKey ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Simpan & Aktifkan AI
                  </>
                )}
              </Button>
            </form>
            <div className="text-[11px] text-muted-foreground bg-white/[0.02] border border-white/5 p-3.5 rounded-xl leading-relaxed">
              <p className="font-semibold text-foreground mb-1 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                Cara mendapatkan API Key gratis:
              </p>
              1. Buka <strong>Google AI Studio</strong> (aistudio.google.com)<br />
              2. Login dengan akun Google Anda<br />
              3. Klik tombol <strong>&quot;Get API Key&quot;</strong> dan buat API Key baru<br />
              4. Salin kuncinya dan tempelkan di atas.
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        /* Loading Screen (While generating insights) */
        <Card className="border-white/5 bg-white/[0.01] shadow-2xl py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl border border-white/10">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-lg font-bold">Menganalisis Data Anda</h3>
              <p className="text-xs text-primary font-medium animate-pulse">
                {loadingTexts[loadingStep]}
              </p>
              <p className="text-[11px] text-muted-foreground pt-2 leading-relaxed">
                Gemini sedang memproses log audit untuk merumuskan wawasan produktivitas dan kebiasaan keuangan yang disesuaikan secara personal.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : insight ? (
        /* Display Insights Screen */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* Productivity Card */}
          <Card className="neon-card-violet flex flex-col h-full border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
                <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <Brain className="h-5 w-5 text-violet-400" />
                </div>
                Analisis Produktivitas
              </CardTitle>
              <CardDescription className="text-xs">Berdasarkan data Weekly Audit Anda</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-5 space-y-5">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Observasi AI</span>
                <p className="text-xs text-foreground leading-relaxed bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                  {insight.productivityObservation}
                </p>
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Rekomendasi / Saran</span>
                <p className="text-xs text-muted-foreground leading-relaxed bg-violet-500/[0.02] border border-violet-500/10 p-4 rounded-2xl">
                  {insight.productivitySuggestion}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Card */}
          <Card className="neon-card-emerald flex flex-col h-full border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Lightbulb className="h-5 w-5 text-emerald-400" />
                </div>
                Pola Keuangan
              </CardTitle>
              <CardDescription className="text-xs">Berdasarkan data Financial Audit Anda</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-5 space-y-5">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Observasi AI</span>
                <p className="text-xs text-foreground leading-relaxed bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                  {insight.financialObservation}
                </p>
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Rekomendasi / Saran</span>
                <p className="text-xs text-muted-foreground leading-relaxed bg-emerald-500/[0.02] border border-emerald-500/10 p-4 rounded-2xl">
                  {insight.financialSuggestion}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info and Re-generate Area */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl md:flex-row gap-3">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              Terakhir diperbarui: <strong className="text-foreground">{insight.generatedAt}</strong>
            </span>
            <Button 
              variant="outline" 
              onClick={handleGenerate} 
              className="text-xs border-white/10 hover:bg-white/5 rounded-xl h-9 px-4 flex items-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Generate Ulang Insight
            </Button>
          </div>
        </div>
      ) : (
        /* Empty / Call to Action Screen */
        <Card className="border-dashed border-white/10 bg-white/[0.01] py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl border border-white/10">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-lg font-bold">Dapatkan AI Insight Pertama Anda</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kami akan menganalisis aktivitas dan catatan pengeluaran Anda untuk memberikan saran optimasi produktivitas serta pola keuangan mingguan.
              </p>
            </div>
            <Button 
              onClick={handleGenerate} 
              className="glow-primary-hover h-11 px-6 rounded-xl flex items-center gap-2 text-xs"
            >
              <Sparkles className="h-4 w-4 animate-spin text-white" />
              Mulai Analisis AI Sekarang
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
