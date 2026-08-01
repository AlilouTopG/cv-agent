import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { SignUp } from "@clerk/nextjs";
import { ThemedAuth } from "@/components/ThemedAuth";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free CV Agent by NemVai account and start building your CV.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-16 dark:from-zinc-950 dark:to-zinc-900">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-md">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            CV<span className="text-[#2563eb]">Agent</span>
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            by NemVai
          </span>
        </span>
      </Link>
      <ThemedAuth component={SignUp} fallbackRedirectUrl="/builder" />
    </div>
  );
}
