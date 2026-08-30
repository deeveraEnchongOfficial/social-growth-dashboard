import type {
  ContentDraft,
  VideoScript,
  GeneratedImage,
  RepurposeVariant,
  OutreachMessage,
  AiStrategySummary,
  Platform,
} from "../../types";
import type {
  AiProvider,
  ContentBrief,
  ScriptBrief,
  ImageBrief,
  RepurposeBrief,
  OutreachBrief,
} from "../types";
import { loadSettings } from "@/lib/settings-loader";
import { buildBrandContext } from "../brand-context";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * OpenRouter AI provider — calls the OpenRouter Chat Completions API.
 * Supports any model available on OpenRouter (Anthropic, OpenAI, Google, etc.)
 * via a single API key.
 */
export class OpenRouterProvider implements AiProvider {
  readonly name = "openrouter";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model || "anthropic/claude-3.5-sonnet";
  }

  private async chat(messages: ChatMessage[]): Promise<string> {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Growth Suite",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  /** Parse JSON from LLM response, handling markdown code fences. */
  private parseJson<T>(raw: string): T {
    let text = raw.trim();
    // Strip markdown code fences
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) text = fenceMatch[1].trim();
    // Find first { and last } to extract JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      text = text.slice(start, end + 1);
    }
    return JSON.parse(text) as T;
  }

  async generateContent(brief: ContentBrief): Promise<ContentDraft> {
    const settings = await loadSettings();
    const brandContext = await buildBrandContext(settings);

    const system = `You are a social media content writer for ${settings.workspace.name}. ${brandContext} Return ONLY valid JSON, no markdown.`;

    const user = `Write a ${brief.contentType} for ${brief.platform}.
Topic: ${brief.topic}
Audience: ${brief.audience}
Tone: ${brief.tone}
Product: ${brief.product}
CTA: ${brief.cta}
Notes: ${brief.notes}

Return JSON with these exact fields:
{"title": string, "hook": string, "caption": string, "cta": string, "hashtags": string[], "visualSuggestion": string, "brandSafety": string}`;

    const raw = await this.chat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    const parsed = this.parseJson<{
      title: string; hook: string; caption: string; cta: string;
      hashtags: string[]; visualSuggestion: string; brandSafety: string;
    }>(raw);

    return {
      id: id("cd"),
      type: brief.contentType,
      platform: brief.platform,
      tone: brief.tone,
      title: parsed.title,
      hook: parsed.hook,
      caption: parsed.caption,
      cta: parsed.cta,
      hashtags: parsed.hashtags || [],
      visualSuggestion: parsed.visualSuggestion,
      brandSafety: parsed.brandSafety,
      status: "Drafted",
      source: `AI · ${this.model}`,
      createdAt: "Just now",
    };
  }

  async generateScript(brief: ScriptBrief): Promise<VideoScript> {
    const settings = await loadSettings();
    const brandContext = await buildBrandContext(settings);

    const system = `You are a video script writer for ${settings.workspace.name}. ${brandContext} Return ONLY valid JSON, no markdown.`;

    const user = `Write a ${brief.length} video script.
Topic: ${brief.topic}
Category: ${brief.category}
Speaker: ${brief.speaker}
Tone: ${brief.tone}
Audience: ${brief.audience}
Product: ${brief.product}
Key points: ${brief.keyPoints}
CTA: ${brief.cta}

Return JSON with these exact fields:
{"hook": string, "beats": [{"beat": string, "detail": string, "bRoll": string}], "onScreenText": string, "cta": string, "visuals": string, "caption": string, "platformRecs": string}`;

    const raw = await this.chat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    const parsed = this.parseJson<{
      hook: string; beats: { beat: string; detail: string; bRoll: string }[];
      onScreenText: string; cta: string; visuals: string; caption: string; platformRecs: string;
    }>(raw);

    return {
      id: id("vs"),
      topic: brief.topic,
      category: brief.category,
      length: brief.length,
      speaker: brief.speaker,
      tone: brief.tone,
      hook: parsed.hook,
      beats: parsed.beats || [],
      onScreenText: parsed.onScreenText,
      cta: parsed.cta,
      visuals: parsed.visuals,
      caption: parsed.caption,
      platformRecs: parsed.platformRecs,
      status: "Drafted",
      createdAt: "Just now",
    };
  }

  async generateImages(brief: ImageBrief, count = 4): Promise<GeneratedImage[]> {
    const settings = await loadSettings();

    // Step 1: Use the LLM to generate image concepts (titles + descriptions + prompts)
    const system = `You are an art director for ${settings.workspace.name}. Generate image concepts. Return ONLY valid JSON, no markdown.`;

    const user = `Create ${count} distinct image concepts for a ${brief.imageType}.
Topic: ${brief.topic}
Style: ${brief.brandStyle}
Aspect ratio: ${brief.aspectRatio}
Product: ${brief.product}
Notes: ${brief.promptNotes}

Return JSON array with fields:
[{"title": string, "description": string, "brandFitScore": number, "prompt": string}]
The "prompt" field should be a detailed image generation prompt in English, suitable for a text-to-image AI. Include style, lighting, composition, and mood. Do NOT include text/words in the image.`;

    const raw = await this.chat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    let parsed: { title: string; description: string; brandFitScore: number; prompt: string }[];
    try {
      const text = raw.trim();
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      parsed = JSON.parse(start !== -1 && end !== -1 ? text.slice(start, end + 1) : text);
    } catch {
      parsed = Array.from({ length: count }, (_, i) => ({
        title: `${brief.imageType} ${i + 1}`,
        description: brief.topic,
        brandFitScore: 85 + i,
        prompt: `${brief.brandStyle} ${brief.topic} ${brief.imageType}`,
      }));
    }

    const gradients = [
      "from-amber-100 via-stone-200 to-rose-100",
      "from-stone-100 via-amber-50 to-yellow-100",
      "from-rose-100 via-stone-200 to-amber-100",
      "from-sky-100 via-stone-100 to-rose-100",
    ];

    // Step 2: Generate actual images via Pollinations.ai (free, no API key)
    return parsed.slice(0, count).map((img, i) => {
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(img.prompt || `${brief.brandStyle} ${brief.topic}`);
      const width = brief.aspectRatio.includes("16:9") ? 1024 : brief.aspectRatio.includes("9:16") ? 576 : 1024;
      const height = brief.aspectRatio.includes("16:9") ? 576 : brief.aspectRatio.includes("9:16") ? 1024 : 1024;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed + i}&nologo=true`;

      return {
        id: id("im"),
        title: img.title,
        description: img.description,
        brandFitScore: img.brandFitScore || 90,
        aspectRatio: brief.aspectRatio,
        status: "Drafted" as const,
        gradient: gradients[i % gradients.length],
        imageUrl,
      };
    });
  }

  async repurposeContent(brief: RepurposeBrief): Promise<RepurposeVariant[]> {
    const settings = await loadSettings();
    const brandContext = await buildBrandContext(settings);

    const system = `You are a content repurposing expert for ${settings.workspace.name}. ${brandContext} Return ONLY valid JSON, no markdown.`;

    const user = `Repurpose this content for multiple platforms:
Original: "${brief.originalContent}"
Goal: ${brief.campaignGoal}
Audience: ${brief.audience}
Tone: ${brief.tone}
CTA: ${brief.cta}

Create variants for: Instagram, Facebook, LinkedIn, X / Twitter, TikTok.

Return JSON array:
[{"platform": string, "hook": string, "copy": string, "cta": string, "visual": string, "status": "Drafted"}]`;

    const raw = await this.chat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    let parsed: { platform: string; hook: string; copy: string; cta: string; visual: string; status: string }[];
    try {
      const text = raw.trim();
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      parsed = JSON.parse(start !== -1 && end !== -1 ? text.slice(start, end + 1) : text);
    } catch {
      parsed = [];
    }

    return parsed.map((v) => ({
      id: id("rv"),
      platform: v.platform as Platform,
      hook: v.hook,
      copy: v.copy,
      cta: v.cta,
      visual: v.visual,
      status: "Drafted" as const,
    }));
  }

  async generateOutreach(brief: OutreachBrief): Promise<Partial<OutreachMessage>> {
    const settings = await loadSettings();
    const brandContext = await buildBrandContext(settings);

    const system = `You are an outreach specialist for ${settings.workspace.name}. ${brandContext} Write personalized, authentic messages. Return ONLY valid JSON, no markdown.`;

    const user = `Write a ${brief.channel} outreach message.
Creator: ${brief.creatorName} (${brief.handle})
Platform: ${brief.platform}
Category: ${brief.category}
Bio: ${brief.bio}
Angle: ${brief.angle}
Type: ${brief.type}

Return JSON:
{"body": string, "type": string}`;

    const raw = await this.chat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    const parsed = this.parseJson<{ body: string; type: string }>(raw);

    return {
      channel: brief.channel,
      type: parsed.type || brief.type,
      body: parsed.body,
      status: "Drafted" as const,
      lastAction: "AI drafted",
      time: "Just now",
    };
  }

  async summarizePerformance(
    posts: { caption: string; platform: Platform; engagementRate: number }[]
  ): Promise<AiStrategySummary> {
    const settings = await loadSettings();
    const brandContext = await buildBrandContext(settings);

    const system = `You are a social media analyst for ${settings.workspace.name}. ${brandContext} Return ONLY valid JSON, no markdown.`;

    const user = `Analyze these posts and provide strategy:
${posts.map((p) => `- [${p.platform}] ${p.caption} (ER: ${p.engagementRate}%)`).join("\n")}

Return JSON:
{"whatWorked": string, "whatUnderperformed": string, "whatToCreateNext": string, "whatToAvoid": string, "suggestedHooks": string[], "suggestedCarouselTopics": string[]}`;

    const raw = await this.chat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    const parsed = this.parseJson<AiStrategySummary>(raw);

    return {
      whatWorked: parsed.whatWorked || "",
      whatUnderperformed: parsed.whatUnderperformed || "",
      whatToCreateNext: parsed.whatToCreateNext || "",
      whatToAvoid: parsed.whatToAvoid || "",
      suggestedHooks: parsed.suggestedHooks || [],
      suggestedCarouselTopics: parsed.suggestedCarouselTopics || [],
    };
  }
}
