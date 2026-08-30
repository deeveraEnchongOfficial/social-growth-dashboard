import type {
  KpiStat,
  WeeklyRecommendation,
  PipelineStage,
  SocialPost,
  ContentDraft,
  VideoScript,
  GeneratedImage,
  RepurposeVariant,
  BrandReference,
  KnowledgeEntry,
  Creator,
  OutreachMessage,
  ApprovalItem,
  Integration,
  ActivityEvent,
  EngagementPoint,
  ThemeScore,
  PlatformShare,
  HookPerformance,
  AiStrategySummary,
} from "../types";

export const dashboardKpis: KpiStat[] = [
  { id: "cps", label: "Content Performance Score", value: "82", delta: "+6.4%", deltaTone: "positive", sublabel: "vs last week", icon: "Gauge" },
  { id: "posts", label: "Posts Analyzed", value: "1,284", delta: "+128", deltaTone: "positive", sublabel: "this week", icon: "Layers" },
  { id: "drafts", label: "Drafts Awaiting Approval", value: "14", sublabel: "3 urgent in queue", icon: "ClipboardList" },
  { id: "prospects", label: "Outreach Prospects Found", value: "327", delta: "+42", deltaTone: "positive", sublabel: "this week", icon: "UserSearch" },
  { id: "sent", label: "Messages Sent", value: "186", sublabel: "98% delivered · last 7 days", icon: "Send" },
  { id: "replies", label: "Replies Received", value: "37", delta: "19.9%", deltaTone: "positive", sublabel: "reply rate vs 12% benchmark", icon: "MessageSquare" },
];

export const weeklyRecommendations: WeeklyRecommendation[] = [
  { id: "r1", text: "Educational posts about product strategy are outperforming general announcement posts by 2.4×." },
  { id: "r2", text: "Turn your best-performing TikTok into an Instagram carousel and a LinkedIn thought leadership post." },
  { id: "r3", text: "Prioritize outreach to industry experts and content creators this week — reply rates are 28% higher." },
  { id: "r4", text: "Mid-week posts (Tue–Thu, 11am ET) generated 41% more saves than weekend posts." },
];

export const contentPipeline: PipelineStage[] = [
  { label: "Drafted", value: 23 },
  { label: "Needs Review", value: 14 },
  { label: "Approved", value: 9 },
  { label: "Scheduled", value: 18 },
  { label: "Posted", value: 64 },
];

export const outreachPipeline: PipelineStage[] = [
  { label: "Prospects Found", value: 327 },
  { label: "Drafted", value: 142 },
  { label: "Approved", value: 88 },
  { label: "Queued", value: 26 },
  { label: "Sent", value: 186 },
  { label: "Replied", value: 37 },
  { label: "Follow Up Needed", value: 19 },
];

export const engagementSeries: EngagementPoint[] = [
  { day: "Mon", reach: 14200, engagement: 1180 },
  { day: "Tue", reach: 18900, engagement: 1640 },
  { day: "Wed", reach: 22100, engagement: 2010 },
  { day: "Thu", reach: 19800, engagement: 1720 },
  { day: "Fri", reach: 16400, engagement: 1390 },
  { day: "Sat", reach: 12100, engagement: 980 },
  { day: "Sun", reach: 18700, engagement: 1530 },
];

export const themeScores: ThemeScore[] = [
  { theme: "How-to & Tutorials", score: 92 },
  { theme: "Product Education", score: 78 },
  { theme: "Founder POV", score: 71 },
  { theme: "Product Spotlight", score: 58 },
  { theme: "Industry News", score: 49 },
];

export const platformShares: PlatformShare[] = [
  { platform: "Instagram", share: 42 },
  { platform: "TikTok", share: 31 },
  { platform: "LinkedIn", share: 18 },
  { platform: "X / Twitter", share: 9 },
];

export const hookPerformance: HookPerformance[] = [
  { hook: "“Stop making this onboarding mistake…”", score: 9.2 },
  { hook: "“3 mistakes founders make…”", score: 8.6 },
  { hook: "“The strategy behind…”", score: 7.4 },
  { hook: "“Quick product update”", score: 3.1 },
];

