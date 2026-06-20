import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getWeeklyAudits } from "@/app/(dashboard)/audit/actions";
import { getFinancialRecords } from "@/app/(dashboard)/financial/actions";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API Key belum dikonfigurasi." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ambil data user agar AI punya konteks otomatis
    const { records: audits } = await getWeeklyAudits();
    const { records: finances } = await getFinancialRecords();
    
    let contextData = "";
    if (audits && audits.length > 0) {
      contextData += "DATA AUDIT AKTIVITAS & WAKTU MINGGU INI (terbaru):\n";
      const latestAudit = audits[0];
      contextData += `- Total waktu dihabiskan: ${latestAudit.total_time} menit\n`;
      contextData += `- Ringkasan mingguan: ${latestAudit.summary || "Tidak ada ringkasan"}\n`;
      contextData += `- Detail aktivitas:\n`;
      if (latestAudit.activities) {
        latestAudit.activities.forEach((act: any) => {
           contextData += `  * ${act.description}: ${act.duration} menit (${act.productivity_type})\n`;
        });
      }
      contextData += "\n";
    } else {
      contextData += "Pengguna belum mencatat audit aktivitas apa pun.\n\n";
    }
    
    if (finances && finances.length > 0) {
      contextData += "DATA KEUANGAN:\n";
      // Ambil 15 transaksi terakhir
      finances.slice(0, 15).forEach((fin: any) => {
         contextData += `- Tanggal ${fin.date} | Kategori: ${fin.category} (${fin.type}) | Rp ${fin.amount} | Catatan: ${fin.description || "-"}\n`;
      });
      contextData += "\n";
    } else {
      contextData += "Pengguna belum mencatat data keuangan.\n\n";
    }

    // Pastikan format pesan sesuai dengan skema ModelMessage[] yang ketat
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
      content: m.content || m.text || (m.parts && m.parts[0]?.text) || "",
    }));

    const result = streamText({
      model: google("gemini-flash-latest"),
      messages: formattedMessages,
      system: `Anda adalah AuditLife Assistant, asisten AI analitik di dalam aplikasi AuditLife.
AuditLife adalah platform pelacakan produktivitas dan keuangan mingguan.
Tugas Anda adalah merespons pertanyaan pengguna terkait produktivitas dan keuangan.
KARAKTER ANDA: Analis produktivitas yang sangat objektif, ketat, dan berbasis data. Anda tidak berbasa-basi. Evaluasi setiap pertanyaan secara faktual. Jika kinerja pengguna buruk, sampaikan fakta kelemahannya secara lugas, profesional, dan solutif. Tujuannya adalah membangun kedisiplinan melalui evaluasi data yang jujur.

KONTEKS DATA PENGGUNA SAAT INI (gunakan data ini sebagai dasar jawaban Anda HINDARI menanyakan ulang data yang sudah tercatat di sini):
${contextData}

INSTRUKSI PENTING: 
1. JANGAN PERNAH menanyakan ulang data keuangan atau waktu jika data tersebut sudah ada di atas.
2. Analisis langsung berdasarkan "KONTEKS DATA PENGGUNA SAAT INI".
3. Jika data kosong (belum mencatat), maka beritahu pengguna untuk mencatatnya terlebih dahulu di fitur Audit atau Keuangan.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("AI Chat error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan: " + (error instanceof Error ? error.message : String(error)) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
