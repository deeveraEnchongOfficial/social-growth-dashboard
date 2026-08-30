import type { AiProvider } from "./types";
import { mockAiProvider } from "./mock-provider";

/**
 * Returns the active AI provider based on env config.
 *
 * Set AI_PROVIDER to one of: "mock" (default), "openai", "anthropic",
 * "gemini", "openrouter". Real providers are wired in
 * src/lib/ai/providers/* and require their respective API keys.
 *
 * Until a real provider is configured, the mock provider returns
 * realistic canned outputs that match the reference product experience.
 */
export function getAiProvider(): AiProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase() ?? "mock";

  switch (provider) {
    case "mock":
      return mockAiProvider;
    // Real providers are stubbed here and activated once credentials exist.
    // case "openai": return new OpenAiProvider(process.env.OPENAI_API_KEY!);
    // case "anthropic": return new AnthropicProvider(process.env.ANTHROPIC_API_KEY!);
    // case "gemini": return new GeminiProvider(process.env.GEMINI_API_KEY!);
    // case "openrouter": return new OpenRouterProvider(process.env.OPENROUTER_API_KEY!);
    default:
      return mockAiProvider;
  }
}
