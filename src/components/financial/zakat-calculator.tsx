import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HandCoins, AlertCircle, CheckCircle2 } from "lucide-react";

interface ZakatCalculatorProps {
  balance: number;
}

export function ZakatCalculator({ balance }: ZakatCalculatorProps) {
  // Asumsi Nisab Zakat Maal (misal: 85 gram emas * Rp 1.000.000/gram) = Rp 85.000.000
  const NISAB = 85000000;
  const isWajibZakat = balance >= NISAB;
  const zakatAmount = isWajibZakat ? balance * 0.025 : 0;
  const remainingToNisab = isWajibZakat ? 0 : NISAB - balance;

  return (
    <Card className="border-white/5 bg-gradient-to-br from-emerald-900/10 to-emerald-900/5 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HandCoins className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-lg">Kalkulator Zakat Maal</CardTitle>
        </div>
        <CardDescription>
          Perhitungan zakat harta (2,5%) berdasarkan saldo Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isWajibZakat ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  Alhamdulillah, Saldo Anda telah mencapai Nisab!
                </p>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Kewajiban zakat harta Anda adalah 2,5% dari total saldo yang telah mengendap selama 1 tahun (haul).
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5">
              <span className="text-sm text-muted-foreground">Estimasi Zakat</span>
              <span className="text-xl font-bold text-emerald-400">
                Rp {zakatAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  Saldo Anda belum mencapai Nisab
                </p>
                <p className="text-xs text-amber-400/80 mt-1">
                  Saat ini saldo Anda berada di bawah batas wajib zakat maal (Rp 85 Juta). Tetap semangat menabung dan jangan lupa bersedekah!
                </p>
              </div>
            </div>
            {balance > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress menuju Nisab</span>
                  <span className="text-muted-foreground">{Math.round((balance / NISAB) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min((balance / NISAB) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-1">
                  Kurang Rp {remainingToNisab.toLocaleString("id-ID")} lagi
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
