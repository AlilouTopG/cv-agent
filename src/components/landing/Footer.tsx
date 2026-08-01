import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer dir="rtl" lang="ar" className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed]">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900">
            CV<span className="text-[#2563eb]">Agent</span>
          </span>
        </div>

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} CV Agent — ابنِ سيرتك الذاتية بشكل أفضل مع
          الذكاء الاصطناعي.
        </p>

        <Link
          href="/builder"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ExternalLink className="h-4 w-4" />
          cv-agent
        </Link>
      </div>
    </footer>
  );
}
