import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import type { OutreachBrief } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OutreachBrief;
    if (!body.creatorName || !body.channel) {
      return NextResponse.json(
        { error: "creatorName and channel are required" },
        { status: 400 }
      );
    }
    const provider = getAiProvider();
    const message = await provider.generateOutreach(body);
    return NextResponse.json({ message });
  } catch (error) {
    console.error("[api/outreach] error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
