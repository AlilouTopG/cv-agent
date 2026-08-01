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
    title: "Smart Guided Conversation",
    description:
      "An AI agent walks you through every section — experience, education, skills, and more — so you never face a blank page.",
  },
  {
    icon: Layers,
    title: "Effortlessly Structured Data",
    description:
      "Your answers are converted into clean, structured JSON as you type, keeping your CV organized and easy to refine.",
  },
  {
    icon: Gauge,
    title: "Real-Time Live Preview",
    description:
      "A split-screen design renders a professional CV template that updates instantly with every message you send.",
  },
  {
    icon: ScanSearch,
    title: "ATS-Friendly Design",
    description:
      "Clean headings, standard sections, and simple fonts that applicant tracking systems parse without issues.",
  },
  {
    icon: FileDown,
    title: "One-Click PDF Export",
    description:
      "Download a high-quality, print-ready PDF straight from your browser — no account required.",
  },
  {
    icon: MessageSquareText,
    title: "Step-by-Step Guidance",
    description:
      "Helpful hints, examples, and quick suggestions make the process fast, simple, and frustration-free.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Everything you need to stand out
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
            NemVai combines conversation, intelligence, and clean design into
            one seamless experience.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#2563eb]/30 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#2563eb]/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb]/10 to-[#7c3aed]/10 text-[#2563eb] transition group-hover:from-[#2563eb] group-hover:to-[#7c3aed] group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
