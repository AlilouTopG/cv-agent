import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            CV<span className="text-[#2563eb]">Agent</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-900">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-slate-900">
            How it works
          </a>
        </nav>

        <Link
          href="/builder"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
        >
          <Sparkles className="h-4 w-4" />
          Start building
        </Link>
      </div>
    </header>
  );
}