export const socialPosts: SocialPost[] = [
  { id: "p1", caption: "3 mistakes founders make during onboarding (and the quick fix)", platform: "TikTok", topic: "How-to & Tutorials", views: 184200, likes: 12480, comments: 482, shares: 1840, engagementRate: 7.9, postedAt: "2026-08-28", aiInsight: "Strong educational hook. Repurpose into carousel.", recommendedAction: "Repurpose to IG Carousel" },
  { id: "p2", caption: "The strategy behind our product launch — broken down in 60s", platform: "Instagram", topic: "Product Education", views: 42100, likes: 3120, comments: 188, shares: 410, engagementRate: 8.8, postedAt: "2026-08-27", aiInsight: "Product mention performed well. Create follow-up content.", recommendedAction: "Draft follow-up post" },
  { id: "p3", caption: "Behind the launch: founder Q&A on building a data-driven team", platform: "Instagram", topic: "Founder POV", views: 28800, likes: 1980, comments: 142, shares: 220, engagementRate: 8.1, postedAt: "2026-08-26", aiInsight: "Audience responded to practical strategy education.", recommendedAction: "Schedule second cut" },
  { id: "p4", caption: "Don't believe these 5 marketing myths your team still follows", platform: "TikTok", topic: "Myth Busting", views: 96500, likes: 7100, comments: 612, shares: 1020, engagementRate: 9.0, postedAt: "2026-08-25", aiInsight: "High saves. Turn into LinkedIn carousel for B2B.", recommendedAction: "Repurpose for LinkedIn" },
  { id: "p5", caption: "Why content creators are the most underrated growth lever for brands", platform: "LinkedIn", topic: "Founder POV", views: 14200, likes: 480, comments: 86, shares: 92, engagementRate: 4.6, postedAt: "2026-08-24", aiInsight: "High views but low engagement. Improve CTA.", recommendedAction: "Rewrite CTA, retest" },
  { id: "p6", caption: "Growth playbook for teams — 4 steps, 4 minutes", platform: "Instagram", topic: "How-to & Tutorials", views: 51200, likes: 3880, comments: 211, shares: 504, engagementRate: 9.0, postedAt: "2026-08-23", aiInsight: "Top-performing format this week. Build a series.", recommendedAction: "Plan 4-part series" },
];

export const aiStrategySummary: AiStrategySummary = {
  whatWorked:
    "How-to and tutorial content on TikTok drove the highest saves and shares. Carousel reposts on Instagram outperformed single static posts by 38%.",
  whatUnderperformed:
    "LinkedIn founder posts had high views but weak engagement — CTAs were soft. Product-only posts continue to fade.",
  whatToCreateNext:
    "A 4-part “How-to & Tutorials” series for TikTok + matching IG carousel covers. One founder POV piece per week with a stronger CTA.",
  whatToAvoid:
    "Avoid generic “new launch” captions and unsubstantiated claims (see Knowledge Memory: Claims to avoid).",
  suggestedHooks: [
    "“The 30-second test most teams skip…”",
    "“If your funnel is doing this, stop…”",
    "“5 myths your audience still believes”",
  ],
  suggestedCarouselTopics: [
    "Pro vs. basic workflows, side by side",
    "Growth playbook 101 for modern teams",
    "4-step content strategy framework",
  ],
};

