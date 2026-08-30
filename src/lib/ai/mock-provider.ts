import type {
  ContentDraft,
  VideoScript,
  GeneratedImage,
  RepurposeVariant,
  OutreachMessage,
  AiStrategySummary,
  Platform,
} from "../types";
import type {
  AiProvider,
  ContentBrief,
  ScriptBrief,
  ImageBrief,
  RepurposeBrief,
  OutreachBrief,
} from "./types";
import {
  sampleContentDraft,
  sampleVideoScript,
  sampleImages,
  sampleRepurposeVariants,
  aiStrategySummary,
} from "../mock/data";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Mock AI provider — returns realistic canned outputs that match the
 * reference product experience. Implements the same interface as real
 * providers so swapping is a config change, not a code change.
 */
export class MockAiProvider implements AiProvider {
  readonly name = "mock";

  async generateContent(brief: ContentBrief): Promise<ContentDraft> {
    await delay(900);
    return {
      ...sampleContentDraft,
      id: id("cd"),
      type: brief.contentType,
      platform: brief.platform,
      tone: brief.tone,
      title: brief.topic
        ? `${brief.topic} — on-brand draft`
        : sampleContentDraft.title,
      caption: brief.notes
        ? `${sampleContentDraft.caption}\n\n(${brief.notes})`
        : sampleContentDraft.caption,
      cta: brief.cta || sampleContentDraft.cta,
      createdAt: "Just now",
    };
  }

  async generateScript(brief: ScriptBrief): Promise<VideoScript> {
    await delay(900);
    return {
      ...sampleVideoScript,
      id: id("vs"),
      topic: brief.topic || sampleVideoScript.topic,
      category: brief.category || sampleVideoScript.category,
      length: brief.length || sampleVideoScript.length,
      speaker: brief.speaker || sampleVideoScript.speaker,
      tone: brief.tone || sampleVideoScript.tone,
      cta: brief.cta || sampleVideoScript.cta,
      createdAt: "Just now",
    };
  }

  async generateImages(brief: ImageBrief, count = 4): Promise<GeneratedImage[]> {
    await delay(1200);
    return Array.from({ length: count }, (_, i) => {
      const sample = sampleImages[i % sampleImages.length];
      const seed = Math.floor(Math.random() * 1000000);
      const prompt = encodeURIComponent(`${brief.brandStyle || "editorial"} ${brief.topic || "product visual"} ${brief.imageType || ""}`);
      const width = brief.aspectRatio?.includes("16:9") ? 1024 : brief.aspectRatio?.includes("9:16") ? 576 : 1024;
      const height = brief.aspectRatio?.includes("16:9") ? 576 : brief.aspectRatio?.includes("9:16") ? 1024 : 1024;
      const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&seed=${seed + i}&nologo=true`;
      return {
        ...sample,
        id: id("im"),
        aspectRatio: brief.aspectRatio || sampleImages[0].aspectRatio,
        status: "Drafted" as const,
        imageUrl,
      };
    });
  }

  async repurposeContent(brief: RepurposeBrief): Promise<RepurposeVariant[]> {
    await delay(1000);
    return sampleRepurposeVariants.map((v) => ({
      ...v,
      id: id("rv"),
      cta: brief.cta || v.cta,
    }));
  }

  async generateOutreach(
    brief: OutreachBrief
  ): Promise<Partial<OutreachMessage>> {
    await delay(800);
    const isDm = brief.channel === "Instagram DM";
    const body = isDm
      ? `Hi ${brief.creatorName.split(" ")[0]} — I've been following your ${
          brief.bio.split("·")[0]?.trim() || "content"
        } and your work is exactly what we look for in a partner.\n\nWe're GrowthCo. We're building something that aligns with what your audience already cares about. Would love to send you a sample kit — no strings.\n\nIf it sparks something, we'd be open to a paid collab around: ${brief.angle}. Worth a quick chat?`
      : `Hi ${brief.creatorName} —\n\nWe noticed your work in ${
          brief.category
        }. GrowthCo aligns with your audience and we'd love to explore a partnership around: ${brief.angle}.\n\nReply here and I'll send the details.\n\n— Alex, GrowthCo`;
    return {
      channel: brief.channel,
      type: brief.type,
      body,
      status: "Drafted" as const,
      lastAction: "AI drafted",
      time: "Just now",
    };
  }

  async summarizePerformance(
    posts: { caption: string; platform: Platform; engagementRate: number }[]
  ): Promise<AiStrategySummary> {
    await delay(700);
    void posts;
    return aiStrategySummary;
  }
}

export const mockAiProvider = new MockAiProvider();
