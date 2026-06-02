"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WeeklyAuditFormValues } from "@/lib/validations/audit";

export async function submitWeeklyAudit(data: WeeklyAuditFormValues) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // 1. Insert ke tabel weekly_audit
    // Asumsi: total_time bisa dihitung dari jumlah durasi activities, tapi kita kalkulasi di sini
    const totalTime = data.activities.reduce((acc, curr) => acc + curr.duration, 0);

    const { data: auditData, error: auditError } = await supabase
      .from("weekly_audit")
      .insert({
        user_id: user.id,
        week_start_date: data.week_start_date,
        week_end_date: data.week_end_date,
        summary: data.summary || null,
        total_time: totalTime,
      })
      .select("audit_id")
      .single();

    if (auditError) {
      console.error("Audit Insert Error:", auditError);
      return { error: "Gagal menyimpan data audit" };
    }

    const auditId = auditData.audit_id;

    // 2. Insert bulk ke tabel activities
    const activitiesToInsert = data.activities.map((act) => ({
      audit_id: auditId,
      // Jika category_id menggunakan fallback ("1", "2"), set null agar tidak error UUID/FK constraint
      category_id: act.category_id && act.category_id.length > 10 ? act.category_id : null,
      duration: act.duration,
      productivity_type: act.productivity_type,
      description: act.description,
    }));

    const { error: activitiesError } = await supabase
      .from("activities")
      .insert(activitiesToInsert);

    if (activitiesError) {
      console.error("Activities Insert Error:", activitiesError);
      // Rollback manual (optional, jika tidak pakai trigger/transaction)
      await supabase.from("weekly_audit").delete().eq("audit_id", auditId);
      return { error: "Gagal menyimpan aktivitas" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/audit");
    revalidatePath("/insight");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Terjadi kesalahan sistem" };
  }
}
