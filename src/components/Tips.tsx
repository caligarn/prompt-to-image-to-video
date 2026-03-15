"use client";

interface TipsProps {
  tips: string[];
  modelName: string;
}

export default function Tips({ tips, modelName }: TipsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-wider text-muted">
        Tips for {modelName}
      </h3>
      <ul className="space-y-1.5">
        {tips.map((tip, i) => (
          <li key={i} className="text-xs text-muted flex gap-2">
            <span className="text-accent shrink-0 mt-0.5">-</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
