import {
  extractDateRange,
  extractEmail,
  extractHeadline,
  extractName,
  extractPhone,
  isNegative,
  isPositive,
  mergeCertification,
  mergeEducation,
  mergeExperience,
  mergeProject,
  normalizeDescription,
  parseSkills,
  uid,
} from "./cv";
import { createEmptyCV } from "./cv";
import type {
  CVData,
  Certification,
  ChatMessage,
  Education,
  Experience,
  PersonalInfo,
  Project,
  Skill,
} from "./types";

export type StepId =
  | "name"
  | "headline"
  | "email"
  | "phone"
  | "location"
  | "summary"
  | "skills"
  | "exp_company"
  | "exp_role"
  | "exp_location"
  | "exp_dates"
  | "exp_desc"
  | "exp_more"
  | "edu_school"
  | "edu_degree"
  | "edu_field"
  | "edu_dates"
  | "edu_more"
  | "proj_name"
  | "proj_desc"
  | "proj_tech"
  | "proj_more"
  | "cert_name"
  | "cert_issuer"
  | "cert_year"
  | "cert_more"
  | "done";

export interface AgentState {
  step: StepId;
  experienceDraft: Partial<Experience>;
  educationDraft: Partial<Education>;
  projectDraft: Partial<Project>;
  certDraft: Partial<Certification>;
}

export interface AgentResult {
  state: AgentState;
  cv: CVData;
  messages: ChatMessage[];
  done: boolean;
}

export interface AgentReply {
  messages: ChatMessage[];
  done: boolean;
}

export function createInitialState(): AgentState {
  return {
    step: "name",
    experienceDraft: {},
    educationDraft: {},
    projectDraft: {},
    certDraft: {},
  };
}

export function getGreeting(): ChatMessage {
  return {
    id: uid("msg"),
    role: "assistant",
    content:
      "Hi! I'm your AI CV agent 👋 I'll guide you step by step to build a professional, ATS-friendly CV. We'll cover your contact details, summary, skills, work experience, education, projects and certifications. The live preview on the right updates in real time as we go. Let's start — what's your full name?",
  };
}

const SKIP_HINT = "Tip: you can type \"skip\" to move past any question.";

function assistant(content: string, suggestions?: string[]): ChatMessage {
  return {
    id: uid("msg"),
    role: "assistant",
    content,
    suggestions,
  };
}

function user(content: string): ChatMessage {
  return { id: uid("msg"), role: "user", content };
}

function nextStep(
  step: StepId,
  draft:
    | Partial<Experience>
    | Partial<Education>
    | Partial<Project>
    | Partial<Certification>
): AgentState {
  return {
    step,
    experienceDraft:
      step.startsWith("exp_") ? (draft as Partial<Experience>) : {},
    educationDraft:
      step.startsWith("edu_") ? (draft as Partial<Education>) : {},
    projectDraft:
      step.startsWith("proj_") ? (draft as Partial<Project>) : {},
    certDraft: step.startsWith("cert_") ? (draft as Partial<Certification>) : {},
  };
}

function isCompleteEnough(personal: PersonalInfo): boolean {
  return personal.fullName.trim().length > 0;
}

