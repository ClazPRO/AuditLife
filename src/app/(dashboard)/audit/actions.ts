"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { WeeklyAuditFormValues } from "@/lib/validations/audit";
import { ensurePublicUser } from "@/lib/ensure-user";

export async function submitWeeklyAudit(data: WeeklyAuditFormValues) {
  // Pastikan user ada di public.users (auto-create jika belum)
  const user = await ensurePublicUser();

  if (!user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const supabase = createClient();

  try {
    // 1. Insert ke tabel weekly_audit
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
      return { error: `Gagal menyimpan data audit: ${auditError.message}` };
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
      // Rollback manual
      await supabase.from("weekly_audit").delete().eq("audit_id", auditId);
      return { error: `Gagal menyimpan aktivitas: ${activitiesError.message}` };
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

export async function getWeeklyAudits() {
  const user = await ensurePublicUser();

  if (!user) {
    return { error: "Unauthorized", records: [] };
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("weekly_audit")
      .select(`
        audit_id,
        week_start_date,
        week_end_date,
        total_time,
        summary,
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Audits Error:", error);
      return { error: "Gagal mengambil riwayat audit", records: [] };
    }

    return { records: data || [] };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Terjadi kesalahan sistem", records: [] };
  }
}
