import type { AiProvider } from "./types";
import { mockAiProvider } from "./mock-provider";
import { loadSettings } from "@/lib/settings-loader";
import { OpenRouterProvider } from "./providers/openrouter";

/**
 * Returns the active AI provider based on Settings (DB) or env config.
 *
 * The active provider is determined by:
 * 1. Settings page (DB) — aiProviders.activeProvider
 * 2. Env var — AI_PROVIDER
 * 3. Default — "mock"
 *
 * Real providers require their respective API keys (stored in Settings).
 * If a provider is selected but no API key is configured, falls back to mock.
 */
export async function getAiProvider(): Promise<AiProvider> {
  const settings = await loadSettings();
  const provider = settings.aiProviders.activeProvider?.toLowerCase() ?? "mock";

  switch (provider) {
    case "mock":
      return mockAiProvider;

    case "openrouter": {
      const key = settings.aiProviders.openrouter.apiKey;
      if (!key || key.includes("••••")) {
        console.warn("[ai] OpenRouter selected but no API key — falling back to mock");
        return mockAiProvider;
      }
      return new OpenRouterProvider(key, settings.aiProviders.openrouter.model);
    }

    // Real providers — stubbed, activated once credentials exist.
    // case "openai":
    //   return new OpenAiProvider(settings.aiProviders.openai.apiKey, settings.aiProviders.openai.model);
    // case "anthropic":
    //   return new AnthropicProvider(settings.aiProviders.anthropic.apiKey, settings.aiProviders.anthropic.model);
    // case "gemini":
    //   return new GeminiProvider(settings.aiProviders.gemini.apiKey, settings.aiProviders.gemini.model);

    default:
      return mockAiProvider;
  }
}

/**
 * Synchronous version that uses env vars only (for backward compatibility).
 * Prefer the async getAiProvider() which reads from DB settings.
 */
export function getAiProviderSync(): AiProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase() ?? "mock";

  switch (provider) {
    case "mock":
      return mockAiProvider;
    default:
      return mockAiProvider;
  }
}
