import { z } from "zod";

export const contentBriefSchema = z.object({
  goal: z.string().min(1, "Select a content goal"),
  platform: z.string().min(1, "Select a platform"),
  tone: z.string().min(1, "Select a tone"),
  audience: z.string().min(1, "Audience is required"),
  topic: z.string().min(1, "Topic is required"),
  product: z.string().min(1, "Product / service is required"),
  cta: z.string().min(1, "CTA is required"),
  notes: z.string().optional(),
  contentType: z.string().min(1, "Select a content type"),
});

export type ContentBriefValues = z.infer<typeof contentBriefSchema>;

export const scriptBriefSchema = z.object({
  topic: z.string().min(1, "Video topic is required"),
  category: z.string().min(1, "Select a category"),
  audience: z.string().min(1, "Audience is required"),
  length: z.string().min(1, "Select a length"),
  speaker: z.string().min(1, "Select a speaker"),
  tone: z.string().min(1, "Select a tone"),
  cta: z.string().min(1, "CTA is required"),
  product: z.string().min(1, "Product / service is required"),
  keyPoints: z.string().min(1, "Key points are required"),
  claimsToAvoid: z.string().optional(),
});

export type ScriptBriefValues = z.infer<typeof scriptBriefSchema>;

export const imageBriefSchema = z.object({
  purpose: z.string().min(1, "Select a purpose"),
  platform: z.string().min(1, "Select a platform"),
  aspectRatio: z.string().min(1, "Select an aspect ratio"),
  topic: z.string().min(1, "Content topic is required"),
  brandStyle: z.string().min(1, "Brand style is required"),
  palette: z.string().min(1, "Color palette is required"),
  product: z.string().min(1, "Product / service is required"),
  promptNotes: z.string().optional(),
  imageType: z.string().min(1, "Select an image type"),
});

export type ImageBriefValues = z.infer<typeof imageBriefSchema>;

export const repurposeBriefSchema = z.object({
  originalContent: z.string().min(10, "Paste at least 10 characters of source content"),
  campaignGoal: z.string().min(1, "Select a campaign goal"),
  audience: z.string().min(1, "Audience is required"),
  product: z.string().min(1, "Product / service is required"),
  tone: z.string().min(1, "Select a tone"),
  cta: z.string().min(1, "CTA is required"),
});

export type RepurposeBriefValues = z.infer<typeof repurposeBriefSchema>;

export const knowledgeEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Select a category"),
  priority: z.string().min(1, "Select a priority"),
  description: z.string().min(1, "Description is required"),
  relatedProduct: z.string().optional(),
  approvedMessaging: z.string().optional(),
  phrasesToAvoid: z.string().optional(),
  audience: z.string().optional(),
  startDate: z.string().optional(),
  expiration: z.string().optional(),
});

export type KnowledgeEntryValues = z.infer<typeof knowledgeEntrySchema>;
