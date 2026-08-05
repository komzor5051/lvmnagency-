# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal site for **Влад Лямин — AI-инженер** (https://vladlyamin.ru): a marketing
site (home, about, products, AI-audit funnel) plus an automated content factory that
publishes daily AI-generated blog articles and announces them in Telegram.

**Hosting: self-hosted on a Timeweb VPS, NOT Vercel** (Vercel is blocked in Russia).
The old `lvmn.vercel.app` URL is retired. See the Deployment section below — do not
suggest `vercel` commands or assume Vercel-managed crons / env / SSL.

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
```

## Deployment (Timeweb VPS)

Hosted on a Timeweb cloud server, region Novosibirsk. NOT Vercel.

- **Server**: `5.42.111.39` (root, SSH key from Влад's Mac), Ubuntu 24.04,
  1 GB RAM + 2 GB swap (swap is required — `next build` OOMs on 1 GB without it).
- **Domain**: `vladlyamin.ru` (reg.ru, DNS on `ns1/ns2.reg.ru`, A `@` and `www`
  → 5.42.111.39). SSL via certbot (Let's Encrypt), auto-renew enabled.
- **Runtime**: code in `/var/www/lvmn-site`, Node 20, run via
  `pm2 start npm --name lvmn -- start` (port 3000, autostart on reboot).
  nginx reverse-proxies 80/443 → localhost:3000 (`/etc/nginx/sites-available/lvmn`).
- **Secrets**: `/var/www/lvmn-site/.env.local` on the server (not in git).

**Supabase is unreachable from the VPS** (poisoned DNS for `*.supabase.co` +
TCP 443 blocked to its IPs from the Timeweb DC; works fine from Влад's Mac).
All server-side post reads go through `lib/posts.ts`: Supabase with a 5s
timeout, then fallback to `data/posts-snapshot.json`. **Regenerate the snapshot
before every deploy** — otherwise new articles won't appear on the site
(publishing to Supabase alone is no longer enough):

```bash
npx tsx scripts/export-posts.ts
```

**Deploy an update** (from `~/Desktop/Бизнес/lvmn-site` on the Mac):

```bash
npx tsx scripts/export-posts.ts   # refresh article snapshot
rsync -az --exclude node_modules --exclude .next --exclude .git --exclude .env.local \
  ./ root@5.42.111.39:/var/www/lvmn-site/
ssh root@5.42.111.39 'cd /var/www/lvmn-site \
  && NODE_OPTIONS="--max-old-space-size=2048" npm run build \
  && pm2 restart lvmn --update-env'
```

## Architecture

**Blog content is Claude/Claude Code focused** (pivoted 2026-07-08/09, see
`docs/superpowers/specs/2026-07-08-claude-content-pivot-design.md`): 4 pillars —
Claude.ai for non-technical users, Claude Code for developers, business automation
via Claude, comparisons/news. Old AI-automation/n8n-generic topics were retired.

**Automated cron is currently BROKEN — generate articles manually instead.**
`api.exa.ai` (used for research) blocks the VPS's Russian IP at the Cloudflare
level (403, confirmed via `curl` with full browser headers — it's a geo/IP block,
not an expired key). Vercel Cron itself was already retired for this exact
reason. Until a non-RU proxy is set up for Exa requests, `mine-topics` and
`generate` fail silently on the server. **To publish an article right now:**
run `npx tsx scripts/run-pipeline.ts` from a non-RU machine (this repo checked
out locally works — Exa returns 200 there) against the same Supabase project;
it writes straight to `lvmn_blog_posts`, so the live site picks it up immediately
with no deploy needed. Run `npx tsx scripts/seed-topic.ts`-style inserts (or edit
`lvmn_blog_topics` directly) first if you need a specific topic queued.

```
System cron (server crontab, CRON_TZ=UTC — replaces the old Vercel Cron)
  scripts/cron-runner.sh curls each endpoint with CRON_SECRET; log: /var/log/lvmn/cron.log
  vercel.json crons are kept for reference only and do NOT run anywhere.
  ├── /api/cron/mine-topics  (every 3 days, 04:00 UTC — BROKEN, see note above)
  │     └── Exa trends + docs.claude.com/anthropic.com scrape → Gemini → save topics
  │         (4 pillars: Claude.ai, Claude Code, business automation via Claude, comparisons/news)
  │
  └── /api/cron/generate     (daily, 05:00 UTC = 08:00 MSK — BROKEN, see note above)
        ├── select top pending topic
        ├── researcher (Exa API → 6 sources)
        ├── writer (Gemini 2.0 Flash, 1500-2500 words with ![IMG:] placeholders;
        │         Claude Code-pillar articles are grounded in Влад's real skills/MCP
        │         setup via lib/claude-setup-context.ts, not generic web advice)
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
- `lib/claude-setup-context.ts` — Влад's real Claude Code setup (skills, MCP
  servers, subagent/workflow patterns), client-free; writer.ts grounds
  "Claude Code для разработчиков" pillar articles in this instead of generic
  web-researched advice. Update as the real setup evolves.
