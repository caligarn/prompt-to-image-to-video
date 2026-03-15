import { AIModel } from "./models";

// ── Vocabulary Banks ──

const SHOT_TYPES = [
  "extreme close-up", "close-up", "medium close-up", "medium shot",
  "medium wide shot", "wide shot", "extreme wide shot", "establishing shot",
  "over-the-shoulder", "two-shot", "insert shot", "cutaway",
];

const CAMERA_MOVEMENTS = [
  "dolly in", "dolly out", "dolly forward", "dolly back",
  "pan left", "pan right", "tilt up", "tilt down",
  "tracking shot", "crane shot", "steadicam", "handheld",
  "push in", "pull back", "orbit", "arc shot",
  "whip pan", "rack focus", "follow shot", "boom shot",
];

const CAMERA_ANGLES = [
  "eye level", "low angle", "high angle", "bird's eye view",
  "worm's eye view", "Dutch angle", "overhead shot", "canted angle",
];

const LENS_LANGUAGE = [
  "24mm wide angle", "35mm", "50mm", "85mm portrait lens",
  "135mm telephoto", "anamorphic lens", "macro lens",
  "shallow depth of field", "deep focus", "bokeh",
  "rack focus", "split diopter",
];

const LIGHTING_DIRECTION = [
  "Rembrandt lighting", "chiaroscuro", "rim light", "backlight",
  "key light with soft fill", "high-key lighting", "low-key lighting",
  "practical lighting", "motivated lighting", "volumetric light rays",
  "dappled light", "silhouette lighting", "three-point lighting",
  "natural window light", "neon-lit", "candlelit",
];

const COLOR_GRADING = [
  "warm amber tones", "cool blue tones", "desaturated muted palette",
  "high contrast", "teal and orange color grade", "monochromatic",
  "cross-processed", "bleach bypass look", "Kodak Portra palette",
  "cinematic LUT", "golden hour warmth", "moonlit cool tones",
];

const FILM_TEXTURE = [
  "35mm film grain", "16mm film stock", "IMAX quality",
  "anamorphic lens flare", "film noir aesthetic", "cinema verite",
  "shot on Arri Alexa", "Kodachrome colors", "celluloid texture",
];

const STAGE_DIRECTIONS = [
  "subject enters frame from left",
  "figure stands center frame",
  "positioned in the foreground",
  "receding into the background",
  "subject framed against negative space",
  "off-center composition using rule of thirds",
  "leading lines draw the eye toward",
  "subject silhouetted against",
  "figure occupies the lower third",
  "layered depth with foreground, midground, background elements",
];

const VIDEO_PACING = [
  "slow, contemplative pace",
  "building momentum",
  "rhythmic editing",
  "lingering take",
  "quick cuts between angles",
  "continuous one-shot take",
  "gradual reveal",
  "held frame, letting the action breathe",
];

// ── Detection helpers ──

function containsAny(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter((t) => lower.includes(t.toLowerCase()));
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Categories ──

interface EnhancementCategory {
  label: string;
  key: string;
  terms: string[];
  detect: string[]; // simplified detection keywords
  pick: number; // how many to inject
}

const IMAGE_CATEGORIES: EnhancementCategory[] = [
  {
    label: "Shot Type",
    key: "shot",
    terms: SHOT_TYPES,
    detect: ["close-up", "wide shot", "medium shot", "establishing", "over-the-shoulder", "two-shot", "insert"],
    pick: 1,
  },
  {
    label: "Camera Angle",
    key: "angle",
    terms: CAMERA_ANGLES,
    detect: ["eye level", "low angle", "high angle", "bird", "worm", "dutch", "overhead", "canted"],
    pick: 1,
  },
  {
    label: "Lens",
    key: "lens",
    terms: LENS_LANGUAGE,
    detect: ["mm", "lens", "depth of field", "bokeh", "focus", "diopter", "anamorphic", "macro", "telephoto", "wide angle"],
    pick: 1,
  },
  {
    label: "Lighting",
    key: "lighting",
    terms: LIGHTING_DIRECTION,
    detect: ["light", "lighting", "lit", "chiaroscuro", "rembrandt", "silhouette", "backlight", "rim light", "neon", "candle"],
    pick: 1,
  },
  {
    label: "Color Grade",
    key: "color",
    terms: COLOR_GRADING,
    detect: ["tone", "tones", "palette", "grade", "grading", "color grade", "lut", "portra", "monochrom", "desaturated", "contrast"],
    pick: 1,
  },
  {
    label: "Film Texture",
    key: "texture",
    terms: FILM_TEXTURE,
    detect: ["film grain", "film stock", "imax", "lens flare", "noir", "verite", "arri", "alexa", "kodachrome", "celluloid", "16mm", "35mm film"],
    pick: 1,
  },
  {
    label: "Composition",
    key: "composition",
    terms: STAGE_DIRECTIONS,
    detect: ["enters frame", "center frame", "foreground", "background", "negative space", "rule of thirds", "leading lines", "silhouetted", "lower third", "layered depth"],
    pick: 1,
  },
];

const VIDEO_CATEGORIES: EnhancementCategory[] = [
  ...IMAGE_CATEGORIES,
  {
    label: "Camera Movement",
    key: "movement",
    terms: CAMERA_MOVEMENTS,
    detect: ["dolly", "pan", "tilt", "tracking", "crane", "steadicam", "handheld", "push in", "pull back", "orbit", "arc", "whip", "rack focus", "follow", "boom"],
    pick: 1,
  },
  {
    label: "Pacing",
    key: "pacing",
    terms: VIDEO_PACING,
    detect: ["pace", "pacing", "momentum", "editing", "lingering", "one-shot", "continuous", "quick cuts", "held frame", "reveal"],
    pick: 1,
  },
];

// ── Main Enhancement ──

export interface Enhancement {
  category: string;
  addition: string;
}

export interface EnhancedPrompt {
  text: string;
  enhancements: Enhancement[];
}

function hasCategoryPresent(prompt: string, category: EnhancementCategory): boolean {
  const lower = prompt.toLowerCase();
  return category.detect.some((keyword) => lower.includes(keyword));
}

export function enhancePrompt(prompt: string, model: AIModel): EnhancedPrompt {
  if (!prompt.trim()) return { text: "", enhancements: [] };

  const categories = model.type === "video" ? VIDEO_CATEGORIES : IMAGE_CATEGORIES;
  const enhancements: Enhancement[] = [];
  const additions: string[] = [];

  for (const category of categories) {
    if (hasCategoryPresent(prompt, category)) continue;

    // Pick terms that aren't already in the prompt
    const available = category.terms.filter(
      (t) => !prompt.toLowerCase().includes(t.toLowerCase())
    );
    if (available.length === 0) continue;

    const picked = pickRandom(available, category.pick);
    for (const term of picked) {
      enhancements.push({ category: category.label, addition: term });
      additions.push(term);
    }
  }

  if (additions.length === 0) return { text: prompt, enhancements: [] };

  // Build enhanced prompt — append as a cinematography direction block
  const directionBlock = additions.join(", ");
  const separator = prompt.endsWith(".") || prompt.endsWith(",") || prompt.endsWith(";") ? " " : ". ";
  const enhanced = `${prompt.trimEnd()}${separator}${directionBlock}`;

  return { text: enhanced, enhancements };
}
