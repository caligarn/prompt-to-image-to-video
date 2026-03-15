"use client";

import { useState, useCallback, useMemo } from "react";
import { AIModel } from "@/lib/models";
import { enhancePrompt, EnhancedPrompt } from "@/lib/enhance";

interface PromptOutputProps {
  prompt: string;
  model: AIModel;
  params: Record<string, string | number>;
}

function buildFinalPrompt(enhanced: EnhancedPrompt, model: AIModel, params: Record<string, string | number>): string {
  if (!enhanced.text) return "";

  let output = enhanced.text;

  // For Midjourney, append parameters as flags
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

export default function PromptOutput({ prompt, model, params }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const enhanced = useMemo(() => enhancePrompt(prompt, model), [prompt, model]);
  const finalPrompt = buildFinalPrompt(enhanced, model, params);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [finalPrompt]);

  if (!finalPrompt) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted">Your final prompt will appear here</p>
      </div>
    );
  }

  return (
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
      <pre className="bg-card border border-accent/30 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap">
        {finalPrompt}
      </pre>

      {/* Show what cinematography enhancements were added */}
      {enhanced.enhancements.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted">
            Auto-enhanced with cinematography direction
          </p>
          <div className="flex flex-wrap gap-1.5">
            {enhanced.enhancements.map((e, i) => (
              <span
                key={i}
                className="text-[10px] bg-accent-dim text-accent-hover px-2 py-0.5 rounded-full"
              >
                <span className="opacity-60">{e.category}:</span> {e.addition}
              </span>
            ))}
          </div>
        </div>
      )}

      {model.id !== "midjourney" && Object.keys(params).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
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
