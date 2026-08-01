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
  { id: "crimson", name: "Bold Crimson", primary: "#be123c", background: "#fef2f2" },
  { id: "sunset", name: "Sunset Amber", primary: "#c2410c", background: "#fff7ed" },
  { id: "ocean", name: "Deep Ocean", primary: "#0369a1", background: "#f0f9ff" },
  { id: "violet", name: "Royal Violet", primary: "#6d28d9", background: "#f5f3ff" },
  { id: "rose", name: "Elegant Rose", primary: "#be185d", background: "#fdf2f8" },
];

export const DEFAULT_THEME: CVTheme = CV_THEMES[0];
