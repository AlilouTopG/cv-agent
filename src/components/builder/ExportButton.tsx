"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportNodeToPDF } from "@/lib/export-pdf";

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

export default function ExportButton({ targetRef, disabled }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    const node = targetRef.current;
    if (!node) return;
    setLoading(true);
    setError(null);
    try {
      await exportNodeToPDF(node, {
        filename: "cv-agent-resume.pdf",
        scale: 3,
      });
    } catch (err) {
      console.error("PDF export failed:", err);
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleExport}
        disabled={loading || disabled}
        className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {loading ? "Generating PDF..." : "Download PDF"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
