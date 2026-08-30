import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import { loadSettings } from "@/lib/settings-loader";

/**
 * POST /api/autofill
 *
 * Body: { formType: "content" | "scripts" | "images" | "repurpose" | "knowledge", hint?: string }
 * Returns: { fields: Record<string, string> }
 *
 * Uses the active AI provider to suggest values for all fields in a form.
 * The user can then review and edit before generating.
 */
export async function POST(request: Request) {
  try {
    const { formType, hint } = (await request.json()) as {
      formType: string;
      hint?: string;
    };

    if (!formType) {
      return NextResponse.json(
        { error: "formType is required" },
        { status: 400 }
      );
    }

    const settings = await loadSettings();
    const bv = settings.brandVoice;
    const provider = await getAiProvider();

    // Build a prompt that asks the AI to suggest form field values
    const prompts: Record<string, { system: string; user: string }> = {
      content: {
        system: `You are a social media strategist for ${settings.workspace.name}. Brand voice: ${bv.tone}, ${bv.personality}. Words to use: ${bv.wordsToUse}. Return ONLY valid JSON, no markdown.`,
        user: `Suggest values for a content brief form. ${hint ? `Context: ${hint}` : "Suggest a compelling topic for the brand."}
Return JSON with these exact fields:
{"goal": string, "platform": "Instagram"|"TikTok"|"LinkedIn"|"X / Twitter"|"Facebook", "tone": string, "audience": string, "topic": string, "product": string, "cta": string, "contentType": string, "notes": string}`,
      },
      scripts: {
        system: `You are a video script strategist for ${settings.workspace.name}. Brand voice: ${bv.tone}. Return ONLY valid JSON, no markdown.`,
        user: `Suggest values for a video script brief form. ${hint ? `Context: ${hint}` : "Suggest a compelling video topic."}
Return JSON with these exact fields:
{"topic": string, "category": string, "audience": string, "length": "15 seconds"|"30 seconds"|"60 seconds"|"90 seconds", "speaker": "Founder"|"Team educator"|"UGC creator", "tone": string, "cta": string, "product": string, "keyPoints": string, "claimsToAvoid": string}`,
      },
      images: {
        system: `You are an art director for ${settings.workspace.name}. Brand style: ${bv.tone}. Return ONLY valid JSON, no markdown.`,
        user: `Suggest values for an image brief form. ${hint ? `Context: ${hint}` : "Suggest a compelling visual concept."}
Return JSON with these exact fields:
{"purpose": "Carousel cover"|"Product hero"|"Educational visual", "platform": "Instagram"|"TikTok"|"LinkedIn"|"X / Twitter"|"Facebook", "aspectRatio": "1:1 Square"|"4:5 Portrait"|"9:16 Vertical"|"16:9 Landscape", "topic": string, "brandStyle": string, "palette": string, "product": string, "promptNotes": string, "imageType": string}`,
      },
      repurpose: {
        system: `You are a content repurposing expert for ${settings.workspace.name}. Return ONLY valid JSON, no markdown.`,
        user: `Suggest values for a content repurposing form. ${hint ? `Context: ${hint}` : "Suggest a compelling piece of content to repurpose."}
Return JSON with these exact fields:
{"originalContent": string, "campaignGoal": string, "audience": string, "product": string, "tone": string, "cta": string}`,
      },
      knowledge: {
        system: `You are a brand knowledge manager for ${settings.workspace.name}. Return ONLY valid JSON, no markdown.`,
        user: `Suggest values for a knowledge entry form. ${hint ? `Context: ${hint}` : "Suggest an important brand knowledge entry."}
Return JSON with these exact fields:
{"title": string, "category": string, "priority": "Low"|"Medium"|"High"|"Critical", "description": string, "relatedProduct": string, "approvedMessaging": string, "phrasesToAvoid": string, "audience": string}`,
      },
    };

    const prompt = prompts[formType];
    if (!prompt) {
      return NextResponse.json(
        { error: `Unknown formType: ${formType}` },
        { status: 400 }
      );
    }

    // Use the provider's chat method if it's OpenRouter, otherwise use mock data
    let fields: Record<string, string>;

    if (provider.name === "openrouter") {
      // Call the OpenRouter chat API directly
      const OpenRouterProvider = (await import("@/lib/ai/providers/openrouter")).OpenRouterProvider;
      if (provider instanceof OpenRouterProvider) {
        const raw = await (provider as unknown as {
          chat: (messages: { role: string; content: string }[]) => Promise<string>;
        }).chat([
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ]);

        // Parse JSON from response
        let text = raw.trim();
        const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) text = fenceMatch[1].trim();
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
        fields = JSON.parse(text);
      } else {
        fields = mockFill(formType);
      }
    } else {
      // Mock provider — return sensible defaults
      fields = mockFill(formType);
    }

    return NextResponse.json({ fields });
  } catch (error) {
    console.error("[api/autofill] error:", error);
    return NextResponse.json(
      { error: "Failed to generate form suggestions" },
      { status: 500 }
    );
  }
}

/** Mock form suggestions for when no real AI provider is configured. */
function mockFill(formType: string): Record<string, string> {
  const fills: Record<string, Record<string, string>> = {
    content: {
      goal: "Educate & inform",
      platform: "Instagram",
      tone: "Educational",
      audience: "SaaS founders",
      topic: "5 onboarding tips that reduce churn",
      product: "GrowthCo Pro",
      cta: "Save this for your next onboarding review",
      contentType: "Instagram caption",
      notes: "Focus on data-driven growth. Keep it practical and actionable.",
    },
    scripts: {
      topic: "3 onboarding mistakes founders make",
      category: "How-to tutorial",
      audience: "SaaS founders",
      length: "30 seconds",
      speaker: "Founder",
      tone: "Confident",
      cta: "Tag a founder who needs this",
      product: "GrowthCo Pro",
      keyPoints: "Planning, timing, review and iterate",
      claimsToAvoid: "No unsubstantiated claims. No guaranteed results.",
    },
    images: {
      purpose: "Product hero",
      platform: "Instagram",
      aspectRatio: "1:1 Square",
      topic: "Product launch hero visual",
      brandStyle: "Editorial, clean, modern",
      palette: "Neutral with accent blue",
      product: "GrowthCo Pro",
      promptNotes: "Clean modern workspace. No people. Leave top-left negative space for headline.",
      imageType: "Product visual",
    },
    repurpose: {
      originalContent:
        "If your landing page bounce rate is above 60%, that's a messaging signal — not a traffic problem. Here's a 30-second audit we teach in our onboarding.",
      campaignGoal: "Drive saves",
      audience: "SaaS founders",
      product: "GrowthCo Pro",
      tone: "Educational",
      cta: "Read the full playbook",
    },
    knowledge: {
      title: "Q2 product launch campaign",
      category: "Campaign priority",
      priority: "High",
      description: "Lead Q2 messaging around the product launch. Focus on data-driven growth and practical onboarding tips.",
      relatedProduct: "GrowthCo Pro",
      approvedMessaging: "Built for growing teams. Designed for modern marketers.",
      phrasesToAvoid: "No unsubstantiated claims. No guaranteed results.",
      audience: "SaaS founders",
    },
  };

  return fills[formType] ?? {};
}
