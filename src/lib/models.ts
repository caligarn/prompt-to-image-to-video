export type ModelType = "image" | "video";

export interface ModelParam {
  name: string;
  label: string;
  type: "select" | "number" | "text";
  options?: string[];
  default?: string | number;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface AIModel {
  id: string;
  name: string;
  type: ModelType;
  description: string;
  promptFormats: PromptFormat[];
  params: ModelParam[];
  tips: string[];
}

export type PromptFormat = "natural" | "json" | "timed" | "structured";

export const PROMPT_FORMAT_LABELS: Record<PromptFormat, string> = {
  natural: "Natural Language",
  json: "JSON Prompt",
  timed: "Time-Based",
  structured: "Structured",
};

export const AI_MODELS: AIModel[] = [
  // ── Image Models ──
  {
    id: "midjourney",
    name: "Midjourney",
    type: "image",
    description: "Artistic, highly stylized image generation",
    promptFormats: ["natural", "structured"],
    params: [
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9", "3:2", "2:3"], default: "1:1" },
      { name: "version", label: "Version", type: "select", options: ["v7", "v6.1", "v6", "v5.2"], default: "v7" },
      { name: "stylize", label: "Stylize", type: "number", min: 0, max: 1000, step: 50, default: 100 },
      { name: "chaos", label: "Chaos", type: "number", min: 0, max: 100, step: 5, default: 0 },
      { name: "quality", label: "Quality", type: "select", options: [".25", ".5", "1", "2"], default: "1" },
      { name: "style", label: "Style", type: "select", options: ["raw", "default"], default: "default" },
    ],
    tips: [
      "Use comma-separated phrases, not full sentences",
      "Put most important elements first",
      "Use --no to exclude elements",
      "Specify art styles, lighting, and camera angles explicitly",
      "Use :: for multi-prompt weighting (e.g. cat::2 dog::1)",
    ],
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    type: "image",
    description: "OpenAI's text-to-image model with strong prompt following",
    promptFormats: ["natural", "structured"],
    params: [
      { name: "size", label: "Size", type: "select", options: ["1024x1024", "1024x1792", "1792x1024"], default: "1024x1024" },
      { name: "quality", label: "Quality", type: "select", options: ["standard", "hd"], default: "hd" },
      { name: "style", label: "Style", type: "select", options: ["vivid", "natural"], default: "vivid" },
    ],
    tips: [
      "DALL-E 3 understands full natural language descriptions well",
      "Be very specific about composition and spatial relationships",
      "Describe the mood, lighting, and atmosphere",
      "Specify the medium (photo, oil painting, 3D render, etc.)",
    ],
  },
  {
    id: "flux",
    name: "Flux",
    type: "image",
    description: "Black Forest Labs' high-quality image model",
    promptFormats: ["natural", "structured"],
    params: [
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"], default: "1:1" },
      { name: "variant", label: "Variant", type: "select", options: ["pro", "dev", "schnell"], default: "pro" },
      { name: "guidance", label: "Guidance Scale", type: "number", min: 1, max: 20, step: 0.5, default: 7.5 },
    ],
    tips: [
      "Flux excels at photorealistic images and text rendering",
      "Use detailed descriptions for best results",
      "Specify lighting conditions and camera settings for realism",
    ],
  },
  {
    id: "ideogram",
    name: "Ideogram",
    type: "image",
    description: "Strong at text rendering and graphic design",
    promptFormats: ["natural", "structured"],
    params: [
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["1:1", "16:9", "9:16", "4:3", "3:4", "10:16", "16:10"], default: "1:1" },
      { name: "model", label: "Model", type: "select", options: ["3.0", "2.0", "1.0"], default: "3.0" },
      { name: "style", label: "Style", type: "select", options: ["auto", "general", "realistic", "design", "render_3d", "anime"], default: "auto" },
    ],
    tips: [
      "Best-in-class for generating text within images",
      "Use quotes around text you want rendered",
      "Great for logos, posters, and graphic design work",
    ],
  },
  // ── Video Models ──
  {
    id: "runway",
    name: "Runway Gen-4",
    type: "video",
    description: "Runway's latest video generation model",
    promptFormats: ["natural", "json", "timed"],
    params: [
      { name: "duration", label: "Duration (s)", type: "select", options: ["5", "10"], default: "10" },
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["16:9", "9:16", "1:1"], default: "16:9" },
      { name: "resolution", label: "Resolution", type: "select", options: ["720p", "1080p"], default: "1080p" },
    ],
    tips: [
      "Describe camera movements explicitly (dolly, pan, zoom, tracking shot)",
      "Specify the mood and atmosphere of the scene",
      "Use time-based prompting for precise control over scene progression",
      "Keep subjects and actions simple for best coherence",
    ],
  },
  {
    id: "sora",
    name: "Sora",
    type: "video",
    description: "OpenAI's video generation model",
    promptFormats: ["natural", "structured", "timed"],
    params: [
      { name: "duration", label: "Duration (s)", type: "select", options: ["5", "10", "15", "20"], default: "10" },
      { name: "resolution", label: "Resolution", type: "select", options: ["480p", "720p", "1080p"], default: "1080p" },
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["16:9", "9:16", "1:1"], default: "16:9" },
    ],
    tips: [
      "Sora understands complex natural language descriptions",
      "Describe physics and real-world interactions for realistic motion",
      "Specify the visual style (cinematic, documentary, animation, etc.)",
      "Include details about lighting changes and time of day",
    ],
  },
  {
    id: "kling",
    name: "Kling 2.1",
    type: "video",
    description: "Kuaishou's video generation with strong motion",
    promptFormats: ["natural", "structured", "timed"],
    params: [
      { name: "duration", label: "Duration (s)", type: "select", options: ["5", "10"], default: "5" },
      { name: "mode", label: "Mode", type: "select", options: ["standard", "professional"], default: "professional" },
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["16:9", "9:16", "1:1"], default: "16:9" },
    ],
    tips: [
      "Kling excels at dynamic action scenes and motion",
      "Describe movement patterns clearly",
      "Works well with cinematic camera movements",
      "Good at maintaining character consistency in short clips",
    ],
  },
  {
    id: "seedance",
    name: "Seedance",
    type: "video",
    description: "ByteDance's dance and motion video model",
    promptFormats: ["natural", "timed", "json"],
    params: [
      { name: "duration", label: "Duration (s)", type: "select", options: ["5", "10", "15"], default: "10" },
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["16:9", "9:16", "1:1"], default: "16:9" },
      { name: "motion", label: "Motion Intensity", type: "select", options: ["low", "medium", "high"], default: "medium" },
    ],
    tips: [
      "Particularly strong at dance choreography and rhythmic movements",
      "Describe the style of dance or movement in detail",
      "Specify music genre/tempo for better motion matching",
      "Use time-based prompting for choreographed sequences",
    ],
  },
  {
    id: "veo",
    name: "Veo 3",
    type: "video",
    description: "Google DeepMind's video generation model",
    promptFormats: ["natural", "structured", "timed"],
    params: [
      { name: "duration", label: "Duration (s)", type: "select", options: ["5", "10", "15"], default: "10" },
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["16:9", "9:16", "1:1"], default: "16:9" },
      { name: "resolution", label: "Resolution", type: "select", options: ["720p", "1080p", "4K"], default: "1080p" },
    ],
    tips: [
      "Veo 3 generates audio alongside video — describe sounds too",
      "Strong at understanding physics and realistic motion",
      "Cinematic descriptions with specific camera language work best",
      "Include ambient audio descriptions for more immersive results",
    ],
  },
  {
    id: "minimax",
    name: "MiniMax (Hailuo)",
    type: "video",
    description: "MiniMax's video generation with strong consistency",
    promptFormats: ["natural", "structured"],
    params: [
      { name: "duration", label: "Duration (s)", type: "select", options: ["5", "6"], default: "6" },
      { name: "aspect", label: "Aspect Ratio", type: "select", options: ["16:9", "9:16", "1:1"], default: "16:9" },
    ],
    tips: [
      "Strong at maintaining visual consistency throughout the clip",
      "Describe the scene with clear subject-action-setting structure",
      "Works well with cinematic and commercial-style descriptions",
    ],
  },
];

export function getModel(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export function getImageModels(): AIModel[] {
  return AI_MODELS.filter((m) => m.type === "image");
}

export function getVideoModels(): AIModel[] {
  return AI_MODELS.filter((m) => m.type === "video");
}
