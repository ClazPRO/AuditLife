import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "AI Insight | AuditLife",
  description: "Dapatkan wawasan personal mengenai produktivitas dan keuangan Anda",
};

export default function InsightPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Insight
        </h2>
        <p className="text-muted-foreground mt-2">
          Wawasan cerdas yang di-generate oleh AI berdasarkan pola produktivitas dan kebiasaan finansial Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              Analisis Produktivitas
            </CardTitle>
            <CardDescription>Berdasarkan Weekly Audit Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 p-4 rounded-lg text-sm space-y-3 border border-primary/10">
              <p>
                <strong>Observasi:</strong> AI mendeteksi Anda menghabiskan banyak waktu di fase &quot;Non-Produktif&quot; selama 2 minggu berturut-turut.
              </p>
              <p>
                <strong>Saran:</strong> Cobalah metode Pomodoro (25 menit kerja, 5 menit istirahat) untuk mencegah *burnout* dan meningkatkan fokus harian.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Pola Keuangan
            </CardTitle>
            <CardDescription>Berdasarkan Financial Audit Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-emerald-500/5 p-4 rounded-lg text-sm space-y-3 border border-emerald-500/10">
              <p>
                <strong>Observasi:</strong> Alokasi pengeluaran &quot;Wants&quot; (Keinginan) Anda memakan porsi 40% dari total pemasukan.
              </p>
              <p>
                <strong>Saran:</strong> Terapkan aturan 50/30/20. Usahakan untuk membatasi pengeluaran non-esensial maksimal di angka 30%, lalu alihkan 10% sisanya ke instrumen investasi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold mb-2">Tingkatkan Insight Anda</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Saat ini Insight yang ditampilkan masih berupa versi standar (Demonstrasi). Pastikan **API Key Google Gemini** Anda sudah tersambung untuk mendapatkan analisis yang 100% personal sesuai data asli Anda.
          </p>
          <Button variant="outline" disabled>
            Generate Ulang Insight (Butuh API Key)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
