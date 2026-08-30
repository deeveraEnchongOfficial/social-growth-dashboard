# AI Growth Suite — Social Media Content, Performance & Outreach Dashboard

An original Next.js dashboard inspired by the product experience of a brand-safe AI-powered social media growth platform for modern brands. Built from scratch with a modern, production-ready stack.

## Features

- **Dashboard** — KPI overview, weekly AI recommendations, engagement charts, content & outreach pipelines, quick actions.
- **Performance / Analytics** — filterable post table with per-row AI insights, engagement-over-time chart, theme/platform/hook breakdowns, AI strategy summary.
- **Content Generator** — brief-driven AI content generation with brand-safety checks and approval routing.
- **Content Repurposing** — one source idea → multi-channel variants (Instagram, Facebook, LinkedIn, X, TikTok).
- **Video Scripts** — structured short-form script generator (hook, beats with B-roll, CTA, platform recs).
- **Image Studio** — AI image brief → 4 brand-fit-scored variants with approval routing.
- **Brand Reference Library** — upload zone + filterable references table.
- **Knowledge Memory** — add-knowledge form + knowledge base table that feeds all AI outputs.
- **Creator Search** — filterable creator cards with fit reasoning, suggested angles, and outreach actions.
- **Outreach Drafts** — prospect list + personalized message preview with personalization details.
- **Sending Status** — status summary cards, all-sends table, live activity feed.
- **Approval Queue** — the brand-safe governance hub; nothing sends without human approval.
- **Settings** — brand voice rules, content guardrails, API connections, user roles, notifications.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui-style primitives |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 |
| Charts | Recharts |
| Database | MongoDB (Mongoose) — falls back to mock data when unset |
| AI | Provider-agnostic interface with a mock provider (OpenAI / Anthropic / Gemini / OpenRouter ready) |
| Notifications | Sonner |
| Linting | ESLint (next/core-web-vitals) |

## Project structure

```
social-growth-dashboard/
├── src/
│   ├── app/
│   │   ├── (dashboard)/            # Authenticated layout group (sidebar + topbar)
│   │   │   ├── layout.tsx          # Calls requireAuth() — redirects to /login if unauthenticated
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── performance/
│   │   │   ├── content/
│   │   │   ├── repurpose/
│   │   │   ├── scripts/
│   │   │   ├── images/
│   │   │   ├── library/
│   │   │   ├── knowledge/
│   │   │   ├── outreach/
│   │   │   │   ├── search/
│   │   │   │   ├── drafts/
│   │   │   │   └── status/
│   │   │   ├── approvals/
│   │   │   └── settings/
│   │   ├── login/                  # Login page (standalone, no sidebar)
│   │   ├── api/                    # AI generation + NextAuth endpoints
│   │   │   ├── auth/[...nextauth]/ # NextAuth.js route handler
│   │   │   ├── content/route.ts
│   │   │   ├── scripts/route.ts
│   │   │   ├── images/route.ts
│   │   │   ├── repurpose/route.ts
│   │   │   └── outreach/route.ts
│   │   ├── layout.tsx              # Root layout + SessionProvider + Toaster
│   │   ├── globals.css
│   │   └── middleware.ts           # Route protection (redirects to /login)
│   ├── components/
│   │   ├── ui/                     # shadcn-style primitives (button, card, dialog, etc.)
│   │   ├── layout/                 # sidebar-nav, topbar (shows session user + sign-out)
│   │   ├── shared/                 # stat-card, pipeline, filter-bar, data-table, charts, states, etc.
│   │   ├── features/
│   │   │   └── content/            # content-preview
│   │   └── providers.tsx           # NextAuth SessionProvider wrapper
│   └── lib/
│       ├── ai/                     # provider interface + mock provider + factory
│       ├── auth/                   # NextAuth config, type augmentation, helpers
│       ├── db/                     # mongo connection, mongoose models, queries
│       ├── mock/                   # mock data
│       ├── types.ts                # shared TypeScript types
│       ├── constants.ts            # nav, platforms, themes, categories, etc.
│       ├── schemas.ts              # Zod form schemas
│       ├── icons.ts                # icon name → component map
│       └── utils.ts                # cn(), formatters
├── scripts/
│   ├── seed.ts                     # Database seeder (npm run seed / seed:fresh)
│   └── seed-data.ts                # Seed dataset
├── .env.example
├── tailwind.config.ts
└── package.json
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars (optional — app runs on mock data without these)
cp .env.example .env.local
#    Then edit .env.local and add your MONGODB_URI and NEXTAUTH_SECRET

# 3. Seed the database (requires MONGODB_URI)
npm run seed          # idempotent — upserts by email/handle
#   or: npm run seed:fresh   # drops collections first, then seeds

# 4. Run the dev server
npm run dev
# → http://localhost:3000 → redirects to /login

# 5. Production build
npm run build && npm start
```

