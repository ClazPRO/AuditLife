"use server";

import { createClient } from "@/utils/supabase/server";
import { ensurePublicUser } from "@/lib/ensure-user";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export async function saveGeminiApiKey(key: string) {
  const user = await ensurePublicUser();
  if (!user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const trimmedKey = key.trim();
  if (trimmedKey.length < 10) {
    return { error: "Format API Key Gemini tidak valid. Terlalu pendek." };
  }

  try {
    const envPath = path.join(process.cwd(), ".env.local");
    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf-8");
    }

    const keyLine = `GOOGLE_GENERATIVE_AI_API_KEY=${trimmedKey}`;
    const regex = /^GOOGLE_GENERATIVE_AI_API_KEY=.*$/m;
    
    if (regex.test(content)) {
      content = content.replace(regex, keyLine);
    } else {
      // Add newline if content is not empty and doesn't end with newline
      if (content && !content.endsWith("\n")) {
        content += "\n";
      }
      content += `${keyLine}\n`;
    }

    fs.writeFileSync(envPath, content.trim() + "\n", "utf-8");
    
    // Update the environment variable for the current running process immediately
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = trimmedKey;

    return { success: true };
  } catch (error: unknown) {
    console.error("Save API Key Error:", error);
    return { error: `Gagal menyimpan API Key: ${error instanceof Error ? error.message : "Kesalahan sistem"}` };
  }
}

export async function checkApiKeyConfigured() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return !!apiKey && apiKey.length > 10;
}

export async function generateAIInsight() {
  const user = await ensurePublicUser();

  if (!user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  // Check Gemini API key
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    return { 
      error: "API Key Google Gemini belum dikonfigurasi. Silakan masukkan API Key Anda di bawah." 
    };
  }

  const supabase = createClient();

  try {
    // 1. Fetch latest 3 audits with their activities
    const { data: audits, error: auditsError } = await supabase
      .from("weekly_audit")
      .select(`
        audit_id,
        week_start_date,
        week_end_date,
        total_time,
        summary,
        activities (
          duration,
          productivity_type,
          description
        )
      `)
      .eq("user_id", user.id)
      .order("week_start_date", { ascending: false })
      .limit(3);

    if (auditsError) {
      console.error("Fetch Audits for Insight Error:", auditsError);
    }

    // 2. Fetch latest 20 financial records
    const { data: finances, error: financesError } = await supabase
      .from("financial_records")
      .select("date, category, amount, type, description")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(20);

    if (financesError) {
      console.error("Fetch Finances for Insight Error:", financesError);
    }

    const hasAudits = audits && audits.length > 0;
    const hasFinances = finances && finances.length > 0;

    // Build the system and data prompt for Gemini
    const systemPrompt = `Anda adalah AI Insight Generator untuk AuditLife.
Analisis data produktivitas dan finansial user, lalu kembalikan JSON MURNI (tanpa markdown) dengan struktur PERSIS berikut:
{
  "weeklyHighlight": "1 kalimat ringkasan kondisi user minggu ini",
  "productivityScore": <angka 0-100 berdasarkan kualitas aktivitas>,
  "productivityObservation": "1-2 kalimat observasi produktivitas",
  "productivityTips": ["tip singkat 1", "tip singkat 2", "tip singkat 3"],
  "topProductiveActivity": "nama aktivitas paling produktif (atau '-' jika kosong)",
  "financialScore": <angka 0-100 berdasarkan kesehatan keuangan>,
  "financialObservation": "1-2 kalimat observasi keuangan",
  "financialTips": ["tip singkat 1", "tip singkat 2", "tip singkat 3"],
  "biggestExpenseCategory": "kategori pengeluaran terbesar (atau '-' jika kosong)",
  "savingsStatus": "Baik" | "Cukup" | "Perlu Perhatian"
}
Tips harus singkat (max 10 kata). Bahasa Indonesia ramah dan memotivasi.`;

    const userPrompt = `DATA AUDIT PRODUKTIVITAS (3 minggu terakhir):
${hasAudits ? JSON.stringify(audits, null, 2) : "Belum ada data audit produktivitas."}

DATA FINANSIAL (transaksi terakhir):
${hasFinances ? JSON.stringify(finances, null, 2) : "Belum ada data transaksi finansial."}

Jika data kosong, buat insight motivasi umum dengan score default 50.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    let text = result.response.text().trim();

    // Strip markdown JSON code block if returned by Gemini
    if (text.startsWith("```json")) {
      text = text.slice(7);
    } else if (text.startsWith("```")) {
      text = text.slice(3);
    }
    if (text.endsWith("```")) {
      text = text.slice(0, -3);
    }

    try {
      const parsed = JSON.parse(text.trim());
      return { 
        success: true, 
        insight: {
          weeklyHighlight: parsed.weeklyHighlight || "Analisis mingguan telah selesai.",
          productivityScore: Number(parsed.productivityScore) || 50,
          productivityObservation: parsed.productivityObservation || "Belum ada observasi produktivitas.",
          productivityTips: Array.isArray(parsed.productivityTips) ? parsed.productivityTips : ["Mulai isi audit mingguan Anda."],
          topProductiveActivity: parsed.topProductiveActivity || "-",
          financialScore: Number(parsed.financialScore) || 50,
          financialObservation: parsed.financialObservation || "Belum ada observasi keuangan.",
          financialTips: Array.isArray(parsed.financialTips) ? parsed.financialTips : ["Mulai catat transaksi keuangan Anda."],
          biggestExpenseCategory: parsed.biggestExpenseCategory || "-",
          savingsStatus: parsed.savingsStatus || "Cukup",
        } 
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text, parseError);
      return { 
        error: "Gagal memproses hasil analisis AI. Silakan coba generate kembali." 
      };
    }
  } catch (apiError) {
    console.error("Gemini API call error:", apiError);
    return { 
      error: "Gagal memanggil AI Google Gemini. Pastikan API Key Anda aktif dan valid." 
    };
  }
}
