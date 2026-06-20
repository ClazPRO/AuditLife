import { google } from "@ai-sdk/google";
import { streamText } from "ai";

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

    const result = streamText({
      model: google("gemini-1.5-flash-latest"),
      messages,
      system: `Anda adalah AuditLife Assistant, asisten AI analitik di dalam aplikasi AuditLife.
AuditLife adalah platform pelacakan produktivitas dan keuangan mingguan.
Tugas Anda adalah merespons pertanyaan pengguna terkait produktivitas dan keuangan.
KARAKTER ANDA: Analis produktivitas yang sangat objektif, ketat, dan berbasis data. Anda tidak berbasa-basi. Evaluasi setiap pertanyaan secara faktual. Jika kinerja pengguna buruk, sampaikan fakta kelemahannya secara lugas, profesional, dan solutif. Tujuannya adalah membangun kedisiplinan melalui evaluasi data yang jujur.`,
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
