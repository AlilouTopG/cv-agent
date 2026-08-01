import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import { ThemedAuth } from "@/components/ThemedAuth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NemVai account to continue building your CV.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-16 dark:from-zinc-950 dark:to-zinc-900">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] shadow-md">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Nem<span className="text-[#2563eb]">Vai</span>
        </span>
      </Link>
      <ThemedAuth component={SignIn} fallbackRedirectUrl="/builder" />
    </div>
  );
}
