import { createClient } from "@/utils/supabase/server";
import { ActivityForm } from "@/components/audit/activity-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuditPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Weekly Audit</h2>
        <p className="text-muted-foreground">
          Catat aktivitas mingguan Anda untuk mendapatkan analisis dan rekomendasi produktivitas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Pencatatan Aktivitas</CardTitle>
          <CardDescription>
            Isi data aktivitas Anda secara jujur selama satu minggu. Data ini akan digunakan untuk menghitung skor Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories && categories.length === 0 && (
            <div className="mb-6 p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-md border border-yellow-500/20 text-sm">
              <p className="font-semibold">Perhatian:</p>
              <p>Belum ada kategori yang dikonfigurasi di database. Anda menggunakan kategori sementara (fallback). Hubungi admin untuk menambahkan kategori resmi.</p>
            </div>
          )}
          <ActivityForm categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  );
}
