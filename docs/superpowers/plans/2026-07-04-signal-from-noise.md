# «Сигнал из шума» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage into a scroll narrative driven by one fixed particle canvas: portrait assembles from noise (hero), disperses into a stream that builds a pipeline scheme (system), hits case counters, and finally converges back into the photographic portrait.

**Architecture:** One fixed 2D-canvas layer under the DOM content, vanilla TS particle engine (~3000 particles), GSAP ScrollTrigger scrub interpolating particles between precomputed "maps" (portrait halftone / scatter / scheme / counters / final portrait). Halftone map is generated at build time from `public/portrait.jpg` by a sharp script. All chapters are complete static sections when the engine is off.

**Tech Stack:** Next.js 16 App Router, React 19, GSAP 3.15 (+ScrollTrigger, already a dep), sharp (already in node_modules), TypeScript, Tailwind 4 tokens from `app/globals.css`.

## Global Constraints

- White + Lime DS only: ink `#111111`, paper `#FFFFFF`, muted `#666666`, line `#E8E8E8`, lime `#C8F04C` / `#A8D030`. Radius 0, no shadows, no emojis, no purple.
- Lime is fill/highlight only, never text colour.
- Fonts: Inter Tight (`font-heading`), Onest (`font-body`), Caveat (`font-hand`), mono.
- Engine off (static fallback) when: `prefers-reduced-motion`, viewport < 768px, or FPS < 40 during first ~0.5s.
- Hero headline + CTA are server-rendered; `portrait-map.json` loads lazily after page load; engine code ≤ ~15KB gzip (vanilla TS, no three.js).
- Page must be fully usable with the engine completely off.
- No brand renames: `lvmn` infra identifiers stay.
- Copy in Russian; no "агентство/мы" framing; no location.

## File Structure

- `scripts/generate-portrait-map.ts` — build-time: portrait.jpg → `public/portrait-map.json` + `public/portrait-halftone.png` (static fallback).
- `components/home/engine/particles.ts` — particle engine (positions, easing, render).
- `components/home/engine/maps.ts` — map builders (portrait / scatter / scheme / counters) in document coordinates.
- `components/home/engine/scroll.ts` — `initEngine()`: ScrollTrigger scrub, keyframes from `[data-stage]` anchors, FPS watchdog, cleanup.
- `components/home/engine/CanvasStage.tsx` — client wrapper: guards, lazy JSON fetch, mounts canvas.
- `components/home/SystemSection.tsx` — chapter 2 (replaces TeachingStrip + DarkBusiness; their copy migrates here).
- `components/home/SignalSection.tsx` — chapter 5 (absorbs AboutTeaser + FinalCta).
- `components/motion/SketchFrame.tsx` — chapter 4 card stroke draw-in.
- Modified: `app/page.tsx`, `components/home/Hero.tsx`, `components/home/CasesSection.tsx`, `components/home/ProductsSection.tsx`, `app/globals.css`.
- Deleted: `components/home/TeachingStrip.tsx`, `DarkBusiness.tsx`, `AboutTeaser.tsx`, `FinalCta.tsx`.

No unit-test runner exists in this repo; test cycle per task = run the script / `npm run build` + `npm run lint` / Playwright screenshots.

---

### Task 1: Build-time portrait map generator

**Files:**
- Create: `scripts/generate-portrait-map.ts`
- Generated: `public/portrait-map.json`, `public/portrait-halftone.png`

**Interfaces:**
- Produces: JSON `{ aspect: number, pts: number[] }` where `pts` is packed `[x, y, r, ...]`, all normalized 0..1 (r = dot darkness 0.25..1). Consumed by Task 2 `portraitMap()` and Task 4 fallback image.

- [ ] **Step 1: Write the script** (grid 72 columns, keep darkest ≤3200 points, skip near-white; halftone PNG 960px wide, every 17th dot lime `#C8F04C`, rest `#111111`, white bg) — full code as in engine design section of the spec; uses `sharp` grayscale → raw buffer.
- [ ] **Step 2: Run** `npx tsx scripts/generate-portrait-map.ts` — expect `points: ~3200`, JSON 50–100KB, PNG created.
- [ ] **Step 3: Visually check** `public/portrait-halftone.png` (Read tool) — portrait recognizable, dots on white.
- [ ] **Step 4: Commit** `feat(home): build-time halftone portrait map generator`

