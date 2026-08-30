import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import type { ContentBrief } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContentBrief;
    if (!body.platform || !body.contentType) {
      return NextResponse.json(
        { error: "platform and contentType are required" },
        { status: 400 }
      );
    }
    const provider = await getAiProvider();
    const draft = await provider.generateContent(body);
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("[api/content] error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
