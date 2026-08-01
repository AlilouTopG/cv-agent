import { extractCVData } from "@/utils/cvParser";
import { createEmptyCV, uid } from "./cv";
import type { CVData, ChatMessage } from "./types";

export interface AgentState {
  step: number;
}

export interface AgentResult {
  state: AgentState;
  cv: CVData;
  messages: ChatMessage[];
  done: boolean;
}

export function createInitialState(): AgentState {
  return { step: 0 };
}

export function getGreeting(): ChatMessage {
  return {
    id: uid("msg"),
    role: "assistant",
    content:
      "Welcome to CV Agent by Nexus! 👋 I'm your AI assistant and I'll help you build a professional, ATS-friendly CV in just a few minutes. Let's start — what is your full name?",
  };
}

function user(content: string): ChatMessage {
  return { id: uid("msg"), role: "user", content };
}

export function processUserMessage(
  prev: AgentState,
  cv: CVData,
  input: string
): AgentResult {
  const text = input.trim();
  const result = extractCVData(cv, text, prev.step);

  return {
    state: { step: result.nextStep },
    cv: result.updatedData,
    messages: [
      user(text),
      {
        id: uid("msg"),
        role: "assistant",
        content: result.responseMessage,
      },
    ],
    done: result.nextStep > 3,
  };
}

export function getInitialCV(): CVData {
  return createEmptyCV();
}

export function isCVUsable(cv: CVData): boolean {
  return cv.fullName.trim().length > 0;
}