export const approvalItems: ApprovalItem[] = [
  { id: "a1", type: "Content", status: "Needs Review", aiSource: "AI · gpt-pro", createdAt: "2h ago", reviewer: "Alex M.", title: "IG caption — product launch education", preview: "Your funnel isn't broken — it's just asking for…", brandSafety: "Claims within approved messaging." },
  { id: "a2", type: "Images", status: "Needs Review", aiSource: "AI · image-2", createdAt: "3h ago", reviewer: "Priya S.", title: "Carousel cover — How-to series", preview: "clean modern workspace with product mockup", brandSafety: "Brand palette aligned." },
  { id: "a3", type: "Scripts", status: "Approved", aiSource: "AI · gpt-pro", createdAt: "5h ago", reviewer: "Alex M.", title: "30s TikTok — 3 onboarding mistakes", preview: "Hook: 'Stop making this onboarding mistake…'", brandSafety: "Scheduled for Wed." },
  { id: "a4", type: "Outreach", status: "Drafted", aiSource: "AI · gpt-pro", createdAt: "6h ago", reviewer: "—", title: "DM — @raedoescontent UGC", preview: "Hi Rae — loved your content breakdown…", brandSafety: "Awaiting reviewer." },
  { id: "a5", type: "Repurposed Posts", status: "Needs Revision", aiSource: "AI · gpt-pro", createdAt: "1d ago", reviewer: "Alex M.", title: "LinkedIn version of TikTok #418", preview: "Why content creators are the most underrated growth lever…", brandSafety: "Soften the CTA." },
  { id: "a6", type: "Prospect Lists", status: "Approved", aiSource: "AI · tikhub", createdAt: "1d ago", reviewer: "Priya S.", title: "Content creators — West Coast batch", preview: "24 prospects · avg 8.2k followers · 6.1% ER", brandSafety: "Verified public contact info." },
];

export const creators: Creator[] = [
  { id: "c1", name: "Maya Alvarez", handle: "@maya.creates", platform: "Instagram", category: "Content creator", bio: "Content creator · growth marketing obsessed · educator", followers: 48000, engagementRate: 6.2, location: "TX", contact: "maya@mayacreates.co", contactSource: "Public bio", fitReason: "Posts strategy-led education aligned with our positioning.", suggestedAngle: "Content creator partnership — co-branded strategy reel", listStatus: "New" },
  { id: "c2", name: "Jordan Patel", handle: "@jordanpatel", platform: "TikTok", category: "Industry expert", bio: "Marketing strategist explaining growth tactics in plain English", followers: 184000, engagementRate: 7.8, location: "UK", contact: "DM only", contactSource: "DM only", fitReason: "Audience overlaps with our growth-curious audience.", suggestedAngle: "Strategy deep-dive co-creation", listStatus: "Shortlisted" },
  { id: "c3", name: "Lumiere Studio", handle: "@lumierestudio", platform: "Instagram", category: "Reseller", bio: "Boutique agency · branding · content · growth consulting", followers: 13000, engagementRate: 5.1, location: "NY", contact: "hello@lumierestudio.co", contactSource: "Website footer", fitReason: "Offers complementary services — strong partner candidate.", suggestedAngle: "Partner program invite", listStatus: "Drafted" },
  { id: "c4", name: "Sage & Stone Co", handle: "@sageandstoneco", platform: "Instagram", category: "Consultant", bio: "Growth consultancy · data-driven · content strategy", followers: 8400, engagementRate: 4.4, location: "CO", contact: "team@sageandstone.co", contactSource: "Public bio", fitReason: "Brand-aligned consultancy with active content program.", suggestedAngle: "Training + partnership bundle", listStatus: "New" },
  { id: "c5", name: "Rae Thompson", handle: "@raedoescontent", platform: "TikTok", category: "UGC creator", bio: "UGC creator · marketing + tech · brand collabs", followers: 31000, engagementRate: 8.9, location: "CA", contact: "rae.collabs@gmail.com", contactSource: "Public bio", fitReason: "Authentic creator with strong save rate on edu content.", suggestedAngle: "Paid UGC for growth education series", listStatus: "New" },
  { id: "c6", name: "Nora Kim", handle: "@nora.growth", platform: "Instagram", category: "Thought leader", bio: "Growth strategist · content specialist · pro education content", followers: 22000, engagementRate: 5.7, location: "CA", contact: "nora@noragrowth.co", contactSource: "Linktree", fitReason: "Owns the growth strategy niche we want to grow in.", suggestedAngle: "Content strategy mini-series", listStatus: "Approved" },
];

