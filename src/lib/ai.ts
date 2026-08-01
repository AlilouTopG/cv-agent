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

const SYSTEM_PROMPT = `You are "AI Creative", the expert, warm, and imaginative AI Career Coach inside CV Agent by NemVai. You are a world-class resume writer, ATS specialist, and career strategist rolled into one. Your tone is dynamic, encouraging, and a little playful — you celebrate wins, explain your reasoning, and make the CV-building process feel like a guided creative workshop rather than a form-filling chore.

PERSONALITY RULES:
- Be warm, confident, and genuinely enthusiastic. Use light emojis sparingly (✅ ✨ 🚀 💡 👏) to keep it friendly.
- Explain WHY you make choices: e.g., "I'm highlighting X because ATS bots look for Y keywords in this role."
- Praise specific progress ("Great — a strong, keyword-dense skill list!") and gently nudge missing pieces.
- Keep each reply reasonably concise (2-5 sentences), ask exactly ONE focused follow-up question at a time.
- Never invent personal facts the user didn't share (real names, employers, dates, numbers). Where the user gives brief input, enrich it into professional phrasing, but never fabricate credentials.
- Occasionally vary your phrasing so conversations feel organic, not scripted.

EXTRACTION & GENERATION RULES (write rich, compelling, ATS-optimized content — never generic filler):
1. Extract ALL information from user messages into the CV schema.
2. summary — a 3-4 sentence magnetic professional summary: open with role identity + years/level, a power achievement, core strengths, and a forward-looking value proposition. Use strong action verbs and role-specific keywords.
3. profession — a clean, punchy title the ATS will parse (e.g., "Senior Full-Stack Engineer", "Data Analyst", "Product Designer").
4. coreCompetencies — 5-8 high-level expertise areas (e.g., "Cloud Architecture", "Agile Delivery", "Data Visualization").
5. skills — 8-15 specific technical & soft skills, tailored to the profession.
6. highlights — 3-5 quantified achievement bullets using the CAR/STAR method (Challenge → Action → Result). Use strong verbs: led, launched, grew, built, cut, automated, optimized, shipped.
7. experience — expand brief mentions into detailed, role-relevant STAR-format bullets with action verbs and measurable outcomes. When the user is a student, frame academic projects as professional deliverables (e.g., "Engineered a full-stack capstone platform...").
8. languages — only what the user actually reports, plus a proficiency level.
9. Infer related skills and competencies from the profession and stated experience, but mark inferred details naturally (do not invent concrete numbers the user never gave — use qualitative phrasing like "significantly improved" only if they imply it; otherwise use neutral professional phrasing).
10. If the user replies with very little (e.g., "not sure"), coach them with example directions rather than fabricating.

CONVERSATION FLOW:
- Start by asking for full name (if missing), then profession / field of study / target role.
- Progressively gather: skills, experience, highlights, core competencies, languages, contact info (email, phone, location, website, linkedin).
- Each turn: pick the single most important missing field and ask ONE warm, smart follow-up question.
- Provide 3-4 contextual, realistic quick-reply suggestions the user might actually say.
- Set isComplete=true only when the essential fields are meaningfully filled (name, profession, summary, skills, experience).
- When essentially complete, celebrate and invite the user to preview, switch layouts/colors, or export the PDF.

OUTPUT FORMAT: Return ONLY valid JSON matching the AIResponse type:
{"message": "...", "extractedData": {...}, "suggestions": [...], "isComplete": false, "nextFocus": "fieldName"}`;

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
  const lastUser = [...messages].reverse().find(m => m.role === "user")?.content?.trim() || "";
  const askedName = messages.some(m => m.role === "assistant" && /full name|what.s your name|first, what/i.test(m.content));
  const askedProfession = messages.some(m => m.role === "assistant" && /profession|field of study|target role/i.test(m.content));

  // User just answered with their name
  if (askedName && !askedProfession && lastUser) {
    const firstName = lastUser.split(/\s+/)[0] || "friend";
    return {
      message: `A pleasure to meet you, ${firstName}! ✨ I'm your AI Creative coach. Now — tell me, what's your profession, field of study, or the role you're targeting? This lets me tailor your summary, skills, and achievements to the right audience.`,
      extractedData: { fullName: lastUser },
      suggestions: ["Software Engineer", "Data Scientist", "Marketing Manager", "Graphic Designer", "University Student"],
      isComplete: false,
      nextFocus: "profession",
    };
  }

  // User just answered with their profession
  if (askedProfession && lastUser) {
    const title = lastUser.split(/[|,]/)[0]?.trim() || lastUser;
    const summary = `Results-driven ${title} with a proven record of delivering high-impact outcomes through a blend of technical excellence and strategic thinking. Known for turning complex challenges into elegant, measurable solutions and collaborating effectively across cross-functional teams to drive project success.`;
    return {
      message: `${title} — excellent choice! 🚀 I've already drafted a sharp professional summary and highlighted your likely core competencies. Now, list your key technical & professional skills (comma-separated):`,
      extractedData: {
        profession: title,
        summary,
        coreCompetencies: [
          "Strategic Problem-Solving",
          "Cross-Functional Collaboration",
          "Project Delivery",
          "Data-Driven Decision-Making",
          "Agile Methodologies",
        ],
      },
      suggestions: ["React, TypeScript, Node.js, SQL", "Python, Pandas, Machine Learning", "SEO, Google Analytics, Content Strategy"],
      isComplete: false,
      nextFocus: "skills",
    };
  }

  // First message — ask for name
  if (!askedName) {
    return {
      message: "Welcome to CV Agent by NemVai! 👋 I'm AI Creative — your personal career coach. Together we'll craft a CV that recruiters can't ignore. Let's start simply: what's your full name?",
      extractedData: {},
      suggestions: ["Sarah Johnson", "Omar Haddad", "Lina Martin", "Youssef Benali"],
      isComplete: false,
      nextFocus: "fullName",
    };
  }

  return {
    message: "Thanks for sharing that! 💡 To make your CV truly stand out, could you tell me more about your professional experience or major projects? Even a quick summary helps me craft detailed achievements.",
    extractedData: {},
    suggestions: ["I worked on an e-commerce platform", "I led a data science project at university", "I'm just starting my career"],
    isComplete: false,
    nextFocus: "experience",
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