import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import type { RepurposeBrief } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RepurposeBrief;
    if (!body.originalContent) {
      return NextResponse.json(
        { error: "originalContent is required" },
        { status: 400 }
      );
    }
    const provider = getAiProvider();
    const variants = await provider.repurposeContent(body);
    return NextResponse.json({ variants });
  } catch (error) {
    console.error("[api/repurpose] error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
