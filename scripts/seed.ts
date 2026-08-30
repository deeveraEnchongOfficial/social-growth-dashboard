/**
 * Database seeder — populates MongoDB with a full demo dataset.
 *
 * Usage:
 *   npm run seed          # seed (idempotent — upserts by email/handle)
 *   npm run seed:fresh    # drop collections then seed
 *
 * Requires MONGODB_URI in .env.local.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  User,
  Workspace,
  SocialPost,
  ContentDraftModel,
  VideoScriptModel,
  ImageModel,
  RepurposedVariantModel,
  BrandReferenceModel,
  KnowledgeEntryModel,
  CreatorModel,
  OutreachMessageModel,
  ApprovalItemModel,
  IntegrationModel,
} from "../src/lib/db/models";
import { seedData } from "./seed-data";

const MONGODB_URI = process.env.MONGODB_URI;
const FRESH = process.argv.includes("--fresh");

async function run() {
  if (!MONGODB_URI) {
    console.error("✗ MONGODB_URI is not set. Add it to .env.local then run: npm run seed");
    process.exit(1);
  }

  console.log("→ Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("✓ Connected");

  if (FRESH) {
    console.log("→ Dropping existing collections (--fresh)…");
    await Promise.all([
      User.deleteMany({}),
      Workspace.deleteMany({}),
      SocialPost.deleteMany({}),
      ContentDraftModel.deleteMany({}),
      VideoScriptModel.deleteMany({}),
      ImageModel.deleteMany({}),
      RepurposedVariantModel.deleteMany({}),
      BrandReferenceModel.deleteMany({}),
      KnowledgeEntryModel.deleteMany({}),
      CreatorModel.deleteMany({}),
      OutreachMessageModel.deleteMany({}),
      ApprovalItemModel.deleteMany({}),
      IntegrationModel.deleteMany({}),
    ]);
    console.log("✓ Collections cleared");
  }

  // 1. Workspace
  console.log("→ Seeding workspace…");
  const workspace = await Workspace.findOneAndUpdate(
    { slug: "growthco" },
    { $set: seedData.workspace },
    { upsert: true, returnDocument: 'after' }
  );
  console.log(`✓ Workspace: ${workspace.name} (${workspace._id})`);

  // 2. Admin user (hashed password)
  console.log("→ Seeding admin user…");
  const hashed = await bcrypt.hash("Admin@123", 10);
  const admin = await User.findOneAndUpdate(
    { email: "admin@growthco.co" },
    {
      $set: {
        email: "admin@growthco.co",
        name: "Alex Morgan",
        password: hashed,
        role: "Admin",
        workspaceId: workspace._id,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );
  console.log(`✓ Admin user: ${admin.email} (${admin._id})`);
  console.log("   Login: admin@growthco.co / Admin@123");

  // 3. Additional team members
  console.log("→ Seeding team members…");
  for (const member of seedData.teamMembers) {
    const pw = await bcrypt.hash(member.password, 10);
    await User.findOneAndUpdate(
      { email: member.email },
      { $set: { ...member, password: pw, workspaceId: workspace._id } },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`  ✓ ${member.email} (${member.role})`);
  }

  // 4. Integrations
  console.log("→ Seeding integrations…");
  for (const integration of seedData.integrations) {
    await IntegrationModel.findOneAndUpdate(
      { workspaceId: workspace._id, name: integration.name },
      { $set: { ...integration, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.integrations.length} integrations`);

  // 5. Social posts
  console.log("→ Seeding social posts…");
  for (const post of seedData.socialPosts) {
    await SocialPost.findOneAndUpdate(
      { workspaceId: workspace._id, caption: post.caption },
      { $set: { ...post, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.socialPosts.length} social posts`);

  // 6. Brand references
  console.log("→ Seeding brand references…");
  for (const ref of seedData.brandReferences) {
    await BrandReferenceModel.findOneAndUpdate(
      { workspaceId: workspace._id, name: ref.name },
      { $set: { ...ref, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.brandReferences.length} brand references`);

  // 7. Knowledge entries
  console.log("→ Seeding knowledge entries…");
  for (const entry of seedData.knowledgeEntries) {
    await KnowledgeEntryModel.findOneAndUpdate(
      { workspaceId: workspace._id, title: entry.title },
      { $set: { ...entry, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.knowledgeEntries.length} knowledge entries`);

  // 8. Creators
  console.log("→ Seeding creators…");
  const creatorIds: Record<string, string> = {};
  for (const creator of seedData.creators) {
    const doc = await CreatorModel.findOneAndUpdate(
      { handle: creator.handle },
      { $set: creator },
      { upsert: true, returnDocument: 'after' }
    );
    creatorIds[creator.handle] = String(doc._id);
  }
  console.log(`✓ ${seedData.creators.length} creators`);

  // 9. Outreach messages
  console.log("→ Seeding outreach messages…");
  for (const msg of seedData.outreachMessages) {
    const creatorId = creatorIds[msg.creatorHandle];
    await OutreachMessageModel.findOneAndUpdate(
      { workspaceId: workspace._id, creatorId, type: msg.type },
      { $set: { ...msg, workspaceId: workspace._id, creatorId } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.outreachMessages.length} outreach messages`);

  // 10. Approval items
  console.log("→ Seeding approval items…");
  for (const item of seedData.approvalItems) {
    await ApprovalItemModel.findOneAndUpdate(
      { workspaceId: workspace._id, title: item.title },
      { $set: { ...item, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.approvalItems.length} approval items`);

  // 11. Content drafts
  console.log("→ Seeding content drafts…");
  for (const draft of seedData.contentDrafts) {
    await ContentDraftModel.findOneAndUpdate(
      { workspaceId: workspace._id, title: draft.title },
      { $set: { ...draft, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.contentDrafts.length} content drafts`);

  // 12. Video scripts
  console.log("→ Seeding video scripts…");
  for (const script of seedData.videoScripts) {
    await VideoScriptModel.findOneAndUpdate(
      { workspaceId: workspace._id, topic: script.topic },
      { $set: { ...script, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.videoScripts.length} video scripts`);

  // 13. Images
  console.log("→ Seeding images…");
  for (const image of seedData.images) {
    await ImageModel.findOneAndUpdate(
      { workspaceId: workspace._id, title: image.title },
      { $set: { ...image, workspaceId: workspace._id } },
      { upsert: true }
    );
  }
  console.log(`✓ ${seedData.images.length} images`);

  console.log("\n✅ Seed complete!");
  console.log("   Login: admin@growthco.co / Admin@123");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
