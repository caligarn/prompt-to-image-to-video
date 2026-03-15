export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  modelType: "image" | "video" | "both";
  compatibleModels: string[]; // model IDs
  format: "natural" | "json" | "timed" | "structured";
  prompt: string;
  description: string;
  tags: string[];
}

export const CATEGORIES = [
  "Cinematic",
  "Portrait",
  "Landscape",
  "Abstract",
  "Product",
  "Architecture",
  "Action",
  "Dance & Motion",
  "Nature",
  "Sci-Fi & Fantasy",
  "Commercial",
  "Animation",
];

export const TEMPLATES: PromptTemplate[] = [
  // ── Image Templates ──
  {
    id: "cinematic-portrait",
    title: "Cinematic Portrait",
    category: "Portrait",
    modelType: "image",
    compatibleModels: ["midjourney", "dalle", "flux", "ideogram"],
    format: "natural",
    prompt: "A cinematic portrait of [subject] with dramatic side lighting, shallow depth of field, shot on 85mm lens, film grain, moody atmosphere, [color palette] color grading, professional photography",
    description: "Professional cinematic portrait with dramatic lighting",
    tags: ["portrait", "cinematic", "dramatic", "photography"],
  },
  {
    id: "product-hero",
    title: "Product Hero Shot",
    category: "Product",
    modelType: "image",
    compatibleModels: ["midjourney", "dalle", "flux", "ideogram"],
    format: "natural",
    prompt: "Professional product photography of [product], floating in mid-air, clean [background color] background, soft studio lighting with rim light, subtle shadow below, 4K commercial quality, minimalist composition",
    description: "Clean commercial product photography",
    tags: ["product", "commercial", "clean", "professional"],
  },
  {
    id: "epic-landscape",
    title: "Epic Landscape",
    category: "Landscape",
    modelType: "image",
    compatibleModels: ["midjourney", "dalle", "flux"],
    format: "natural",
    prompt: "Breathtaking panoramic landscape of [location/scene], golden hour lighting, dramatic clouds, [season] atmosphere, ultra wide angle shot, National Geographic quality, vivid colors, sharp detail throughout",
    description: "Stunning wide landscape with golden hour lighting",
    tags: ["landscape", "nature", "panoramic", "golden hour"],
  },
  {
    id: "scifi-environment",
    title: "Sci-Fi Environment",
    category: "Sci-Fi & Fantasy",
    modelType: "image",
    compatibleModels: ["midjourney", "dalle", "flux"],
    format: "structured",
    prompt: "Subject: [futuristic scene description]\nStyle: concept art, matte painting\nLighting: volumetric neon lighting, atmospheric haze\nColor palette: [cyberpunk blues and purples / warm amber / cold teal]\nMood: awe-inspiring, vast scale\nDetails: intricate mechanical details, holographic elements, flying vehicles in distance",
    description: "Detailed sci-fi concept art with structured prompt",
    tags: ["scifi", "concept art", "futuristic", "environment"],
  },
  {
    id: "mj-multi-prompt",
    title: "Midjourney Multi-Prompt",
    category: "Abstract",
    modelType: "image",
    compatibleModels: ["midjourney"],
    format: "structured",
    prompt: "[main subject]::2 [artistic style]::1.5 [lighting/mood]::1 [background element]::0.5 --no [unwanted elements]",
    description: "Midjourney multi-prompt with weighted elements",
    tags: ["midjourney", "multi-prompt", "weighted", "advanced"],
  },
  {
    id: "architectural-viz",
    title: "Architectural Visualization",
    category: "Architecture",
    modelType: "image",
    compatibleModels: ["midjourney", "dalle", "flux"],
    format: "natural",
    prompt: "Photorealistic architectural visualization of [building type], modern [style] design, floor-to-ceiling glass windows, surrounded by [landscaping], late afternoon sun casting long shadows, people walking nearby for scale, ultra detailed, 8K resolution, architectural photography by Iwan Baan",
    description: "Professional architectural rendering",
    tags: ["architecture", "modern", "photorealistic", "visualization"],
  },
  // ── Video Templates ──
  {
    id: "cinematic-drone",
    title: "Cinematic Drone Shot",
    category: "Cinematic",
    modelType: "video",
    compatibleModels: ["runway", "sora", "kling", "veo", "minimax"],
    format: "natural",
    prompt: "Cinematic aerial drone shot slowly rising above [location], revealing a vast [landscape] stretching to the horizon, golden hour light casting warm shadows, gentle camera tilt from ground level to bird's eye view, smooth cinematic motion, 24fps film look",
    description: "Sweeping aerial reveal shot",
    tags: ["drone", "aerial", "cinematic", "reveal"],
  },
  {
    id: "timed-action-sequence",
    title: "Timed Action Sequence",
    category: "Action",
    modelType: "video",
    compatibleModels: ["runway", "sora", "kling", "seedance", "veo"],
    format: "timed",
    prompt: "[0:00-0:02] Close-up of [subject's] face, intense expression, shallow depth of field\n[0:02-0:04] Camera pulls back to medium shot as [subject] begins to [action]\n[0:04-0:07] Wide angle tracking shot following the [action] in motion\n[0:07-0:10] Slow motion capture of the climactic moment, dramatic lighting, particles/debris in the air",
    description: "Precisely timed action sequence with camera direction",
    tags: ["action", "timed", "dynamic", "slow-motion"],
  },
  {
    id: "json-video-prompt",
    title: "JSON Scene Control",
    category: "Cinematic",
    modelType: "video",
    compatibleModels: ["runway", "seedance"],
    format: "json",
    prompt: `{
  "scene": {
    "setting": "[environment description]",
    "time_of_day": "golden hour",
    "weather": "clear with light haze"
  },
  "subject": {
    "description": "[main subject]",
    "action": "[what they are doing]",
    "emotion": "[emotional state]"
  },
  "camera": {
    "movement": "slow dolly forward",
    "angle": "eye level",
    "lens": "35mm",
    "focus": "rack focus from foreground to subject"
  },
  "style": {
    "look": "cinematic film",
    "color_grade": "warm amber tones",
    "grain": "subtle film grain"
  }
}`,
    description: "JSON-structured prompt for precise scene control",
    tags: ["json", "structured", "precise", "cinematic"],
  },
  {
    id: "dance-choreography",
    title: "Dance Choreography",
    category: "Dance & Motion",
    modelType: "video",
    compatibleModels: ["seedance", "kling", "sora", "veo"],
    format: "timed",
    prompt: "[0:00-0:03] Wide shot of dancer in [setting], standing still in opening pose, dramatic lighting from above\n[0:03-0:06] Dancer begins fluid [dance style] movements, camera slowly orbits around them\n[0:06-0:10] Dynamic sequence of [specific moves], close-up shots intercut with wide angles\n[0:10-0:15] Climactic combo of movements building in energy, camera pulls back to reveal full scene, final pose",
    description: "Choreographed dance sequence with camera direction",
    tags: ["dance", "choreography", "motion", "timed"],
  },
  {
    id: "nature-timelapse",
    title: "Nature Timelapse",
    category: "Nature",
    modelType: "video",
    compatibleModels: ["sora", "runway", "veo", "kling"],
    format: "timed",
    prompt: "[0:00-0:05] Dawn breaking over [landscape], sky transitioning from deep purple to soft pink and orange, locked-off wide shot\n[0:05-0:10] Sun rises higher, light rays streaming through [elements], shadows shifting across the terrain\n[0:10-0:15] Full daylight reveals the scene in rich detail, clouds moving swiftly overhead, [wildlife/nature elements] coming to life",
    description: "Compressed time nature sequence showing light changes",
    tags: ["nature", "timelapse", "landscape", "dawn"],
  },
  {
    id: "commercial-product",
    title: "Product Commercial",
    category: "Commercial",
    modelType: "video",
    compatibleModels: ["runway", "sora", "kling", "minimax", "veo"],
    format: "natural",
    prompt: "Sleek product commercial for [product]. Camera slowly orbits around [product] on a [surface] with [background]. Dramatic studio lighting with sharp highlights on [material/surface]. Shallow depth of field, subtle reflections. Premium commercial aesthetic, smooth slow-motion, clean and minimal composition.",
    description: "Premium product commercial with studio lighting",
    tags: ["commercial", "product", "premium", "studio"],
  },
  {
    id: "veo3-with-audio",
    title: "Scene with Audio (Veo 3)",
    category: "Cinematic",
    modelType: "video",
    compatibleModels: ["veo"],
    format: "structured",
    prompt: "Visual: [Detailed visual scene description with camera movement, subject action, and lighting]\n\nAudio: [Ambient sounds] — [specific sound effects timed to actions] — [background music mood/genre]\n\nExample:\nVisual: A lone musician plays acoustic guitar on a rain-soaked city rooftop at night, neon signs reflecting in puddles, camera slowly pushes in from wide to medium close-up\n\nAudio: Rain pattering on concrete — gentle acoustic guitar melody — distant city traffic hum — occasional thunder rumble",
    description: "Veo 3 prompt with integrated audio description",
    tags: ["veo3", "audio", "immersive", "cinematic"],
  },
  {
    id: "anime-scene",
    title: "Anime Scene",
    category: "Animation",
    modelType: "video",
    compatibleModels: ["kling", "runway", "sora"],
    format: "natural",
    prompt: "Anime-style scene of [character description] in [setting]. [Action/motion description]. Studio Ghibli inspired with soft watercolor backgrounds, detailed character animation, wind blowing through [elements], warm afternoon light, hand-drawn aesthetic, 24fps smooth animation",
    description: "Anime-style animated scene with Ghibli influence",
    tags: ["anime", "animation", "ghibli", "stylized"],
  },
];
