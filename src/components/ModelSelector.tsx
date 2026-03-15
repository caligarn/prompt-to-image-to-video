"use client";

import { AIModel, getImageModels, getVideoModels } from "@/lib/models";

interface ModelSelectorProps {
  selected: string;
  onSelect: (modelId: string) => void;
}

function ModelCard({ model, selected, onSelect }: { model: AIModel; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left px-3 py-2 rounded-lg border transition-all cursor-pointer ${
        selected
          ? "border-accent bg-accent-dim"
          : "border-border hover:border-border-hover bg-card hover:bg-card-hover"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${selected ? "text-accent-hover" : ""}`}>{model.name}</span>
        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
          model.type === "image" ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400"
        }`}>
          {model.type}
        </span>
      </div>
      <p className="text-xs text-muted mt-0.5">{model.description}</p>
    </button>
  );
}

export default function ModelSelector({ selected, onSelect }: ModelSelectorProps) {
  const imageModels = getImageModels();
  const videoModels = getVideoModels();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Image Models</h3>
        <div className="grid grid-cols-2 gap-2">
          {imageModels.map((m) => (
            <ModelCard key={m.id} model={m} selected={selected === m.id} onSelect={() => onSelect(m.id)} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-wider text-muted mb-2">Video Models</h3>
        <div className="grid grid-cols-2 gap-2">
          {videoModels.map((m) => (
            <ModelCard key={m.id} model={m} selected={selected === m.id} onSelect={() => onSelect(m.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