export function processUserMessage(
  prev: AgentState,
  cv: CVData,
  input: string
): AgentResult {
  const text = input.trim();
  const out = {
    state: prev,
    cv: { ...cv },
    messages: [user(text)] as ChatMessage[],
    done: false,
  };

  const skip = isNegative(text);

  switch (prev.step) {
    case "name": {
      if (skip) {
        out.state = nextStep("headline", {});
        out.messages.push(
          assistant("No problem, we can add your name later. What's the target role you're aiming for?", [
            "Frontend Developer",
            "Product Manager",
            "Data Analyst",
          ])
        );
        break;
      }
      const name = extractName(text);
      if (!name) {
        out.messages.push(
          assistant("I didn't quite catch that. Could you tell me your full name?")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, fullName: name };
      out.messages.push(
        assistant(
          `Nice to meet you, ${name.split(" ")[0]}! What target role are you applying for, or what's your professional title?`,
          ["Frontend Developer", "Product Manager", "Data Analyst"]
        )
      );
      out.state = nextStep("headline", {});
      break;
    }

    case "headline": {
      if (skip) {
        out.state = nextStep("email", {});
        out.messages.push(
          assistant("Got it. What email address should I put on your CV?")
        );
        break;
      }
      const headline = extractHeadline(text);
      if (!headline) {
        out.messages.push(
          assistant("Could you rephrase that? For example: \"Frontend Engineer\" or \"Product Manager\".")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, headline };
      out.cv.targetRole = headline;
      out.messages.push(
        assistant(`Perfect — ${headline} it is. What email address should appear on your CV?`)
      );
      out.state = nextStep("email", {});
      break;
    }

    case "email": {
      const email = extractEmail(text);
      const phone = extractPhone(text);
      const nextCv = { ...out.cv };
      if (email) {
        nextCv.personal = { ...nextCv.personal, email };
      }
      if (phone) {
        nextCv.personal = { ...nextCv.personal, phone };
      }
      if (skip && !email && !phone) {
        out.cv = nextCv;
        out.state = nextStep("location", {});
        out.messages.push(
          assistant("That's fine, we can add contact details later. Where are you based? (city, country)")
        );
        break;
      }
      if (!email) {
        out.messages.push(
          assistant("I didn't spot an email address. Could you share it? (You can also include your phone number in the same message.)")
        );
        break;
      }
      out.cv = nextCv;
      if (phone) {
        out.state = nextStep("location", {});
        out.messages.push(
          assistant("Got your email and phone number. Where are you based? (city, country)")
        );
      } else {
        out.state = nextStep("phone", {});
        out.messages.push(
          assistant("Got your email. What's the best phone number to reach you at?")
        );
      }
      break;
    }

    case "phone": {
      const phone = extractPhone(text);
      if (skip) {
        out.state = nextStep("location", {});
        out.messages.push(
          assistant("No problem. Where are you based? (city, country)")
        );
        break;
      }
      if (!phone) {
        out.messages.push(
          assistant("I couldn't find a phone number in that. Could you share it, e.g. +1 555 123 4567?")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, phone };
      out.state = nextStep("location", {});
      out.messages.push(
        assistant("Thanks! Where are you based? (city, country)")
      );
      break;
    }

    case "location": {
      if (skip) {
        out.state = nextStep("summary", {});
        out.messages.push(
          assistant("Okay. Tell me a bit about yourself — write a short professional summary (2-4 sentences) describing who you are and what you bring to the table.")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, location: normalizeDescription(text) };
      out.state = nextStep("summary", {});
      out.messages.push(
        assistant("Got it. Now a short professional summary: who are you and what makes you great at your job? 2-4 sentences is perfect.")
      );
      break;
    }

    case "summary": {
      if (skip) {
        out.state = nextStep("skills", {});
        out.messages.push(
          assistant("Fine, we'll skip the summary. Let's move to skills — list your key skills separated by commas.", [
            "JavaScript, React, TypeScript, Git",
            "Excel, SQL, Tableau, Communication",
          ])
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, summary: normalizeDescription(text) };
      out.state = nextStep("skills", {});
      out.messages.push(
        assistant("Great summary! Now list your key skills, separated by commas.", [
          "JavaScript, React, TypeScript, Git",
          "Excel, SQL, Tableau, Communication",
        ])
      );
      break;
    }

    case "skills": {
      if (skip) {
        out.state = nextStep("exp_company", {});
        out.messages.push(
          assistant("Okay, we'll skip skills for now. Let's talk about work experience — where's the most recent company you worked for?")
        );
        break;
      }
      const skills: Skill[] = parseSkills(text);
      if (skills.length === 0) {
        out.messages.push(
          assistant("I didn't find any skills there. Try listing them like: \"JavaScript, React, Git\".")
        );
        break;
      }
      out.cv.skills = skills;
      out.state = nextStep("exp_company", {});
      out.messages.push(
        assistant(
          `Nice set of skills: ${skills.map((s) => s.name).join(", ")}. Now let's add your work experience. What's the name of your most recent employer?`,
          []
        )
      );
      break;
    }

    case "exp_company": {
      if (skip) {
        out.state = nextStep("edu_school", {});
        out.messages.push(
          assistant("Alright, we'll skip work experience. Now let's talk education — what school or university did you attend?")
        );
        break;
      }
      const company = text
        .replace(/^(i (?:worked|was employed)(?: for| at)|at|with|in)\s+/i, "")
        .replace(/[.,;!]+$/, "")
        .trim();
      if (!company) {
        out.messages.push(
          assistant("Could you tell me the company name?")
        );
        break;
      }
      const draft: Partial<Experience> = { company };
      out.state = nextStep("exp_role", draft);
      out.messages.push(
        assistant(`Great. What was your job title at ${company}?`)
      );
      break;
    }

    case "exp_role": {
      if (skip) {
        out.state = nextStep("exp_dates", prev.experienceDraft);
        out.messages.push(
          assistant("Okay. When did you work there? (e.g. \"Jan 2021 to Present\" or \"2020 - 2022\")")
        );
        break;
      }
      const role = text
        .replace(/^(i (?:was|worked) (?:as|a|an)|role|title|position|as)\s+/i, "")
        .replace(/[.,;!]+$/, "")
        .trim();
      if (!role) {
        out.messages.push(
          assistant("What was your job title there?")
        );
        break;
      }
      const draft: Partial<Experience> = { ...prev.experienceDraft, role };
      out.state = nextStep("exp_dates", draft);
      out.messages.push(
        assistant(`Nice, ${role}. When did you start and end there? (e.g. "Jan 2021 to Present" or "2020 - 2022")`)
      );
      break;
    }

    case "exp_dates": {
      const { startDate, endDate } = extractDateRange(text);
      if (!startDate) {
        if (skip) {
          const draft: Partial<Experience> = { ...prev.experienceDraft };
          out.state = nextStep("exp_desc", draft);
          out.messages.push(
            assistant("Okay. What were your main responsibilities or achievements in this role?")
          );
          break;
        }
        out.messages.push(
          assistant("I couldn't parse those dates. Try something like \"March 2020 - June 2023\" or \"2021 to Present\".")
        );
        break;
      }
      const draft: Partial<Experience> = { ...prev.experienceDraft, startDate, endDate };
      out.state = nextStep("exp_desc", draft);
      out.messages.push(
        assistant(
          endDate
            ? `Got it (${startDate} → ${endDate}). What were your main responsibilities or achievements there?`
            : `Got it (from ${startDate}). What were your main responsibilities or achievements there?`
        )
      );
      break;
    }

    case "exp_desc": {
      const description = normalizeDescription(text);
      if (!description && !skip) {
        out.messages.push(
          assistant("Could you describe a bit what you did in that role? Even one or two achievements help.")
        );
        break;
      }
      const experience = mergeExperience({
        ...prev.experienceDraft,
        description,
      });
      out.cv.experience = [...out.cv.experience, experience];
      const label = experience.role || experience.company || "this position";
      out.state = nextStep("exp_more", {});
      out.messages.push(
        assistant(
          `Added ${label} to your CV. Would you like to add another work position?`,
          ["Yes", "No, that's all"]
        )
      );
      break;
    }

    case "exp_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("exp_company", {});
        out.messages.push(
          assistant("Great — tell me the next company you worked at.")
        );
      } else {
        out.state = nextStep("edu_school", {});
        out.messages.push(
          assistant("Perfect. Let's cover education — what school or university did you attend?")
        );
      }
      break;
    }

    case "edu_school": {
      if (skip) {
        out.state = nextStep("proj_name", {});
        out.messages.push(
          assistant("Alright. Do you have any projects you'd like to feature? What's the first one called?")
        );
        break;
      }
      const institution = text
        .replace(/^(i (?:attended|went to|studied at)|at|the)\s+/i, "")
        .replace(/[.,;!]+$/, "")
        .trim();
      if (!institution) {
        out.messages.push(
          assistant("Which school or university did you attend?")
        );
        break;
      }
      const draft: Partial<Education> = { institution };
      out.state = nextStep("edu_degree", draft);
      out.messages.push(
        assistant(`Great. What degree or diploma did you earn at ${institution}?`)
      );
      break;
    }

    case "edu_degree": {
      if (skip) {
        out.state = nextStep("edu_dates", prev.educationDraft);
        out.messages.push(
          assistant("Okay. When did you study there?")
        );
        break;
      }
      const degree = text
        .replace(/^(i (?:studied|majored in|earned|got|have|hold))\s+/i, "")
        .replace(/[.,;!]+$/, "")
        .trim();
      if (!degree) {
        out.messages.push(
          assistant("What degree did you earn? For example \"BSc Computer Science\".")
        );
        break;
      }
      const draft: Partial<Education> = { ...prev.educationDraft, degree };
      out.state = nextStep("edu_dates", draft);
      out.messages.push(
        assistant(`Nice. When did you study there? (e.g. "2016 - 2020")`)
      );
      break;
    }

    case "edu_dates": {
      const { startDate, endDate } = extractDateRange(text);
      if (!startDate) {
        if (skip) {
          const education = mergeEducation({ ...prev.educationDraft });
          out.cv.education = [...out.cv.education, education];
          out.state = nextStep("edu_more", {});
          out.messages.push(
            assistant(
              education.degree
                ? `Added your ${education.degree}. Would you like to add another qualification?`
                : "Added your education entry. Would you like to add another one?",
              ["Yes", "No, that's all"]
            )
          );
          break;
        }
        out.messages.push(
          assistant("I couldn't parse those dates. Try something like \"2016 - 2020\" or \"September 2015 to May 2019\".")
        );
        break;
      }
      const education = mergeEducation({
        ...prev.educationDraft,
        startDate,
        endDate,
      });
      out.cv.education = [...out.cv.education, education];
      out.state = nextStep("edu_more", {});
      out.messages.push(
        assistant(
          education.degree
            ? `Added your ${education.degree}${endDate ? ` (${startDate} - ${endDate})` : ""}. Would you like to add another qualification?`
            : "Added your education entry. Would you like to add another one?",
          ["Yes", "No, that's all"]
        )
      );
      break;
    }

    case "edu_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("edu_school", {});
        out.messages.push(
          assistant("Great — which school or university next?")
        );
      } else {
        out.state = nextStep("proj_name", {});
        out.messages.push(
          assistant("Now let's talk projects. Do you have any standout projects to feature? What's the first one called?")
        );
      }
      break;
    }

    case "proj_name": {
      if (skip) {
        out.state = nextStep("cert_name", {});
        out.messages.push(
          assistant("No problem. Do you have any certifications or courses to add? What's the first one?")
        );
        break;
      }
      const name = text
        .replace(/^(i (?:built|made|created|worked on)|project(?:\s+name)?\s*:?\s*)\s*/i, "")
        .replace(/[.,;!]+$/, "")
        .trim();
      if (!name) {
        out.messages.push(
          assistant("What's the name of the project?")
        );
        break;
      }
      const draft: Partial<Project> = { name };
      out.state = nextStep("proj_desc", draft);
      out.messages.push(
        assistant(`Tell me a little about "${name}" — what does it do?`)
      );
      break;
    }

    case "proj_desc": {
      if (skip) {
        out.state = nextStep("proj_tech", prev.projectDraft);
        out.messages.push(
          assistant("Okay. What technologies or tools did you use?")
        );
        break;
      }
      const description = normalizeDescription(text);
      if (!description) {
        out.messages.push(
          assistant("Could you describe the project a bit?")
        );
        break;
      }
      const draft: Partial<Project> = { ...prev.projectDraft, description };
      out.state = nextStep("proj_tech", draft);
      out.messages.push(
        assistant("Nice. What technologies or tools did you use on it?")
      );
      break;
    }

    case "proj_tech": {
      const project = mergeProject({
        ...prev.projectDraft,
        technologies: skip ? "" : normalizeDescription(text),
      });
      out.cv.projects = [...out.cv.projects, project];
      out.state = nextStep("proj_more", {});
      out.messages.push(
        assistant(
          `Added "${project.name}" to your projects. Want to add another project?`,
          ["Yes", "No, that's all"]
        )
      );
      break;
    }

    case "proj_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("proj_name", {});
        out.messages.push(
          assistant("What's the next project called?")
        );
      } else {
        out.state = nextStep("cert_name", {});
        out.messages.push(
          assistant("Let's add any certifications or courses. What's the first one?")
        );
      }
      break;
    }

    case "cert_name": {
      if (skip) {
        out.state = nextStep("done", {});
        finishAgent(out);
        break;
      }
      const name = text
        .replace(/^(i (?:have|hold|earned|got)|certification)\s*:?\s*/i, "")
        .replace(/[.,;!]+$/, "")
        .trim();
      if (!name) {
        out.messages.push(
          assistant("What's the name of the certification?")
        );
        break;
      }
      const draft: Partial<Certification> = { name };
      out.state = nextStep("cert_issuer", draft);
      out.messages.push(
        assistant(`Who issued "${name}"? (You can also type "skip".)`)
      );
      break;
    }

    case "cert_issuer": {
      const issuer = skip ? "" : normalizeDescription(text);
      const draft: Partial<Certification> = { ...prev.certDraft, issuer };
      out.state = nextStep("cert_year", draft);
      out.messages.push(
        assistant("What year did you earn it?")
      );
      break;
    }

    case "cert_year": {
      const year = text.trim().match(/\b(19|20)\d{2}\b/);
      const certification = mergeCertification({
        ...prev.certDraft,
        year: skip || !year ? "" : year[0],
      });
      out.cv.certifications = [...out.cv.certifications, certification];
      out.state = nextStep("cert_more", {});
      out.messages.push(
        assistant(
          `Added ${certification.name}. Would you like to add another certification?`,
          ["Yes", "No, that's all"]
        )
      );
      break;
    }

    case "cert_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("cert_name", {});
        out.messages.push(
          assistant("What's the next certification?")
        );
      } else {
        out.state = nextStep("done", {});
        finishAgent(out);
      }
      break;
    }

    case "done": {
      out.messages.push(
        assistant("Your CV is looking great! You can keep refining it, or hit the **Download PDF** button in the preview pane to export it. Anything else you'd like to change?")
      );
      out.done = true;
      break;
    }
  }

  return out;
}

function finishAgent(out: AgentResult) {
  out.done = true;
  const count = out.cv.experience.length + out.cv.education.length + out.cv.projects.length + out.cv.skills.length;
  out.messages.push(
    assistant(
      `That's everything I need! I've drafted ${count} entries for your CV. Take a look at the live preview on the right — when you're happy, click "Download PDF" to export it. You can also reply any time to tweak details.${count === 0 ? ` ${SKIP_HINT}` : ""}`
    )
  );
}

export function getInitialCV(): CVData {
  return createEmptyCV();
}

export function isCVUsable(cv: CVData): boolean {
  return isCompleteEnough(cv.personal);
}
