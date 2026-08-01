import type { Metadata } from "next";
import BuilderClient from "@/components/builder/BuilderClient";

export const metadata: Metadata = {
  title: "Build Your CV | CV Agent",
  description:
    "Chat with the AI CV agent to build a professional, ATS-friendly resume with a live preview.",
};

export default function BuilderPage() {
  return <BuilderClient />;
}
