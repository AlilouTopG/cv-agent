export interface CVData {
  fullName: string;
  profession: string;
  summary: string;
  skills: string[];
  experience: string;
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
