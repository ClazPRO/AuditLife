"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { FinancialFormValues } from "@/lib/validations/financial";
import { ensurePublicUser } from "@/lib/ensure-user";

export async function getFinancialRecords() {
  const user = await ensurePublicUser();

  if (!user) {
    return { error: "Unauthorized", records: [] };
  }

  const supabase = createClient();

  try {
    const { data: records, error } = await supabase
      .from("financial_records")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get Records Error:", error);
      return { error: "Gagal mengambil data keuangan", records: [] };
    }

    return { records: records || [] };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Terjadi kesalahan sistem", records: [] };
  }
}

export async function addFinancialRecord(data: FinancialFormValues) {
  // Pastikan user ada di public.users (auto-create jika belum)
  const user = await ensurePublicUser();

  if (!user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("financial_records")
      .insert({
        user_id: user.id,
        date: data.date,
        category: data.category,
        amount: data.amount,
        type: data.type,
        description: data.description || null,
      });

    if (error) {
      console.error("Insert Record Error:", error);
      return { error: `Gagal menyimpan data keuangan: ${error.message}` };
    }

    revalidatePath("/financial");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Terjadi kesalahan sistem" };
  }
}

export async function deleteFinancialRecord(recordId: string) {
  const user = await ensurePublicUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("financial_records")
      .delete()
      .eq("record_id", recordId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete Record Error:", error);
      return { error: "Gagal menghapus data keuangan" };
    }

    revalidatePath("/financial");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "Terjadi kesalahan sistem" };
  }
}
