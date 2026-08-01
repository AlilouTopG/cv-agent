"use client";

import { useEffect, useState, useCallback } from "react";
import ChatPanel from "./ChatPanel";
import PreviewPanel from "./PreviewPanel";
import { createEmptyCV } from "@/lib/cv";
import {
  createInitialState,
  getGreeting,
  processUserMessage,
  type AgentState,
  type AgentResult,
} from "@/lib/agent";
import { DEFAULT_THEME } from "@/lib/themes";
import { DEFAULT_LAYOUT, DEFAULT_FONT_STYLE } from "@/lib/layouts";
import type { CVData, ChatMessage } from "@/lib/types";

const STORAGE_KEY = "nemvai-state-v6";

interface PersistedState {
  cv: CVData;
  agentState: AgentState;
  messages: ChatMessage[];
  themeId?: string;
  layoutId?: string;
  fontStyleId?: string;
}

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed || !parsed.cv || !parsed.agentState || !Array.isArray(parsed.messages)) {
      return null;
    }
    return {
      cv: { ...createEmptyCV(), ...parsed.cv },
      agentState: parsed.agentState,
      messages: parsed.messages,
      themeId: parsed.themeId,
      layoutId: parsed.layoutId,
      fontStyleId: parsed.fontStyleId,
    };
  } catch {
    return null;
  }
}

export default function BuilderClient() {
  const [initial] = useState<PersistedState | null>(() =>
    typeof window === "undefined" ? null : loadPersisted()
  );

  const [cv, setCv] = useState<CVData>(
    () => initial?.cv ?? createEmptyCV()
  );
  const [agentState, setAgentState] = useState<AgentState>(
    () => initial?.agentState ?? createInitialState()
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => initial?.messages ?? [getGreeting()]
  );
  const [themeId, setThemeId] = useState<string>(
    () => initial?.themeId ?? DEFAULT_THEME.id
  );
  const [layoutId, setLayoutId] = useState<string>(
    () => initial?.layoutId ?? DEFAULT_LAYOUT.id
  );
  const [fontStyleId, setFontStyleId] = useState<string>(
    () => initial?.fontStyleId ?? DEFAULT_FONT_STYLE.id
  );

  const [isTyping, setIsTyping] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cv, agentState, messages, themeId, layoutId, fontStyleId })
      );
    } catch {
      // storage unavailable (e.g. private mode) — ignore
    }
  }, [cv, agentState, messages, themeId, layoutId, fontStyleId]);

  const handleSend = useCallback(async (text: string) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: text },
    ]);
    setIsTyping(true);

    try {
      const result: AgentResult = await processUserMessage(agentState, cv, text);
      
      setAgentState(result.state);
      setCv(result.cv);
      setCompletionPercentage(result.completionPercentage);
      setMessages((prev) => [
        ...prev,
        ...result.messages.filter((m) => m.role === "assistant"),
      ]);
    } catch (error) {
      console.error("Failed to process message:", error);
      setMessages((prev) => [
        ...prev,
        { 
          id: `error-${Date.now()}`, 
          role: "assistant", 
          content: "I'm having trouble processing that. Could you try again?",
          suggestions: ["Try again", "Start over"],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [agentState, cv, isTyping]);

  const handleReset = () => {
    if (isTyping) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setCv(createEmptyCV());
    setAgentState(createInitialState());
    setMessages([getGreeting()]);
    setThemeId(DEFAULT_THEME.id);
    setLayoutId(DEFAULT_LAYOUT.id);
    setFontStyleId(DEFAULT_FONT_STYLE.id);
    setCompletionPercentage(0);
  };

  return (
    <div dir="ltr" lang="en" className="flex h-dvh flex-col bg-slate-100 dark:bg-zinc-950">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col border-b border-slate-200 md:border-b-0 md:border-r dark:border-zinc-800">
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
            onReset={handleReset}
            completionPercentage={completionPercentage}
          />
        </div>
        <div className="min-h-0 flex-1">
          <PreviewPanel
            cv={cv}
            themeId={themeId}
            onThemeChange={setThemeId}
            layoutId={layoutId}
            onLayoutChange={setLayoutId}
            fontStyleId={fontStyleId}
            onFontStyleChange={setFontStyleId}
          />
        </div>
      </div>
    </div>
  );
}