import { connectMongo } from "@/lib/db/mongo";
import { KnowledgeEntryModel } from "@/lib/db/models";
import { loadSettings } from "@/lib/settings-loader";
import type { AppSettings } from "@/lib/config";

/**
 * Builds a brand context string from settings + active knowledge entries.
 * This is injected into AI system prompts so the AI uses the brand's
 * markdown knowledge base as context.
 *
 * Only active (non-archived) knowledge entries are included.
 * Content is truncated to avoid exceeding token limits.
 */
export async function buildBrandContext(settings?: AppSettings): Promise<string> {
  const s = settings ?? (await loadSettings());
  const bv = s.brandVoice;

  // Fetch active knowledge entries from the database
  let knowledgeSection = "";
  const conn = await connectMongo();
  if (conn) {
    const entries = await KnowledgeEntryModel.find({ status: "Active" })
      .sort({ usedCount: -1 })
      .limit(5)
      .lean()
      .exec();

    if (entries.length > 0) {
      knowledgeSection = `\n\n## Brand Knowledge Base\n${entries.map((k) =>
        `### ${k.title}\n${k.content || ""}`
      ).join("\n\n")}`;
    }
  }

  return `Brand: ${s.workspace.name}
Brand voice: ${bv.tone}, ${bv.personality}.
Words to use: ${bv.wordsToUse}.
Words to avoid: ${bv.wordsToAvoid}.
Approved claims: ${bv.approvedClaims}.
Claims to avoid: ${bv.claimsToAvoid}.${knowledgeSection}`;
}
