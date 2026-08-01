import { MessageSquareText, MonitorSmartphone, FileDown } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    step: "01",
    title: "Chat with the agent",
    description:
      "Answer a few simple questions about your target role, experience, education, and skills. The agent guides you from start to finish.",
  },
  {
    icon: MonitorSmartphone,
    step: "02",
    title: "Watch it build live",
    description:
      "Every answer appears instantly in a professional, ATS-friendly CV template in the live preview panel beside the chat.",
  },
  {
    icon: FileDown,
    step: "03",
    title: "Export your PDF",
    description:
      "Happy with the result? Export a high-quality PDF in one click and send it straight to employers.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-slate-50 to-white py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From chat to CV in three steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            You talk, we structure. It&apos;s that simple.
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
