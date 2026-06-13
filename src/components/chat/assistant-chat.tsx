"use client";

import { useRef, useEffect, FormEvent } from "react";
import { flushSync } from "react-dom";
import { useChat } from "@ai-sdk/react";
import { Send, User, Bot, Loader2, Sparkles, AlertCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AssistantChat({ userName }: { userName: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    messages,
    input = "",
    handleInputChange,
    handleSubmit,
    status,
    error,
    setMessages,
  } = useChat({ api: "/api/chat", streamProtocol: "text" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input?.trim() || isLoading) return;
    handleSubmit(e as any);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    // flushSync forces React to update state synchronously before requestSubmit
    flushSync(() => {
      handleInputChange({
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    formRef.current?.requestSubmit();
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Helper to extract text content from message
  const getMessageText = (m: (typeof messages)[number]): string => {
    return m.content || "";
  };

  const suggestions = [
    "Analisis minggu ini",
    "Saran kegiatan produktif",
    "Tips mengelola keuangan",
    "Buat rencana minggu depan",
  ];

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
          /* Empty / Welcome state */
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

            {/* Suggestions list */}
            <div className="w-full max-w-[280px] flex flex-col gap-2 pt-4">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 text-xs font-medium rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 text-muted-foreground hover:text-foreground flex items-center justify-between group"
                >
                  <span>{suggestion}</span>
                  <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Tanya &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat history */
          <div className="space-y-4 pt-2 pb-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] animate-in fade-in duration-200 ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border border-white/5 ${
                    m.role === "user" 
                      ? "bg-primary text-white" 
                      : "bg-white/[0.04] text-primary"
                  }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-tr-none shadow-lg"
                      : "bg-white/[0.03] border border-white/5 text-foreground rounded-tl-none"
                  }`}
                >
                  {getMessageText(m)}
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 max-w-[85%] animate-in fade-in duration-200">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/5 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-3.5 py-2.5 text-xs bg-white/[0.03] border border-white/5 text-muted-foreground flex items-center gap-2 rounded-tl-none">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> 
                  Mengetik jawaban...
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 text-center text-red-400 text-xs mt-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl max-w-[90%] mx-auto">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>Gagal memuat balasan. Pastikan API Key Anda sudah diatur.</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Message Area */}
      <div className="p-4 border-t border-white/5 bg-background/90 backdrop-blur-md shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="flex items-center gap-2 max-w-md mx-auto"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Tulis pertanyaanmu..."
            className="flex-1 h-11 bg-white/[0.02] border-white/10 focus:border-primary/50 text-xs rounded-xl px-4"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-11 w-11 rounded-xl shrink-0 glow-primary-hover"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
