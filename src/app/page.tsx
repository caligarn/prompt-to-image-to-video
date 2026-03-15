"use client";

import { useState, useCallback } from "react";
import { getModel, AI_MODELS, PromptFormat } from "@/lib/models";
import { PromptTemplate } from "@/lib/templates";
import ModelSelector from "@/components/ModelSelector";
import ParamControls from "@/components/ParamControls";
import PromptEditor from "@/components/PromptEditor";
import PromptOutput from "@/components/PromptOutput";
import Tips from "@/components/Tips";
import TemplateGallery from "@/components/TemplateGallery";

export default function Home() {
  const [selectedModelId, setSelectedModelId] = useState("midjourney");
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<PromptFormat>("natural");
  const [params, setParams] = useState<Record<string, string | number>>({});
  const [showTemplates, setShowTemplates] = useState(false);

  const model = getModel(selectedModelId) ?? AI_MODELS[0];

  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    setParams({});
    const newModel = getModel(modelId);
    if (newModel && !newModel.promptFormats.includes(format)) {
      setFormat(newModel.promptFormats[0]);
    }
  }, [format]);

  const handleParamChange = useCallback((name: string, value: string | number) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUseTemplate = useCallback((template: PromptTemplate) => {
    setPrompt(template.prompt);
    setFormat(template.format);
    if (!template.compatibleModels.includes(selectedModelId)) {
      const newModelId = template.compatibleModels[0];
      setSelectedModelId(newModelId);
      setParams({});
    }
    setShowTemplates(false);
  }, [selectedModelId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <ModelSelector selected={selectedModelId} onSelect={handleModelChange} />
        <ParamControls params={model.params} values={params} onChange={handleParamChange} />
        <Tips tips={model.tips} modelName={model.name} />
      </div>

      {/* Main area */}
      <div className="lg:col-span-9 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Prompt Builder</h1>
            <p className="text-sm text-muted mt-0.5">
              Building for <span className="text-accent-hover font-medium">{model.name}</span>
            </p>
          </div>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`text-sm px-4 py-2 rounded-lg border transition-all cursor-pointer ${
              showTemplates
                ? "border-accent bg-accent-dim text-accent-hover"
                : "border-border hover:border-border-hover text-muted hover:text-foreground"
            }`}
          >
            {showTemplates ? "Close Templates" : "Browse Templates"}
          </button>
        </div>

        {showTemplates ? (
          <TemplateGallery onUseTemplate={handleUseTemplate} filterModelId={selectedModelId} />
        ) : (
          <>
            <PromptEditor
              model={model}
              format={format}
              onFormatChange={setFormat}
              prompt={prompt}
              onPromptChange={setPrompt}
            />
            <PromptOutput prompt={prompt} model={model} params={params} />
          </>
        )}
      </div>
    </div>
  );
}