export const outreachMessages: OutreachMessage[] = [
  {
    id: "o1", creatorId: "c1", creatorName: "Maya Alvarez", handle: "@maya.creates", platform: "Instagram", category: "Content creator",
    channel: "Instagram DM", type: "Intro", body: `Hi Maya — I've been following your growth marketing content and the content audit reel was 🔥.\n\nWe're GrowthCo. We're building something that aligns with what your audience already cares about. Would love to send you our product — no strings, just want it in your hands.\n\nIf it sparks something, we'd be open to a paid collab. Worth a quick chat?`,
    status: "Sent", approvedBy: "Alex M.", sentAt: "2026-08-30", lastAction: "Opened", time: "2m ago", nextAction: "Follow up in 3d",
    personalization: { bioInsight: "“Content creator · growth marketing obsessed”", contentTopics: ["Growth marketing", "Content strategy", "Audience building"], location: "Austin, TX", category: "Content creator", brandFitReason: "Posts strategy-led education aligned with our positioning.", contactSource: "Public bio" },
  },
  {
    id: "o2", creatorId: "c3", creatorName: "Lumiere Studio", handle: "@lumierestudio", platform: "Instagram", category: "Reseller",
    channel: "Email", type: "Partner invite", body: `Hi team at Lumiere —\n\nWe noticed your boutique agency offers a thoughtful growth consulting package. GrowthCo's platform aligns with teams that prioritize data-driven strategy.\n\nWould love to share our partner tiers and a demo for your team to try. Reply here and I'll send the details + pricing.\n\n— Alex, GrowthCo`,
    status: "Replied", approvedBy: "Alex M.", sentAt: "2026-08-29", lastAction: "Reply received", time: "11m ago", replyStatus: "Interested", nextAction: "Send partner info",
    personalization: { bioInsight: "“Boutique agency · branding · content · growth consulting”", contentTopics: ["Branding", "Growth consulting", "Content"], location: "New York, NY", category: "Reseller", brandFitReason: "Offers complementary services — strong partner candidate.", contactSource: "Website footer" },
  },
  {
    id: "o3", creatorId: "c5", creatorName: "Rae Thompson", handle: "@raedoescontent", platform: "TikTok", category: "UGC creator",
    channel: "Instagram DM", type: "UGC brief", body: `Hi Rae — your content breakdowns hit different. We're GrowthCo and we're building a growth education series for founders.\n\nWe'd love to commission a short UGC piece — your style, our brief, paid. Open to a 15-min call this week to walk through the angle?\n\n— Alex`,
    status: "Queued", approvedBy: "Alex M.", lastAction: "Approved by Alex", time: "1h ago", nextAction: "Send at 2pm ET",
    personalization: { bioInsight: "“UGC creator · marketing + tech · brand collabs”", contentTopics: ["Content education", "Marketing", "Brand collabs"], location: "California, CA", category: "UGC creator", brandFitReason: "Authentic creator with strong save rate on edu content.", contactSource: "Public bio" },
  },
  {
    id: "o4", creatorId: "c4", creatorName: "Sage & Stone Co", handle: "@sageandstoneco", platform: "Instagram", category: "Consultant",
    channel: "Email", type: "Training", body: `Hi Sage & Stone team —\n\nYour data-driven approach and content strategy caught our eye. GrowthCo offers a free training module + partnership bundle for consultancies that align with our platform.\n\nCan I send the training deck and a demo for your team?\n\n— Alex, GrowthCo`,
    status: "Sending", approvedBy: "Alex M.", lastAction: "In progress", time: "Just now",
    personalization: { bioInsight: "“Growth consultancy · data-driven · content strategy”", contentTopics: ["Growth consulting", "Data-driven", "Content strategy"], location: "Colorado, CO", category: "Consultant", brandFitReason: "Brand-aligned consultancy with active content program.", contactSource: "Public bio" },
  },
  {
    id: "o5", creatorId: "x1", creatorName: "Spam Trap", handle: "—", platform: "Instagram", category: "Influencer",
    channel: "Email", type: "Intro", body: "Invalid mailbox — bounced on send.", status: "Failed", approvedBy: "—", lastAction: "Bounced", time: "3h ago", nextAction: "Mark Do Not Contact",
    personalization: { bioInsight: "Invalid mailbox", contentTopics: [], location: "—", category: "Influencer", brandFitReason: "Invalid mailbox — do not contact.", contactSource: "Scraped" },
  },
  {
    id: "o6", creatorId: "c6", creatorName: "Nora Kim", handle: "@nora.growth", platform: "Instagram", category: "Thought leader",
    channel: "Instagram DM", type: "Co-creation", body: `Hi Nora — your growth strategy content is exactly the niche we want to grow in. We'd love to co-create a content strategy mini-series: your expertise, our platform.\n\nPaid, of course. Want me to send a brief?\n\n— Alex, GrowthCo`,
    status: "Replied", approvedBy: "Alex M.", sentAt: "2026-08-29", lastAction: "Reply received", time: "5h ago", replyStatus: "Wants details", nextAction: "Send brief",
    personalization: { bioInsight: "“Growth strategist · content specialist · pro education content”", contentTopics: ["Growth strategy", "Content", "Education"], location: "California, CA", category: "Thought leader", brandFitReason: "Owns the growth strategy niche we want to grow in.", contactSource: "Linktree" },
  },
  {
    id: "o7", creatorId: "c2", creatorName: "Jordan Patel", handle: "@jordanpatel", platform: "TikTok", category: "Industry expert",
    channel: "Instagram DM", type: "Intro", body: `Hi Jordan — your plain-English growth explainers are exactly what our audience needs. GrowthCo is building a strategy education series and we'd love to co-create a deep-dive.\n\nOpen to a quick chat?\n\n— Alex`,
    status: "Sent", approvedBy: "Alex M.", sentAt: "2026-08-29", lastAction: "Delivered", time: "1d ago", nextAction: "Wait 5d",
    personalization: { bioInsight: "“Marketing strategist explaining growth tactics in plain English”", contentTopics: ["Growth tactics", "Strategy", "Education"], location: "UK", category: "Industry expert", brandFitReason: "Audience overlaps with our growth-curious audience.", contactSource: "DM only" },
  },
];

