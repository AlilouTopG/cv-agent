import type { CVData } from "@/lib/types";
import type { CVTheme } from "@/lib/themes";

function bullets(text: string): string[] {
  return text
    .split(/\n|•/)
    .map((s) => s.trim().replace(/^[-–—]\s*/, ""))
    .filter(Boolean);
}

function SectionTitle({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: CVTheme;
}) {
  return (
    <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.primary }}>
      <h2
        className="text-[13px] font-bold uppercase tracking-[0.14em]"
        style={{ color: theme.primary }}
      >
        {children}
      </h2>
    </div>
  );
}

function ContactRow({ cv }: { cv: CVData }) {
  const items = [cv.email, cv.phone, cv.location, cv.website, cv.linkedin].filter(
    Boolean
  );

  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-[#4b5563]">
      {items.map((item, index) => (
        <span key={item} className="inline-flex items-center">
          {index > 0 && <span className="mr-2 text-[#9ca3af]">•</span>}
          {item}
        </span>
      ))}
    </div>
  );
}

export default function CVTemplate({
  cv,
  theme,
}: {
  cv: CVData;
  theme: CVTheme;
}) {
  const hasSummary = cv.summary.trim().length > 0;
  const hasExperience = cv.experience.trim().length > 0;
  const hasSkills = cv.skills.length > 0;
  const isEmpty =
    !cv.fullName.trim() &&
    !cv.profession.trim() &&
    !hasSummary &&
    !hasExperience &&
    !hasSkills;

  const placeholders = [
    !cv.fullName.trim() && "Your name",
    !cv.profession.trim() && "Professional title",
    !hasSummary && "Professional summary",
    !hasExperience && "Work experience",
    !hasSkills && "Skills",
  ].filter(Boolean);

  return (
    <div
      dir="ltr"
      lang="en"
      className="relative mx-auto text-left text-[#1f2937] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]"
      style={{ width: 794, minHeight: 1123, backgroundColor: theme.background }}
    >
      <div className="px-9 py-10">
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
          <ContactRow cv={cv} />
        </header>

        <div className="mt-6 space-y-5">
          {(hasSummary || isEmpty) && (
            <section>
              <SectionTitle theme={theme}>Summary</SectionTitle>
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
              <SectionTitle theme={theme}>Work Experience</SectionTitle>
              <ul className="space-y-0.5">
                {bullets(cv.experience).map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[11px] leading-snug text-[#374151]"
                  >
                    <span className="shrink-0 text-[#9ca3af]">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasSkills && (
            <section>
              <SectionTitle theme={theme}>Skills</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px]"
                    style={{ borderColor: theme.primary, color: theme.primary }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {isEmpty && placeholders.length > 0 && (
            <section className="rounded border border-dashed border-[#d1d5db] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                Your CV will be built here instantly
              </p>
              <p className="mt-1 text-[11px] text-[#9ca3af]">
                {placeholders.join(" · ")}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
