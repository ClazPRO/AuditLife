import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, PiggyBank, ArrowUpCircle } from "lucide-react";
import { FinancialForm } from "@/components/financial/financial-form";
import { FinancialTable } from "@/components/financial/financial-table";
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Audit</h2>
          <p className="text-muted-foreground">
            Pantau arus kas Anda. Catat pemasukan awal bulan dan kelola pengeluaran Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FinancialForm defaultType="income" />
          <FinancialForm />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              Rp {totalIncome.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
              Sisa Saldo: Rp {remainingBalance.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs (Kebutuhan)</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              Rp {totalNeeds.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
              Pengeluaran wajib bulanan
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wants (Keinginan)</CardTitle>
            <Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              Rp {totalWants.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">
              Pengeluaran non-esensial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investments (Investasi)</CardTitle>
            <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              Rp {totalInvestments.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Tabungan & Investasi
            </p>
          </CardContent>
        </Card>
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
