"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Eye } from "lucide-react";
import CVTemplate from "./CVTemplate";
import ExportButton from "./ExportButton";
import { cvCompleteness } from "@/lib/cv";
import type { CVData } from "@/lib/types";

const TEMPLATE_WIDTH = 794;
const TEMPLATE_HEIGHT = 1123;

export default function PreviewPanel({ cv }: { cv: CVData }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [templateHeight, setTemplateHeight] = useState(TEMPLATE_HEIGHT);
  const stats = cvCompleteness(cv);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const next = Math.min(1, frame.clientWidth / TEMPLATE_WIDTH);
      setScale(next);
    };
    updateScale();
    const frameObserver = new ResizeObserver(updateScale);
    frameObserver.observe(frame);

    const template = templateRef.current;
    let templateObserver: ResizeObserver | undefined;
    if (template) {
      templateObserver = new ResizeObserver(() => {
        setTemplateHeight(template.offsetHeight);
      });
      templateObserver.observe(template);
    }

    return () => {
      frameObserver.disconnect();
      templateObserver?.disconnect();
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-800">Live Preview</h2>
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            {stats.percentage}% complete
          </span>
        </div>
        <ExportButton targetRef={templateRef} />
      </div>

      <div
        ref={frameRef}
        className="flex-1 overflow-auto px-6 py-8"
      >
        <div
          className="relative mx-auto"
          style={{ width: TEMPLATE_WIDTH * scale, height: templateHeight * scale }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: TEMPLATE_WIDTH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div ref={templateRef}>
              <CVTemplate cv={cv} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
