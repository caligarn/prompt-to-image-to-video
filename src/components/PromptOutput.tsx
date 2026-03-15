"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AIModel } from "@/lib/models";

interface PromptOutputProps {
  prompt: string;
  model: AIModel;
  params: Record<string, string | number>;
}

interface AnalysisItem {
  category: string;
  term: string;
}

// ── SVG Icons ──

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
  "Shot Type": IconFrame,
  "Camera Angle": IconAngle,
  "Lens": IconLens,
  "Lighting": IconLight,
  "Color Grade": IconPalette,
  "Film Texture": IconFilm,
  "Composition": IconStage,
  "Camera Movement": IconMove,
  "Pacing": IconTempo,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  "Shot Type":       { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  "Camera Angle":    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20" },
  "Lens":            { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20" },
  "Lighting":        { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
  "Color Grade":     { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20" },
  "Film Texture":    { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/20" },
  "Composition":     { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  "Camera Movement": { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/20" },
  "Pacing":          { bg: "bg-pink-500/10",    text: "text-pink-400",    border: "border-pink-500/20" },
};

// ── Midjourney flag builder ──

function getMjFlags(params: Record<string, string | number>): string {
  const flags: string[] = [];
  if (params.aspect && params.aspect !== "1:1") flags.push(`--ar ${params.aspect}`);
  if (params.stylize && params.stylize !== 100) flags.push(`--s ${params.stylize}`);
  if (params.chaos && params.chaos !== 0) flags.push(`--chaos ${params.chaos}`);
  if (params.quality && params.quality !== "1") flags.push(`--q ${params.quality}`);
  if (params.style === "raw") flags.push("--style raw");
  if (params.version && params.version !== "v7") flags.push(`--${params.version}`);
  return flags.join(" ");
}

// ── Shimmer loading animation ──

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-border/50 rounded ${className}`} />
  );
}

// ── Component ──

export default function PromptOutput({ prompt, model, params }: PromptOutputProps) {
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"enhanced" | "original">("enhanced");

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  // Auto-enhance when prompt changes (debounced)
  useEffect(() => {
    if (!prompt.trim()) {
      setEnhancedPrompt("");
      setAnalysis([]);
      setPreviewUrl("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      runEnhance(prompt);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, model.id, model.type]);

  async function runEnhance(text: string) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setEnhancing(true);
    setEnhanceError("");

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          modelType: model.type,
          targetModel: model.name,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Enhancement failed");
      }

      const data = await res.json();
      setEnhancedPrompt(data.enhancedPrompt);
      setAnalysis(data.analysis || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setEnhanceError(err instanceof Error ? err.message : "Enhancement failed");
    } finally {
      setEnhancing(false);
    }
  }

  async function runPreview() {
    const promptToPreview = enhancedPrompt || prompt;
    if (!promptToPreview.trim()) return;

    setPreviewing(true);
    setPreviewError("");

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToPreview }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Preview failed");
      }

      const data = await res.json();
      setPreviewUrl(data.imageUrl);
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setPreviewing(false);
    }
  }

  const finalPrompt = (() => {
    const base = activeTab === "enhanced" && enhancedPrompt ? enhancedPrompt : prompt;
    if (!base.trim()) return "";
    const mjFlags = model.id === "midjourney" ? getMjFlags(params) : "";
    return mjFlags ? `${base} ${mjFlags}` : base;
  })();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [finalPrompt]);

  if (!prompt.trim()) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="text-muted space-y-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mx-auto opacity-30">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Write a prompt above and AI will enhance it with professional cinematography direction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Tab toggle: Enhanced vs Original ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("enhanced")}
            className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
              activeTab === "enhanced"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {enhancing ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enhancing...
              </span>
            ) : (
              "AI Enhanced"
            )}
          </button>
          <button
            onClick={() => setActiveTab("original")}
            className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
              activeTab === "original"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            Original
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview button */}
          <button
            onClick={runPreview}
            disabled={previewing || (!enhancedPrompt && !prompt.trim())}
            className="text-xs px-3 py-1.5 rounded-md border border-border hover:border-accent text-muted hover:text-accent-hover transition-all cursor-pointer disabled:opacity-30 disabled:cursor-default flex items-center gap-1.5"
          >
            {previewing ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <rect x="1" y="3" width="14" height="10" rx="1.5" />
                  <circle cx="6" cy="7" r="1.5" />
                  <path d="M1 11 L5 8 L8 10 L11 7 L15 10" />
                </svg>
                Preview Image
              </>
            )}
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={!finalPrompt}
            className="text-xs px-3 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-all cursor-pointer disabled:opacity-30"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Prompt + Analysis */}
        <div className={`space-y-4 ${previewUrl ? "lg:col-span-3" : "lg:col-span-5"}`}>
          {/* Prompt display */}
          <div className="bg-card border border-accent/30 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[100px]">
            {enhancing && activeTab === "enhanced" ? (
              <div className="space-y-2">
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-5/6" />
                <Shimmer className="h-4 w-4/6" />
                <Shimmer className="h-4 w-3/4" />
              </div>
            ) : enhanceError && activeTab === "enhanced" ? (
              <div className="text-warning text-xs">
                <p className="font-medium">Enhancement unavailable</p>
                <p className="text-muted mt-1">{enhanceError}</p>
                <p className="text-muted mt-2">Showing original prompt below:</p>
                <p className="text-foreground mt-2">{prompt}</p>
              </div>
            ) : (
              <span>{activeTab === "enhanced" && enhancedPrompt ? enhancedPrompt : prompt}</span>
            )}
            {/* Midjourney flags shown inline */}
            {model.id === "midjourney" && getMjFlags(params) && (
              <span className="text-muted"> {getMjFlags(params)}</span>
            )}
          </div>

          {/* ── Cinematography Analysis Grid ── */}
          {activeTab === "enhanced" && analysis.length > 0 && !enhancing && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-accent-hover">
                  <path d="M2 8 L10 2 L18 8" />
                  <rect x="4" y="8" width="12" height="10" />
                  <circle cx="10" cy="12" r="2.5" />
                  <line x1="10" y1="14.5" x2="10" y2="18" />
                </svg>
                <span className="text-xs font-medium text-accent-hover uppercase tracking-wider">
                  Cinematography Breakdown
                </span>
                <span className="text-[10px] text-muted ml-auto">
                  {analysis.length} element{analysis.length !== 1 ? "s" : ""} identified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50">
                {analysis.map((item, i) => {
                  const colors = COLOR_MAP[item.category] || { bg: "bg-accent-dim", text: "text-accent-hover", border: "border-accent/20" };
                  const Icon = ICON_MAP[item.category];
                  return (
                    <div key={i} className={`${colors.bg} p-3 flex items-start gap-3`}>
                      <div className={`${colors.text} mt-0.5 shrink-0`}>
                        {Icon ? <Icon /> : (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                            <circle cx="10" cy="10" r="7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[10px] uppercase tracking-wider ${colors.text} font-medium`}>
                          {item.category}
                        </p>
                        <p className="text-sm text-foreground mt-0.5 leading-snug">
                          {item.term}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhancing analysis skeleton */}
          {activeTab === "enhanced" && enhancing && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border">
                <Shimmer className="h-3.5 w-48" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card p-3 flex items-start gap-3">
                    <Shimmer className="w-4 h-4 rounded shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Shimmer className="h-2.5 w-16" />
                      <Shimmer className="h-3.5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Image Preview */}
        {(previewUrl || previewing || previewError) && (
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider text-muted">Preview</h4>
              {previewUrl && (
                <button
                  onClick={runPreview}
                  disabled={previewing}
                  className="text-[10px] text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Regenerate
                </button>
              )}
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {previewing ? (
                <div className="flex flex-col items-center gap-3 text-muted">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
                  </div>
                  <p className="text-xs">Generating preview with FLUX...</p>
                </div>
              ) : previewError ? (
                <div className="text-center px-4">
                  <p className="text-warning text-xs font-medium">Preview unavailable</p>
                  <p className="text-muted text-[11px] mt-1">{previewError}</p>
                </div>
              ) : previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt="Prompt preview"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            {previewUrl && (
              <p className="text-[10px] text-muted text-center">
                Preview generated with FLUX Schnell — actual results will vary by model
              </p>
            )}
          </div>
        )}
      </div>

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