### Default login credentials (created by the seeder)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@growthco.co` | `Admin@123` |
| Reviewer | `priya@growthco.co` | `Reviewer@123` |
| Content Creator | `creator@growthco.co` | `Creator@123` |
| Outreach Manager | `outreach@growthco.co` | `Outreach@123` |

> **Note:** If MongoDB is not connected, the credentials provider falls back to allowing the demo admin (`admin@growthco.co / Admin@123`) so the dashboard remains explorable during local development.

## Authentication

Authentication is implemented with **NextAuth.js** (credentials provider) backed by MongoDB:

- **Login page:** `/login` — email + password form
- **Session:** JWT-based (stateless, no session DB needed)
- **Password storage:** bcrypt-hashed (`bcryptjs`)
- **Route protection:** `src/middleware.ts` protects all routes except `/login`, `/api/*`, and static assets — unauthenticated users are redirected to `/login`
- **Server-side guard:** `requireAuth()` in `src/lib/auth/index.ts` — call from any Server Component or route handler to enforce authentication
- **Role guard:** `requireRole("Admin")` — restricts access to specific roles
- **Auth config:** `src/lib/auth/auth-options.ts`
- **Type augmentation:** `src/lib/auth/next-auth.d.ts` (adds `role` to session/user)
- **NextAuth API route:** `src/app/api/auth/[...nextauth]/route.ts`

### Auth flow

1. User visits any page → middleware checks for session → redirects to `/login` if unauthenticated
2. User submits email + password → NextAuth credentials provider queries MongoDB
3. bcrypt compares the submitted password against the hashed password in the `users` collection
4. On success, a JWT session is created with `name`, `email`, `role`, and `id`
5. All subsequent requests carry the session cookie → middleware allows access

## Database seeder

The seeder populates MongoDB with a full demo dataset (workspace, team members, brand voice, guardrails, integrations, social posts, brand references, knowledge entries, creators, outreach messages, approval items, content drafts, video scripts, images).

```bash
npm run seed          # upserts (safe to re-run)
npm run seed:fresh    # drops all collections first, then seeds
```

The seeder is **idempotent** — it upserts by unique keys (email, handle, title, slug) so re-running won't create duplicates.

### Seed data

Defined in `scripts/seed-data.ts`. The dataset mirrors the mock data in `src/lib/mock/data.ts` but is shaped for MongoDB. Key entries:

- **1 workspace** — GrowthCo, with full brand voice config and guardrails
- **4 users** — Admin + 3 team members (Reviewer, Content Creator, Outreach Manager)
- **7 integrations** — TikTok, Instagram, Gmail, OpenRouter, Tikhub, OpenAI Image 2, Apify
- **6 social posts** — with AI insights and recommended actions
- **6 brand references** — guidelines, images, carousels, training, voice notes
- **6 knowledge entries** — campaign priorities, approved language, claims to avoid
- **6 creators** — content creators, industry experts, thought leaders, UGC creators
- **6 outreach messages** — DMs and emails with personalization details
- **6 approval items** — content, images, scripts, outreach, repurposed posts, prospect lists
- **1 content draft, 1 video script, 4 images**

## Environment variables

See `.env.example`. Key variables:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string. Unset → mock data. |
| `AI_PROVIDER` | `mock` (default), `openai`, `anthropic`, `gemini`, `openrouter` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `OPENROUTER_API_KEY` | LLM credentials |
| `IMAGE_API_KEY` | Image generation provider |
| `TIKHUB_API_KEY` | Creator / prospect data |
| `APIFY_API_KEY` | Instagram DM automation |
| `EMAIL_API_KEY` | Email provider (Gmail / SMTP) |
| `TIKTOK_API_KEY` / `INSTAGRAM_API_KEY` | Social platform APIs |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | Auth (ready to wire) |

