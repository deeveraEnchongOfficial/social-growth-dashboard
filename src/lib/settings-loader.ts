import { connectMongo } from "@/lib/db/mongo";
import { SettingsModel } from "@/lib/db/models";
import {
  defaultSettings,
  type AppSettings,
  type AiProviderConfig,
  type EmailConfig,
  type DropdownValuesConfig,
} from "./config";

/**
 * Load settings from MongoDB. Falls back to env vars for API keys,
 * then to defaults if neither DB nor env is available.
 *
 * This is called server-side from API routes and Server Components.
 */
export async function loadSettings(): Promise<AppSettings> {
  const conn = await connectMongo();
  if (!conn) {
    return mergeEnv(defaultSettings);
  }

  const doc = await SettingsModel.findOne().lean().exec();
  if (!doc) {
    return mergeEnv(defaultSettings);
  }

  const settings: AppSettings = {
    brandVoice: {
      ...defaultSettings.brandVoice,
      ...(doc.brandVoice as Record<string, string>),
    },
    guardrails: {
      ...defaultSettings.guardrails,
      ...(doc.guardrails as Record<string, boolean>),
    },
    notifications: {
      ...defaultSettings.notifications,
      ...(doc.notifications as Record<string, boolean>),
    },
    aiProviders: {
      ...defaultSettings.aiProviders,
      ...(doc.aiProviders as Partial<AiProviderConfig>),
    },
    integrations: {
      ...defaultSettings.integrations,
      ...(doc.integrations as Record<string, { apiKey: string; status: string }>),
    },
    email: {
      ...defaultSettings.email,
      ...((doc.email as Partial<EmailConfig>) ?? {}),
      smtp: {
        ...defaultSettings.email.smtp,
        ...((doc.email as { smtp?: Partial<EmailConfig["smtp"]> })?.smtp ?? {}),
      },
    },
    workspace: {
      ...defaultSettings.workspace,
      ...(doc.workspace as Record<string, string>),
    },
    dropdownValues: mergeDropdownValues(
      defaultSettings.dropdownValues,
      (doc.dropdownValues as Partial<DropdownValuesConfig>) ?? {}
    ),
  };

  return mergeEnv(settings);
}

/**
 * Deep-merge dropdown values from DB over defaults.
 * Ensures every module/field exists even if DB only has partial data.
 */
function mergeDropdownValues(
  defaults: DropdownValuesConfig,
  fromDb: Partial<DropdownValuesConfig>
): DropdownValuesConfig {
  const result = { ...defaults };
  for (const moduleKey of Object.keys(defaults) as (keyof DropdownValuesConfig)[]) {
    const dbModule = fromDb[moduleKey];
    if (dbModule) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[moduleKey] = { ...defaults[moduleKey], ...dbModule };
    }
  }
  return result;
}

/**
 * Merge env var fallbacks into settings. If a DB setting is empty,
 * try the corresponding env var. This allows smooth migration from
 * env-based config to DB-based config.
 */
function mergeEnv(settings: AppSettings): AppSettings {
  const ai = settings.aiProviders;
  const integrations = settings.integrations;

  // AI provider keys
  if (!ai.openai.apiKey && process.env.OPENAI_API_KEY)
    ai.openai.apiKey = process.env.OPENAI_API_KEY;
  if (!ai.anthropic.apiKey && process.env.ANTHROPIC_API_KEY)
    ai.anthropic.apiKey = process.env.ANTHROPIC_API_KEY;
  if (!ai.gemini.apiKey && process.env.GEMINI_API_KEY)
    ai.gemini.apiKey = process.env.GEMINI_API_KEY;
  if (!ai.openrouter.apiKey && process.env.OPENROUTER_API_KEY)
    ai.openrouter.apiKey = process.env.OPENROUTER_API_KEY;
  if (!ai.imageApiKey && process.env.IMAGE_API_KEY)
    ai.imageApiKey = process.env.IMAGE_API_KEY;

  // Provider selection from env if still "mock" and env says otherwise
  if (ai.activeProvider === "mock" && process.env.AI_PROVIDER)
    ai.activeProvider = process.env.AI_PROVIDER;
  if (ai.imageProvider === "mock" && process.env.IMAGE_PROVIDER)
    ai.imageProvider = process.env.IMAGE_PROVIDER;

  // Integration keys
  if (!integrations.tikhub.apiKey && process.env.TIKHUB_API_KEY) {
    integrations.tikhub.apiKey = process.env.TIKHUB_API_KEY;
    integrations.tikhub.status = "Connected";
  }
  if (!integrations.apify.apiKey && process.env.APIFY_API_KEY) {
    integrations.apify.apiKey = process.env.APIFY_API_KEY;
    integrations.apify.status = "Connected";
  }
  if (!integrations.gmail.apiKey && process.env.EMAIL_API_KEY) {
    integrations.gmail.apiKey = process.env.EMAIL_API_KEY;
    integrations.gmail.status = "Connected";
  }
  if (!integrations.tiktok.apiKey && process.env.TIKTOK_API_KEY) {
    integrations.tiktok.apiKey = process.env.TIKTOK_API_KEY;
    integrations.tiktok.status = "Connected";
  }
  if (!integrations.instagram.apiKey && process.env.INSTAGRAM_API_KEY) {
    integrations.instagram.apiKey = process.env.INSTAGRAM_API_KEY;
    integrations.instagram.status = "Connected";
  }

  return { ...settings, aiProviders: ai, integrations };
}

/**
 * Save settings to MongoDB. Creates or updates the singleton settings doc.
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  const conn = await connectMongo();
  if (!conn) {
    throw new Error("Database not connected — cannot save settings");
  }

  await SettingsModel.findOneAndUpdate(
    {},
    { $set: settings },
    { upsert: true, returnDocument: "after" }
  ).exec();
}

/**
 * Get the effective AI provider name (from DB or env).
 */
export async function getActiveAiProvider(): Promise<string> {
  const settings = await loadSettings();
  return settings.aiProviders.activeProvider;
}
