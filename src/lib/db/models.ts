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
    approvedMessaging: String,
    phrasesToAvoid: String,
    relatedProduct: String,
    audience: String,
    startDate: Date,
    expiration: Date,
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
