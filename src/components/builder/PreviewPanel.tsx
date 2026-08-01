"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Eye, Layout, Type, Palette, Languages } from "lucide-react";
import CVTemplate from "./CVTemplate";
import ExportButton from "./ExportButton";
import { cvCompleteness } from "@/lib/cv";
import { CV_THEMES, DEFAULT_THEME } from "@/lib/themes";
import {
  AVAILABLE_LAYOUTS,
  FONT_PRESETS,
  DEFAULT_LAYOUT,
  DEFAULT_FONT_STYLE,
  type LayoutId,
  type FontStyleId,
} from "@/lib/layouts";
import { LANGUAGES, DEFAULT_LANG, getTranslator, type LangId } from "@/lib/i18n";
import type { CVData } from "@/lib/types";

const TEMPLATE_WIDTH = 794;
const TEMPLATE_HEIGHT = 1123;

interface PreviewPanelProps {
  cv: CVData;
  themeId: string;
  onThemeChange: (themeId: string) => void;
  layoutId?: string;
  onLayoutChange?: (layoutId: string) => void;
  fontStyleId?: string;
  onFontStyleChange?: (fontStyleId: string) => void;
  langId?: string;
  onLangChange?: (langId: string) => void;
}

export default function PreviewPanel({
  cv,
  themeId,
  onThemeChange,
  layoutId = DEFAULT_LAYOUT.id,
  onLayoutChange,
  fontStyleId = DEFAULT_FONT_STYLE.id,
  onFontStyleChange,
  langId = DEFAULT_LANG,
  onLangChange,
}: PreviewPanelProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [templateHeight, setTemplateHeight] = useState(TEMPLATE_HEIGHT);

  const stats = cvCompleteness(cv);
  const theme = CV_THEMES.find((t) => t.id === themeId) ?? DEFAULT_THEME;
  const activeLang: LangId = (["en", "fr", "ar"] as LangId[]).includes(langId as LangId)
    ? (langId as LangId)
    : DEFAULT_LANG;
  const t = getTranslator(activeLang);

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
    <div dir="ltr" lang="en" className="flex h-full flex-col bg-slate-100 dark:bg-zinc-950">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">{t("livePreview")}</h2>
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            {stats.percentage}% {t("complete")}
          </span>
        </div>
        <ExportButton targetRef={templateRef} />
      </div>

      {/* Control Toolbar: Language, Theme, Layout & Font Switchers */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200 bg-white px-4 py-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900">
        {/* Language Switcher */}
        {onLangChange && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-400 mr-1 dark:text-zinc-500">
              <Languages className="h-3.5 w-3.5" />
              {activeLang === "en" ? "Language" : activeLang === "fr" ? "Langue" : "اللغة"}
            </span>
            {LANGUAGES.map((l) => {
              const active = l.id === activeLang;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onLangChange(l.id)}
                  title={l.name}
                  dir={l.dir}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-medium transition ${
                    active
                      ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm dark:bg-[#1e3a8a] dark:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span>{l.flag}</span>
                  {l.nativeName}
                </button>
              );
            })}
          </div>
        )}

        {/* Color Themes */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-400 mr-1 dark:text-zinc-500">
            <Palette className="h-3.5 w-3.5" />
            {t("theme")}
          </span>
          {CV_THEMES.map((t) => {
            const active = t.id === theme.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange(t.id)}
                title={t.name}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition ${
                  active
                    ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm dark:bg-[#1e3a8a] dark:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: t.primary }}
                />
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Layout Switcher */}
        {onLayoutChange && (
          <div className="flex flex-wrap items-center gap-1.5 border-l border-slate-200 pl-4 dark:border-zinc-700">
            <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-400 mr-1 dark:text-zinc-500">
              <Layout className="h-3.5 w-3.5" />
              {t("layout")}
            </span>
            {AVAILABLE_LAYOUTS.map((l) => {
              const active = l.id === layoutId;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onLayoutChange(l.id)}
                  title={l.description}
                  className={`rounded-md border px-2 py-1 font-medium transition ${
                    active
                      ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm dark:bg-[#1e3a8a] dark:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
                  }`}
                >
                  {l.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Font Style Switcher */}
        {onFontStyleChange && (
          <div className="flex flex-wrap items-center gap-1.5 border-l border-slate-200 pl-4 dark:border-zinc-700">
            <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-400 mr-1 dark:text-zinc-500">
              <Type className="h-3.5 w-3.5" />
              {t("font")}
            </span>
            {FONT_PRESETS.map((f) => {
              const active = f.id === fontStyleId;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onFontStyleChange(f.id)}
                  title={f.name}
                  className={`rounded-md border px-2 py-1 font-medium transition ${
                    active
                      ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm dark:bg-[#1e3a8a] dark:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
                  }`}
                  style={{ fontFamily: f.fontFamily }}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Scaled Live Document Frame */}
      <div ref={frameRef} className="flex-1 overflow-auto px-6 py-8">
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
              <CVTemplate
                cv={cv}
                theme={theme}
                layout={layoutId as LayoutId}
                fontStyle={fontStyleId as FontStyleId}
                lang={activeLang}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
