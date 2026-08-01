import type {
  Certification,
  CVData,
  Education,
  Experience,
  Project,
  Skill,
} from "@/lib/types";

function bullets(description: string): string[] {
  return description
    .split(/\n|•/)
    .map((s) => s.trim().replace(/^[-–—]\s*/, ""))
    .filter(Boolean);
}

function ContactRow({ cv }: { cv: CVData }) {
  const items = [
    cv.personal.email,
    cv.personal.phone,
    cv.personal.location,
    cv.personal.website,
    cv.personal.linkedin,
  ].filter(Boolean);

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 border-b-2 border-[#111827] pb-1">
      <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#111827]">
        {children}
      </h2>
    </div>
  );
}

function ExperienceBlock({ item }: { item: Experience }) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-[#111827]">
            {item.role || item.company}
          </p>
          {(item.company || item.location) && (
            <p className="text-[11px] font-medium text-[#374151]">
              {item.company}
              {item.company && item.location ? " — " : ""}
              {item.location}
            </p>
          )}
        </div>
        {(item.startDate || item.endDate) && (
          <p className="shrink-0 text-[11px] text-[#4b5563]">
            {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
          </p>
        )}
      </div>
      {item.description && (
        <ul className="mt-1 space-y-0.5">
          {bullets(item.description).map((line, i) => (
            <li
              key={i}
              className="flex gap-1.5 text-[11px] leading-snug text-[#374151]"
            >
              <span className="shrink-0 text-[#9ca3af]">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationBlock({ item }: { item: Education }) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-[#111827]">
            {item.degree || item.institution}
          </p>
          {item.institution && (
            <p className="text-[11px] font-medium text-[#374151]">
              {item.institution}
              {item.field ? ` — ${item.field}` : ""}
            </p>
          )}
        </div>
        {(item.startDate || item.endDate) && (
          <p className="shrink-0 text-[11px] text-[#4b5563]">
            {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
          </p>
        )}
      </div>
      {item.description && (
        <p className="mt-1 text-[11px] leading-snug text-[#374151]">
          {item.description}
        </p>
      )}
    </div>
  );
}

function ProjectBlock({ item }: { item: Project }) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] font-bold text-[#111827]">{item.name}</p>
        {item.technologies && (
          <p className="shrink-0 text-[11px] text-[#4b5563]">
            {item.technologies}
          </p>
        )}
      </div>
      {item.description && (
        <ul className="mt-1 space-y-0.5">
          {bullets(item.description).map((line, i) => (
            <li
              key={i}
              className="flex gap-1.5 text-[11px] leading-snug text-[#374151]"
            >
              <span className="shrink-0 text-[#9ca3af]">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
      {item.link && (
        <p className="mt-0.5 text-[11px] text-[#2563eb]">{item.link}</p>
      )}
    </div>
  );
}

function CertBlock({ item }: { item: Certification }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <p className="text-[11px] font-medium text-[#111827]">{item.name}</p>
      <p className="shrink-0 text-[11px] text-[#4b5563]">
        {[item.issuer, item.year].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}

function SkillsGrid({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill.id}
          className="inline-flex items-center rounded-sm border border-[#d1d5db] px-2 py-0.5 text-[11px] text-[#1f2937]"
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
}

export default function CVTemplate({ cv }: { cv: CVData }) {
  const hasExperience = cv.experience.length > 0;
  const hasEducation = cv.education.length > 0;
  const hasProjects = cv.projects.length > 0;
  const hasSkills = cv.skills.length > 0;
  const hasCerts = cv.certifications.length > 0;
  const isEmpty = !cv.personal.fullName && !hasExperience && !hasEducation && !hasSkills;

  const placeholders = [
    !cv.personal.fullName && "Your name",
    !cv.personal.headline && "Professional title",
    !cv.personal.summary && "A short professional summary",
    !hasExperience && "Work experience",
    !hasEducation && "Education",
    !hasSkills && "Skills",
    !hasProjects && "Projects",
    !hasCerts && "Certifications",
  ].filter(Boolean);

  return (
    <div
      className="relative mx-auto bg-[#ffffff] text-left text-[#1f2937] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]"
      style={{ width: 794, minHeight: 1123 }}
    >
      <div className="px-9 py-10">
        <header className="text-center">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#111827]">
            {cv.personal.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[#2563eb]">
            {cv.personal.headline || cv.targetRole}
          </p>
          <ContactRow cv={cv} />
        </header>

        <div className="mt-6 space-y-5">
          {(cv.personal.summary || isEmpty) && (
            <section>
              <SectionTitle>Summary</SectionTitle>
              {cv.personal.summary ? (
                <p className="text-[11.5px] leading-relaxed text-[#374151]">
                  {cv.personal.summary}
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
              <SectionTitle>Work Experience</SectionTitle>
              {cv.experience.map((item) => (
                <ExperienceBlock key={item.id} item={item} />
              ))}
            </section>
          )}

          {hasEducation && (
            <section>
              <SectionTitle>Education</SectionTitle>
              {cv.education.map((item) => (
                <EducationBlock key={item.id} item={item} />
              ))}
            </section>
          )}

          {hasSkills && (
            <section>
              <SectionTitle>Skills</SectionTitle>
              <SkillsGrid skills={cv.skills} />
            </section>
          )}

          {hasProjects && (
            <section>
              <SectionTitle>Projects</SectionTitle>
              {cv.projects.map((item) => (
                <ProjectBlock key={item.id} item={item} />
              ))}
            </section>
          )}

          {hasCerts && (
            <section>
              <SectionTitle>Certifications</SectionTitle>
              {cv.certifications.map((item) => (
                <CertBlock key={item.id} item={item} />
              ))}
            </section>
          )}

          {isEmpty && placeholders.length > 0 && (
            <section className="rounded border border-dashed border-[#d1d5db] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                Your CV will be built here in real time
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