export const outreachStatusCounts = [
  { status: "Approved", value: 88 },
  { status: "Queued", value: 26 },
  { status: "Sending", value: 4 },
  { status: "Sent", value: 186 },
  { status: "Failed", value: 6 },
  { status: "Replied", value: 37 },
  { status: "Follow Up Needed", value: 19 },
  { status: "Do Not Contact", value: 11 },
] as const;

export const liveActivity: ActivityEvent[] = [
  { id: "l1", text: "DM sent to @maya.creates", time: "Just now", tone: "neutral" },
  { id: "l2", text: "Email queued for Sage & Stone Co", time: "2m ago", tone: "neutral" },
  { id: "l3", text: "Reply received from Lumiere Studio", time: "11m ago", tone: "success" },
  { id: "l4", text: "Outreach batch of 12 approved by Alex", time: "1h ago", tone: "neutral" },
  { id: "l5", text: "Email failed: no valid address (no-reply@spamtrap.io)", time: "3h ago", tone: "destructive" },
  { id: "l6", text: "Reply received from @nora.growth", time: "5h ago", tone: "success" },
];

export const brandReferences: BrandReference[] = [
  { id: "b1", name: "Brand Guidelines v3.pdf", type: "PDF", category: "Brand guidelines", tags: ["voice", "logo", "colors"], uploadedBy: "Alex M.", date: "Apr 12", usedFor: "All AI outputs", status: "Active" },
  { id: "b2", name: "Product hero.jpg", type: "Image", category: "Product images", tags: ["product", "hero"], uploadedBy: "Priya S.", date: "May 02", usedFor: "Image studio", status: "Active" },
  { id: "b3", name: "Q1 launch carousel.png", type: "Image", category: "Carousels", tags: ["launch", "carousel"], uploadedBy: "Alex M.", date: "Mar 19", usedFor: "Repurposing", status: "Active" },
  { id: "b4", name: "Team training deck.pdf", type: "PDF", category: "Training content", tags: ["team", "training"], uploadedBy: "Founder", date: "Feb 28", usedFor: "Knowledge memory", status: "Active" },
  { id: "b5", name: "Founder voice notes.txt", type: "Text", category: "Captions", tags: ["voice", "founder"], uploadedBy: "Founder", date: "Jan 14", usedFor: "Content generator", status: "Active" },
  { id: "b6", name: "Competitor scan May.pdf", type: "PDF", category: "Competitor references", tags: ["competitor", "scan"], uploadedBy: "Alex M.", date: "May 20", usedFor: "Strategy", status: "Archived" },
];

