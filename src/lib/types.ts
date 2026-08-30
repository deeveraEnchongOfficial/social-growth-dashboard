export type Platform = "Instagram" | "TikTok" | "LinkedIn" | "X / Twitter" | "Facebook";

export type ContentTheme =
  | "How-to & Tutorials"
  | "Product Education"
  | "Founder POV"
  | "Product Spotlight"
  | "Industry News"
  | "Myth Busting";

export type ContentType =
  | "Instagram caption"
  | "Facebook post"
  | "LinkedIn post"
  | "Twitter/X post"
  | "Carousel concept"
  | "Infographic concept"
  | "Product education"
  | "Professional education"
  | "Short-form video script"
  | "UGC collab prompt";

export type Tone =
  | "Educational, calm"
  | "Confident, founder-led"
  | "Warm, conversational"
  | "Bold, opinionated";

export type ApprovalStatus =
  | "Drafted"
  | "Needs Review"
  | "Needs Revision"
  | "Approved"
  | "Scheduled"
  | "Rejected"
  | "Sent";

export type ApprovalItemType =
  | "Content"
  | "Images"
  | "Scripts"
  | "Repurposed Posts"
  | "Outreach"
  | "Prospect Lists";

export type CreatorCategory =
  | "Influencer"
  | "UGC creator"
  | "Content creator"
  | "Industry expert"
  | "Thought leader"
  | "Affiliate partner"
  | "Reseller"
  | "Consultant"
  | "Brand ambassador";

export type ListStatus =
  | "New"
  | "Shortlisted"
  | "Drafted"
  | "Approved"
  | "Do Not Contact";

export type OutreachChannel = "Instagram DM" | "Email";

export type OutreachStatus =
  | "Drafted"
  | "Approved"
  | "Queued"
  | "Sending"
  | "Sent"
  | "Failed"
  | "Replied"
  | "Follow Up Needed"
  | "Do Not Contact";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type KnowledgeCategory =
  | "New product"
  | "New offering"
  | "Promotion"
  | "Training program"
  | "Distributor info"
  | "Campaign priority"
  | "Audience segment"
  | "Approved language"
  | "Claims to avoid"
  | "Brand positioning"
  | "Founder notes"
  | "Seasonal messaging";

export type ReferenceCategory =
  | "Brand guidelines"
  | "Product images"
  | "Past social posts"
  | "Captions"
  | "Carousels"
  | "Video scripts"
  | "Website copy"
  | "Product descriptions"
  | "Training content"
  | "Campaign references"
  | "Competitor references"
  | "Style references";

export type IntegrationStatus = "Connected" | "Active" | "Paused" | "Disconnected";

export type UserRole = "Admin" | "Reviewer" | "Content Creator" | "Outreach Manager";

export interface KpiStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  sublabel: string;
  icon: string;
}

export interface WeeklyRecommendation {
  id: string;
  text: string;
}

export interface PipelineStage {
  label: string;
  value: number;
}

export interface SocialPost {
  id: string;
  caption: string;
  platform: Platform;
  topic: ContentTheme;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  postedAt: string;
  aiInsight: string;
  recommendedAction: string;
}

export interface ContentDraft {
  id: string;
  type: ContentType;
  platform: Platform;
  tone: Tone;
  title: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
  visualSuggestion: string;
  brandSafety: string;
  status: ApprovalStatus;
  source: string;
  createdAt: string;
}

export interface VideoScriptBeat {
  beat: string;
  detail: string;
  bRoll: string;
}

export interface VideoScript {
  id: string;
  topic: string;
  category: string;
  length: string;
  speaker: string;
  tone: Tone;
  hook: string;
  beats: VideoScriptBeat[];
  onScreenText: string;
  cta: string;
  visuals: string;
  caption: string;
  platformRecs: string;
  status: ApprovalStatus;
  createdAt: string;
}

export interface GeneratedImage {
  id: string;
  title: string;
  description: string;
  brandFitScore: number;
  aspectRatio: string;
  status: ApprovalStatus;
  gradient: string;
}

export interface RepurposeVariant {
  id: string;
  platform: Platform;
  hook: string;
  copy: string;
  cta: string;
  visual: string;
  status: ApprovalStatus;
}

export interface BrandReference {
  id: string;
  name: string;
  type: "PDF" | "Image" | "Text" | "Video";
  category: ReferenceCategory;
  tags: string[];
  uploadedBy: string;
  date: string;
  usedFor: string;
  status: "Active" | "Archived";
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  category: KnowledgeCategory;
  priority: Priority;
  updated: string;
  usedIn: number;
  status: "Active" | "Archived";
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  category: CreatorCategory;
  bio: string;
  followers: number;
  engagementRate: number;
  location: string;
  contact: string;
  contactSource: string;
  fitReason: string;
  suggestedAngle: string;
  listStatus: ListStatus;
}

export interface PersonalizationDetail {
  bioInsight: string;
  contentTopics: string[];
  location: string;
  category: CreatorCategory;
  brandFitReason: string;
  contactSource: string;
}

export interface OutreachMessage {
  id: string;
  creatorId: string;
  creatorName: string;
  handle: string;
  platform: Platform;
  category: CreatorCategory;
  channel: OutreachChannel;
  type: string;
  body: string;
  status: OutreachStatus;
  approvedBy: string;
  scheduledAt?: string;
  sentAt?: string;
  replyStatus?: string;
  nextAction?: string;
  lastAction: string;
  time: string;
  personalization: PersonalizationDetail;
}

export interface ApprovalItem {
  id: string;
  type: ApprovalItemType;
  status: ApprovalStatus;
  aiSource: string;
  createdAt: string;
  reviewer: string;
  title: string;
  preview: string;
  brandSafety: string;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  status: IntegrationStatus;
  category: "Social" | "AI" | "Email" | "Automation" | "Data";
}

export interface ActivityEvent {
  id: string;
  text: string;
  time: string;
  tone: "neutral" | "success" | "warning" | "destructive";
}

export interface EngagementPoint {
  day: string;
  reach: number;
  engagement: number;
}

export interface ThemeScore {
  theme: ContentTheme;
  score: number;
}

export interface PlatformShare {
  platform: Platform;
  share: number;
}

export interface HookPerformance {
  hook: string;
  score: number;
}

export interface AiStrategySummary {
  whatWorked: string;
  whatUnderperformed: string;
  whatToCreateNext: string;
  whatToAvoid: string;
  suggestedHooks: string[];
  suggestedCarouselTopics: string[];
}
