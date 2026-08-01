import type { CVData } from "@/lib/types";
import type { CVTheme } from "@/lib/themes";
import {
  FONT_PRESETS,
  type FontStyleId,
  type LayoutId,
} from "@/lib/layouts";

function bullets(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n|•/)
    .map((s) => s.trim().replace(/^[-–—]\s*/, ""))
    .filter(Boolean);
}

function ContactRow({ cv, theme }: { cv: CVData; theme?: CVTheme }) {
  const items = [cv.email, cv.phone, cv.location, cv.website, cv.linkedin].filter(
    Boolean
  );

  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] leading-relaxed text-[#4b5563]">
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center">
          {index > 0 && (
            <span
              className="mr-3 text-[#9ca3af]"
              style={{ color: theme?.primary }}
            >
              •
            </span>
          )}
          {item}
        </span>
      ))}
    </div>
  );
}

function initials(name: string): string {
  if (!name || !name.trim()) return "CV";
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CV"
  );
}

// 1. Classic Single Column
function ClassicLayout({ cv, theme }: { cv: CVData; theme: CVTheme }) {
  const hasSummary = Boolean(cv.summary?.trim());
  const hasExperience = Boolean(cv.experience?.trim());
  const hasSkills = Boolean(cv.skills && cv.skills.length > 0);
  const isEmpty =
    !cv.fullName?.trim() &&
    !cv.profession?.trim() &&
    !hasSummary &&
    !hasExperience &&
    !hasSkills;

  return (
    <div className="px-10 py-11">
      <header className="text-center">
        <h1
          className="text-[28px] font-bold leading-tight tracking-tight"
          style={{ color: theme.primary }}
        >
          {cv.fullName || "Your Name"}
        </h1>
        <p
          className="mt-1 text-[14px] font-medium"
          style={{ color: theme.primary }}
        >
          {cv.profession || "Professional Title"}
        </p>
        <ContactRow cv={cv} theme={theme} />
      </header>

      <div className="mt-6 space-y-5">
        {(hasSummary || isEmpty) && (
          <section>
            <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.primary }}>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.primary }}>
                Executive Summary
              </h2>
            </div>
            {hasSummary ? (
              <p className="text-[11.5px] leading-relaxed text-[#374151]">
                {cv.summary}
              </p>
            ) : (
              <p className="text-[11.5px] italic text-[#9ca3af]">
                Your professional summary will appear here.
              </p>
            )}
          </section>
        )}

        {hasExperience && (
          <section>
            <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.primary }}>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.primary }}>
                Work & Academic Experience
              </h2>
            </div>
            <ul className="space-y-1">
              {bullets(cv.experience).map((line, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-snug text-[#374151]">
                  <span className="shrink-0" style={{ color: theme.primary }}>•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasSkills && (
          <section>
            <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.primary }}>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.primary }}>
                Core Skills & Competencies
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cv.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-sm border px-2.5 py-1 text-[11px] font-medium"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// 2. Modern Split (Two Columns)
function ModernSplitLayout({ cv, theme }: { cv: CVData; theme: CVTheme }) {
  const contactItems = [cv.email, cv.phone, cv.location, cv.website, cv.linkedin].filter(
    Boolean
  );
  const hasSummary = Boolean(cv.summary?.trim());
  const hasSkills = Boolean(cv.skills && cv.skills.length > 0);
  const hasExperience = Boolean(cv.experience?.trim());

  return (
    <div className="flex min-h-[1123px] text-[#1f2937]">
      {/* Sidebar */}
      <aside
        style={{ backgroundColor: theme.primary }}
        className="w-[260px] shrink-0 px-6 py-10 text-white"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/40 text-2xl font-bold">
          {initials(cv.fullName)}
        </div>

        <section className="mt-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            Contact
          </h3>
          <div className="mt-2 border-t border-white/20 pt-2.5">
            {contactItems.length === 0 ? (
              <p className="text-[10.5px] italic text-white/60">No contact provided</p>
            ) : (
              <ul className="space-y-2 text-[10.5px] leading-snug text-white/95">
                {contactItems.map((item) => (
                  <li key={item} className="break-all">{item}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {hasSkills && (
          <section className="mt-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
              Core Skills
            </h3>
            <div className="mt-2 border-t border-white/20 pt-2.5">
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-white/40 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 px-8 py-10">
        <header>
          <h1
            style={{ color: theme.primary }}
            className="text-[26px] font-bold leading-tight"
          >
            {cv.fullName || "Your Name"}
          </h1>
          <p
            style={{ color: theme.primary }}
            className="mt-0.5 text-[13px] font-semibold"
          >
            {cv.profession || "Professional Title"}
          </p>
        </header>
        <div className="mt-3 h-0.5 w-12" style={{ backgroundColor: theme.primary }} />

        {hasSummary && (
          <section className="mt-6">
            <h2
              className="text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: theme.primary }}
            >
              Executive Summary
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-[#374151]">
              {cv.summary}
            </p>
          </section>
        )}

        {hasExperience && (
          <section className="mt-6">
            <h2
              className="text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: theme.primary }}
            >
              Work & Major Projects
            </h2>
            <ul className="mt-2 space-y-1.5">
              {bullets(cv.experience).map((line, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-snug text-[#374151]">
                  <span className="shrink-0" style={{ color: theme.primary }}>✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// 3. Minimal Tech Layout
function MinimalLayout({ cv, theme }: { cv: CVData; theme: CVTheme }) {
  const contactItems = [cv.email, cv.phone, cv.location, cv.website, cv.linkedin].filter(
    Boolean
  );
  const hasSummary = Boolean(cv.summary?.trim());
  const hasSkills = Boolean(cv.skills && cv.skills.length > 0);
  const hasExperience = Boolean(cv.experience?.trim());

  return (
    <div className="px-10 py-12">
      <div className="h-1.5 w-full" style={{ backgroundColor: theme.primary }} />
      <header className="mt-6 flex flex-col gap-2 border-b pb-4" style={{ borderColor: `${theme.primary}33` }}>
        <h1 className="text-[30px] font-bold leading-none tracking-tight" style={{ color: theme.primary }}>
          {cv.fullName || "Your Name"}
        </h1>
        <p className="text-[13px] font-semibold text-[#374151]">
          {cv.profession || "Professional Title"}
        </p>
        {contactItems.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6b7280]">
            {contactItems.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-6 space-y-6">
        {hasSummary && (
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>
              Summary
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-[#374151]">
              {cv.summary}
            </p>
          </section>
        )}

        {hasSkills && (
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>
              Technical Stack & Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {cv.skills.map((s) => (
                <span
                  key={s}
                  className="rounded bg-slate-100 px-2.5 py-1 text-[10.5px] font-mono text-slate-800 border"
                  style={{ borderColor: `${theme.primary}44` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasExperience && (
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>
              Experience & Achievements
            </h3>
            <ul className="mt-2 space-y-1.5">
              {bullets(cv.experience).map((line, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-snug text-[#374151]">
                  <span className="shrink-0 font-mono text-slate-400">&gt;</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// 4. Executive Centered Layout
function ExecutiveLayout({ cv, theme }: { cv: CVData; theme: CVTheme }) {
  const contactItems = [cv.email, cv.phone, cv.location, cv.website, cv.linkedin].filter(
    Boolean
  );
  const hasSummary = Boolean(cv.summary?.trim());
  const hasSkills = Boolean(cv.skills && cv.skills.length > 0);
  const hasExperience = Boolean(cv.experience?.trim());

  return (
    <div className="px-14 py-12 text-center">
      <header>
        <h1 className="text-[32px] font-extrabold tracking-tight" style={{ color: theme.primary }}>
          {cv.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-[14px] font-semibold tracking-wider uppercase" style={{ color: theme.primary }}>
          {cv.profession || "Professional Title"}
        </p>
        {contactItems.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#4b5563]">
            {contactItems.map((item, i) => (
              <span key={item}>
                {i > 0 && <span className="mr-4 text-slate-300">|</span>}
                {item}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="my-6 border-t-2" style={{ borderColor: theme.primary }} />

      <div className="space-y-6 text-left">
        {hasSummary && (
          <section>
            <div className="mb-2 text-center">
              <h2 className="inline-block border-b-2 px-4 pb-1 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary, borderColor: theme.primary }}>
                Executive Profile
              </h2>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[#374151] text-justify">
              {cv.summary}
            </p>
          </section>
        )}

        {hasExperience && (
          <section>
            <div className="mb-2 text-center">
              <h2 className="inline-block border-b-2 px-4 pb-1 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary, borderColor: theme.primary }}>
                Key Experience & Accomplishments
              </h2>
            </div>
            <ul className="mt-2 space-y-1.5">
              {bullets(cv.experience).map((line, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-snug text-[#374151]">
                  <span className="shrink-0 font-bold" style={{ color: theme.primary }}>▪</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasSkills && (
          <section>
            <div className="mb-2 text-center">
              <h2 className="inline-block border-b-2 px-4 pb-1 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary, borderColor: theme.primary }}>
                Core Competencies
              </h2>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {cv.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full px-3 py-1 text-[10.5px] font-semibold border"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// 5. Compact Dense Layout
function CompactLayout({ cv, theme }: { cv: CVData; theme: CVTheme }) {
  const contactItems = [cv.email, cv.phone, cv.location, cv.website, cv.linkedin].filter(
    Boolean
  );
  const hasSummary = Boolean(cv.summary?.trim());
  const hasSkills = Boolean(cv.skills && cv.skills.length > 0);
  const hasExperience = Boolean(cv.experience?.trim());

  return (
    <div className="px-8 py-8 text-[10.5px] leading-tight">
      <header className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.primary }}>
        <div>
          <h1 className="text-[24px] font-bold" style={{ color: theme.primary }}>
            {cv.fullName || "Your Name"}
          </h1>
          <p className="text-[12px] font-medium text-slate-700">
            {cv.profession || "Professional Title"}
          </p>
        </div>
        <div className="text-right text-[10px] text-slate-600 space-y-0.5">
          {contactItems.map((c) => (
            <div key={c}>{c}</div>
          ))}
        </div>
      </header>

      <div className="mt-4 space-y-4">
        {hasSummary && (
          <section>
            <h3 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: theme.primary }}>
              Summary
            </h3>
            <p className="mt-1 text-slate-700 leading-snug">{cv.summary}</p>
          </section>
        )}

        {hasSkills && (
          <section>
            <h3 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: theme.primary }}>
              Skills & Expertise
            </h3>
            <p className="mt-1 text-slate-800 font-medium">
              {cv.skills.join(" • ")}
            </p>
          </section>
        )}

        {hasExperience && (
          <section>
            <h3 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: theme.primary }}>
              Experience & Projects
            </h3>
            <ul className="mt-1 space-y-1">
              {bullets(cv.experience).map((line, i) => (
                <li key={i} className="flex gap-1.5 text-slate-700">
                  <span style={{ color: theme.primary }}>–</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default function CVTemplate({
  cv,
  theme,
  layout = "classic",
  fontStyle = "inter",
}: {
  cv: CVData;
  theme: CVTheme;
  layout?: LayoutId | string;
  fontStyle?: FontStyleId | string;
}) {
  const fontPreset =
    FONT_PRESETS.find((f) => f.id === fontStyle) ??
    FONT_PRESETS.find((f) => f.id === "inter") ??
    FONT_PRESETS[0];

  const layoutId = (layout || "classic").replace("-", "_") as LayoutId;

  return (
    <div
      dir="ltr"
      lang="en"
      className="relative mx-auto text-left text-[#1f2937] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]"
      style={{
        width: 794,
        minHeight: 1123,
        backgroundColor: theme.background,
        fontFamily: fontPreset.fontFamily,
      }}
    >
      {layoutId === "modern_split" && <ModernSplitLayout cv={cv} theme={theme} />}
      {layoutId === "minimal" && <MinimalLayout cv={cv} theme={theme} />}
      {layoutId === "executive" && <ExecutiveLayout cv={cv} theme={theme} />}
      {layoutId === "compact" && <CompactLayout cv={cv} theme={theme} />}
      {(layoutId === "classic" ||
        (!["modern_split", "minimal", "executive", "compact"].includes(layoutId))) && (
        <ClassicLayout cv={cv} theme={theme} />
      )}
    </div>
  );
}
