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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Halo, ${userName}! 👋\nAda yang bisa saya bantu hari ini?`
    }
  ]);
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
    } catch (err: unknown) {
      setError("Gagal memuat balasan. Pastikan API Key Anda sudah diatur.");
      // Remove empty assistant placeholder on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      console.error("Chat error:", err instanceof Error ? err.message : String(err));
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
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Halo, ${userName}! 👋\nAda yang bisa saya bantu hari ini?`
      }
    ]);
    setError(null);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/80 backdrop-blur-md px-4 shrink-0 justify-between">
        <h2 className="text-base font-medium text-foreground/80 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Assistant
        </h2>

        {messages.length > 1 && (
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-h-0 pb-32">
        {/* Messages */}
        <div className="space-y-4 max-w-4xl mx-auto w-full">
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
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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

          {/* Suggestions - show only when just welcome message is present */}
          {messages.length === 1 && (
            <div className="flex flex-col gap-2 pt-4 pl-11">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="w-fit px-4 py-2 text-left text-xs font-medium rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 transition-all duration-300 text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
              <span>⚠ {error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - Gemini Style Floating Pill */}
      <div className="fixed bottom-[4.5rem] md:bottom-6 left-0 right-0 px-4 pt-8 pb-2 bg-gradient-to-t from-background via-background/90 to-transparent z-40 pointer-events-none">
        <form onSubmit={handleSubmit} className="pointer-events-auto flex items-center gap-2 max-w-4xl mx-auto bg-white/[0.05] border border-white/10 rounded-full pl-6 pr-2 py-2 shadow-2xl focus-within:bg-white/[0.08] focus-within:border-white/20 transition-all backdrop-blur-md">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a prompt here"
            disabled={isLoading}
            className="flex-1 h-10 border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={`h-10 w-10 rounded-full shrink-0 transition-all ${
              input.trim() ? "bg-white hover:bg-white/90 text-black" : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <Send className="h-4 w-4 ml-0.5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
