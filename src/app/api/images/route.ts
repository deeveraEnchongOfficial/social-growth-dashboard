import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import type { ImageBrief } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ImageBrief & { count?: number };
    if (!body.aspectRatio || !body.imageType) {
      return NextResponse.json(
        { error: "aspectRatio and imageType are required" },
        { status: 400 }
      );
    }
    const provider = getAiProvider();
    const images = await provider.generateImages(body, body.count ?? 4);
    return NextResponse.json({ images });
  } catch (error) {
    console.error("[api/images] error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
