/**
 * App-wide configuration types.
 * All of these are editable from the Settings page and persisted to MongoDB.
 */

export interface BrandVoiceConfig {
  tone: string;
  personality: string;
  readingLevel: string;
  ctaStyle: string;
  wordsToUse: string;
  wordsToAvoid: string;
  approvedClaims: string;
  claimsToAvoid: string;
}

export interface AiProviderConfig {
  activeProvider: string;
  openai: { apiKey: string; model: string };
  anthropic: { apiKey: string; model: string };
  gemini: { apiKey: string; model: string };
  openrouter: { apiKey: string; model: string };
  imageProvider: string;
  imageApiKey: string;
}

export interface IntegrationConfig {
  tikhub: { apiKey: string; status: string };
  apify: { apiKey: string; status: string };
  gmail: { apiKey: string; status: string };
  tiktok: { apiKey: string; status: string };
  instagram: { apiKey: string; status: string };
}

export interface WorkspaceConfig {
  name: string;
  productName: string;
}

export interface EmailConfig {
  provider: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromName: string;
    fromEmail: string;
  };
}

export interface DropdownValuesConfig {
  content: {
    contentGoals: string[];
    platforms: string[];
    tones: string[];
    contentTypes: string[];
  };
  scripts: {
    categories: string[];
    lengths: string[];
    speakers: string[];
    tones: string[];
  };
  images: {
    purposes: string[];
    platforms: string[];
    aspectRatios: string[];
    imageTypes: string[];
  };
  repurpose: {
    campaignGoals: string[];
    tones: string[];
    platforms: string[];
  };
  knowledge: {
    categories: string[];
    priorities: string[];
  };
  outreach: {
    creatorCategories: string[];
    channels: string[];
    types: string[];
  };
  approvals: {
    types: string[];
    statuses: string[];
  };
}

export interface AppSettings {
  brandVoice: BrandVoiceConfig;
  guardrails: Record<string, boolean>;
  notifications: Record<string, boolean>;
  aiProviders: AiProviderConfig;
  integrations: IntegrationConfig;
  email: EmailConfig;
  workspace: WorkspaceConfig;
  dropdownValues: DropdownValuesConfig;
}

/** Default settings used when no DB record exists. */
export const defaultSettings: AppSettings = {
  brandVoice: {
    tone: "Educational, calm",
    personality: "Founder-led authority",
    readingLevel: "Grade 7–9 (accessible)",
    ctaStyle: "Save / share / consult",
    wordsToUse: "customer-focused, data-driven, approachable, strategy, playbook, insight, growth",
    wordsToAvoid: "hype, exaggeration, miracle, guaranteed, permanent",
    approvedClaims: "Built for growing teams · Designed for modern marketers · Trusted by data-driven brands",
    claimsToAvoid: "No unsubstantiated claims. No before/after promises. No \u201cproven\u201d without source.",
  },
  guardrails: {
    "No fake reviews": true,
    "No fake testimonials": true,
    "No fake UGC": true,
    "No unsupported product claims": true,
    "No aggressive outreach": true,
    "No auto-sending without approval": true,
    "Require approval before publishing": true,
    "Require approval before sending outreach": true,
  },
  notifications: {
    "Draft awaiting approval": true,
    "Outreach sent": true,
    "Reply received": true,
    "Failed message": true,
    "New content recommendation": true,
  },
  aiProviders: {
    activeProvider: "mock",
    openai: { apiKey: "", model: "gpt-4o" },
    anthropic: { apiKey: "", model: "claude-sonnet-4-20250514" },
    gemini: { apiKey: "", model: "gemini-2.0-flash" },
    openrouter: { apiKey: "", model: "anthropic/claude-3.5-sonnet" },
    imageProvider: "mock",
    imageApiKey: "",
  },
  integrations: {
    tikhub: { apiKey: "", status: "Disconnected" },
    apify: { apiKey: "", status: "Disconnected" },
    gmail: { apiKey: "", status: "Disconnected" },
    tiktok: { apiKey: "", status: "Disconnected" },
    instagram: { apiKey: "", status: "Disconnected" },
  },
  email: {
    provider: "none",
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      user: "",
      pass: "",
      fromName: "GrowthCo",
      fromEmail: "",
    },
  },
  workspace: {
    name: "GrowthCo",
    productName: "AI Growth Suite",
  },
  dropdownValues: {
    content: {
      contentGoals: ["Educate professional audience", "Drive product saves", "Build founder authority", "Promote new launch"],
      platforms: ["Instagram", "TikTok", "LinkedIn", "X / Twitter", "Facebook"],
      tones: ["Educational, calm", "Confident, founder-led", "Warm, conversational", "Bold, opinionated"],
      contentTypes: ["Instagram caption", "Facebook post", "LinkedIn post", "Twitter/X post", "Carousel concept", "Infographic concept", "Product education", "Professional education", "Short-form video script", "UGC collab prompt"],
    },
    scripts: {
      categories: ["Product education", "How-to tutorial", "Founder thought leadership", "Industry commentary", "Myth busting", "Professional training", "Partner education", "Reseller education", "UGC collab prompt"],
      lengths: ["15 seconds", "30 seconds", "60 seconds", "90 seconds"],
      speakers: ["Founder", "Team educator", "UGC creator"],
      tones: ["Educational, calm", "Confident, founder-led", "Warm, conversational", "Bold, opinionated"],
    },
    images: {
      purposes: ["Carousel cover", "Product hero", "Educational visual"],
      platforms: ["Instagram", "TikTok", "LinkedIn", "X / Twitter", "Facebook"],
      aspectRatios: ["1:1 Square", "4:5 Portrait", "9:16 Vertical", "16:9 Landscape"],
      imageTypes: ["Product visual", "Infographic", "Carousel support", "Educational visual", "Campaign creative", "Social post"],
    },
    repurpose: {
      campaignGoals: ["Educate professionals", "Drive saves", "Build founder authority", "Promote new launch"],
      tones: ["Educational, calm", "Confident, founder-led", "Warm, conversational", "Bold, opinionated"],
      platforms: ["Instagram", "TikTok", "LinkedIn", "X / Twitter", "Facebook"],
    },
    knowledge: {
      categories: ["New product", "New offering", "Promotion", "Training program", "Distributor info", "Campaign priority", "Audience segment", "Approved language", "Claims to avoid", "Brand positioning", "Founder notes", "Seasonal messaging"],
      priorities: ["Low", "Medium", "High", "Critical"],
    },
    outreach: {
      creatorCategories: ["Influencer", "UGC creator", "Content creator", "Industry expert", "Thought leader", "Affiliate partner", "Reseller", "Consultant", "Brand ambassador"],
      channels: ["Instagram DM", "Email", "TikTok DM", "LinkedIn DM"],
      types: ["Intro", "Partnership invite", "UGC brief", "Follow-up", "Collab pitch"],
    },
    approvals: {
      types: ["Content", "Images", "Scripts", "Repurposed Posts", "Outreach", "Prospect Lists"],
      statuses: ["Drafted", "Needs Review", "Needs Revision", "Approved", "Scheduled", "Rejected", "Sent"],
    },
  },
};

/**
 * Mask an API key for display — shows only the last 4 characters.
 * Returns empty string if the key is empty.
 */
export function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 4) return "••••" + key;
  return "••••••••••••" + key.slice(-4);
}
