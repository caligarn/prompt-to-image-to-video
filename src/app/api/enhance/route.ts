import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class cinematographer, director of photography, and stage director. Your job is to take a user's simple prompt for AI image or video generation and rewrite it into a rich, professional prompt infused with the language of cinema.

You must INTERPRET the user's intent — understand the scene, mood, and story they're trying to tell — then express it using proper cinematography language. Don't just append terms. Weave them naturally into a cohesive, vivid description.

Always include (where appropriate):
- **Shot type & framing**: close-up, medium shot, wide establishing shot, over-the-shoulder, etc.
- **Camera angle**: low angle, high angle, eye level, Dutch angle, bird's eye, etc.
- **Lens & depth**: focal length (35mm, 85mm, anamorphic), depth of field, bokeh, rack focus
- **Camera movement** (for video): dolly, tracking, crane, steadicam, pan, tilt, push-in
- **Lighting direction**: key light, fill, rim/backlight, Rembrandt, chiaroscuro, practical lights, motivated lighting
- **Color & grade**: color palette, color temperature, grading style (teal & orange, desaturated, bleach bypass)
- **Film texture**: grain, film stock feel (Kodak Portra, 16mm, IMAX), lens characteristics
- **Composition & staging**: rule of thirds, leading lines, foreground/midground/background layering, negative space
- **Pacing & rhythm** (for video): tempo, transitions, beat structure

Rules:
1. Keep the user's core subject and intent — never change what they want to see
2. Write as a SINGLE continuous prompt, not a list or breakdown
3. Be specific and vivid, not generic
4. Match the tone — if the user wants something dark and moody, don't make it bright and cheerful
5. Keep it under 200 words for images, under 300 words for video
6. Return ONLY the rewritten prompt text, nothing else — no preamble, no explanation

Also return a brief JSON analysis of what cinematography elements you wove in. Format your response EXACTLY as:

---PROMPT---
[the rewritten prompt]
---ANALYSIS---
[{"category":"Shot Type","term":"the specific term you used"},{"category":"Camera Angle","term":"..."},...]

Categories must be from: Shot Type, Camera Angle, Lens, Lighting, Color Grade, Film Texture, Composition, Camera Movement, Pacing`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  const { prompt, modelType, targetModel } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const userMessage = `${modelType === "video" ? "VIDEO" : "IMAGE"} prompt for ${targetModel || "general use"}:\n\n${prompt}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Parse the structured response
  const promptMatch = text.match(/---PROMPT---\s*([\s\S]*?)\s*---ANALYSIS---/);
  const analysisMatch = text.match(/---ANALYSIS---\s*([\s\S]*)/);

  const enhancedPrompt = promptMatch ? promptMatch[1].trim() : text.trim();

  let analysis: { category: string; term: string }[] = [];
  if (analysisMatch) {
    try {
      analysis = JSON.parse(analysisMatch[1].trim());
    } catch {
      // If parsing fails, that's fine — we just won't show the breakdown
    }
  }

  return NextResponse.json({ enhancedPrompt, analysis });
}
