/**
 * Seed data for the full demo dataset.
 * Mirrors the mock data in src/lib/mock/data.ts but shaped for MongoDB.
 */

export const seedData = {
  workspace: {
    name: "GrowthCo",
    slug: "growthco",
    brandVoice: {
      tone: ["Educational, calm", "Confident, founder-led"],
      personality: ["Founder-led authority", "Editorial", "Conversational"],
      readingLevel: "Grade 7–9 (accessible)",
      ctaStyle: "Save / share / book a call",
      wordsToUse: [
        "customer-focused",
        "data-driven",
        "approachable",
        "strategy",
        "playbook",
        "insight",
        "consult",
      ],
      wordsToAvoid: [
        "hype",
        "exaggeration",
        "miracle",
        "guaranteed",
        "permanent",
      ],
      approvedClaims: [
        "Built for growing teams",
        "Designed for modern marketers",
        "Trusted by data-driven brands",
      ],
      claimsToAvoid: [
        "No unsubstantiated claims",
        "No before/after promises",
        'No "proven" without source',
      ],
    },
    guardrails: [
      "No fake reviews",
      "No fake testimonials",
      "No fake UGC",
      "No unsupported product claims",
      "No aggressive outreach",
      "No auto-sending without approval",
      "Require approval before publishing",
      "Require approval before sending outreach",
    ],
  },

  teamMembers: [
    {
      email: "priya@growthco.co",
      name: "Priya Sharma",
      password: "Reviewer@123",
      role: "Reviewer",
    },
    {
      email: "creator@growthco.co",
      name: "Jamie Lee",
      password: "Creator@123",
      role: "Content Creator",
    },
    {
      email: "outreach@growthco.co",
      name: "Sam Rivera",
      password: "Outreach@123",
      role: "Outreach Manager",
    },
  ],

  integrations: [
    { name: "TikTok profile", provider: "API placeholder", status: "Connected", category: "Social" },
    { name: "Instagram profile", provider: "API placeholder", status: "Connected", category: "Social" },
    { name: "Gmail / Email provider", provider: "API placeholder", status: "Connected", category: "Email" },
    { name: "OpenRouter API", provider: "API placeholder", status: "Active", category: "AI" },
    { name: "Tikhub API", provider: "API placeholder", status: "Active", category: "Data" },
    { name: "OpenAI Image 2 API", provider: "API placeholder", status: "Active", category: "AI" },
    { name: "Apify DM automation", provider: "API placeholder", status: "Paused", category: "Automation" },
  ],

  socialPosts: [
    { caption: "3 mistakes marketers make with their content calendar (and the pro fix)", platform: "TikTok", topic: "Marketing Strategy", views: 184200, likes: 12480, comments: 482, shares: 1840, engagementRate: 7.9, postedAt: new Date("2026-08-28"), aiInsight: "Strong educational hook. Repurpose into carousel.", recommendedAction: "Repurpose to IG Carousel" },
    { caption: "The science behind a high-converting landing page — broken down in 60s", platform: "Instagram", topic: "Conversion Edu", views: 42100, likes: 3120, comments: 188, shares: 410, engagementRate: 8.8, postedAt: new Date("2026-08-27"), aiInsight: "Product mention performed well. Create follow-up content.", recommendedAction: "Draft follow-up post" },
    { caption: "Behind the launch: founder Q&A on building a data-driven brand", platform: "Instagram", topic: "Founder POV", views: 28800, likes: 1980, comments: 142, shares: 220, engagementRate: 8.1, postedAt: new Date("2026-08-26"), aiInsight: "Audience responded to practical strategy education.", recommendedAction: "Schedule second cut" },
    { caption: "Don't believe these 5 marketing myths your team keeps repeating", platform: "TikTok", topic: "Myth Busting", views: 96500, likes: 7100, comments: 612, shares: 1020, engagementRate: 9.0, postedAt: new Date("2026-08-25"), aiInsight: "High saves. Turn into LinkedIn carousel for B2B.", recommendedAction: "Repurpose for LinkedIn" },
    { caption: "Why data-driven teams are the most underrated growth lever in business", platform: "LinkedIn", topic: "Founder POV", views: 14200, likes: 480, comments: 86, shares: 92, engagementRate: 4.6, postedAt: new Date("2026-08-24"), aiInsight: "High views but low engagement. Improve CTA.", recommendedAction: "Rewrite CTA, retest" },
    { caption: "Growth routine for teams — 4 steps, 4 minutes", platform: "Instagram", topic: "Marketing Strategy", views: 51200, likes: 3880, comments: 211, shares: 504, engagementRate: 9.0, postedAt: new Date("2026-08-23"), aiInsight: "Top-performing format this week. Build a series.", recommendedAction: "Plan 4-part series" },
  ],

  brandReferences: [
    { name: "Brand Guidelines v3.pdf", type: "PDF", category: "Brand guidelines", tags: ["voice", "logo", "colors"], uploadedBy: "Alex M.", usedFor: "All AI outputs", status: "Active" },
    { name: "Product hero.jpg", type: "Image", category: "Product images", tags: ["hero", "product"], uploadedBy: "Priya S.", usedFor: "Image studio", status: "Active" },
    { name: "Q1 launch carousel.png", type: "Image", category: "Carousels", tags: ["launch", "carousel"], uploadedBy: "Alex M.", usedFor: "Repurposing", status: "Active" },
    { name: "Team training deck.pdf", type: "PDF", category: "Training content", tags: ["training", "team"], uploadedBy: "Founder", usedFor: "Knowledge memory", status: "Active" },
    { name: "Founder voice notes.txt", type: "Text", category: "Captions", tags: ["voice", "founder"], uploadedBy: "Founder", usedFor: "Content generator", status: "Active" },
    { name: "Competitor scan May.pdf", type: "PDF", category: "Competitor references", tags: ["competitor", "scan"], uploadedBy: "Alex M.", usedFor: "Strategy", status: "Archived" },
  ],

  knowledgeEntries: [
    {
      title: "Q2 product launch campaign",
      description: "Lead Q2 messaging around the product launch.",
      category: "Campaign priority",
      priority: "High",
      usedCount: 142,
      status: "Active",
      content: `# Q2 Product Launch Campaign

## Overview
The Q2 launch focuses on positioning GrowthCo Pro as the go-to growth platform for SaaS founders.

## Key Messages
- **Data-driven growth** — every decision backed by metrics
- **Founder-led authority** — built by operators, for operators
- **Practical onboarding** — 30-second audits, not 30-page reports

## Target Audience
Early-stage SaaS founders (Seed to Series A) struggling with funnel optimization.

## CTA Guidelines
- Use "Save this for your next review"
- Use "Share with a founder who needs this"
- Avoid "Buy now" or aggressive sales language

## Channels
Instagram carousels, LinkedIn thought leadership, TikTok how-to shorts.`,
      wordCount: 98,
    },
    {
      title: "Approved product language",
      description: "Pre-approved phrasing for product descriptions and feature names.",
      category: "Approved language",
      priority: "High",
      usedCount: 318,
      status: "Active",
      content: `# Approved Product Language

## Product Names
- **GrowthCo Pro** — the main subscription tier
- **GrowthCo Lite** — the free tier
- **GrowthCo Analytics** — the reporting module

## Approved Phrasing
- "Built for growing teams"
- "Designed for modern marketers"
- "Trusted by data-driven brands"
- "Your growth playbook, automated"

## Feature Descriptions
- **AI Content Generator** — "On-brand content in seconds, not hours"
- **Outreach Automation** — "Personalized outreach that scales without losing the human touch"
- **Performance Analytics** — "See what works, double down on what converts"

## Do NOT Use
- "AI-powered magic"
- "Revolutionary"
- "Game-changing"
- "Best in class" (without source)`,
      wordCount: 112,
    },
    {
      title: "Claims to avoid — unsubstantiated",
      description: "No unsubstantiated claims, guaranteed results, or exaggerated outcomes.",
      category: "Claims to avoid",
      priority: "Critical",
      usedCount: 412,
      status: "Active",
      content: `# Claims to Avoid

## Strictly Prohibited
- **No unsubstantiated claims** — every stat must have a source
- **No guaranteed results** — "guaranteed to grow" is banned
- **No exaggerated outcomes** — "10x your revenue" is banned
- **No before/after promises** — individual results vary

## Requires Source
- Any percentage claim ("increases conversions by 40%")
- Any comparison to competitors ("better than X")
- Any testimonial-adjacent language

## Safe Alternatives
- "Helps you identify" instead of "guarantees you'll find"
- "Designed to support" instead of "proven to deliver"
- "Many teams use" instead of "everyone uses"`,
      wordCount: 95,
    },
    {
      title: "Partner program details",
      description: "Partner tiers, minimums, and qualification criteria.",
      category: "Distributor info",
      priority: "Medium",
      usedCount: 64,
      status: "Active",
      content: `# Partner Program Details

## Tiers
1. **Starter Partner** — 5+ active referrals, 10% revenue share
2. **Growth Partner** — 25+ active referrals, 15% revenue share
3. **Elite Partner** — 100+ active referrals, 20% revenue share + co-marketing

## Qualification Criteria
- Must be an active GrowthCo Pro subscriber
- Must complete partner onboarding (2 hours)
- Must maintain minimum 5 active referrals per quarter

## Co-Branding Rules
- Use "GrowthCo Partner" badge in marketing
- Do not imply exclusive partnership
- All co-branded content requires approval`,
      wordCount: 82,
    },
    {
      title: "Founder origin story",
      description: "Approved short and long-form founder narrative.",
      category: "Founder notes",
      priority: "Medium",
      usedCount: 88,
      status: "Active",
      content: `# Founder Origin Story

## Short Version (30 seconds)
GrowthCo started when our founder realized most growth advice was theoretical. After scaling three SaaS companies, he built the tool he wished he had — one that turns data into action in 30 seconds, not 30 days.

## Long Version (2 minutes)
Our founder spent a decade building and scaling SaaS companies. Every time he hit a growth plateau, the advice was the same: "just add more traffic." But the data told a different story — the funnel was leaking, not starving.

He started GrowthCo to solve this. The platform combines AI-driven content generation, outreach automation, and performance analytics into one workflow. The goal: help founders spend less time guessing and more time growing.

## Key Themes
- Practical over theoretical
- Data-driven over opinion-driven
- Founder-led over corporate`,
      wordCount: 130,
    },
    {
      title: "Holiday Q4 priorities",
      description: "Year-end bundles for partners and end customers.",
      category: "Seasonal messaging",
      priority: "Low",
      usedCount: 12,
      status: "Archived",
      content: `# Holiday Q4 Priorities

## Campaigns
- **Black Friday Bundle** — GrowthCo Pro + Analytics at 30% off
- **Partner Year-End Push** — bonus revenue share for Q4 referrals
- **New Year Planning** — "Set up your 2025 growth stack" content series

## Messaging Guidelines
- Focus on planning and preparation, not urgency
- Avoid "last chance" language until final week
- Emphasize "start the year ahead" over "don't miss out"`,
      wordCount: 65,
    },
  ],

  creators: [
    { name: "Maya Alvarez", handle: "@maya.growth", platform: "Instagram", category: "Influencer", bio: "Marketing influencer · growth-obsessed · educator", followers: 48000, engagementRate: 6.2, location: "TX", contact: "maya@mayagrowth.co", contactSource: "Public bio", fitReason: "Posts strategy-led education aligned with our positioning.", suggestedAngle: "Influencer partnership — co-branded strategy reel", listStatus: "New" },
    { name: "Jordan Patel", handle: "@drjordanpatel", platform: "TikTok", category: "Thought leader", bio: "Marketing strategist explaining growth in plain English", followers: 184000, engagementRate: 7.8, location: "UK", contact: "DM only", contactSource: "DM only", fitReason: "Audience overlaps with our data-curious marketers.", suggestedAngle: "Growth strategy deep-dive co-creation", listStatus: "Shortlisted" },
    { name: "Lumière Studio", handle: "@lumierestudio", platform: "Instagram", category: "Consultant", bio: "Boutique agency · content · paid ads · brand strategy", followers: 13000, engagementRate: 5.1, location: "NY", contact: "hello@lumierestudio.co", contactSource: "Website footer", fitReason: "Offers strategy services — strong partner candidate.", suggestedAngle: "Partner program invite", listStatus: "Drafted" },
    { name: "Sage & Stone Agency", handle: "@sageandstoneagency", platform: "Instagram", category: "Reseller", bio: "Digital agency · expert team · growth marketing", followers: 8400, engagementRate: 4.4, location: "CO", contact: "team@sageandstone.agency", contactSource: "Public bio", fitReason: "Brand-aligned agency with active partner program.", suggestedAngle: "Partner training + bundle", listStatus: "New" },
    { name: "Rae Thompson", handle: "@raedoesmarketing", platform: "TikTok", category: "UGC creator", bio: "UGC creator · marketing + business · brand collabs", followers: 31000, engagementRate: 8.9, location: "CA", contact: "rae.collabs@gmail.com", contactSource: "Public bio", fitReason: "Authentic creator with strong save rate on edu content.", suggestedAngle: "Paid UGC for growth education series", listStatus: "New" },
    { name: "Nora Kim", handle: "@nora.content", platform: "Instagram", category: "Content creator", bio: "Content creator · social media specialist · marketing education", followers: 22000, engagementRate: 5.7, location: "CA", contact: "nora@norakim.co", contactSource: "Linktree", fitReason: "Owns the content marketing niche we want to grow in.", suggestedAngle: "Content strategy mini-series", listStatus: "Approved" },
  ],

  outreachMessages: [
    { creatorHandle: "@maya.growth", channel: "Instagram DM", type: "Intro", body: "Hi Maya — I've been following your growth education and the content audit reel was 🔥.\n\nWe're GrowthCo. Our platform is built around the same data-driven philosophy you're already teaching. Would love to send you our demo — no strings, just want it in your hands.\n\nIf it sparks something, we'd be open to a paid strategy-led collab. Worth a quick chat?", status: "Sent", approvedBy: "Alex M.", sentAt: new Date("2026-08-30"), lastAction: "Opened", nextAction: "Follow up in 3d", personalization: { bioInsight: "Marketing influencer · growth-obsessed · educator", contentTopics: ["Growth strategy", "Content audits", "Marketing education"], location: "Austin, TX", category: "Influencer", brandFitReason: "Posts strategy-led education aligned with our positioning.", contactSource: "Public bio" } },
    { creatorHandle: "@lumierestudio", channel: "Email", type: "Partnership invite", body: "Hi team at Lumière —\n\nWe noticed your boutique agency offers a thoughtful brand strategy service. GrowthCo's partner program is built for agencies that prioritize data-driven marketing.\n\nWould love to share our partnership tiers and a demo for your team to try. Reply here and I'll send the partner kit + pricing.\n\n— Alex, GrowthCo", status: "Replied", approvedBy: "Alex M.", sentAt: new Date("2026-08-29"), lastAction: "Reply received", replyStatus: "Interested", nextAction: "Send partner kit info", personalization: { bioInsight: "Boutique agency · content · paid ads · brand strategy", contentTopics: ["Brand strategy", "Paid ads", "Content"], location: "New York, NY", category: "Consultant", brandFitReason: "Offers strategy services — strong partner candidate.", contactSource: "Website footer" } },
    { creatorHandle: "@raedoesmarketing", channel: "Instagram DM", type: "UGC brief", body: "Hi Rae — your marketing breakdowns hit different. We're GrowthCo and we're building a growth education series for modern marketers.\n\nWe'd love to commission a short UGC piece — your style, our brief, paid. Open to a 15-min call this week to walk through the angle?\n\n— Alex", status: "Queued", approvedBy: "Alex M.", lastAction: "Approved by Alex", nextAction: "Send at 2pm ET", personalization: { bioInsight: "UGC creator · marketing + business · brand collabs", contentTopics: ["Marketing education", "Business", "Brand collabs"], location: "California, CA", category: "UGC creator", brandFitReason: "Authentic creator with strong save rate on edu content.", contactSource: "Public bio" } },
    { creatorHandle: "@sageandstoneagency", channel: "Email", type: "Partner training", body: "Hi Sage & Stone team —\n\nYour expert team and growth marketing approach caught our eye. GrowthCo offers a free partner training module + onboarding bundle for agencies that align with data-driven marketing.\n\nCan I send the training deck and a demo for your team?\n\n— Alex, GrowthCo", status: "Sending", approvedBy: "Alex M.", lastAction: "In progress", personalization: { bioInsight: "Digital agency · expert team · growth marketing", contentTopics: ["Agency growth", "Expert team", "Marketing"], location: "Colorado, CO", category: "Reseller", brandFitReason: "Brand-aligned agency with active partner program.", contactSource: "Public bio" } },
    { creatorHandle: "@nora.content", channel: "Instagram DM", type: "Co-creation", body: "Hi Nora — your content strategy content is exactly the niche we want to grow in. We'd love to co-create a content strategy mini-series: your expertise, our platform.\n\nPaid, of course. Want me to send a brief?\n\n— Alex, GrowthCo", status: "Replied", approvedBy: "Alex M.", sentAt: new Date("2026-08-29"), lastAction: "Reply received", replyStatus: "Wants details", nextAction: "Send brief", personalization: { bioInsight: "Content creator · social media specialist · marketing education", contentTopics: ["Content strategy", "Marketing education", "Social media"], location: "California, CA", category: "Content creator", brandFitReason: "Owns the content marketing niche we want to grow in.", contactSource: "Linktree" } },
    { creatorHandle: "@drjordanpatel", channel: "Instagram DM", type: "Intro", body: "Hi Jordan — your plain-English growth explainers are exactly what our audience needs. GrowthCo is building a growth education series and we'd love to co-create a deep-dive.\n\nOpen to a quick chat?\n\n— Alex", status: "Sent", approvedBy: "Alex M.", sentAt: new Date("2026-08-29"), lastAction: "Delivered", nextAction: "Wait 5d", personalization: { bioInsight: "Marketing strategist explaining growth in plain English", contentTopics: ["Growth", "Strategy", "Education"], location: "UK", category: "Thought leader", brandFitReason: "Audience overlaps with our data-curious marketers.", contactSource: "DM only" } },
  ],

  approvalItems: [
    { type: "Content", status: "Needs Review", aiSource: "AI · gpt-pro", reviewer: "Alex M.", title: "IG caption — landing page education", preview: "Your conversion rate isn't broken — it's just asking for…", brandSafety: "Claims within approved messaging." },
    { type: "Images", status: "Needs Review", aiSource: "AI · image-2", reviewer: "Priya S.", title: "Carousel cover — Marketing Strategy series", preview: "warm-neutral product still life on desk", brandSafety: "Brand palette aligned." },
    { type: "Scripts", status: "Approved", aiSource: "AI · gpt-pro", reviewer: "Alex M.", title: "30s TikTok — 3 content calendar mistakes", preview: "Hook: 'Stop doing this with your calendar…'", brandSafety: "Scheduled for Wed." },
    { type: "Outreach", status: "Drafted", aiSource: "AI · gpt-pro", reviewer: "—", title: "DM — @raedoesmarketing UGC", preview: "Hi Rae — loved your growth breakdown…", brandSafety: "Awaiting reviewer." },
    { type: "Repurposed Posts", status: "Needs Revision", aiSource: "AI · gpt-pro", reviewer: "Alex M.", title: "LinkedIn version of TikTok #418", preview: "Why data-driven teams are the most underrated growth lever…", brandSafety: "Soften the CTA." },
    { type: "Prospect Lists", status: "Approved", aiSource: "AI · tikhub", reviewer: "Priya S.", title: "Marketers — Texas batch", preview: "24 prospects · avg 8.2k followers · 6.1% ER", brandSafety: "Verified public contact info." },
  ],

  contentDrafts: [
    { type: "Instagram caption", platform: "Instagram", tone: "Educational, calm", title: "Is your funnel asking for help? Here's the 30-second test.", hook: "If your landing page bounces 10 minutes after launch — stop everything.", caption: "A struggling funnel doesn't always look obvious. Sometimes it whispers — high bounce rate, low time on page, a drop-off at the CTA that used to convert. Here's the 30-second audit test we teach in our team training: check, observe, ask. If two of three flag, switch to a conversion-focused routine before scaling spend. Save this for your next team review.", cta: "Save this for your next team review. Tap the link for the full growth playbook.", hashtags: ["#marketingtips", "#growthstrategy", "#digitalmarketing", "#contentmarketing", "#growthco"], visualSuggestion: "Soft-light close-up of a calm workspace with laptop on warm desk. Neutral palette, no model face.", brandSafety: "No unsubstantiated claims. Brand-positioning intact. Approved product language ✓", status: "Drafted", source: "AI · gpt-pro" },
  ],

  videoScripts: [
    { topic: "3 content calendar mistakes (and the pro fix)", category: "Strategy education", length: "30 seconds", speaker: "Marketing educator", tone: "Confident, founder-led", hook: "“Stop doing this with your calendar — and you'll wonder how you ever stayed consistent without it.”", beats: [{ beat: "Beat 1", detail: "planning is everything. If topics aren't batched, you post random content — not strategy.", bRoll: "B-roll: calendar planning" }, { beat: "Beat 2", detail: "posting cadence. Consistent, not sporadic. The most common mistake — and the easiest fix.", bRoll: "B-roll: scheduling demo" }, { beat: "Beat 3", detail: "review after. Skip the guesswork. Use a calm, data-driven review.", bRoll: "B-roll: analytics dashboard" }], onScreenText: "“Plan. Post. Review.”", cta: "Tag the marketer who needs to see this — and save for next week.", visuals: "POV vertical, warm daylight, 3 cuts, hands-only.", caption: "The 3-step pro fix for a consistent content calendar every time. Plan. Post. Review.", platformRecs: "TikTok primary · Instagram Reels secondary · cut a 15s version for Stories.", status: "Drafted" },
  ],

  images: [
    { title: "Editorial product still life", description: "Product on warm desk, soft morning light, neutral palette.", brandFitScore: 96, aspectRatio: "1:1 Square", status: "Drafted" },
    { title: "Infographic background", description: "3-step strategy grid, off-white with subtle paper texture, gold accents.", brandFitScore: 91, aspectRatio: "4:5 Portrait", status: "Drafted" },
    { title: "Carousel cover", description: "Hand demo on desk, hero text space top-left, warm beige tones.", brandFitScore: 88, aspectRatio: "1:1 Square", status: "Drafted" },
    { title: "Educational hero", description: "Abstract macro of workspace in soft focus, calm pastel palette.", brandFitScore: 94, aspectRatio: "16:9 Landscape", status: "Drafted" },
  ],
};
