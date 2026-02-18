# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Automated content factory for LVMN AI Agency — daily AI-generated blog articles about AI automation for business, published to a Next.js blog, announced in Telegram.

**Product**: LVMN (lvmn.vercel.app) — AI-агентство по внедрению автоматизации в бизнес.

## Commands

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint

npx tsx scripts/seed-topic.ts      # Seed a test topic
npx tsx scripts/run-pipeline.ts    # Run full pipeline manually
npx tsx scripts/check-articles.ts  # Validate article structure
npx tsx scripts/fix-broken-articles.ts  # Repair malformed posts
npx tsx scripts/setup-storage.ts   # Initialize Supabase Storage bucket

npx vercel --prod    # Deploy to Vercel
```

## Architecture

```
Vercel Cron (vercel.json)
  ├── /api/cron/mine-topics  (every 3 days, 04:00 UTC)
  │     └── Exa trends → Wordstat search demand → Gemini → validate keywords → save topics
  │
  └── /api/cron/generate     (daily, 05:00 UTC = 08:00 MSK)
        ├── select top pending topic
        ├── researcher (Exa API → 6 sources)
        ├── writer (Gemini 2.0 Flash, 1500-2500 words with MEME placeholders)
        ├── 4 sequential editors (structure → coherence → anti-slop → factcheck)
        ├── image-generator (Gemini 3 Pro → Supabase Storage)
        ├── publisher (slug, meta_desc, MD→HTML, save to lvmn_blog_posts)
        └── [telegram not wired in cron yet]

Next.js ISR frontend
  ├── /blog          — article list (revalidate 60s)
  ├── /blog/[slug]   — article page + JSON-LD + CTA + sticky TOC
  ├── /blog/sitemap.xml
  ├── /blog/feed.xml — RSS feed
  └── /robots.txt
```

## Database (Supabase)

Same Supabase instance as sabka-blog, separate tables:

**lvmn_blog_topics**: `id, title, angle, keywords[], source, score, search_volume, status, created_at, used_at`

**lvmn_blog_posts**: `id, topic_id, slug, title, meta_desc, content_md, content_html, cover_image, tags[], cta_url, status, published_at, telegram_sent, views`

**Storage bucket**: `lvmn-blog-images` (public, 10MB, image MIME only)

RPC function: `increment_lvmn_views(post_slug TEXT)`

## Key Files

- `lib/lvmn-features.ts` — agency description (single source of truth)
- `lib/pipeline/style-guide.ts` — writing rules
- `lib/pipeline/writer.ts` — article writer with LVMN persona
- `lib/pipeline/topic-miner.ts` — topic generation with Wordstat
- `lib/pipeline/editors.ts` — 4-pass editing
- `lib/pipeline/image-generator.ts` — Gemini 3 Pro images → `lvmn-blog-images` bucket
- `lib/pipeline/publisher.ts` — slug, meta, publish to `lvmn_blog_posts`
- `lib/wordstat.ts` — Yandex Wordstat API wrapper

## Design Tokens

- **Accent**: `#7c6aef` (purple), hover `#9b8df5`, light `#f0edff`, dark `#5b4cc4`
- **Dark mode accent-light**: `#1a1530`
- **Fonts**: Outfit (body), Cormorant Garamond (headings), JetBrains Mono (code)
- **Background**: `#08090c` (dark), `#ffffff` (light)

## Environment Variables

```
GOOGLE_AI_API_KEY          # Gemini API
SUPABASE_URL               # Supabase project URL
SUPABASE_SERVICE_KEY       # Supabase service role key
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
EXA_API_KEY                # Exa for research
TELEGRAM_BOT_TOKEN         # Telegram bot
TELEGRAM_CHANNEL_ID        # Target channel
CRON_SECRET                # Vercel Cron auth
BLOG_URL                   # https://lvmn-blog.vercel.app
WORDSTAT_TOKEN             # Yandex Wordstat API OAuth token
```

## Gotchas

- **Two Gemini SDKs**: Text uses `@google/generative-ai`, images use `@google/genai`.
- Manual trigger secret is `lvmn2026go` (query param `?secret=`).
- Shares Supabase instance with sabka-blog — tables prefixed `lvmn_`.
- Inngest exists in code but Vercel Cron is the active trigger.
- MEME placeholders must be preserved through editing pipeline.
- Forked from sabka-blog — no `sabka` references should remain in active code.
