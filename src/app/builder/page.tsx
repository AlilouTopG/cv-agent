import type { Metadata } from "next";
import BuilderClient from "@/components/builder/BuilderClient";

export const metadata: Metadata = {
  title: "Build Your CV | NemVai",
  description:
    "Chat with an AI agent to build a professional, ATS-friendly CV with live preview and one-click PDF export.",
};

export default function BuilderPage() {
  return <BuilderClient />;
}
