import { createEmptyCV, uid } from "./cv";
import { callAI, mergeCVData, getMissingFields, getCompletionPercentage, type ConversationContext } from "./ai";
import type { CVData, ChatMessage } from "./types";

export interface AgentState {
  context: ConversationContext;
  isProcessing: boolean;
}

export interface AgentResult {
  state: AgentState;
  cv: CVData;
  messages: ChatMessage[];
  done: boolean;
  completionPercentage: number;
}

export function createInitialState(): AgentState {
  return {
    context: {
      extractedData: {},
      missingFields: ["fullName", "profession", "summary", "skills", "experience", "highlights", "coreCompetencies", "languages", "email", "phone", "location", "website", "linkedin"],
      currentFocus: "fullName",
      turnCount: 0,
    },
    isProcessing: false,
  };
}

export function getGreeting(): ChatMessage {
  return {
    id: uid("msg"),
    role: "assistant",
    content: "Welcome to CV Agent! 👋 I'm your AI career coach. Let's build you an outstanding, ATS-optimized CV through natural conversation. First, what's your full name?",
    suggestions: ["John Smith", "Maria Garcia", "Alex Johnson", "Priya Patel"],
  };
}

function user(content: string): ChatMessage {
  return { id: uid("msg"), role: "user", content };
}

function assistant(content: string, suggestions: string[] = []): ChatMessage {
  return { id: uid("msg"), role: "assistant", content, suggestions };
}

function buildConversationMessages(cv: CVData, userInput: string): Array<{ role: string; content: string }> {
  const missing = getMissingFields(cv);
  const completion = getCompletionPercentage(cv);
  
  const contextMsg = `Current CV completeness: ${completion}%. Missing essential fields: ${missing.join(", ")}. 
  
Current extracted data:
${JSON.stringify(cv, null, 2)}

User just said: "${userInput}"

Extract ALL relevant information, update the CV data, and respond naturally. Ask ONE focused follow-up question for the most important missing field. Provide 3-4 contextual quick-reply suggestions.`;

  return [
    { role: "user", content: contextMsg },
  ];
}

export async function processUserMessage(
  prev: AgentState,
  cv: CVData,
  input: string
): Promise<AgentResult> {
  const text = input.trim();
  if (!text) {
    return {
      state: prev,
      cv,
      messages: [],
      done: false,
      completionPercentage: getCompletionPercentage(cv),
    };
  }

  const messages = buildConversationMessages(cv, text);
  const aiResponse = await callAI(messages);

  const newCV = mergeCVData(cv, aiResponse.extractedData);
  const newMissing = getMissingFields(newCV);
  const completion = getCompletionPercentage(newCV);

  const newContext: ConversationContext = {
    extractedData: { ...prev.context.extractedData, ...aiResponse.extractedData },
    missingFields: newMissing,
    currentFocus: aiResponse.nextFocus || newMissing[0] || null,
    turnCount: prev.context.turnCount + 1,
  };

  return {
    state: {
      context: newContext,
      isProcessing: false,
    },
    cv: newCV,
    messages: [
      user(text),
      assistant(aiResponse.message, aiResponse.suggestions),
    ],
    done: aiResponse.isComplete || completion >= 80,
    completionPercentage: completion,
  };
}

export function getInitialCV(): CVData {
  return createEmptyCV();
}

export function isCVUsable(cv: CVData): boolean {
  return cv.fullName.trim().length > 0 && cv.profession.trim().length > 0;
}