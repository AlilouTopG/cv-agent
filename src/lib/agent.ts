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
      "مرحباً! أنا وكيل السيرة الذاتية الذكي 👋 سأرشدك خطوة بخطوة لبناء سيرة ذاتية احترافية متوافقة مع أنظمة التوظيف. سنغطي بيانات التواصل، الملخص، المهارات، الخبرة العملية، التعليم، المشاريع والشهادات. سترى المعاينة الحية تتحدث لحظياً أثناء تقدمنا. لنبدأ — ما اسمك الكامل؟",
  };
}

const SKIP_HINT = "تلميح: يمكنك كتابة \"تخطي\" لتجاوز أي سؤال.";

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
          assistant(
            "لا مشكلة، يمكننا إضافة اسمك لاحقاً. ما الوظيفة المستهدفة التي تسعى إليها؟",
            ["مطوّر واجهات أمامية", "مدير منتج", "محلل بيانات"]
          )
        );
        break;
      }
      const name = extractName(text);
      if (!name) {
        out.messages.push(
          assistant("لم أستطع فهم ذلك. هل يمكنك إخباري باسمك الكامل؟")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, fullName: name };
      out.messages.push(
        assistant(
          `تشرفت بمعرفتك يا ${name.split(" ")[0]}! ما الوظيفة التي تستهدفها أو ما هو مسمّاك المهني؟`,
          ["مطوّر واجهات أمامية", "مدير منتج", "محلل بيانات"]
        )
      );
      out.state = nextStep("headline", {});
      break;
    }

    case "headline": {
      if (skip) {
        out.state = nextStep("email", {});
        out.messages.push(
          assistant("تمام. ما البريد الإلكتروني الذي ينبغي أن يظهر في سيرتك الذاتية؟")
        );
        break;
      }
      const headline = extractHeadline(text);
      if (!headline) {
        out.messages.push(
          assistant(
            "هل يمكنك إعادة الصياغة؟ مثلاً: \"مطوّر واجهات أمامية\" أو \"مدير منتج\"."
          )
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, headline };
      out.cv.targetRole = headline;
      out.messages.push(
        assistant(
          `ممتاز — ${headline} إذاً. ما البريد الإلكتروني الذي ينبغي أن يظهر في سيرتك الذاتية؟`
        )
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
          assistant("لا بأس، يمكننا إضافة بيانات التواصل لاحقاً. أين مكان إقامتك؟ (المدينة، الدولة)")
        );
        break;
      }
      if (!email) {
        out.messages.push(
          assistant("لم أجد عنوان بريد إلكتروني. هل يمكنك مشاركته؟ (يمكنك أيضاً إضافة رقم هاتفك في نفس الرسالة)")
        );
        break;
      }
      out.cv = nextCv;
      if (phone) {
        out.state = nextStep("location", {});
        out.messages.push(
          assistant("حصلت على بريدك الإلكتروني ورقم هاتفك. أين مكان إقامتك؟ (المدينة، الدولة)")
        );
      } else {
        out.state = nextStep("phone", {});
        out.messages.push(
          assistant("حصلت على بريدك الإلكتروني. ما أفضل رقم هاتف للتواصل معك؟")
        );
      }
      break;
    }

    case "phone": {
      const phone = extractPhone(text);
      if (skip) {
        out.state = nextStep("location", {});
        out.messages.push(
          assistant("لا مشكلة. أين مكان إقامتك؟ (المدينة، الدولة)")
        );
        break;
      }
      if (!phone) {
        out.messages.push(
          assistant("لم أتمكن من العثور على رقم هاتف. هل يمكنك مشاركته، مثلاً +1 555 123 4567؟")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, phone };
      out.state = nextStep("location", {});
      out.messages.push(assistant("شكراً! أين مكان إقامتك؟ (المدينة، الدولة)"));
      break;
    }

    case "location": {
      if (skip) {
        out.state = nextStep("summary", {});
        out.messages.push(
          assistant("حسناً. أخبرني قليلاً عن نفسك — اكتب ملخصاً مهنياً قصيراً (من 2 إلى 4 جمل) يصف من أنت وما الذي تميّز به.")
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, location: normalizeDescription(text) };
      out.state = nextStep("summary", {});
      out.messages.push(
        assistant("تمام. الآن ملخص مهني قصير: من أنت وما الذي يجعلك مميزاً في عملك؟ جملتان إلى أربع كافٍ.")
      );
      break;
    }

    case "summary": {
      if (skip) {
        out.state = nextStep("skills", {});
        out.messages.push(
          assistant("حسناً، سنتخطى الملخص. لننتقل إلى المهارات — اذكر مهاراتك الأساسية مفصولة بفواصل.", [
            "JavaScript, React, TypeScript, Git",
            "Excel, SQL, Tableau, التواصل",
          ])
        );
        break;
      }
      out.cv.personal = { ...out.cv.personal, summary: normalizeDescription(text) };
      out.state = nextStep("skills", {});
      out.messages.push(
        assistant("ملخص رائع! الآن اذكر مهاراتك الأساسية مفصولة بفواصل.", [
          "JavaScript, React, TypeScript, Git",
          "Excel, SQL, Tableau, التواصل",
        ])
      );
      break;
    }

    case "skills": {
      if (skip) {
        out.state = nextStep("exp_company", {});
        out.messages.push(
          assistant("حسناً، سنتخطى المهارات حالياً. لنتحدث عن الخبرة العملية — ما آخر شركة عملت فيها؟")
        );
        break;
      }
      const skills: Skill[] = parseSkills(text);
      if (skills.length === 0) {
        out.messages.push(
          assistant("لم أجد أي مهارات في هذه الرسالة. جرّب كتابتها هكذا: \"JavaScript, React, Git\".")
        );
        break;
      }
      out.cv.skills = skills;
      out.state = nextStep("exp_company", {});
      out.messages.push(
        assistant(
          `مجموعة مهارات رائعة: ${skills.map((s) => s.name).join("، ")}. الآن لِنضِف خبرتك العملية. ما اسم آخر جهة عمل لك؟`,
          []
        )
      );
      break;
    }

    case "exp_company": {
      if (skip) {
        out.state = nextStep("edu_school", {});
        out.messages.push(
          assistant("حسناً، سنتخطى الخبرة العملية. لنتحدث عن التعليم — ما المدرسة أو الجامعة التي التحقت بها؟")
        );
        break;
      }
      const company = text
        .replace(/^(i (?:worked|was employed)(?: for| at)|at|with|in)\s+/i, "")
        .replace(/[.,;!،؟]+$/, "")
        .trim();
      if (!company) {
        out.messages.push(assistant("هل يمكنك إخباري باسم الشركة؟"));
        break;
      }
      const draft: Partial<Experience> = { company };
      out.state = nextStep("exp_role", draft);
      out.messages.push(assistant(`رائع. ما مسمّاك الوظيفي في ${company}؟`));
      break;
    }

    case "exp_role": {
      if (skip) {
        out.state = nextStep("exp_dates", prev.experienceDraft);
        out.messages.push(
          assistant("حسناً. متى عملت هناك؟ (مثلاً \"يناير 2021 إلى الآن\" أو \"2020 - 2022\")")
        );
        break;
      }
      const role = text
        .replace(/^(i (?:was|worked) (?:as|a|an)|role|title|position|as)\s+/i, "")
        .replace(/[.,;!،؟]+$/, "")
        .trim();
      if (!role) {
        out.messages.push(assistant("ما مسمّاك الوظيفي هناك؟"));
        break;
      }
      const draft: Partial<Experience> = { ...prev.experienceDraft, role };
      out.state = nextStep("exp_dates", draft);
      out.messages.push(
        assistant(`جميل، ${role}. متى بدأت وانتهيت هناك؟ (مثلاً "يناير 2021 إلى الآن" أو "2020 - 2022")`)
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
            assistant("حسناً. ما مسؤولياتك أو إنجازاتك الرئيسية في هذا الدور؟")
          );
          break;
        }
        out.messages.push(
          assistant("لم أتمكن من تحليل هذه التواريخ. جرّب شيئاً مثل \"مارس 2020 - يونيو 2023\" أو \"2021 إلى الآن\".")
        );
        break;
      }
      const draft: Partial<Experience> = { ...prev.experienceDraft, startDate, endDate };
      out.state = nextStep("exp_desc", draft);
      out.messages.push(
        assistant(
          endDate
            ? `تمام (${startDate} ← ${endDate}). ما مسؤولياتك أو إنجازاتك الرئيسية هناك؟`
            : `تمام (من ${startDate}). ما مسؤولياتك أو إنجازاتك الرئيسية هناك؟`
        )
      );
      break;
    }

    case "exp_desc": {
      const description = normalizeDescription(text);
      if (!description && !skip) {
        out.messages.push(
          assistant("هل يمكنك وصف ما قمت به في هذا الدور؟ حتى إنجاز واحد أو إنجازان يساعدان.")
        );
        break;
      }
      const experience = mergeExperience({
        ...prev.experienceDraft,
        description,
      });
      out.cv.experience = [...out.cv.experience, experience];
      const label = experience.role || experience.company || "هذه الوظيفة";
      out.state = nextStep("exp_more", {});
      out.messages.push(
        assistant(
          `تمت إضافة ${label} إلى سيرتك الذاتية. هل ترغب في إضافة وظيفة أخرى؟`,
          ["نعم", "لا، هذا كل شيء"]
        )
      );
      break;
    }

    case "exp_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("exp_company", {});
        out.messages.push(
          assistant("رائع — أخبرني بالشركة التالية التي عملت فيها.")
        );
      } else {
        out.state = nextStep("edu_school", {});
        out.messages.push(
          assistant("ممتاز. لنغطِ التعليم — ما المدرسة أو الجامعة التي التحقت بها؟")
        );
      }
      break;
    }

    case "edu_school": {
      if (skip) {
        out.state = nextStep("proj_name", {});
        out.messages.push(
          assistant("حسناً. هل لديك أي مشاريع ترغب في إبرازها؟ ما اسم المشروع الأول؟")
        );
        break;
      }
      const institution = text
        .replace(/^(i (?:attended|went to|studied at)|at|the)\s+/i, "")
        .replace(/[.,;!،؟]+$/, "")
        .trim();
      if (!institution) {
        out.messages.push(
          assistant("ما المدرسة أو الجامعة التي التحقت بها؟")
        );
        break;
      }
      const draft: Partial<Education> = { institution };
      out.state = nextStep("edu_degree", draft);
      out.messages.push(
        assistant(`رائع. ما الدرجة أو الشهادة التي حصلت عليها في ${institution}؟`)
      );
      break;
    }

    case "edu_degree": {
      if (skip) {
        out.state = nextStep("edu_dates", prev.educationDraft);
        out.messages.push(assistant("حسناً. متى درست هناك؟"));
        break;
      }
      const degree = text
        .replace(/^(i (?:studied|majored in|earned|got|have|hold))\s+/i, "")
        .replace(/[.,;!،؟]+$/, "")
        .trim();
      if (!degree) {
        out.messages.push(
          assistant("ما الدرجة التي حصلت عليها؟ مثلاً \"بكالوريوس علوم الحاسوب\".")
        );
        break;
      }
      const draft: Partial<Education> = { ...prev.educationDraft, degree };
      out.state = nextStep("edu_dates", draft);
      out.messages.push(
        assistant(`جميل. متى درست هناك؟ (مثلاً "2016 - 2020")`)
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
                ? `تمت إضافة مؤهلك ${education.degree}. هل ترغب في إضافة مؤهل آخر؟`
                : "تمت إضافة قيدك التعليمي. هل ترغب في إضافة مؤهل آخر؟",
              ["نعم", "لا، هذا كل شيء"]
            )
          );
          break;
        }
        out.messages.push(
          assistant("لم أتمكن من تحليل هذه التواريخ. جرّب شيئاً مثل \"2016 - 2020\" أو \"سبتمبر 2015 إلى مايو 2019\".")
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
            ? `تمت إضافة مؤهلك ${education.degree}${endDate ? ` (${startDate} - ${endDate})` : ""}. هل ترغب في إضافة مؤهل آخر؟`
            : "تمت إضافة قيدك التعليمي. هل ترغب في إضافة مؤهل آخر؟",
          ["نعم", "لا، هذا كل شيء"]
        )
      );
      break;
    }

    case "edu_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("edu_school", {});
        out.messages.push(
          assistant("رائع — ما المدرسة أو الجامعة التالية؟")
        );
      } else {
        out.state = nextStep("proj_name", {});
        out.messages.push(
          assistant("الآن لنتحدث عن المشاريع. هل لديك أي مشاريع مميزة لإبرازها؟ ما اسم المشروع الأول؟")
        );
      }
      break;
    }

    case "proj_name": {
      if (skip) {
        out.state = nextStep("cert_name", {});
        out.messages.push(
          assistant("لا مشكلة. هل لديك أي شهادات أو دورات لإضافتها؟ ما أول شهادة؟")
        );
        break;
      }
      const name = text
        .replace(/^(i (?:built|made|created|worked on)|project(?:\s+name)?\s*:?\s*)\s*/i, "")
        .replace(/[.,;!،؟]+$/, "")
        .trim();
      if (!name) {
        out.messages.push(assistant("ما اسم المشروع؟"));
        break;
      }
      const draft: Partial<Project> = { name };
      out.state = nextStep("proj_desc", draft);
      out.messages.push(
        assistant(`أخبرني قليلاً عن "${name}" — ماذا يقدّم؟`)
      );
      break;
    }

    case "proj_desc": {
      if (skip) {
        out.state = nextStep("proj_tech", prev.projectDraft);
        out.messages.push(
          assistant("حسناً. ما التقنيات أو الأدوات التي استخدمتها؟")
        );
        break;
      }
      const description = normalizeDescription(text);
      if (!description) {
        out.messages.push(
          assistant("هل يمكنك وصف المشروع قليلاً؟")
        );
        break;
      }
      const draft: Partial<Project> = { ...prev.projectDraft, description };
      out.state = nextStep("proj_tech", draft);
      out.messages.push(
        assistant("جميل. ما التقنيات أو الأدوات التي استخدمتها فيه؟")
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
          `تمت إضافة "${project.name}" إلى مشاريعك. هل تريد إضافة مشروع آخر؟`,
          ["نعم", "لا، هذا كل شيء"]
        )
      );
      break;
    }

    case "proj_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("proj_name", {});
        out.messages.push(assistant("ما اسم المشروع التالي؟"));
      } else {
        out.state = nextStep("cert_name", {});
        out.messages.push(
          assistant("لنضف أي شهادات أو دورات. ما أول شهادة؟")
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
        .replace(/[.,;!،؟]+$/, "")
        .trim();
      if (!name) {
        out.messages.push(assistant("ما اسم الشهادة؟"));
        break;
      }
      const draft: Partial<Certification> = { name };
      out.state = nextStep("cert_issuer", draft);
      out.messages.push(
        assistant(`من أصدر "${name}"؟ (يمكنك أيضاً كتابة "تخطي".)`)
      );
      break;
    }

    case "cert_issuer": {
      const issuer = skip ? "" : normalizeDescription(text);
      const draft: Partial<Certification> = { ...prev.certDraft, issuer };
      out.state = nextStep("cert_year", draft);
      out.messages.push(assistant("في أي سنة حصلت عليها؟"));
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
          `تمت إضافة ${certification.name}. هل ترغب في إضافة شهادة أخرى؟`,
          ["نعم", "لا، هذا كل شيء"]
        )
      );
      break;
    }

    case "cert_more": {
      if (isPositive(text) || !isNegative(text)) {
        out.state = nextStep("cert_name", {});
        out.messages.push(assistant("ما الشهادة التالية؟"));
      } else {
        out.state = nextStep("done", {});
        finishAgent(out);
      }
      break;
    }

    case "done": {
      out.messages.push(
        assistant("سيرتك الذاتية رائعة! يمكنك الاستمرار في تحسينها، أو الضغط على زر **تنزيل PDF** في لوحة المعاينة لتصديرها. هل ترغب في تعديل أي شيء آخر؟")
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
      `هذا كل ما أحتاجه! لقد أعددت ${count} عناصر لسيرتك الذاتية. ألقِ نظرة على المعاينة الحية على اليسار — وعندما تكون راضياً، اضغط "تنزيل PDF" لتصديرها. يمكنك أيضاً الرد في أي وقت لتعديل التفاصيل.${count === 0 ? ` ${SKIP_HINT}` : ""}`
    )
  );
}

export function getInitialCV(): CVData {
  return createEmptyCV();
}

export function isCVUsable(cv: CVData): boolean {
  return isCompleteEnough(cv.personal);
}
