import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";
import { PrayerTimes } from "@/components/mutabaah/prayer-times";

export default async function MutabaahPage() {
  const supabase = createClient();
  const { data: records } = await supabase
    .from("mutabaah_records")
    .select("*")
    .order("date", { ascending: false });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-rose-400" /> Mutabaah Yaumiyah
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Pantau dan tingkatkan kualitas ibadah harian Anda.
          </p>
        </div>
      </div>

      <PrayerTimes />

      <Card className="border-white/5 bg-card/50">
        <CardHeader>
          <CardTitle>Riwayat Mutabaah</CardTitle>
          <CardDescription>
            Catatan ibadah harian Anda (sedang dalam pengembangan UI).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records && records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record: any) => (
                <div key={record.record_id} className="flex flex-col p-4 border border-white/10 rounded-xl bg-white/5 gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">Shalat Fardhu</span>
                      <span>{record.fardhu_prayers} / 5</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">Shalat Sunnah</span>
                      <span>{record.sunnah_prayers ? "Ya" : "Tidak"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">Tilawah</span>
                      <span>{record.tilawah_pages} Halaman</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">Sedekah</span>
                      <span>{record.sedekah_daily ? "Ya" : "Tidak"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-10 w-10 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">Belum ada catatan mutabaah.</p>
              <p className="text-xs text-muted-foreground mt-1">Fitur penambahan catatan akan segera hadir.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
