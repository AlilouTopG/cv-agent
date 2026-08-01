import { MessageSquareText, MonitorSmartphone, FileDown } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    step: "01",
    title: "تحدّث مع الوكيل",
    description:
      "أجب عن بعض الأسئلة البسيطة حول وظيفتك المستهدفة وخبرتك وتعليمك ومهاراتك. يرافقك الوكيل من البداية حتى النهاية.",
  },
  {
    icon: MonitorSmartphone,
    step: "02",
    title: "شاهد المعاينة وهي تُبنى",
    description:
      "كل إجابة تظهر فوراً في قالب سيرة ذاتية احترافي ومتوافق مع أنظمة ATS في لوحة المعاينة الحية بجانب المحادثة.",
  },
  {
    icon: FileDown,
    step: "03",
    title: "نزّل سيرتك بصيغة PDF",
    description:
      "هل أنت راضٍ عن النتيجة؟ صدّر نسخة PDF عالية الجودة بنقرة واحدة وأرسلها إلى أرباب العمل مباشرة.",
  },
];

export default function HowItWorks() {
  return (
    <section
      dir="rtl"
      lang="ar"
      id="how-it-works"
      className="bg-gradient-to-b from-slate-50 to-white py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            من المحادثة إلى السيرة الذاتية في ثلاث خطوات
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            تتحدث ونحن ننظّم. الأمر بهذه البساطة.
          </p>
        </div>

        <div className="relative mt-14 grid gap-10 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-slate-200 lg:block" />
          {steps.map((step) => (
            <div key={step.step} className="relative text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20">
                <step.icon className="h-7 w-7" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                  {step.step.slice(1)}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
