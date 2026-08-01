import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function CTA() {
  return (
    <section className="px-5 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] px-8 py-14 text-center shadow-2xl shadow-[#7c3aed]/30">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next role is one conversation away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Start chatting with the AI agent now and have a professional CV
            ready in minutes — completely free.
          </p>
          <Link
            href="/builder"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-base font-semibold text-[#2563eb] shadow-lg transition hover:bg-indigo-50"
          >
            Build my CV now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
