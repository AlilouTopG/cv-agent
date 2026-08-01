import {
  Bot,
  FileDown,
  Gauge,
  Layers,
  MessageSquareText,
  ScanSearch,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Guided AI conversation",
    description:
      "An AI agent walks you through every section — experience, education, skills and more — so you never stare at a blank page.",
  },
  {
    icon: Layers,
    title: "Structured data, zero effort",
    description:
      "Your answers are parsed into clean, structured JSON as you type, keeping your CV organized and easy to refine.",
  },
  {
    icon: Gauge,
    title: "Real-time live preview",
    description:
      "A split-screen layout updates a professional CV template instantly with every message you send.",
  },
  {
    icon: ScanSearch,
    title: "ATS-friendly design",
    description:
      "Clean headings, standard sections and simple typography that applicant tracking systems parse without trouble.",
  },
  {
    icon: FileDown,
    title: "One-click PDF export",
    description:
      "Download a high-quality, print-ready PDF of your CV straight from your browser — no accounts required.",
  },
  {
    icon: MessageSquareText,
    title: "Step-by-step guidance",
    description:
      "Helpful prompts, examples and quick-reply suggestions keep the process fast, friendly and frustration-free.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to nail your next application
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            CV Agent combines conversation, intelligence and clean design into
            one smooth experience.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#2563eb]/30 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb]/10 to-[#7c3aed]/10 text-[#2563eb] transition group-hover:from-[#2563eb] group-hover:to-[#7c3aed] group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
