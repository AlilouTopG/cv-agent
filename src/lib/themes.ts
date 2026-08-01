export interface CVTheme {
  id: string;
  name: string;
  primary: string;
  background: string;
}

export const CV_THEMES: CVTheme[] = [
  { id: "indigo", name: "Modern Indigo", primary: "#4f46e5", background: "#f8fafc" },
  { id: "navy", name: "Classic Navy", primary: "#1e3a8a", background: "#ffffff" },
  { id: "emerald", name: "Emerald Tech", primary: "#059669", background: "#f0fdf4" },
  { id: "charcoal", name: "Sleek Charcoal", primary: "#111827", background: "#f9fafb" },
];

export const DEFAULT_THEME: CVTheme = CV_THEMES[0];
