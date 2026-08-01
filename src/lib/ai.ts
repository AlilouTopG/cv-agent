import type { CVData } from "./types";

export interface ExtractedCVData {
  fullName?: string;
  profession?: string;
  summary?: string;
  highlights?: string[];
  coreCompetencies?: string[];
  skills?: string[];
  experience?: string;
  languages?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
}

export interface ConversationContext {
  extractedData: ExtractedCVData;
  missingFields: (keyof ExtractedCVData)[];
  currentFocus: keyof ExtractedCVData | null;
  turnCount: number;
}

export interface AIResponse {
  message: string;
  extractedData: ExtractedCVData;
  suggestions: string[];
  isComplete: boolean;
  nextFocus: keyof ExtractedCVData | null;
}

const SYSTEM_PROMPT = `You are CV Agent, an expert AI career coach and resume writer. Your goal is to help users build a complete, ATS-optimized CV through natural conversation.

EXTRACTION RULES:
1. Extract ALL relevant information from user messages into the CV schema
2. Infer missing information intelligently (e.g., from profession suggest likely skills)
3. Generate professional, quantified content - not just raw input
4. For experience: expand brief mentions into STAR-format bullets (Situation, Task, Action, Result)
5. For skills: categorize into technical/soft, infer related skills
6. For summary: write a compelling 2-3 sentence professional summary
7. For highlights: create 3-5 quantified achievements
8. For core competencies: 5-8 high-level expertise areas

CONVERSATION FLOW:
- Start by asking for name if missing
- Then profession/field of study
- Then progressively gather: skills, experience, highlights, contact info
- Ask ONE focused question at a time
- Provide 3-4 contextual quick-reply suggestions
- Mark isComplete=true when all essential fields are filled (name, profession, summary, skills, experience)

OUTPUT FORMAT: Return valid JSON matching the AIResponse type.`;

export async function callAI(messages: Array<{ role: string; content: string }>): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return fallbackAIResponse(messages);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    
    return {
      message: parsed.message || "Thanks! Let me help you build your CV.",
      extractedData: parsed.extractedData || {},
      suggestions: parsed.suggestions || [],
      isComplete: parsed.isComplete || false,
      nextFocus: parsed.nextFocus || null,
    };
  } catch (error) {
    console.error("AI call failed:", error);
    return fallbackAIResponse(messages);
  }
}

function fallbackAIResponse(messages: Array<{ role: string; content: string }>): AIResponse {
  const hasName = messages.some(m => m.content.toLowerCase().includes("name") || m.role === "assistant");
  
  if (!hasName && messages.length <= 2) {
    return {
      message: "Welcome to CV Agent! 👋 I'm your AI career coach. Let's build you an outstanding, ATS-optimized CV. First, what's your full name?",
      extractedData: {},
      suggestions: ["John Smith", "Maria Garcia", "Alex Johnson", "Priya Patel"],
      isComplete: false,
      nextFocus: "fullName",
    };
  }

  return {
    message: "Thanks for sharing! Could you tell me your current profession, field of study, or target role?",
    extractedData: {},
    suggestions: ["Software Engineer", "Data Scientist", "Marketing Manager", "Product Designer"],
    isComplete: false,
    nextFocus: "profession",
  };
}

export function mergeCVData(current: CVData, extracted: ExtractedCVData): CVData {
  return {
    ...current,
    ...Object.fromEntries(
      Object.entries(extracted).filter(([, v]) => v !== undefined && v !== "")
    ),
  };
}

export function getMissingFields(cv: CVData): (keyof ExtractedCVData)[] {
  const essential: (keyof ExtractedCVData)[] = ["fullName", "profession", "summary", "skills", "experience"];
  return essential.filter(field => !cv[field] || (Array.isArray(cv[field]) && cv[field].length === 0));
}

export function getCompletionPercentage(cv: CVData): number {
  const allFields: (keyof CVData)[] = [
    "fullName", "profession", "summary", "highlights", "coreCompetencies", 
    "skills", "experience", "languages", "email", "phone", "location", "website", "linkedin"
  ];
  const filled = allFields.filter(field => {
    const val = cv[field];
    if (Array.isArray(val)) return val.length > 0;
    return typeof val === "string" && val.trim().length > 0;
  });
  return Math.round((filled.length / allFields.length) * 100);
}