import { createClient } from "@/utils/supabase/server";
import { ActivityForm } from "@/components/audit/activity-form";
import { AuditTable } from "@/components/audit/audit-table";
import { getWeeklyAudits } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuditPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*");
  const { records } = await getWeeklyAudits();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Weekly Audit</h2>
          <p className="text-muted-foreground">
            Catat aktivitas mingguan Anda untuk mendapatkan analisis dan rekomendasi produktivitas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {categories && categories.length === 0 && (
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
              Kategori Terbatas
            </span>
          )}
          <ActivityForm categories={categories || []} />
        </div>
      </div>

      <Card className="border-white/5">
        <CardHeader>
          <CardTitle>Riwayat Weekly Audit</CardTitle>
          <CardDescription>
            Daftar audit mingguan yang sudah Anda kumpulkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditTable records={records || []} />
        </CardContent>
      </Card>
    </div>
  );
}
