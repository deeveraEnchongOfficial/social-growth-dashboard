import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongo";
import { KnowledgeEntryModel } from "@/lib/db/models";

/**
 * PUT /api/knowledge/[id] — updates a knowledge entry.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conn = await connectMongo();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const update: Record<string, unknown> = {};

    if (body.title !== undefined) update.title = body.title;
    if (body.description !== undefined) update.description = body.description;
    if (body.category !== undefined) update.category = body.category;
    if (body.priority !== undefined) update.priority = body.priority;
    if (body.content !== undefined) {
      update.content = body.content;
      update.wordCount = body.content.trim().split(/\s+/).filter(Boolean).length;
    }
    if (body.status !== undefined) update.status = body.status;

    const updated = await KnowledgeEntryModel.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true }
    ).lean().exec();

    if (!updated) {
      return NextResponse.json(
        { error: "Knowledge entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      entry: {
        id: updated._id.toString(),
        title: updated.title,
        description: updated.description,
        category: updated.category,
        priority: updated.priority,
        content: updated.content,
        wordCount: updated.wordCount,
        usedIn: updated.usedCount,
        status: updated.status,
        updated: "Just now",
      },
    });
  } catch (error) {
    console.error("[api/knowledge] PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge entry" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/knowledge/[id] — deletes a knowledge entry.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conn = await connectMongo();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 500 }
      );
    }

    const deleted = await KnowledgeEntryModel.findByIdAndDelete(
      params.id
    ).exec();

    if (!deleted) {
      return NextResponse.json(
        { error: "Knowledge entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("[api/knowledge] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge entry" },
      { status: 500 }
    );
  }
}