## Database schema (MongoDB / Mongoose)

Models are defined in `src/lib/db/models.ts`. Collections:

- **users** — email, name, role, avatarUrl
- **workspaces** — name, slug, brandVoice (tone, personality, readingLevel, ctaStyle, wordsToUse/Avoid, approvedClaims, claimsToAvoid), guardrails
- **socialposts** — workspaceId, caption, platform, topic, views, likes, comments, shares, engagementRate, postedAt, aiInsight, recommendedAction
- **contentdrafts** — workspaceId, type, platform, tone, title, hook, caption, cta, hashtags, visualSuggestion, brandSafety, status, source
- **videoscripts** — workspaceId, topic, category, length, speaker, tone, hook, beats[], onScreenText, cta, visuals, caption, platformRecs, status
- **images** — workspaceId, title, description, url, brandFitScore, aspectRatio, status, brief
- **repurposedvariants** — workspaceId, sourceDraftId, platform, hook, copy, cta, visual, status
- **brandreferences** — workspaceId, name, type, category, tags, fileUrl, uploadedBy, usedFor, status
- **knowledgeentries** — workspaceId, title, description, category, priority, approvedMessaging, phrasesToAvoid, relatedProduct, audience, startDate, expiration, usedCount, status
- **creators** — handle, name, platform, category, bio, followers, engagementRate, location, contact, contactSource, fitReason, suggestedAngle, listStatus
- **outreachmessages** — workspaceId, creatorId, channel, type, body, status, approvedBy, scheduledAt, sentAt, replyStatus, nextAction, lastAction, personalization
- **approvalitems** — workspaceId, type, itemId, status, aiSource, reviewer, title, preview, brandSafety
- **integrations** — workspaceId, name, provider, status, category, config

## AI service architecture

All AI features go through a single `AiProvider` interface (`src/lib/ai/types.ts`). The active provider is selected by `AI_PROVIDER`:

- **mock** (default) — returns realistic canned outputs, no API key needed.
- **openai / anthropic / gemini / openrouter** — stubbed in `src/lib/ai/index.ts`; implement the provider class and uncomment the switch case to activate.

API routes (`/api/content`, `/api/scripts`, `/api/images`, `/api/repurpose`, `/api/outreach`) call the provider and return JSON. Pages POST to these routes from Client Components.

## Integrations still needing real API credentials

| Integration | Env var | Purpose |
|---|---|---|
| OpenRouter / OpenAI / Anthropic / Gemini | `AI_PROVIDER` + key | LLM for content, scripts, repurposing, outreach, summaries |
| OpenAI Image 2 | `IMAGE_API_KEY` | AI image generation |
| Tikhub | `TIKHUB_API_KEY` | Creator / prospect data + social performance signals |
| Apify | `APIFY_API_KEY` | Instagram DM automation |
| Gmail / Email provider | `EMAIL_API_KEY` | Outreach email sending |
| TikTok / Instagram APIs | platform keys | Social profile + performance data |
| Supabase / NextAuth | `NEXTAUTH_SECRET` | Authentication (architecture is auth-ready) |

## Architecture notes

- **Server Components by default** — pages are Server Components; Client Components (`"use client"`) are used only where interactivity requires it (forms, tables, filters, interactive panels).
- **Reusable components** — `src/components/shared/` holds cross-feature UI (StatCard, Pipeline, FilterBar, DataTable, charts, states, badges). Feature-specific components live in `src/components/features/`.
- **Feature modules** — each page is a self-contained feature module under `src/app/(dashboard)/`.
- **Mock data layer** — `src/lib/mock/data.ts` provides realistic data matching the reference product. The data access layer (`src/lib/db/queries.ts`) uses MongoDB when `MONGODB_URI` is set and connected, otherwise falls back to mock data.
- **Auth-ready** — the dashboard layout group `(dashboard)` is structured for an auth wrapper; wire NextAuth/Supabase in `src/lib/auth/` and protect the layout.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # production server
npm run lint         # ESLint
npm run typecheck    # TypeScript type check
npm run seed         # seed MongoDB (idempotent upserts)
npm run seed:fresh   # drop collections then seed
```

## Original work notice

This is an original implementation built from publicly observable product/UI inspiration. It does not copy, reverse-engineer, or reproduce any private source code, APIs, credentials, or proprietary backend logic from the reference application.
