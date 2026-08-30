import mongoose, { type InferSchemaType } from "mongoose";

const { Schema, model } = mongoose;

/* ----------------------------- User ----------------------------- */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["Admin", "Reviewer", "Content Creator", "Outreach Manager"], default: "Reviewer" },
    avatarUrl: String,
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace" },
  },
  { timestamps: true }
);

/* --------------------------- Workspace -------------------------- */
const workspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    brandVoice: {
      tone: [String],
      personality: [String],
      readingLevel: String,
      ctaStyle: String,
      wordsToUse: [String],
      wordsToAvoid: [String],
      approvedClaims: [String],
      claimsToAvoid: [String],
    },
    guardrails: { type: [String], default: [] },
  },
  { timestamps: true }
);

/* -------------------------- SocialPost -------------------------- */
const socialPostSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    caption: String,
    platform: String,
    topic: String,
    views: Number,
    likes: Number,
    comments: Number,
    shares: Number,
    engagementRate: Number,
    postedAt: Date,
    aiInsight: String,
    recommendedAction: String,
  },
  { timestamps: true }
);

/* ------------------------- ContentDraft ------------------------- */
const contentDraftSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    type: String,
    platform: String,
    tone: String,
    title: String,
    hook: String,
    caption: String,
    cta: String,
    hashtags: [String],
    visualSuggestion: String,
    brandSafety: String,
    status: { type: String, default: "Drafted" },
    source: String,
  },
  { timestamps: true }
);

/* ------------------------- VideoScript -------------------------- */
const videoScriptSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    topic: String,
    category: String,
    length: String,
    speaker: String,
    tone: String,
    hook: String,
    beats: [{ beat: String, detail: String, bRoll: String }],
    onScreenText: String,
    cta: String,
    visuals: String,
    caption: String,
    platformRecs: String,
    status: { type: String, default: "Drafted" },
  },
  { timestamps: true }
);

/* --------------------------- Image ------------------------------ */
const imageSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    title: String,
    description: String,
    url: String,
    brandFitScore: Number,
    aspectRatio: String,
    status: { type: String, default: "Drafted" },
    brief: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

/* ----------------------- RepurposedVariant ---------------------- */
const repurposedVariantSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    sourceDraftId: { type: Schema.Types.ObjectId, ref: "ContentDraft" },
    platform: String,
    hook: String,
    copy: String,
    cta: String,
    visual: String,
    status: { type: String, default: "Drafted" },
  },
  { timestamps: true }
);

/* ------------------------ BrandReference ------------------------ */
const brandReferenceSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    name: String,
    type: { type: String },
    category: String,
    tags: [String],
    fileUrl: String,
    uploadedBy: String,
    usedFor: String,
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

/* ----------------------- KnowledgeEntry ------------------------- */
const knowledgeEntrySchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    title: String,
    description: String,
    category: String,
    priority: { type: String, default: "Medium" },
    content: { type: String, default: "" },
    wordCount: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

/* --------------------------- Creator ---------------------------- */
const creatorSchema = new Schema(
  {
    handle: { type: String, index: true },
    name: String,
    platform: String,
    category: String,
    bio: String,
    followers: Number,
    engagementRate: Number,
    location: String,
    contact: String,
    contactSource: String,
    fitReason: String,
    suggestedAngle: String,
    listStatus: { type: String, default: "New" },
  },
  { timestamps: true }
);

/* ----------------------- OutreachMessage ------------------------ */
const outreachMessageSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "Creator", index: true },
    channel: { type: String, enum: ["Instagram DM", "Email"] },
    type: String,
    body: String,
    status: { type: String, default: "Drafted" },
    approvedBy: String,
    scheduledAt: Date,
    sentAt: Date,
    replyStatus: String,
    nextAction: String,
    lastAction: String,
    personalization: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

/* ------------------------- ApprovalItem ------------------------- */
const approvalItemSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    type: String,
    itemId: { type: Schema.Types.ObjectId },
    status: { type: String, default: "Needs Review" },
    aiSource: String,
    reviewer: String,
    title: String,
    preview: String,
    brandSafety: String,
  },
  { timestamps: true }
);

/* ------------------------- Integration -------------------------- */
const integrationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true },
    name: String,
    provider: String,
    status: { type: String, default: "Disconnected" },
    category: String,
    config: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

