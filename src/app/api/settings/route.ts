import { NextResponse } from "next/server";
import { loadSettings, saveSettings } from "@/lib/settings-loader";
import { maskApiKey, type AppSettings } from "@/lib/config";

/**
 * GET /api/settings — returns all settings with API keys masked.
 */
export async function GET() {
  try {
    const settings = await loadSettings();
    // Mask API keys before sending to the client
    const masked = maskSettingsKeys(settings);
    return NextResponse.json(masked);
  } catch {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings — saves all settings.
 * API keys that arrive as masked values (••••...) are preserved from DB.
 */
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<AppSettings>;

    // Load current settings to preserve masked API keys
    const current = await loadSettings();
    const merged = mergeSettings(current, body);

    await saveSettings(merged);

    // Return masked version
    const masked = maskSettingsKeys(merged);
    return NextResponse.json(masked);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Mask all API keys in settings before sending to client.
 */
function maskSettingsKeys(settings: AppSettings): AppSettings {
  return {
    ...settings,
    aiProviders: {
      ...settings.aiProviders,
      openai: { ...settings.aiProviders.openai, apiKey: maskApiKey(settings.aiProviders.openai.apiKey) },
      anthropic: { ...settings.aiProviders.anthropic, apiKey: maskApiKey(settings.aiProviders.anthropic.apiKey) },
      gemini: { ...settings.aiProviders.gemini, apiKey: maskApiKey(settings.aiProviders.gemini.apiKey) },
      openrouter: { ...settings.aiProviders.openrouter, apiKey: maskApiKey(settings.aiProviders.openrouter.apiKey) },
      imageApiKey: maskApiKey(settings.aiProviders.imageApiKey),
    },
    integrations: {
      tikhub: { ...settings.integrations.tikhub, apiKey: maskApiKey(settings.integrations.tikhub.apiKey) },
      apify: { ...settings.integrations.apify, apiKey: maskApiKey(settings.integrations.apify.apiKey) },
      gmail: { ...settings.integrations.gmail, apiKey: maskApiKey(settings.integrations.gmail.apiKey) },
      tiktok: { ...settings.integrations.tiktok, apiKey: maskApiKey(settings.integrations.tiktok.apiKey) },
      instagram: { ...settings.integrations.instagram, apiKey: maskApiKey(settings.integrations.instagram.apiKey) },
    },
  };
}

/**
 * Merge incoming settings with current settings.
 * If an API key arrives as a masked value (contains ••••), keep the current value.
 */
function mergeSettings(current: AppSettings, incoming: Partial<AppSettings>): AppSettings {
  const merged: AppSettings = {
    brandVoice: { ...current.brandVoice, ...incoming.brandVoice },
    guardrails: { ...current.guardrails, ...incoming.guardrails },
    notifications: { ...current.notifications, ...incoming.notifications },
    workspace: { ...current.workspace, ...incoming.workspace },
    aiProviders: { ...current.aiProviders, ...incoming.aiProviders },
    integrations: { ...current.integrations, ...incoming.integrations },
  };

  // Preserve API keys that were masked on the client
  if (incoming.aiProviders) {
    const ai = merged.aiProviders;
    const inc = incoming.aiProviders;
    if (inc.openai?.apiKey?.includes("••••")) ai.openai.apiKey = current.aiProviders.openai.apiKey;
    if (inc.anthropic?.apiKey?.includes("••••")) ai.anthropic.apiKey = current.aiProviders.anthropic.apiKey;
    if (inc.gemini?.apiKey?.includes("••••")) ai.gemini.apiKey = current.aiProviders.gemini.apiKey;
    if (inc.openrouter?.apiKey?.includes("••••")) ai.openrouter.apiKey = current.aiProviders.openrouter.apiKey;
    if (inc.imageApiKey?.includes("••••")) ai.imageApiKey = current.aiProviders.imageApiKey;
  }

  if (incoming.integrations) {
    const int = merged.integrations;
    const inc = incoming.integrations;
    if (inc.tikhub?.apiKey?.includes("••••")) int.tikhub.apiKey = current.integrations.tikhub.apiKey;
    if (inc.apify?.apiKey?.includes("••••")) int.apify.apiKey = current.integrations.apify.apiKey;
    if (inc.gmail?.apiKey?.includes("••••")) int.gmail.apiKey = current.integrations.gmail.apiKey;
    if (inc.tiktok?.apiKey?.includes("••••")) int.tiktok.apiKey = current.integrations.tiktok.apiKey;
    if (inc.instagram?.apiKey?.includes("••••")) int.instagram.apiKey = current.integrations.instagram.apiKey;
  }

  return merged;
}