export const knowledgeEntries: KnowledgeEntry[] = [
  { id: "k1", title: "Q2 product launch campaign", description: "Lead Q2 messaging around the product launch.", category: "Campaign priority", priority: "High", updated: "2d ago", usedIn: 142, status: "Active" },
  { id: "k2", title: "Approved product language", description: "Pre-approved phrasing for product descriptions and feature names.", category: "Approved language", priority: "High", updated: "1w ago", usedIn: 318, status: "Active" },
  { id: "k3", title: "Claims to avoid — unsubstantiated", description: "No unsubstantiated claims, guaranteed results, or exaggerated outcomes.", category: "Claims to avoid", priority: "Critical", updated: "3w ago", usedIn: 412, status: "Active" },
  { id: "k4", title: "Partner program details", description: "Partner tiers, minimums, and qualification criteria.", category: "Distributor info", priority: "Medium", updated: "1mo ago", usedIn: 64, status: "Active" },
  { id: "k5", title: "Founder origin story", description: "Approved short and long-form founder narrative.", category: "Founder notes", priority: "Medium", updated: "2mo ago", usedIn: 88, status: "Active" },
  { id: "k6", title: "Holiday Q4 priorities", description: "Year-end bundles for partners and end customers.", category: "Seasonal messaging", priority: "Low", updated: "6mo ago", usedIn: 12, status: "Archived" },
];

export const integrations: Integration[] = [
  { id: "i1", name: "TikTok profile", provider: "API placeholder", status: "Connected", category: "Social" },
  { id: "i2", name: "Instagram profile", provider: "API placeholder", status: "Connected", category: "Social" },
  { id: "i3", name: "Gmail / Email provider", provider: "API placeholder", status: "Connected", category: "Email" },
  { id: "i4", name: "OpenRouter API", provider: "API placeholder", status: "Active", category: "AI" },
  { id: "i5", name: "Tikhub API", provider: "API placeholder", status: "Active", category: "Data" },
  { id: "i6", name: "OpenAI Image 2 API", provider: "API placeholder", status: "Active", category: "AI" },
  { id: "i7", name: "Apify DM automation", provider: "API placeholder", status: "Paused", category: "Automation" },
];

export const sampleContentDraft: ContentDraft = {
  id: "cd1",
  type: "Instagram caption",
  platform: "Instagram",
  tone: "Educational, calm",
  title: "Is your funnel asking for help? Here's the 30-second test.",
  hook: "If your landing page bounce rate is above 60% — stop everything.",
  caption:
    "A struggling funnel doesn't always look broken. Sometimes it whispers — high bounce, low scroll, a drop-off at the CTA that used to convert fine. Here's the 30-second audit we teach in our onboarding: check, observe, ask. If two of three flag, switch to a conversion-focused approach before adding more traffic. Save this for your next review.",
  cta: "Save this for your next funnel review. Tap the link for the full playbook.",
  hashtags: ["#growthmarketing", "#conversion", "#saas", "#contentstrategy", "#growthco"],
  visualSuggestion:
    "Clean modern workspace with laptop showing analytics dashboard. Neutral palette, no people.",
  brandSafety: "No unsubstantiated claims. Brand positioning intact. Approved language ✓",
  status: "Drafted",
  source: "AI · gpt-pro",
  createdAt: "Just now",
};

