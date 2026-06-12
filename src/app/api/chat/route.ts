import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if API key is provided
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "API Key Google Gemini belum dikonfigurasi. Silakan tambahkan GOOGLE_GENERATIVE_AI_API_KEY di file .env.local Anda." 
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Anda adalah AuditLife Assistant, asisten AI cerdas dan ramah yang terintegrasi di dalam aplikasi AuditLife.
AuditLife adalah platform pelacakan produktivitas dan keuangan mingguan.
Tugas Anda adalah membantu pengguna dengan pertanyaan seputar produktivitas, manajemen keuangan, kehidupan sehari-hari, atau memberikan panduan tentang cara menggunakan aplikasi ini.
Berikan jawaban yang ringkas, suportif, dan solutif. Gunakan bahasa Indonesia yang santai tapi sopan.`;

    // Convert UI messages to model messages for AI SDK v6
    const modelMessages = await convertToModelMessages(messages);

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat memproses pesan." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