- `lib/products.ts` — product catalog for the marketing site (consultation, guide,
  audit, course)
- `lib/pipeline/style-guide.ts` — writing rules
- `lib/pipeline/writer.ts` — article writer (Влад's persona, not an agency)
- `lib/pipeline/topic-miner.ts` — topic generation
- `lib/pipeline/editors.ts` — 4-pass editing
- `lib/pipeline/image-generator.ts` — Gemini 3 Pro images → `lvmn-blog-images` bucket
- `lib/pipeline/publisher.ts` — slug, meta, publish to `lvmn_blog_posts`

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
CRON_SECRET                # cron endpoint auth (used by scripts/cron-runner.sh)
BLOG_URL                   # https://vladlyamin.ru
```

On Vercel these were managed in the dashboard; now they live in
`/var/www/lvmn-site/.env.local` on the server. EXA_API_KEY on the VPS returns 403
— NOT an expired-key issue, `api.exa.ai` blocks the server's Russian IP at the
Cloudflare level (same class of block that got Vercel itself retired for RU
hosting). The key works fine from a non-RU machine. See the manual-generation
note in Architecture above. `WORDSTAT_TOKEN` is no longer used (Wordstat
validation was dropped when the blog pivoted to Claude content) — remove it
from the server `.env.local` too if present.

## Gotchas

- **Two Gemini SDKs**: Text uses `@google/generative-ai`, images use `@google/genai`.
- Manual trigger secret is `lvmn2026go` (query param `?secret=`).
- Shares Supabase instance with sabka-blog — tables prefixed `lvmn_`.
- Inngest exists in code but the server crontab (system cron) is the active trigger.
- `![IMG:]` placeholders must be preserved through the editing pipeline; the first becomes the cover (cinematic a16z-style, see `lib/pipeline/cover-style.ts`). No memes.
- Forked from sabka-blog — no `sabka` references should remain in active code.
- `lvmn_blog_topics` accumulated ~350 pre-pivot topics (old n8n/ROI/ChatGPT-generic
  angles); most are marked `status: "skipped"` so `run-pipeline.ts`'s highest-score
  selection can't pick them. If a manually-generated article comes out off-topic,
  check the picked topic's `status`/title first before assuming a code bug.
- `status` values in `lvmn_blog_topics`: `pending`, `writing`, `used`, `skipped`,
  `duplicate`. ~32 topics are stuck in `writing` from runs that died mid-pipeline
  (Exa 403) — inert, since only `pending` is ever picked, but they never retry.
- **Duplicate topics** (`lib/pipeline/dedupe.ts`): the blog accumulated ~20
  duplicate articles because the only guard was a slug-collision check that
  appended `-2/-3/-4` and published anyway — and that missed rewordings entirely,
  since a different title yields a different slug. Now `topic-miner` hard-filters
  generated topics against *all* topic and post titles (it used to compare against
  only the 50 newest, so older topics fell out of the window and got regenerated),
  and `publisher` throws `DuplicateArticleError` instead of suffixing, parking the
  topic as `duplicate`. Matching is Jaccard overlap of slugified title tokens at
  0.6 — calibrated on the live corpus, where it flags 25 pairs with no false
  positives. Rejections are logged with their score, so tune from the logs.
