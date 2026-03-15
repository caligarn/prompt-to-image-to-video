"use client";

import { useState, useCallback } from "react";
import { PromptTemplate } from "@/lib/templates";
import TemplateGallery from "@/components/TemplateGallery";

export default function TemplatesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleUseTemplate = useCallback((template: PromptTemplate) => {
    navigator.clipboard.writeText(template.prompt);
    setCopied(template.id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Prompt Templates</h1>
        <p className="text-sm text-muted mt-1">
          Browse and copy prompt templates for image and video generation.
          {copied && <span className="text-success ml-2">Copied to clipboard!</span>}
        </p>
      </div>
      <TemplateGallery onUseTemplate={handleUseTemplate} />
    </div>
  );
}
