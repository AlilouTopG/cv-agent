import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed]">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              CV<span className="text-[#2563eb]">Agent</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">
              by NemVai
            </span>
          </span>
        </div>

        <p className="text-sm text-slate-500 dark:text-zinc-400">
          © {new Date().getFullYear()} CV Agent by NemVai — Build a better CV with AI.
        </p>

        <Link
          href="/builder"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          CV Agent
        </Link>
      </div>
    </footer>
  );
}
