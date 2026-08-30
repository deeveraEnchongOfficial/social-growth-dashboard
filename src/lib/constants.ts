import type {
  Platform,
  ContentTheme,
  Tone,
  ContentType,
  CreatorCategory,
  KnowledgeCategory,
  ReferenceCategory,
  ApprovalItemType,
  ApprovalStatus,
  OutreachStatus,
  ListStatus,
  UserRole,
} from "./types";

export const BRAND_NAME = "GrowthCo";
export const PRODUCT_NAME = "AI Growth Suite";
export const CURRENT_USER = {
  name: "Alex Morgan",
  email: "alex@growthco.co",
  role: "Admin" as UserRole,
  initials: "AM",
};

export const NAV_GROUPS: {
  label: string;
  items: { label: string; href: string; icon: string }[];
}[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: "LayoutDashboard" }],
  },
  {
    label: "Intelligence",
    items: [{ label: "Performance", href: "/performance", icon: "BarChart3" }],
  },
  {
    label: "Create",
    items: [
      { label: "Content Generator", href: "/content", icon: "PenLine" },
      { label: "Repurposing", href: "/repurpose", icon: "Repeat2" },
      { label: "Video Scripts", href: "/scripts", icon: "Clapperboard" },
      { label: "Image Studio", href: "/images", icon: "ImagePlus" },
    ],
  },
  {
    label: "Brand Memory",
    items: [
      { label: "Brand Library", href: "/library", icon: "Library" },
      { label: "Knowledge Memory", href: "/knowledge", icon: "BrainCircuit" },
    ],
  },
  {
    label: "Outreach",
    items: [
      { label: "Creator Search", href: "/outreach/search", icon: "UserSearch" },
      { label: "Outreach Drafts", href: "/outreach/drafts", icon: "Mail" },
      { label: "Sending Status", href: "/outreach/status", icon: "Send" },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Approval Queue", href: "/approvals", icon: "ClipboardCheck" },
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
];

export const PLATFORMS: Platform[] = [
  "Instagram",
  "TikTok",
  "LinkedIn",
  "X / Twitter",
  "Facebook",
];

export const CONTENT_THEMES: ContentTheme[] = [
  "How-to & Tutorials",
  "Product Education",
  "Founder POV",
  "Product Spotlight",
  "Industry News",
  "Myth Busting",
];

export const TONES: Tone[] = [
  "Educational, calm",
  "Confident, founder-led",
  "Warm, conversational",
  "Bold, opinionated",
];

export const CONTENT_TYPES: ContentType[] = [
  "Instagram caption",
  "Facebook post",
  "LinkedIn post",
  "Twitter/X post",
  "Carousel concept",
  "Infographic concept",
  "Product education",
  "Professional education",
  "Short-form video script",
  "UGC collab prompt",
];

export const CONTENT_GOALS = [
  "Educate professional audience",
  "Drive product saves",
  "Build founder authority",
  "Promote new launch",
] as const;

export const CREATOR_CATEGORIES: CreatorCategory[] = [
  "Influencer",
  "UGC creator",
  "Content creator",
  "Industry expert",
  "Thought leader",
  "Affiliate partner",
  "Reseller",
  "Consultant",
  "Brand ambassador",
];

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  "New product",
  "New offering",
  "Promotion",
  "Training program",
  "Distributor info",
  "Campaign priority",
  "Audience segment",
  "Approved language",
  "Claims to avoid",
  "Brand positioning",
  "Founder notes",
  "Seasonal messaging",
];

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  "Brand guidelines",
  "Product images",
  "Past social posts",
  "Captions",
  "Carousels",
  "Video scripts",
  "Website copy",
  "Product descriptions",
  "Training content",
  "Campaign references",
  "Competitor references",
  "Style references",
];

export const APPROVAL_TYPES: ApprovalItemType[] = [
  "Content",
  "Images",
  "Scripts",
  "Repurposed Posts",
  "Outreach",
  "Prospect Lists",
];

export const APPROVAL_STATUSES: ApprovalStatus[] = [
  "Drafted",
  "Needs Review",
  "Needs Revision",
  "Approved",
  "Scheduled",
  "Rejected",
  "Sent",
];

export const OUTREACH_STATUSES: OutreachStatus[] = [
  "Approved",
  "Queued",
  "Sending",
  "Sent",
  "Failed",
  "Replied",
  "Follow Up Needed",
  "Do Not Contact",
];

export const LIST_STATUSES: ListStatus[] = [
  "New",
  "Shortlisted",
  "Drafted",
  "Approved",
  "Do Not Contact",
];

export const VIDEO_CATEGORIES = [
  "Product education",
  "How-to tutorial",
  "Founder thought leadership",
  "Industry commentary",
  "Myth busting",
  "Professional training",
  "Partner education",
  "Reseller education",
  "UGC collab prompt",
] as const;

export const VIDEO_LENGTHS = ["15 seconds", "30 seconds", "60 seconds", "90 seconds"] as const;

export const SPEAKERS = ["Founder", "Team educator", "UGC creator"] as const;

export const IMAGE_PURPOSES = ["Carousel cover", "Product hero", "Educational visual"] as const;
export const ASPECT_RATIOS = ["1:1 Square", "4:5 Portrait", "9:16 Vertical", "16:9 Landscape"] as const;
export const IMAGE_TYPES = [
  "Product visual",
  "Infographic",
  "Carousel support",
  "Educational visual",
  "Campaign creative",
  "Social post",
] as const;

export const USER_ROLES: { role: UserRole; description: string }[] = [
  { role: "Admin", description: "Full access including settings, integrations, and billing." },
  { role: "Reviewer", description: "Approve / reject content and outreach. Cannot send raw." },
  { role: "Content Creator", description: "Draft and submit content for review." },
  { role: "Outreach Manager", description: "Search prospects, draft outreach, queue sends." },
];

export const GUARDRAILS = [
  "No fake reviews",
  "No fake testimonials",
  "No fake UGC",
  "No unsupported product claims",
  "No aggressive outreach",
  "No auto-sending without approval",
  "Require approval before publishing",
  "Require approval before sending outreach",
] as const;

export const NOTIFICATION_TYPES = [
  "Draft awaiting approval",
  "Outreach sent",
  "Reply received",
  "Failed message",
  "New content recommendation",
] as const;
