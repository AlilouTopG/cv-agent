export type LangId = "en" | "fr" | "ar";

export interface Language {
  id: LangId;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { id: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { id: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { id: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export const DEFAULT_LANG: LangId = "en";

export function getDir(lang: LangId): "ltr" | "rtl" {
  return LANGUAGES.find((l) => l.id === lang)?.dir ?? "ltr";
}

export function getLanguage(lang: LangId): Language {
  return LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0];
}

type Dict = {
  yourName: string;
  professionalTitle: string;
  contact: string;
  noContact: string;
  summary: string;
  summaryPlaceholder: string;
  highlights: string;
  competencies: string;
  experience: string;
  skills: string;
  languages: string;
  livePreview: string;
  theme: string;
  layout: string;
  font: string;
  complete: string;
};

export const TRANSLATIONS: Record<LangId, Dict> = {
  en: {
    yourName: "Your Name",
    professionalTitle: "Professional Title",
    contact: "Contact",
    noContact: "No contact provided",
    summary: "Executive Summary",
    summaryPlaceholder: "Your professional summary will appear here.",
    highlights: "Key Highlights",
    competencies: "Core Competencies",
    experience: "Work & Academic Experience",
    skills: "Core Skills",
    languages: "Languages",
    livePreview: "Live Preview",
    theme: "Theme",
    layout: "Layout",
    font: "Font",
    complete: "complete",
  },
  fr: {
    yourName: "Votre Nom",
    professionalTitle: "Titre Professionnel",
    contact: "Contact",
    noContact: "Aucun contact fourni",
    summary: "Résumé Professionnel",
    summaryPlaceholder: "Votre résumé professionnel apparaîtra ici.",
    highlights: "Points Clés",
    competencies: "Compétences Clés",
    experience: "Expérience & Parcours",
    skills: "Compétences",
    languages: "Langues",
    livePreview: "Aperçu en Direct",
    theme: "Thème",
    layout: "Disposition",
    font: "Police",
    complete: "complet",
  },
  ar: {
    yourName: "الاسم الكامل",
    professionalTitle: "المسمى المهني",
    contact: "التواصل",
    noContact: "لا توجد معلومات تواصل",
    summary: "الملخص المهني",
    summaryPlaceholder: "سيظهر ملخصك المهني هنا.",
    highlights: "أبرز الإنجازات",
    competencies: "الكفاءات الأساسية",
    experience: "الخبرات & المسار المهني",
    skills: "المهارات",
    languages: "اللغات",
    livePreview: "المعاينة المباشرة",
    theme: "الألوان",
    layout: "التصميم",
    font: "الخط",
    complete: "مكتمل",
  },
};

export type Translator = (key: keyof Dict) => string;

export function getTranslator(lang: LangId): Translator {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  return (key) => dict[key];
}