### Task 2: Particle engine + maps

**Files:**
- Create: `components/home/engine/particles.ts`, `components/home/engine/maps.ts`

**Interfaces:**
- Produces:
  - `type PMap = Float32Array` (packed x,y,r in **document** pixels)
  - `portraitMap(json, rectDoc: {left,top,width,height}, n): PMap` — contain-fit by aspect
  - `scatterMap(n, w, docTop, h, seed): PMap` — deterministic LCG random
  - `schemeMap(n, nodeRectsDoc, edges: [number,number][]): PMap` — 70% on node perimeters, 30% on edges
  - `clusterMap(n, rectsDoc): PMap` — points clustered around rect centers
  - `class ParticleEngine { constructor(canvas, n); setSegment(a: PMap|null, b: PMap|null): void; setT(t: number): void; alpha: number; start(): void; destroy(): void; onFps?: (fps:number)=>void }` — rAF loop, exponential easing toward lerp(a,b,t) + per-particle sinusoidal jitter, renders at `y - scrollY`, skips offscreen, every 17th particle lime.
- Consumes: Task 1 JSON shape.

- [ ] **Step 1: Write `maps.ts`** with the four builders above (document coordinates; deterministic seeded random).
- [ ] **Step 2: Write `particles.ts`** — DPR-aware canvas sizing, resize handler, FPS sampling over first 30 frames reported via `onFps`.
- [ ] **Step 3: `npx tsc --noEmit`** passes for the new files (or `npm run build` later).
- [ ] **Step 4: Commit** `feat(home): vanilla particle engine and target maps`

### Task 3: ScrollTrigger choreography + CanvasStage

**Files:**
- Create: `components/home/engine/scroll.ts`, `components/home/engine/CanvasStage.tsx`
- Modify: `app/globals.css` (add `[data-canvas="on"] .canvas-hide { opacity: 0 }` + transition), `app/page.tsx` (mount `<CanvasStage />`, wrap main content `relative z-[1]`)

**Interfaces:**
- Consumes: Task 2 engine/maps; DOM anchors `[data-stage="portrait"|"scheme"|"counters"|"final"]`, `[data-stage-node]` (4 nodes), `[data-stage="final-img"]`.
- Produces: `initEngine(canvas: HTMLCanvasElement, json: PortraitJson): () => void` (cleanup). Sets `document.documentElement.dataset.canvas = "on"` when running; removes on destroy/low-FPS.

- [ ] **Step 1: Write `scroll.ts`**: one ScrollTrigger (body, scrub) + keyframe stops computed at `refresh` from anchor document offsets: portrait → scatter → scheme (hold) → counters → alpha 0 (through products) → final portrait (alpha 1) ; drives `finalImg.style.opacity` 0→1 on last 25% of final segment; intro: 0.5s time-based assemble noise→portrait on init.
- [ ] **Step 2: Write `CanvasStage.tsx`**: guards (reduced-motion, <768px), fetch `/portrait-map.json` after `load`+idle, dynamic `import("./scroll")`, fixed canvas `pointer-events-none fixed inset-0 z-0 hidden md:block`, FPS watchdog → destroy + fallback.
- [ ] **Step 3: Wire into `app/page.tsx`**, add CSS. `npm run build` passes.
- [ ] **Step 4: Commit** `feat(home): fixed canvas stage with scroll choreography`

### Task 4: Chapter 1 — Hero «Проявление»

**Files:**
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1:** Replace `<Image src="/portrait.jpg">` with `<img src="/portrait-halftone.png">` (plain img — asset already sized) inside the same hairline frame; add `data-stage="portrait"` on the frame div and `canvas-hide` class on the img. Keep server-rendered headline/CTA and existing kinetic line animation.
- [ ] **Step 2:** `npm run build`; dev-check hero renders halftone statically.
- [ ] **Step 3: Commit** `feat(home): hero portrait becomes halftone anchor`

### Task 5: Chapter 2 — SystemSection (replaces TeachingStrip + DarkBusiness)

**Files:**
- Create: `components/home/SystemSection.tsx`
- Modify: `app/page.tsx` (swap in), Delete: `TeachingStrip.tsx`, `DarkBusiness.tsx`

