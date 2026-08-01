export interface CVData {
  fullName: string;
  profession: string;
  summary: string;
  highlights: string[];
  coreCompetencies: string[];
  skills: string[];
  experience: string;
  languages: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  suggestions?: string[];
}
