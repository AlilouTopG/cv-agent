import type {
  CVData,
  Certification,
  Education,
  Experience,
  Project,
  Skill,
} from "./types";

export function createEmptyCV(): CVData {
  return {
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      summary: "",
    },
    targetRole: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };
}

let counter = 0;

export function uid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

export function emptyExperience(): Experience {
  return {
    id: uid("exp"),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function emptyEducation(): Education {
  return {
    id: uid("edu"),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function emptyProject(): Project {
  return {
    id: uid("proj"),
    name: "",
    description: "",
    technologies: "",
    link: "",
  };
}

export function emptyCertification(): Certification {
  return {
    id: uid("cert"),
    name: "",
    issuer: "",
    year: "",
  };
}

export function mergeExperience(
  draft: Partial<Experience>,
  complete?: Experience
): Experience {
  return { ...(complete ?? emptyExperience()), ...draft };
}

export function mergeEducation(
  draft: Partial<Education>,
  complete?: Education
): Education {
  return { ...(complete ?? emptyEducation()), ...draft };
}

export function mergeProject(
  draft: Partial<Project>,
  complete?: Project
): Project {
  return { ...(complete ?? emptyProject()), ...draft };
}

export function mergeCertification(
  draft: Partial<Certification>,
  complete?: Certification
): Certification {
  return { ...(complete ?? emptyCertification()), ...draft };
}

export interface CVStats {
  personal: number;
  total: number;
  percentage: number;
}

export function cvCompleteness(cv: CVData): CVStats {
  const checks: Array<boolean> = [
    cv.personal.fullName.trim().length > 0,
    cv.personal.headline.trim().length > 0,
    cv.personal.email.trim().length > 0,
    cv.personal.phone.trim().length > 0,
    cv.personal.location.trim().length > 0,
    cv.personal.summary.trim().length > 0,
    cv.targetRole.trim().length > 0,
    cv.experience.length > 0,
    cv.education.length > 0,
    cv.skills.length > 0,
  ];
  const total = checks.length;
  const passed = checks.filter(Boolean).length;
  return {
    personal: passed,
    total,
    percentage: Math.round((passed / total) * 100),
  };
}

export function parseSkills(raw: string): Skill[] {
  const cleaned = raw
    .toLowerCase()
    .replace(/^(my\s+)?skills?(?:\s+(include|are))?\s*:?\s*/i, "")
    .replace(/\band\b/gi, ",")
    .replace(/\s+/g, " ")
    .split(",")
    .map((s) => s.trim().replace(/^\.\s*/, ""))
    .filter(Boolean);

  const seen = new Set<string>();
  const skills: Skill[] = [];
  for (const name of cleaned) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    skills.push({ id: uid("skill"), name, level: 3 });
  }
  return skills;
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;

const MONTHS =
  "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";
const MONTH_YEAR_RE = new RegExp(
  `\\b(${MONTHS})[\\.]?\\s+(\\d{4})\\b`,
  "gi"
);

export function extractEmail(input: string): string | null {
  const match = input.match(EMAIL_RE);
  return match ? match[0] : null;
}

export function extractPhone(input: string): string | null {
  const cleaned = input.replace(EMAIL_RE, "");
  const match = cleaned.match(PHONE_RE);
  return match ? match[0].trim() : null;
}

function cleanName(raw: string): string {
  return raw
    .replace(/^(hi|hey|hello)[,!\s]+/i, "")
    .replace(/^(my name is|i am|i'm|im|call me|it's|its|the name is)\s+/i, "")
    .replace(/[.,;!]+$/, "")
    .trim();
}

export function extractName(input: string): string {
  let candidate = input;

  const explicit =
    /(?:my name is|i am|i'm|im|call me|this is)\s+([a-z][a-z .'-]{1,49})/i.exec(
      input
    );
  if (explicit) {
    candidate = explicit[1];
  } else if (/^(hi|hey|hello)[,!\s]/i.test(input)) {
    candidate = input.replace(/^(hi|hey|hello)[,!\s]+/i, "");
  }

  const cleaned = cleanName(candidate);
  if (cleaned.length === 0) return "";
  const first = cleaned.split(/\s+/)[0];
  if (first.length <= 2) return cleaned.split(/\s+/).slice(0, 3).join(" ");
  return cleaned.split(/\s+/).slice(0, 4).join(" ");
}

export function extractHeadline(input: string): string {
  return input
    .replace(
      /^(my(?: target)?(?: job| role| title)|i want to be (?:a|an|the)?\s*|i(?:'m| am) applying (?:for|as) (?:a|an|the)?\s*|i am a|i'm a|as (?:a|an|the)?\s*)\s*/i,
      ""
    )
    .replace(/[.,;!]+$/, "")
    .trim();
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export function extractDateRange(input: string): DateRange {
  const lower = input.toLowerCase();
  const hasPresent =
    /\b(present|current|now|ongoing|today)\b/.test(lower) ||
    /\d{4}\s*(?:-|to)\s*(?:present|current|now|ongoing)/.test(lower);

  const tokens: Array<{ raw: string; ts: number }> = [];

  MONTH_YEAR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MONTH_YEAR_RE.exec(input)) !== null) {
    const month = m[1];
    const year = m[2];
    const monthIndex = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ].indexOf(month.toLowerCase().slice(0, 3));
    const ts = new Date(Number(year), monthIndex, 1).getTime();
    tokens.push({ raw: `${capitalize(month)} ${year}`, ts });
  }

  const yearRe = /\b(\d{4})\b/g;
  let ym: RegExpExecArray | null;
  while ((ym = yearRe.exec(input)) !== null) {
    const year = Number(ym[1]);
    if (year < 1950 || year > 2100) continue;
    const already = tokens.some((t) => t.raw.endsWith(` ${year}`));
    if (!already) tokens.push({ raw: String(year), ts: new Date(year, 0, 1).getTime() });
  }

  tokens.sort((a, b) => a.ts - b.ts);

  const startDate = tokens[0] ? tokens[0].raw : "";
  const endDate = hasPresent
    ? "Present"
    : tokens.length > 1
      ? tokens[1].raw
      : "";

  return { startDate, endDate };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function normalizeDescription(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .replace(/^[.\s]+/, "")
    .replace(/[.]+$/, ".")
    .trim();
}

export function isNegative(input: string): boolean {
  return /^(no|nope|n|nah|skip|none|not really|next|done|finish|that's it|thats it)\b/i.test(
    input
  );
}

export function isPositive(input: string): boolean {
  return /^(yes|yeah|yep|y|sure|of course|absolutely|correct|right)\b/i.test(
    input
  );
}
