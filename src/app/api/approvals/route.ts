import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongo";
import { ApprovalItemModel } from "@/lib/db/models";

/**
 * GET /api/approvals — returns all approval items.
 */
export async function GET() {
  try {
    const conn = await connectMongo();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 500 }
      );
    }

    const docs = await ApprovalItemModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const items = docs.map((d) => ({
      id: d._id.toString(),
      type: d.type || "Content",
      status: d.status || "Needs Review",
      aiSource: d.aiSource || "AI",
      createdAt: d.createdAt ? timeAgo(d.createdAt) : "—",
      reviewer: d.reviewer || "—",
      title: d.title || "",
      preview: d.preview || "",
      brandSafety: d.brandSafety || "",
      itemId: d.itemId ? d.itemId.toString() : undefined,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[api/approvals] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval items" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/approvals — creates a new approval item (sent from a generation page).
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
    const { type, title, preview, aiSource, brandSafety, itemId } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Missing required fields: type, title" },
        { status: 400 }
      );
    }

    const item = await ApprovalItemModel.create({
      type,
      title,
      preview: preview || "",
      aiSource: aiSource || "AI",
      brandSafety: brandSafety || "Pending review.",
      itemId: itemId || undefined,
      status: "Needs Review",
      reviewer: "—",
    });

    return NextResponse.json({
      item: {
        id: item._id.toString(),
        type: item.type,
        status: item.status,
        aiSource: item.aiSource,
        createdAt: "Just now",
        reviewer: item.reviewer,
        title: item.title,
        preview: item.preview,
        brandSafety: item.brandSafety,
      },
    });
  } catch (error) {
    console.error("[api/approvals] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create approval item" },
      { status: 500 }
    );
  }
}

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
