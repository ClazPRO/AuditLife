"use client";

import { useRef, useEffect, useState } from "react";
import { Send, User, Bot, Loader2, Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AssistantChat({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Analisis minggu ini",
    "Saran kegiatan produktif",
    "Tips mengelola keuangan",
    "Buat rencana minggu depan",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Placeholder for streaming assistant reply
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const allMessages = [...messages, userMessage];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Tidak ada response stream");

      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        // Update assistant message in real-time
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullText } : m
          )
        );
      }
    } catch (err: any) {
      setError("Gagal memuat balasan. Pastikan API Key Anda sudah diatur.");
      // Remove empty assistant placeholder on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      console.error("Chat error:", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/80 backdrop-blur-md px-4 shrink-0 justify-between">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          AI Assistant
        </h2>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-xl border border-white/5 hover:bg-white/5"
          >
            <History className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </header>

      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-h-0">
        {messages.length === 0 ? (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl border border-white/10">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold tracking-tight">
                Hai, {userName}! 👋
              </h3>
              <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                Aku siap membantumu. Tanyakan apa saja tentang hidupmu, keuanganmu, atau saran kegiatan.
              </p>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-[280px] flex flex-col gap-2 pt-4">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 text-xs font-medium rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 text-muted-foreground hover:text-foreground flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{suggestion}</span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                    Tanya →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-600/20 border border-white/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-white/[0.04] border border-white/5 text-foreground rounded-tl-sm"
                  }`}
                >
                  {message.content === "" && message.role === "assistant" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 border border-white/10">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                <span>⚠ {error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-white/5 bg-background/80 backdrop-blur-md p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaanmu..."
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl bg-white/[0.04] border-white/10 text-xs placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:border-primary/40 disabled:opacity-60"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-11 w-11 rounded-xl shrink-0 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
