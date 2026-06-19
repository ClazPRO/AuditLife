import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, PiggyBank, ArrowUpCircle } from "lucide-react";
import { FinancialForm } from "@/components/financial/financial-form";
import { FinancialTable } from "@/components/financial/financial-table";
import { ZakatCalculator } from "@/components/financial/zakat-calculator";
import { getFinancialRecords } from "./actions";

export const metadata = {
  title: "Financial Audit | AuditLife",
  description: "Kelola dan audit pengeluaran keuangan Anda",
};

export default async function FinancialAuditPage() {
  const result = await getFinancialRecords();
  const records = result.records || [];

  // Hitung total untuk masing-masing kategori
  const totalIncome = records
    .filter(r => r.type === "income")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalNeeds = records
    .filter(r => r.type === "need")
    .reduce((sum, r) => sum + Number(r.amount), 0);
    
  const totalWants = records
    .filter(r => r.type === "want")
    .reduce((sum, r) => sum + Number(r.amount), 0);
    
  const totalInvestments = records
    .filter(r => r.type === "investment")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalExpenses = totalNeeds + totalWants + totalInvestments;
  const remainingBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Audit</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Pantau arus kas Anda. Catat pemasukan awal bulan dan kelola pengeluaran Anda.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 pt-1 w-full">
          <FinancialForm defaultType="income" />
          <FinancialForm />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="neon-card-emerald group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              Rp {totalIncome.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sisa Saldo: Rp {remainingBalance.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>

        <Card className="neon-card-blue group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs (Kebutuhan)</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              Rp {totalNeeds.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pengeluaran wajib bulanan
            </p>
          </CardContent>
        </Card>
        
        <Card className="neon-card-amber group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wants (Keinginan)</CardTitle>
            <Wallet className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              Rp {totalWants.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pengeluaran non-esensial
            </p>
          </CardContent>
        </Card>

        <Card className="neon-card-violet group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investments</CardTitle>
            <PiggyBank className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-400">
              Rp {totalInvestments.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tabungan & Investasi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ZakatCalculator balance={remainingBalance} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Keuangan</CardTitle>
          <CardDescription>
            Daftar lengkap catatan pemasukan dan pengeluaran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialTable records={records} />
        </CardContent>
      </Card>
    </div>
  );
}
