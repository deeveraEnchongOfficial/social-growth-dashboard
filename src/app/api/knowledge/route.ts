import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongo";
import { KnowledgeEntryModel } from "@/lib/db/models";

/**
 * GET /api/knowledge — returns all knowledge entries.
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

    const entries = await KnowledgeEntryModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const formatted = entries.map((e) => ({
      id: e._id.toString(),
      title: e.title || "",
      description: e.description || "",
      category: e.category || "",
      priority: e.priority || "Medium",
      content: e.content || "",
      wordCount: e.wordCount || 0,
      usedIn: e.usedCount || 0,
      status: e.status || "Active",
      updated: e.updatedAt
        ? timeAgo(e.updatedAt)
        : "—",
    }));

    return NextResponse.json({ entries: formatted });
  } catch (error) {
    console.error("[api/knowledge] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge entries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge — creates a new knowledge entry.
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
    const { title, description, category, priority, content } = body;

    if (!title || !category || !priority || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, category, priority, content" },
        { status: 400 }
      );
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    const entry = await KnowledgeEntryModel.create({
      title,
      description: description || "",
      category,
      priority,
      content,
      wordCount,
      usedCount: 0,
      status: "Active",
    });

    return NextResponse.json({
      entry: {
        id: entry._id.toString(),
        title: entry.title,
        description: entry.description,
        category: entry.category,
        priority: entry.priority,
        content: entry.content,
        wordCount: entry.wordCount,
        usedIn: entry.usedCount,
        status: entry.status,
        updated: "Just now",
      },
    });
  } catch (error) {
    console.error("[api/knowledge] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge entry" },
      { status: 500 }
    );
  }
}

/** Format a date as a relative time string. */
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
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
