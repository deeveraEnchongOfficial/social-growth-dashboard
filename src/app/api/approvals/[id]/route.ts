import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongo";
import { ApprovalItemModel } from "@/lib/db/models";

/**
 * PUT /api/approvals/[id] — updates an approval item's status.
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

    if (body.status !== undefined) update.status = body.status;
    if (body.reviewer !== undefined) update.reviewer = body.reviewer;
    if (body.title !== undefined) update.title = body.title;
    if (body.preview !== undefined) update.preview = body.preview;
    if (body.brandSafety !== undefined) update.brandSafety = body.brandSafety;

    const updated = await ApprovalItemModel.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true }
    ).lean().exec();

    if (!updated) {
      return NextResponse.json(
        { error: "Approval item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      item: {
        id: updated._id.toString(),
        type: updated.type,
        status: updated.status,
        aiSource: updated.aiSource,
        createdAt: "Just now",
        reviewer: updated.reviewer,
        title: updated.title,
        preview: updated.preview,
        brandSafety: updated.brandSafety,
      },
    });
  } catch (error) {
    console.error("[api/approvals] PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update approval item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/approvals/[id] — deletes an approval item.
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

    const deleted = await ApprovalItemModel.findByIdAndDelete(params.id).exec();

    if (!deleted) {
      return NextResponse.json(
        { error: "Approval item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("[api/approvals] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete approval item" },
      { status: 500 }
    );
  }
}
