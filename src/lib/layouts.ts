export type LayoutId = "classic" | "modern_split" | "minimal" | "executive" | "compact" | "creative";
export type FontStyleId = "inter" | "cairo" | "tajawal" | "merriweather" | "roboto" | "geist";
export type DecorativeDivider = "solid" | "accent-block" | "double-line" | "minimal-dash" | "none";
export type BadgeStyle = "pill" | "rounded-sm" | "outlined" | "flat-tag";
export type BulletStyle = "dots" | "checkmarks" | "dashes" | "square";

export interface LayoutConfig {
  id: LayoutId;
  name: string;
  description: string;
  structure: "single-column" | "two-column-left" | "two-column-right" | "grid" | "compact-dense";
  hasSidebar: boolean;
  sidebarPosition?: "left" | "right";
}

export interface FontPreset {
  id: FontStyleId;
  name: string;
  fontFamily: string;
  headingFamily: string;
  bodyFamily: string;
  direction?: "ltr" | "rtl" | "auto";
  scriptSupport: "en" | "ar" | "bilingual";
}

export interface DecorativeStyle {
  id: string;
  name: string;
  divider: DecorativeDivider;
  badgeStyle: BadgeStyle;
  bulletStyle: BulletStyle;
}

export interface CVTheme {
  id: string;
  name: string;
  primary: string;
  background: string;
}

export const AVAILABLE_LAYOUTS: LayoutConfig[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with clean, structured sections.",
    structure: "single-column",
    hasSidebar: false,
  },
  {
    id: "modern_split",
    name: "Modern Split",
    description: "Two-column layout with a sleek colored sidebar for skills and contact info.",
    structure: "two-column-left",
    hasSidebar: true,
    sidebarPosition: "left",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "High-whitespace, elegant typography layout focused on extreme clarity.",
    structure: "single-column",
    hasSidebar: false,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Prominent top header, bold dividing accents, designed for senior roles.",
    structure: "single-column",
    hasSidebar: false,
  },
  {
    id: "compact",
    name: "Compact",
    description: "High-density multi-column grid layout optimizing single-page real estate.",
    structure: "compact-dense",
    hasSidebar: false,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold header banner, accent shapes, and dynamic typography for design-forward candidates.",
    structure: "two-column-right",
    hasSidebar: true,
    sidebarPosition: "right",
  },
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "inter",
    name: "Modern Sans (Inter/Geist)",
    fontFamily: "var(--font-geist-sans), 'Inter', 'Segoe UI', system-ui, sans-serif",
    headingFamily: "var(--font-geist-sans), 'Inter', sans-serif",
    bodyFamily: "var(--font-geist-sans), 'Inter', sans-serif",
    scriptSupport: "en",
  },
  {
    id: "cairo",
    name: "Cairo (Arabic & EN)",
    fontFamily: "var(--font-cairo), var(--font-geist-sans), sans-serif",
    headingFamily: "var(--font-cairo), sans-serif",
    bodyFamily: "var(--font-cairo), sans-serif",
    scriptSupport: "bilingual",
  },
  {
    id: "tajawal",
    name: "Tajawal (Modern Arabic)",
    fontFamily: "var(--font-tajawal), var(--font-geist-sans), sans-serif",
    headingFamily: "var(--font-tajawal), sans-serif",
    bodyFamily: "var(--font-tajawal), sans-serif",
    scriptSupport: "bilingual",
  },
  {
    id: "merriweather",
    name: "Classic Serif (Merriweather/Georgia)",
    fontFamily: "Georgia, 'Merriweather', 'Times New Roman', serif",
    headingFamily: "Georgia, 'Merriweather', serif",
    bodyFamily: "Georgia, serif",
    scriptSupport: "en",
  },
  {
    id: "roboto",
    name: "Roboto / Clean Sans",
    fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    headingFamily: "'Roboto', sans-serif",
    bodyFamily: "'Roboto', sans-serif",
    scriptSupport: "en",
  },
  {
    id: "geist",
    name: "Tech Mono / Code",
    fontFamily: "var(--font-geist-mono), 'Cascadia Code', Consolas, monospace",
    headingFamily: "var(--font-geist-mono), monospace",
    bodyFamily: "var(--font-geist-mono), monospace",
    scriptSupport: "en",
  },
];

export const DECORATIVE_STYLES: DecorativeStyle[] = [
  {
    id: "modern",
    name: "Modern Accents",
    divider: "solid",
    badgeStyle: "pill",
    bulletStyle: "checkmarks",
  },
  {
    id: "minimalist",
    name: "Minimal Dots",
    divider: "minimal-dash",
    badgeStyle: "outlined",
    bulletStyle: "dots",
  },
  {
    id: "executive",
    name: "Executive Blocks",
    divider: "accent-block",
    badgeStyle: "rounded-sm",
    bulletStyle: "square",
  },
];

// Backwards compatibility exports
export const CV_LAYOUTS = AVAILABLE_LAYOUTS;
export const CV_FONT_STYLES = FONT_PRESETS;
export const DEFAULT_LAYOUT = AVAILABLE_LAYOUTS[0];
export const DEFAULT_FONT_STYLE = FONT_PRESETS[0];
