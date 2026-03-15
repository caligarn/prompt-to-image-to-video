import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json(
      { error: "FAL_KEY not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  fal.config({ credentials: falKey });

  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const result = await fal.subscribe("fal-ai/flux/schnell", {
    input: {
      prompt,
      image_size: "landscape_16_9",
      num_images: 1,
    },
  });

  const images = result.data?.images;
  if (!images || images.length === 0) {
    return NextResponse.json({ error: "No image generated" }, { status: 500 });
  }

  return NextResponse.json({ imageUrl: images[0].url });
}
