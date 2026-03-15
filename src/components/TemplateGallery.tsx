"use client";

import { useState } from "react";
import { TEMPLATES, CATEGORIES, PromptTemplate } from "@/lib/templates";
import { AI_MODELS } from "@/lib/models";

interface TemplateGalleryProps {
  onUseTemplate: (template: PromptTemplate) => void;
  filterModelId?: string;
}

export default function TemplateGallery({ onUseTemplate, filterModelId }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeType, setActiveType] = useState<"all" | "image" | "video">("all");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    if (activeType !== "all" && t.modelType !== activeType && t.modelType !== "both") return false;
    if (filterModelId && !t.compatibleModels.includes(filterModelId)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q))
      );
    }
    return true;
  });

  const usedCategories = CATEGORIES.filter((cat) =>
    TEMPLATES.some((t) => t.category === cat)
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search templates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent"
      />

      {/* Type filter */}
      <div className="flex gap-1">
        {(["all", "image", "video"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-2.5 py-1 text-xs rounded-md transition-all capitalize cursor-pointer ${
              activeType === type
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground hover:bg-card"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-2 py-0.5 text-xs rounded-full transition-all cursor-pointer ${
            activeCategory === "all"
              ? "bg-border text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          All
        </button>
        {usedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-0.5 text-xs rounded-full transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-border text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">No templates match your filters</p>
        ) : (
          filtered.map((template) => (
            <div
              key={template.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-border-hover transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium">{template.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{template.description}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-3">
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    template.modelType === "image" || template.modelType === "both"
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {template.modelType === "both" ? "img+vid" : template.modelType}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-border text-muted">
                    {template.format}
                  </span>
                </div>
              </div>

              <pre className="text-xs text-muted/80 bg-background rounded-md p-3 mb-3 whitespace-pre-wrap overflow-x-auto max-h-[120px] overflow-y-auto">
                {template.prompt}
              </pre>

              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {template.compatibleModels.map((mid) => {
                    const model = AI_MODELS.find((m) => m.id === mid);
                    return model ? (
                      <span key={mid} className="text-[10px] text-muted bg-background px-1.5 py-0.5 rounded">
                        {model.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <button
                  onClick={() => onUseTemplate(template)}
                  className="text-xs px-3 py-1 rounded-md bg-accent hover:bg-accent-hover text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