/* -------------------------- Settings ---------------------------- */
const settingsSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", index: true, unique: true },
    brandVoice: {
      tone: { type: String, default: "Educational, calm" },
      personality: { type: String, default: "Founder-led authority" },
      readingLevel: { type: String, default: "Grade 7–9 (accessible)" },
      ctaStyle: { type: String, default: "Save / share / consult" },
      wordsToUse: { type: String, default: "customer-focused, data-driven, approachable, strategy, playbook, insight, growth" },
      wordsToAvoid: { type: String, default: "hype, exaggeration, miracle, guaranteed, permanent" },
      approvedClaims: { type: String, default: "Built for growing teams · Designed for modern marketers · Trusted by data-driven brands" },
      claimsToAvoid: { type: String, default: "No unsubstantiated claims. No before/after promises. No “proven” without source." },
    },
    guardrails: { type: Schema.Types.Mixed, default: {} },
    notifications: { type: Schema.Types.Mixed, default: {} },
    aiProviders: {
      activeProvider: { type: String, default: "mock" },
      openai: { apiKey: { type: String, default: "" }, model: { type: String, default: "gpt-4o" } },
      anthropic: { apiKey: { type: String, default: "" }, model: { type: String, default: "claude-sonnet-4-20250514" } },
      gemini: { apiKey: { type: String, default: "" }, model: { type: String, default: "gemini-2.0-flash" } },
      openrouter: { apiKey: { type: String, default: "" }, model: { type: String, default: "anthropic/claude-3.5-sonnet" } },
      imageProvider: { type: String, default: "mock" },
      imageApiKey: { type: String, default: "" },
    },
    integrations: {
      tikhub: { apiKey: { type: String, default: "" }, status: { type: String, default: "Disconnected" } },
      apify: { apiKey: { type: String, default: "" }, status: { type: String, default: "Disconnected" } },
      gmail: { apiKey: { type: String, default: "" }, status: { type: String, default: "Disconnected" } },
      tiktok: { apiKey: { type: String, default: "" }, status: { type: String, default: "Disconnected" } },
      instagram: { apiKey: { type: String, default: "" }, status: { type: String, default: "Disconnected" } },
    },
    email: {
      provider: { type: String, default: "none" },
      smtp: {
        host: { type: String, default: "" },
        port: { type: Number, default: 587 },
        secure: { type: Boolean, default: false },
        user: { type: String, default: "" },
        pass: { type: String, default: "" },
        fromName: { type: String, default: "" },
        fromEmail: { type: String, default: "" },
      },
    },
    workspace: {
      name: { type: String, default: "GrowthCo" },
      productName: { type: String, default: "AI Growth Suite" },
    },
    dropdownValues: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Guard against OverwriteModelError when the module is bundled multiple
// times by Next.js webpack — only register a model if it doesn't exist yet.
function getModel(name: string, schema: mongoose.Schema) {
  return mongoose.models[name] || model(name, schema);
}

export const User = getModel("User", userSchema) as mongoose.Model<UserDoc>;
export const Workspace = getModel("Workspace", workspaceSchema) as mongoose.Model<WorkspaceDoc>;
export const SocialPost = getModel("SocialPost", socialPostSchema) as mongoose.Model<SocialPostDoc>;
export const ContentDraftModel = getModel("ContentDraft", contentDraftSchema) as mongoose.Model<ContentDraftDoc>;
export const VideoScriptModel = getModel("VideoScript", videoScriptSchema) as mongoose.Model<VideoScriptDoc>;
export const ImageModel = getModel("Image", imageSchema) as mongoose.Model<ImageDoc>;
export const RepurposedVariantModel = getModel("RepurposedVariant", repurposedVariantSchema) as mongoose.Model<RepurposedVariantDoc>;
export const BrandReferenceModel = getModel("BrandReference", brandReferenceSchema) as mongoose.Model<BrandReferenceDoc>;
export const KnowledgeEntryModel = getModel("KnowledgeEntry", knowledgeEntrySchema) as mongoose.Model<KnowledgeEntryDoc>;
export const CreatorModel = getModel("Creator", creatorSchema) as mongoose.Model<CreatorDoc>;
export const OutreachMessageModel = getModel("OutreachMessage", outreachMessageSchema) as mongoose.Model<OutreachMessageDoc>;
export const ApprovalItemModel = getModel("ApprovalItem", approvalItemSchema) as mongoose.Model<ApprovalItemDoc>;
export const IntegrationModel = getModel("Integration", integrationSchema) as mongoose.Model<IntegrationDoc>;
export const SettingsModel = getModel("Settings", settingsSchema) as mongoose.Model<SettingsDoc>;

export type UserDoc = InferSchemaType<typeof userSchema>;
export type WorkspaceDoc = InferSchemaType<typeof workspaceSchema>;
export type SocialPostDoc = InferSchemaType<typeof socialPostSchema>;
export type ContentDraftDoc = InferSchemaType<typeof contentDraftSchema>;
export type VideoScriptDoc = InferSchemaType<typeof videoScriptSchema>;
export type ImageDoc = InferSchemaType<typeof imageSchema>;
export type RepurposedVariantDoc = InferSchemaType<typeof repurposedVariantSchema>;
export type BrandReferenceDoc = InferSchemaType<typeof brandReferenceSchema>;
export type KnowledgeEntryDoc = InferSchemaType<typeof knowledgeEntrySchema>;
export type CreatorDoc = InferSchemaType<typeof creatorSchema>;
export type OutreachMessageDoc = InferSchemaType<typeof outreachMessageSchema>;
export type ApprovalItemDoc = InferSchemaType<typeof approvalItemSchema>;
export type IntegrationDoc = InferSchemaType<typeof integrationSchema>;
export type SettingsDoc = InferSchemaType<typeof settingsSchema>;
