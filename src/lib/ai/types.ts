import type {
  Platform,
  Tone,
  ContentType,
  ContentDraft,
  VideoScript,
  GeneratedImage,
  RepurposeVariant,
  OutreachMessage,
  AiStrategySummary,
} from "../types";

export interface ContentBrief {
  goal: string;
  platform: Platform;
  tone: Tone;
  audience: string;
  topic: string;
  product: string;
  cta: string;
  notes: string;
  contentType: ContentType;
}

export interface ScriptBrief {
  topic: string;
  category: string;
  audience: string;
  length: string;
  speaker: string;
  tone: Tone;
  cta: string;
  product: string;
  keyPoints: string;
  claimsToAvoid: string;
}

export interface ImageBrief {
  purpose: string;
  platform: Platform;
  aspectRatio: string;
  topic: string;
  brandStyle: string;
  palette: string;
  product: string;
  promptNotes: string;
  imageType: string;
}

export interface RepurposeBrief {
  originalContent: string;
  campaignGoal: string;
  audience: string;
  product: string;
  tone: Tone;
  cta: string;
}

export interface OutreachBrief {
  creatorName: string;
  handle: string;
  platform: Platform;
  category: string;
  bio: string;
  channel: "Instagram DM" | "Email";
  type: string;
  angle: string;
}

/**
 * Provider-agnostic AI service interface.
 * Implementations: mock (default), openai, anthropic, gemini, openrouter, image providers.
 * Swap by setting AI_PROVIDER env var and supplying credentials.
 */
export interface AiProvider {
  readonly name: string;
  generateContent(brief: ContentBrief): Promise<ContentDraft>;
  generateScript(brief: ScriptBrief): Promise<VideoScript>;
  generateImages(brief: ImageBrief, count?: number): Promise<GeneratedImage[]>;
  repurposeContent(brief: RepurposeBrief): Promise<RepurposeVariant[]>;
  generateOutreach(brief: OutreachBrief): Promise<Partial<OutreachMessage>>;
  summarizePerformance(posts: { caption: string; platform: Platform; engagementRate: number }[]): Promise<AiStrategySummary>;
}
