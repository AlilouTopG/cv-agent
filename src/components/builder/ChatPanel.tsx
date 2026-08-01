"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, RotateCcw, Send, Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex w-full gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-ee-md bg-[#2563eb] text-white"
            : "rounded-es-md border border-slate-200 bg-white text-slate-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 shadow-sm">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-full justify-start gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-sm">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-es-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

export default function ChatPanel({
  messages,
  isTyping,
  onSend,
  onReset,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const suggestions = lastAssistant?.suggestions ?? [];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;
    onSend(text);
    setInput("");
  };

  return (
    <div dir="ltr" lang="en" className="flex h-full flex-col bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold leading-tight text-slate-800 dark:text-white">
              CV Assistant
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isTyping ? "Thinking..." : "Guides you step by step"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          title="Start over"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-2.5 dark:border-zinc-800">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isTyping}
              onClick={() => onSend(suggestion)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb] disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[#1e3a8a] dark:hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 p-3 dark:border-zinc-800"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 dark:border-zinc-700 dark:bg-zinc-800">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (e.target as HTMLTextAreaElement).closest("form")?.requestSubmit();
              }
            }}
            rows={1}
            placeholder="Type your answer here..."
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 px-1 text-[11px] text-slate-400 dark:text-zinc-500">
          Press Enter to send · Shift+Enter for a new line
        </p>
      </form>
    </div>
  );
}