**Interfaces:**
- Produces anchors: container `data-stage="scheme"`, 4 node boxes `data-stage-node` («Заявка», «AI-бот», «CRM», «Отчёт»).

- [ ] **Step 1:** Write section: kicker `01 — Система`, H2 «Из хаоса инструментов я собираю систему», static DOM pipeline diagram (4 bordered boxes + arrows, responsive: row on md+, column on mobile), node captions reveal on scroll (existing `Reveal`), paragraphs migrated from DarkBusiness («Нужно, чтобы AI заработал у всей команды…», внедрение под ключ, CTA «Рассказать о задаче» → `TELEGRAM_URL`), compact teaching-proof line from TeachingStrip (Web3nity · Дмитрий Румянцев · ТИТАНЫ) with the same descriptions in a 3-col grid.
- [ ] **Step 2:** Update `app/page.tsx` order: Nav / Hero / SystemSection / NotStrip / CasesSection / ProductsSection / CourseBanner / SignalSection / Footer.
- [ ] **Step 3:** `npm run build` + visual check. Delete old components.
- [ ] **Step 4: Commit** `feat(home): system chapter with pipeline scheme`

### Task 6: Chapter 3 — counters anchor

**Files:**
- Modify: `components/home/CasesSection.tsx`

- [ ] **Step 1:** Renumber kicker to `02 — Кейсы`; add `data-stage="counters"` to the rows container. Table itself unchanged.
- [ ] **Step 2:** Build passes. **Commit** `feat(home): cases counters as particle target`

### Task 7: Chapter 4 — product cards sketch reveal

**Files:**
- Create: `components/motion/SketchFrame.tsx`
- Modify: `components/home/ProductsSection.tsx` (renumber to `03 — Продукты`, wrap cards)

- [ ] **Step 1:** `SketchFrame`: client component, absolutely-positioned 1px ink lines (top/right/bottom/left) scaled from 0 via GSAP on ScrollTrigger enter (once), static full border under reduced-motion. No pinned scroll.
- [ ] **Step 2:** Wrap each `ProductCard` in ProductsSection. Build passes. **Commit** `feat(home): sketch draw-in for product cards`

### Task 8: Chapter 5 — SignalSection (absorbs AboutTeaser + FinalCta)

**Files:**
- Create: `components/home/SignalSection.tsx`
- Delete: `components/home/AboutTeaser.tsx`, `components/home/FinalCta.tsx`

**Interfaces:**
- Produces anchors: portrait frame `data-stage="final"`, `<img data-stage="final-img">` (`/portrait.jpg`).

- [ ] **Step 1:** Write section: kicker `04 — Сигнал`, photographic portrait in hairline frame (img default opacity 1; engine drives it 0→1 when active), Caveat signature «Влад Лямин», about copy from AboutTeaser (сокращённо, ссылка на манифест), FinalCta headline «Разберём вашу задачу вместе — за час» + consultation button + Telegram fallback.
- [ ] **Step 2:** Build + lint pass. **Commit** `feat(home): signal chapter with photographic reveal`

### Task 9: Verification

- [ ] `npm run build` + `npm run lint` clean.
- [ ] Playwright (MCP): screenshots of every chapter at 360 / 768 / 1440; separate run with reduced-motion emulation (static fallback, no canvas attr).
- [ ] Manual: scroll down + up (scrub reversible), no layout shift from canvas (fixed, aria-hidden), FPS sanity.
- [ ] Fix findings, final commit.

### Task 10: Deploy (only after Влад confirms)

- [ ] `rsync -az --exclude node_modules --exclude .next --exclude .git ./ root@5.42.111.39:/var/www/lvmn-site/`
- [ ] `ssh root@5.42.111.39 'cd /var/www/lvmn-site && NODE_OPTIONS="--max-old-space-size=2048" npm run build && pm2 restart lvmn --update-env'`

## Self-Review

- Spec coverage: 5 chapters (T4, T5, T6, T7, T8), build-time map (T1), engine/arch (T2–T3), degradation (T3 guards + static fallbacks in every chapter), testing (T9), deploy (T10). Preserved: Nav, Footer, CourseBanner between ch4–ch5, NotStrip between ch2–ch3 (T5 step 2 order). Covered.
- Types consistent: `PMap`, `portraitMap/scatterMap/schemeMap/clusterMap`, `initEngine` used identically across tasks.
