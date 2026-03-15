"use client";

import { useState, useCallback, useMemo } from "react";
import { AIModel } from "@/lib/models";
import { enhancePrompt, EnhancedPrompt, CATEGORY_ICONS, getCategoryInfo } from "@/lib/enhance";

interface PromptOutputProps {
  prompt: string;
  model: AIModel;
  params: Record<string, string | number>;
}

// ── SVG icons for each category ──

function IconFrame() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <line x1="6" y1="4" x2="6" y2="16" />
      <line x1="14" y1="4" x2="14" y2="16" />
    </svg>
  );
}
function IconAngle() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M4 16 L4 6 L14 16 Z" />
      <path d="M4 12 Q7 12 8 14" />
    </svg>
  );
}
function IconLens() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="4" />
      <circle cx="10" cy="10" r="1.5" />
    </svg>
  );
}
function IconLight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="10" cy="9" r="4" />
      <line x1="10" y1="1" x2="10" y2="3" />
      <line x1="10" y1="15" x2="10" y2="17" />
      <line x1="3" y1="9" x2="5" y2="9" />
      <line x1="15" y1="9" x2="17" y2="9" />
      <line x1="5" y1="4" x2="6.5" y2="5.5" />
      <line x1="13.5" y1="12.5" x2="15" y2="14" />
      <line x1="15" y1="4" x2="13.5" y2="5.5" />
      <line x1="6.5" y1="12.5" x2="5" y2="14" />
    </svg>
  );
}
function IconPalette() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M10 2 C5 2 2 6 2 10 C2 14 5 18 10 18 C11.5 18 12 17 12 16 C12 15.5 11.8 15 12.5 14.5 C13 14 13.5 14 14 14 L15 14 C16.5 14 18 13 18 10 C18 5.5 14.5 2 10 2Z" />
      <circle cx="7" cy="8" r="1.2" fill="currentColor" />
      <circle cx="11" cy="7" r="1.2" fill="currentColor" />
      <circle cx="7" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
function IconFilm() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="2" y="3" width="16" height="14" rx="2" />
      <rect x="5" y="3" width="2" height="3" />
      <rect x="9" y="3" width="2" height="3" />
      <rect x="13" y="3" width="2" height="3" />
      <rect x="5" y="14" width="2" height="3" />
      <rect x="9" y="14" width="2" height="3" />
      <rect x="13" y="14" width="2" height="3" />
    </svg>
  );
}
function IconStage() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <line x1="2" y1="10" x2="18" y2="10" />
      <line x1="6" y1="10" x2="6" y2="3" />
      <line x1="14" y1="10" x2="14" y2="3" />
      <rect x="8" y="6" width="4" height="4" />
      <line x1="2" y1="16" x2="18" y2="16" />
    </svg>
  );
}
function IconMove() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M3 10 L17 10" />
      <path d="M14 7 L17 10 L14 13" />
      <path d="M3 7 C6 4 10 4 13 7" strokeDasharray="2 1" />
    </svg>
  );
}
function IconTempo() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="10" cy="10" r="7" />
      <line x1="10" y1="10" x2="10" y2="6" />
      <line x1="10" y1="10" x2="13" y2="12" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

const ICON_MAP: Record<string, () => React.ReactNode> = {
  shot: IconFrame,
  angle: IconAngle,
  lens: IconLens,
  lighting: IconLight,
  color: IconPalette,
  texture: IconFilm,
  composition: IconStage,
  movement: IconMove,
  pacing: IconTempo,
};

