import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  MessagesSquare,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#2563eb]/20 via-[#7c3aed]/20 to-[#2563eb]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563eb]/20 bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Interactive CV Builder
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] dark:text-white">
            🚀 CV Agent{" "}
            <span className="text-2xl font-bold text-indigo-600 sm:text-3xl lg:text-4xl">
              by Nexus
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
            Nexus&apos; AI platform for crafting your professional CV — fast,
            effortless, and built to help you get hired.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#2563eb]/25 transition hover:bg-[#1d4ed8]"
            >
              Build your CV
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-zinc-400">
            {["100% Free", "No sign-up required", "ATS-friendly output"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#2563eb]/15 to-[#7c3aed]/15 blur-2xl" />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3 dark:border-zinc-800">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-medium text-slate-400">
                cv-agent — CV Builder
              </span>
            </div>

            <div className="space-y-3 px-4 py-5">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  What role are you targeting?
                </div>
              </div>
              <div className="flex items-start justify-end gap-2.5">
                <div className="rounded-2xl rounded-tr-md bg-[#2563eb] px-3 py-2 text-sm text-white">
                  Front-End Developer
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <MessagesSquare className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  Excellent! Watch your CV preview update live ✓
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 px-4 py-4 dark:border-zinc-800">
              <div className="mx-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200 dark:bg-zinc-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-3/4 rounded-full bg-slate-200 dark:bg-zinc-700" />
                  <div className="h-2 w-1/2 rounded-full bg-slate-100 dark:bg-zinc-600" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-100 dark:bg-zinc-600" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
