import type { CVData } from "./types";

export function createEmptyCV(): CVData {
  return {
    fullName: "",
    profession: "",
    summary: "",
    skills: [],
    experience: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  };
}

let counter = 0;

export function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export interface CVStats {
  total: number;
  percentage: number;
}

export function cvCompleteness(cv: CVData): CVStats {
  const checks: Array<boolean> = [
    cv.fullName.trim().length > 0,
    cv.profession.trim().length > 0,
    cv.summary.trim().length > 0,
    cv.skills.length > 0,
    cv.experience.trim().length > 0,
  ];
  const total = checks.length;
  const passed = checks.filter(Boolean).length;
  return {
    total,
    percentage: Math.round((passed / total) * 100),
  };
}