// ── Color map per category ──
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  shot:        { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20",   glow: "shadow-blue-500/5" },
  angle:       { bg: "bg-cyan-500/10",   text: "text-cyan-400",   border: "border-cyan-500/20",   glow: "shadow-cyan-500/5" },
  lens:        { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", glow: "shadow-violet-500/5" },
  lighting:    { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20",  glow: "shadow-amber-500/5" },
  color:       { bg: "bg-rose-500/10",   text: "text-rose-400",   border: "border-rose-500/20",   glow: "shadow-rose-500/5" },
  texture:     { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", glow: "shadow-orange-500/5" },
  composition: { bg: "bg-emerald-500/10",text: "text-emerald-400",border: "border-emerald-500/20",glow: "shadow-emerald-500/5" },
  movement:    { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", glow: "shadow-indigo-500/5" },
  pacing:      { bg: "bg-pink-500/10",   text: "text-pink-400",   border: "border-pink-500/20",   glow: "shadow-pink-500/5" },
};

// ── Helpers ──

function buildFinalPrompt(enhanced: EnhancedPrompt, model: AIModel, params: Record<string, string | number>): string {
  if (!enhanced.text) return "";

  let output = enhanced.text;

  if (model.id === "midjourney") {
    const flags: string[] = [];
    if (params.aspect && params.aspect !== "1:1") flags.push(`--ar ${params.aspect}`);
    if (params.stylize && params.stylize !== 100) flags.push(`--s ${params.stylize}`);
    if (params.chaos && params.chaos !== 0) flags.push(`--chaos ${params.chaos}`);
    if (params.quality && params.quality !== "1") flags.push(`--q ${params.quality}`);
    if (params.style === "raw") flags.push("--style raw");
    if (params.version && params.version !== "v7") flags.push(`--${params.version}`);
    if (flags.length > 0) output += ` ${flags.join(" ")}`;
  }

  return output;
}

// ── Component ──

export default function PromptOutput({ prompt, model, params }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const enhanced = useMemo(() => enhancePrompt(prompt, model), [prompt, model]);
  const finalPrompt = buildFinalPrompt(enhanced, model, params);
  const allCategories = useMemo(() => getCategoryInfo(model.type), [model.type]);

  // Which categories are present in user prompt vs added vs missing
  const enhancedKeys = new Set(enhanced.enhancements.map((e) => e.key));
  const presentKeys = new Set(
    allCategories
      .filter((c) => !enhancedKeys.has(c.key))
      .filter((c) => {
        // If not enhanced, it was already present or skipped — check if present
        return enhanced.enhancements.length > 0 || prompt.trim().length > 0;
      })
      .map((c) => c.key)
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [finalPrompt]);

  if (!prompt.trim()) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted">Your final prompt will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Final Prompt Display ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-muted">Final Prompt</h3>
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1 rounded-md bg-accent hover:bg-accent-hover text-white transition-all cursor-pointer"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>

        {/* Prompt with highlighted additions */}
        <div className="bg-card border border-accent/30 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          <span>{enhanced.originalPrompt.trimEnd()}</span>
          {enhanced.enhancements.length > 0 && (
            <>
              <span className="text-muted">{enhanced.originalPrompt.endsWith(".") || enhanced.originalPrompt.endsWith(",") || enhanced.originalPrompt.endsWith(";") ? " " : ". "}</span>
              {enhanced.enhancements.map((e, i) => {
                const colors = COLOR_MAP[e.key] || COLOR_MAP.shot;
                return (
                  <span key={i}>
                    <span
                      className={`${colors.text} border-b border-dotted ${colors.border}`}
                      title={`Auto-added: ${e.category}`}
                    >
                      {e.addition}
                    </span>
                    {i < enhanced.enhancements.length - 1 && (
                      <span className="text-muted">, </span>
                    )}
                  </span>
                );
              })}
            </>
          )}
          {/* Midjourney flags */}
          {model.id === "midjourney" && (() => {
            const flags: string[] = [];
            if (params.aspect && params.aspect !== "1:1") flags.push(`--ar ${params.aspect}`);
            if (params.stylize && params.stylize !== 100) flags.push(`--s ${params.stylize}`);
            if (params.chaos && params.chaos !== 0) flags.push(`--chaos ${params.chaos}`);
            if (params.quality && params.quality !== "1") flags.push(`--q ${params.quality}`);
            if (params.style === "raw") flags.push("--style raw");
            if (params.version && params.version !== "v7") flags.push(`--${params.version}`);
            return flags.length > 0 ? <span className="text-muted"> {flags.join(" ")}</span> : null;
          })()}
        </div>
      </div>

      {/* ── Cinematography Enhancement Panel ── */}
      {enhanced.enhancements.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Panel header */}
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-accent-hover">
              <path d="M2 8 L10 2 L18 8" />
              <rect x="4" y="8" width="12" height="10" />
              <circle cx="10" cy="12" r="2.5" />
              <line x1="10" y1="14.5" x2="10" y2="18" />
            </svg>
            <span className="text-xs font-medium text-accent-hover uppercase tracking-wider">
              Cinematography Direction Added
            </span>
            <span className="text-[10px] text-muted ml-auto">
              {enhanced.enhancements.length} enhancement{enhanced.enhancements.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Enhancement grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50">
            {enhanced.enhancements.map((e, i) => {
              const colors = COLOR_MAP[e.key] || COLOR_MAP.shot;
              const Icon = ICON_MAP[e.key];
              return (
                <div
                  key={i}
                  className={`${colors.bg} p-3 flex items-start gap-3 shadow-sm ${colors.glow}`}
                >
                  {/* Icon */}
                  <div className={`${colors.text} mt-0.5 shrink-0`}>
                    {Icon && <Icon />}
                  </div>
                  {/* Content */}
                  <div className="min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider ${colors.text} font-medium`}>
                      {e.category}
                    </p>
                    <p className="text-sm text-foreground mt-0.5 leading-snug">
                      {e.addition}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category coverage bar */}
          <div className="px-4 py-2.5 border-t border-border">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-muted mr-1">Coverage:</span>
              {allCategories.map((cat) => {
                const isEnhanced = enhancedKeys.has(cat.key);
                const isPresent = !isEnhanced; // user already covered it
                const colors = COLOR_MAP[cat.key] || COLOR_MAP.shot;
                return (
                  <span
                    key={cat.key}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isPresent
                        ? "bg-success/10 text-success border border-success/20"
                        : `${colors.bg} ${colors.text} border ${colors.border}`
                    }`}
                    title={isPresent ? `${cat.label}: already in your prompt` : `${cat.label}: auto-added`}
                  >
                    {isPresent ? "✓" : "+"} {cat.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Model params (non-Midjourney) */}
      {model.id !== "midjourney" && Object.keys(params).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(params).map(([key, value]) => {
            const paramDef = model.params.find((p) => p.name === key);
            if (!paramDef || value === paramDef.default) return null;
            return (
              <span key={key} className="text-[10px] bg-accent-dim text-accent-hover px-2 py-0.5 rounded-full">
                {paramDef.label}: {value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
