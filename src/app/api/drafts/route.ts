import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongo";
import { ContentDraftModel } from "@/lib/db/models";

/**
 * POST /api/drafts — saves a content draft to the database.
 */
export async function POST(request: Request) {
  try {
    const conn = await connectMongo();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, platform, tone, title, hook, caption, cta, hashtags, visualSuggestion, brandSafety, source } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const draft = await ContentDraftModel.create({
      type: type || "Instagram caption",
      platform: platform || "",
      tone: tone || "",
      title,
      hook: hook || "",
      caption: caption || "",
      cta: cta || "",
      hashtags: hashtags || [],
      visualSuggestion: visualSuggestion || "",
      brandSafety: brandSafety || "",
      status: "Drafted",
      source: source || "AI · content-gen",
    });

    return NextResponse.json({
      id: draft._id.toString(),
      title: draft.title,
      status: draft.status,
    });
  } catch (error) {
    console.error("[api/drafts] POST error:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}