export const sampleVideoScript: VideoScript = {
  id: "vs1",
  topic: "3 onboarding mistakes founders make (and the quick fix)",
  category: "How-to tutorial",
  length: "30 seconds",
  speaker: "Team educator",
  tone: "Confident, founder-led",
  hook: "“Stop making this onboarding mistake — and you'll wonder how you ever converted without it.”",
  beats: [
    { beat: "Beat 1", detail: "planning is everything. If your onboarding isn't mapped, users drop off at step one.", bRoll: "B-roll: flowchart on screen" },
    { beat: "Beat 2", detail: "timing matters. Send the right message at the right step. The most common mistake — and the easiest fix.", bRoll: "B-roll: dashboard demo" },
    { beat: "Beat 3", detail: "review and iterate. Skip the guesswork. Use data to refine each step.", bRoll: "B-roll: analytics chart" },
  ],
  onScreenText: "“Plan. Send. Review.”",
  cta: "Tag a founder who needs to see this — and save for next week.",
  visuals: "POV vertical, clean workspace, 3 cuts, screen-only.",
  caption: "The 3-step fix for better onboarding every time. Plan. Send. Review.",
  platformRecs: "TikTok primary · Instagram Reels secondary · cut a 15s version for Stories.",
  status: "Drafted",
  createdAt: "Just now",
};

export const sampleImages: GeneratedImage[] = [
  { id: "im1", title: "Editorial product still life", description: "Product mockup on clean desk, soft morning light, neutral palette.", brandFitScore: 96, aspectRatio: "1:1 Square", status: "Drafted", gradient: "from-amber-100 via-stone-200 to-rose-100" },
  { id: "im2", title: "Infographic background", description: "3-step strategy grid, off-white with subtle paper texture, gold accents.", brandFitScore: 91, aspectRatio: "4:5 Portrait", status: "Drafted", gradient: "from-stone-100 via-amber-50 to-yellow-100" },
  { id: "im3", title: "Carousel cover", description: "Workspace demo, hero text space top-left, clean modern tones.", brandFitScore: 88, aspectRatio: "1:1 Square", status: "Drafted", gradient: "from-rose-100 via-stone-200 to-amber-100" },
  { id: "im4", title: "Educational hero", description: "Abstract macro of workspace texture in soft focus, calm pastel palette.", brandFitScore: 94, aspectRatio: "16:9 Landscape", status: "Drafted", gradient: "from-sky-100 via-stone-100 to-rose-100" },
];

export const sampleRepurposeVariants: RepurposeVariant[] = [
  { id: "rv1", platform: "Instagram", hook: "Is your funnel asking for help? The 30-second test.", copy: "A struggling funnel doesn't always look broken — sometimes it whispers. Bounce rate above 60%? That's the signal. Here's the 3-step audit we teach in our onboarding…", cta: "Save this for your next funnel review.", visual: "Clean-lit workspace with analytics dashboard on screen.", status: "Drafted" },
  { id: "rv2", platform: "Facebook", hook: "What most teams miss about their funnel", copy: "Your funnel doesn't always shout — it whispers. If your bounce rate is above 60%, your funnel is asking for backup. Read the 3-step audit our team uses →", cta: "Read the full playbook.", visual: "Wide-angle product still life with copy overlay.", status: "Drafted" },
  { id: "rv3", platform: "LinkedIn", hook: "A 30-second test that's redefining how teams approach funnel health.", copy: "Most growth conversations start with traffic. They should start with the funnel. Here's the framework we teach inside our onboarding program — and why generic approaches often miss it…", cta: "Read our growth framework.", visual: "Clean editorial photo with bold headline text overlay.", status: "Drafted" },
  { id: "rv4", platform: "X / Twitter", hook: "Bounce rate above 60%? That's not normal.", copy: "It's your funnel asking for help. Here's the 30-second audit we teach our team — and the 3 things to fix before adding more traffic. 🧵", cta: "Thread →", visual: "Single hero card image with thread thumbnail.", status: "Drafted" },
  { id: "rv5", platform: "TikTok", hook: "Stop adding traffic if this is happening.", copy: "On-camera: hold up laptop. 'If your bounce rate is above 60%, that's not normal — that's a funnel signal.' B-roll: dashboard, workspace. 'Try this 30-second test we teach our team…'", cta: "Save this and tag a founder.", visual: "POV vertical, clean workspace, 22–30s, two cuts.", status: "Drafted" },
];
