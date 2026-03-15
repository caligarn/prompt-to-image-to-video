"use client";

import { useState, useCallback } from "react";
import { AIModel, PromptFormat, PROMPT_FORMAT_LABELS } from "@/lib/models";

interface PromptEditorProps {
  model: AIModel;
  format: PromptFormat;
  onFormatChange: (format: PromptFormat) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

function getPlaceholder(format: PromptFormat, model: AIModel): string {
  switch (format) {
    case "natural":
      return model.type === "image"
        ? "Describe your image in natural language... e.g. A serene mountain lake at sunset with reflections of snow-capped peaks"
        : "Describe your video scene... e.g. A cinematic drone shot rising above a misty forest at dawn";
    case "json":
      return '{\n  "scene": "...",\n  "subject": "...",\n  "camera": "...",\n  "style": "..."\n}';
    case "timed":
      return "[0:00-0:03] Opening shot description\n[0:03-0:06] Second beat\n[0:06-0:10] Closing moment";
    case "structured":
      return "Subject: ...\nStyle: ...\nLighting: ...\nMood: ...\nDetails: ...";
  }
}

export default function PromptEditor({ model, format, onFormatChange, prompt, onPromptChange }: PromptEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  const charCount = prompt.length;

  return (
    <div className="space-y-3">
      {/* Format tabs */}
      <div className="flex items-center gap-1">
        <span className="text-xs uppercase tracking-wider text-muted mr-2">Format</span>
        {model.promptFormats.map((f) => (
          <button
            key={f}
            onClick={() => onFormatChange(f)}
            className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
              format === f
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground hover:bg-card"
            }`}
          >
            {PROMPT_FORMAT_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={getPlaceholder(format, model)}
          className={`w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent min-h-[200px] resize-y ${
            format === "json" ? "font-mono text-xs" : ""
          }`}
          spellCheck={format !== "json"}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-[10px] text-muted tabular-nums">{charCount} chars</span>
          <button
            onClick={handleCopy}
            disabled={!prompt}
            className="text-xs px-2 py-1 rounded bg-border hover:bg-border-hover text-foreground transition-all disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
