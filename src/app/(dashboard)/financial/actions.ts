"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { FinancialFormValues } from "@/lib/validations/financial";
import { ensurePublicUser } from "@/lib/ensure-user";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function classifyFinancialWithAI(text: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. Defaulting to need.");
      return { type: "need" };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Anda adalah asisten klasifikasi keuangan cerdas.
Tentukan apakah transaksi/kategori berikut termasuk: "income" (pemasukan), "need" (kebutuhan wajib), "want" (keinginan/tersier), "investment" (investasi/tabungan), "receivable" (piutang/uang dipinjamkan/bayarin orang), atau "debt" (utang/minjam uang).
Jawab HANYA dengan satu kata dari tipe yang valid: "income", "need", "want", "investment", "receivable", atau "debt".
Transaksi: "${text}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().toLowerCase();

    if (responseText.includes("income")) return { type: "income" };
    if (responseText.includes("want")) return { type: "want" };
    if (responseText.includes("investment")) return { type: "investment" };
    if (responseText.includes("receivable") || responseText.includes("piutang")) return { type: "receivable" };
    if (responseText.includes("debt") || responseText.includes("utang")) return { type: "debt" };
    
    // Default fallback to need if unclear
    return { type: "need" };
  } catch (error) {
    console.error("AI Financial Classification Error:", error);
    return { type: "need" }; // fallback
  }
}
