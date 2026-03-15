"use client";

import { ModelParam } from "@/lib/models";

interface ParamControlsProps {
  params: ModelParam[];
  values: Record<string, string | number>;
  onChange: (name: string, value: string | number) => void;
}

export default function ParamControls({ params, values, onChange }: ParamControlsProps) {
  if (params.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-muted">Parameters</h3>
      <div className="grid grid-cols-2 gap-3">
        {params.map((param) => (
          <div key={param.name}>
            <label className="text-xs text-muted mb-1 block">{param.label}</label>
            {param.type === "select" ? (
              <select
                value={values[param.name] ?? param.default ?? ""}
                onChange={(e) => onChange(param.name, e.target.value)}
                className="w-full bg-card border border-border rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {param.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : param.type === "number" ? (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={values[param.name] ?? param.default ?? 0}
                  onChange={(e) => onChange(param.name, Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="text-xs text-muted w-8 text-right tabular-nums">
                  {values[param.name] ?? param.default}
                </span>
              </div>
            ) : (
              <input
                type="text"
                value={values[param.name] ?? param.default ?? ""}
                placeholder={param.placeholder}
                onChange={(e) => onChange(param.name, e.target.value)}
                className="w-full bg-card border border-border rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
