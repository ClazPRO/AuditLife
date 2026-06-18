import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API Key belum dikonfigurasi." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Anda adalah AuditLife Assistant, asisten AI cerdas dan ramah yang terintegrasi di dalam aplikasi AuditLife.
AuditLife adalah platform pelacakan produktivitas dan keuangan mingguan.
Tugas Anda adalah membantu pengguna dengan pertanyaan seputar produktivitas, manajemen keuangan, kehidupan sehari-hari, atau memberikan panduan tentang cara menggunakan aplikasi ini.
Berikan jawaban yang ringkas, suportif, dan solutif. Gunakan bahasa Indonesia yang santai tapi sopan.`,
    });

    // Convert messages to Gemini chat history format
    const history = messages.slice(0, -1).map((m: { role: string; content: string; parts?: { text: string }[] }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: typeof m.content === "string" ? m.content : (m.parts?.map((p: { text: string }) => p.text).join("") ?? "") }],
    }));

    const lastMessage = messages[messages.length - 1];
    const lastContent = typeof lastMessage.content === "string"
      ? lastMessage.content
      : (lastMessage.parts?.map((p: { text: string }) => p.text).join("") ?? "");

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastContent);

    // Stream the response as plain text
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err: unknown) {
          console.error("Stream error:", err instanceof Error ? err.message : String(err));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    console.error("AI Chat error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan: " + (error instanceof Error ? error.message : String(error)) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
