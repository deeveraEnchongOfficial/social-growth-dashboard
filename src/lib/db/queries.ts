import { connectMongo } from "./mongo";
import {
  SocialPost,
  CreatorModel,
  OutreachMessageModel,
  ApprovalItemModel,
  BrandReferenceModel,
  KnowledgeEntryModel,
  IntegrationModel,
} from "./models";
import * as mock from "../mock/data";
import type {
  SocialPost as SocialPostType,
  Creator as CreatorType,
  OutreachMessage,
  ApprovalItem,
  BrandReference,
  KnowledgeEntry,
  Integration,
} from "../types";

/**
 * Data access layer. Uses MongoDB when MONGODB_URI is set and the
 * connection succeeds; otherwise falls back to the mock data layer.
 * Pages call these functions and stay agnostic to the source.
 */
async function isDbConnected() {
  const conn = await connectMongo();
  return conn !== null;
}

export async function getSocialPosts(): Promise<SocialPostType[]> {
  if (await isDbConnected()) {
    const docs = await SocialPost.find().lean().limit(50);
    return docs.map((d) => ({
      id: String(d._id),
      caption: d.caption ?? "",
      platform: d.platform as SocialPostType["platform"],
      topic: d.topic as SocialPostType["topic"],
      views: d.views ?? 0,
      likes: d.likes ?? 0,
      comments: d.comments ?? 0,
      shares: d.shares ?? 0,
      engagementRate: d.engagementRate ?? 0,
      postedAt: d.postedAt ? new Date(d.postedAt).toISOString() : "",
      aiInsight: d.aiInsight ?? "",
      recommendedAction: d.recommendedAction ?? "",
    }));
  }
  return mock.socialPosts;
}

export async function getCreators(): Promise<CreatorType[]> {
  if (await isDbConnected()) {
    const docs = await CreatorModel.find().lean().limit(50);
    return docs.map((d) => ({
      id: String(d._id),
      name: d.name ?? "",
      handle: d.handle ?? "",
      platform: d.platform as CreatorType["platform"],
      category: d.category as CreatorType["category"],
      bio: d.bio ?? "",
      followers: d.followers ?? 0,
      engagementRate: d.engagementRate ?? 0,
      location: d.location ?? "",
      contact: d.contact ?? "",
      contactSource: d.contactSource ?? "",
      fitReason: d.fitReason ?? "",
      suggestedAngle: d.suggestedAngle ?? "",
      listStatus: d.listStatus as CreatorType["listStatus"],
    }));
  }
  return mock.creators;
}

export async function getOutreachMessages(): Promise<OutreachMessage[]> {
  if (await isDbConnected()) {
    const docs = await OutreachMessageModel.find().lean().limit(50);
    return docs as unknown as OutreachMessage[];
  }
  return mock.outreachMessages;
}

export async function getApprovalItems(): Promise<ApprovalItem[]> {
  if (await isDbConnected()) {
    const docs = await ApprovalItemModel.find().lean().limit(50);
    return docs as unknown as ApprovalItem[];
  }
  return mock.approvalItems;
}

export async function getBrandReferences(): Promise<BrandReference[]> {
  if (await isDbConnected()) {
    const docs = await BrandReferenceModel.find().lean().limit(50);
    return docs as unknown as BrandReference[];
  }
  return mock.brandReferences;
}

export async function getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  if (await isDbConnected()) {
    const docs = await KnowledgeEntryModel.find().lean().limit(50);
    return docs as unknown as KnowledgeEntry[];
  }
  return [];
}

export async function getIntegrations(): Promise<Integration[]> {
  if (await isDbConnected()) {
    const docs = await IntegrationModel.find().lean().limit(50);
    return docs as unknown as Integration[];
  }
  return mock.integrations;
}
