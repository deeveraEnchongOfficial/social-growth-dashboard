import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import type { ScriptBrief } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScriptBrief;
    if (!body.topic || !body.length) {
      return NextResponse.json(
        { error: "topic and length are required" },
        { status: 400 }
      );
    }
    const provider = getAiProvider();
    const script = await provider.generateScript(body);
    return NextResponse.json({ script });
  } catch (error) {
    console.error("[api/scripts] error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
