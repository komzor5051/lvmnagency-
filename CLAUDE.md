# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal site for **Влад Лямин — AI-инженер** (lvmn.vercel.app): a marketing site
(home, about, products, AI-audit funnel) plus an automated content factory that
publishes daily AI-generated blog articles and announces them in Telegram.

**Not an agency.** The brand is personal — Влад внедряет AI-системы для бизнеса
лично. Do not reintroduce "AI-агентство LVMN / мы" framing in copy or personas,
and do not write his location ("Новосибирск") in visible text. The `lvmn` name
survives only in infra identifiers (domain, repo `lvmnagency-`, `lvmn_blog_*`
tables, `increment_lvmn_views`, `lvmn-blog-images`, `LVMN_*` export symbols,
`lib/lvmn-features.ts`) — those are not brand and must not be renamed.

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
        ├── writer (Gemini 2.0 Flash, 1500-2500 words with ![IMG:] placeholders)
        ├── 4 sequential editors (structure → coherence → anti-slop → factcheck)
        ├── image-generator (cinematic editorial covers via lib/pipeline/cover-style.ts → Supabase Storage)
        ├── publisher (slug, meta_desc, MD→HTML, save to lvmn_blog_posts)
        └── [telegram not wired in cron yet]

Next.js frontend
  ├── /            — home (Hero, ProofStrip, TeachingStrip, ProductsSection,
  │                  DarkBusiness, CasesSection, AboutTeaser, FinalCta) in components/home/
  ├── /about       — personal manifesto / expertise / principles
  ├── /products    — product catalog (lib/products.ts) + FAQ
  ├── /audit       — 7-step AI-audit lead funnel (client form, own audit-* CSS)
  ├── /blog        — article list (ISR, revalidate 60s)
  ├── /blog/[slug] — article page + JSON-LD + CTA + sticky TOC
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

- `lib/lvmn-features.ts` — Влад's offering + proof, written in first/third person
  (single source of truth for the blog writer; keep the `LVMN_*` export names)
- `lib/products.ts` — product catalog for the marketing site (consultation, guide,
  audit, course)
- `lib/pipeline/style-guide.ts` — writing rules
- `lib/pipeline/writer.ts` — article writer (Влад's persona, not an agency)
- `lib/pipeline/topic-miner.ts` — topic generation with Wordstat
- `lib/pipeline/editors.ts` — 4-pass editing
- `lib/pipeline/image-generator.ts` — Gemini 3 Pro images → `lvmn-blog-images` bucket
- `lib/pipeline/publisher.ts` — slug, meta, publish to `lvmn_blog_posts`
- `lib/wordstat.ts` — Yandex Wordstat API wrapper

## Design System — White + Lime (Brand DS)

Defined in `app/globals.css` (the `@theme` block near the bottom + scoped
overrides). No purple, no AI slop, no shadows, sharp corners.

- **Background**: white `#FFFFFF` (`paper`); text ink `#111111` (`ink`),
  muted `#666666` (`ink-muted`); hairline borders `#E8E8E8` (`line`)
- **Accent**: lime `#C8F04C` (`lime`), dark `#A8D030` (`lime-dark`) — a FILL/
  highlight only (lime-mark, buttons, tags, rules, dots). Never a text colour
  (unreadable on white). Links/emphasis use an ink underline (`link-ul`).
- **Radius**: 0px everywhere. **Shadows**: none.
- **Fonts** (`app/layout.tsx`, next/font, cyrillic subset): Inter Tight
  (`font-heading` display), Onest (`font-body`), Caveat (`font-hand`
  annotations), system mono (`font-mono`). The brand's Fontshare fonts
  (Cabinet Grotesk, Satoshi) are Latin-only — do NOT use them, they fall back
  to system sans on Russian text.
- Utilities: `lime-mark` (lime highlight behind text), `link-ul` (ink underline),
  `font-hand` (Caveat notes). `--color-accent` resolves to ink for legacy
  Tailwind `*-accent` utilities; `/audit` re-themes via scoped var overrides.
- The blog article body has its own scoped styles in `app/blog/blog.css`.

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
- `![IMG:]` placeholders must be preserved through the editing pipeline; the first becomes the cover (cinematic a16z-style, see `lib/pipeline/cover-style.ts`). No memes.
- Forked from sabka-blog — no `sabka` references should remain in active code.
