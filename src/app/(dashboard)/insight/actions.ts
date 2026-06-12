"use server";

import { createClient } from "@/utils/supabase/server";
import { ensurePublicUser } from "@/lib/ensure-user";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
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
  } catch (error: any) {
    console.error("Save API Key Error:", error);
    return { error: `Gagal menyimpan API Key: ${error.message || "Kesalahan sistem"}` };
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
Tugas Anda adalah menganalisis data produktivitas (weekly audit) dan data finansial dari user, lalu memberikan observasi ringkas serta saran konkret/solutif untuk mereka.

Format output Anda HARUS berupa JSON murni dengan struktur persis seperti berikut (jangan sertakan markdown block lainnya seperti \`\`\`json selain string JSON-nya saja):
{
  "productivityObservation": "observasi singkat tentang produktivitas",
  "productivitySuggestion": "saran konkret untuk meningkatkan produktivitas",
  "financialObservation": "observasi singkat tentang keuangan/kebiasaan belanja",
  "financialSuggestion": "saran konkret untuk mengelola keuangan lebih baik"
}
Jawablah dalam Bahasa Indonesia yang ramah, profesional, dan memotivasi.`;

    const userPrompt = `Berikut adalah data user untuk dianalisis:

DATA AUDIT PRODUKTIVITAS (3 minggu terakhir):
${hasAudits ? JSON.stringify(audits, null, 2) : "Belum ada data audit produktivitas."}

DATA FINANSIAL (transaksi terakhir):
${hasFinances ? JSON.stringify(finances, null, 2) : "Belum ada data transaksi finansial."}

Catatan penting: Jika data produktivitas atau finansial kosong, buatlah observasi umum dan berikan motivasi yang bersahabat agar user segera mulai mengisi data mereka.`;

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    let text = result.text.trim();
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
          productivityObservation: parsed.productivityObservation || "Belum ada observasi produktivitas.",
          productivitySuggestion: parsed.productivitySuggestion || "Mulai isi audit mingguan Anda untuk mendapatkan saran.",
          financialObservation: parsed.financialObservation || "Belum ada observasi keuangan.",
          financialSuggestion: parsed.financialSuggestion || "Mulai catat transaksi keuangan Anda untuk mendapatkan saran."
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
