# Hero 3D Backdrop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Hero section a "drafting table" backdrop — a subtle paper/calque texture plus 3-4 floating abstract shape-cards with soft shadows and parallax/idle motion — without touching the site-wide flat, no-shadow design system anywhere outside this one component.

**Architecture:** One new client component, `components/home/HeroBackdrop.tsx`, renders two absolutely-positioned decorative layers (static texture + animated cards) behind the existing Hero content. `ChapterHero.tsx` gets a two-line change: render `<HeroBackdrop />` and give the existing content wrapper a higher `z-index`. All shadow/motion values are scoped to this file — no changes to `app/globals.css` design tokens.

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4 (utility classes generated from `app/globals.css` `@theme` tokens — `bg-paper`, `border-line`, `text-ink`, etc. already exist and are reused), GSAP 3.15 (`gsap.quickTo`, `gsap.to`) for motion — already a dependency and already used the same way in `components/motion/useTilt.ts`.

## Global Constraints

- No changes to `app/globals.css` `:root`/`@theme` tokens or global utility classes (spec: "Non-goals").
- No changes to any Hero content, copy, or existing components (`SplitLines`, `HandDrawn`, `Magnetic`, `DistortPortrait`) beyond wrapping their container in a `relative z-10` (spec: "Non-goals").
- Backdrop is decorative only: `pointer-events-none`, no text/content on the floating cards (spec: "Components" — abstract UI placeholders, no text).
- Must respect `prefers-reduced-motion` via the existing `components/motion/useReducedMotion.ts` hook (spec: "Motion").
- Scoped to the Hero section only — no other chapter is touched (spec: "Scope").
- This is a presentational-only component with no business logic and the repo has no component test runner (`package.json` scripts: `dev`, `build`, `start`, `lint` — no `test`). Verification for every task is: `npm run lint`, `npm run build` (catches TypeScript errors), and a manual check in `npm run dev` (visual result + browser devtools `prefers-reduced-motion` emulation + responsive width check). This replaces unit-test steps in the task structure below.

---

## File Structure

- **Create:** `components/home/HeroBackdrop.tsx` — the whole backdrop: texture layer + floating cards + motion. Single file, ~90-110 lines; kept together because the layers share the same coordinate system and card data, and the file is small enough that splitting it would just add an import for no reuse benefit (YAGNI).
- **Modify:** `components/home/ChapterHero.tsx` — render `<HeroBackdrop />`, add `relative overflow-hidden` to the `Chapter` wrapper, add `relative z-10` to the existing content `div`.

---

### Task 1: Static texture layer (paper grain + millimeter grid)

**Files:**
- Create: `components/home/HeroBackdrop.tsx`

**Interfaces:**
- Produces: `export default function HeroBackdrop()` — a React component with no props, rendering a `<div>` tree. Later tasks (2, 3) add to this same file/function; this task establishes the outer wrapper and the static texture layer only.

- [ ] **Step 1: Create the component file with the outer wrapper and texture layer**

```tsx
// components/home/HeroBackdrop.tsx
'use client'

export default function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {/* Paper grain + millimeter-grid texture. Purely decorative, static. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #111111 0.5px, transparent 0.5px),
            repeating-linear-gradient(0deg, #111111 0px, #111111 1px, transparent 1px, transparent 24px),
            repeating-linear-gradient(90deg, #111111 0px, #111111 1px, transparent 1px, transparent 24px)
          `,
          backgroundSize: '6px 6px, 24px 24px, 24px 24px',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no errors reported for `components/home/HeroBackdrop.tsx`.

Run: `npm run build`
Expected: build succeeds (this file isn't imported anywhere yet, so it's checked for syntax/type errors only, not rendered).

- [ ] **Step 3: Commit**

```bash
git add components/home/HeroBackdrop.tsx
git commit -m "feat: add Hero backdrop texture layer (unwired)"
```

---

### Task 2: Floating abstract cards (static positions, no motion yet)

**Files:**
- Modify: `components/home/HeroBackdrop.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: a `CARDS` array (`{ id: string; position: string; depth: number }[]`) and card `<div>` elements with `data-hero-card` attribute and `ref` callback storage — Task 3 attaches motion to these same elements by reading `cardRefs.current`.

- [ ] **Step 1: Add the card data and render the card elements**

Replace the full file content with:

```tsx
// components/home/HeroBackdrop.tsx
'use client'

import { useRef } from 'react'

type CardSpec = {
  id: string
  /** Tailwind position + size + rotation classes. */
  position: string
  /** Parallax depth in px — how far this card shifts toward the cursor. */
  depth: number
}

const CARDS: CardSpec[] = [
  { id: 'card-1', position: 'left-[2%] top-[10%] h-24 w-32 -rotate-6 md:h-28 md:w-40', depth: 18 },
  { id: 'card-2', position: 'right-[4%] top-[6%] h-20 w-28 rotate-3 md:h-24 md:w-36', depth: 26 },
  { id: 'card-3', position: 'right-[9%] bottom-[12%] h-16 w-24 -rotate-2 md:h-20 md:w-32', depth: 14 },
  { id: 'card-4', position: 'left-[7%] bottom-[8%] h-14 w-20 rotate-6 md:h-16 md:w-24', depth: 22 },
]

export default function HeroBackdrop() {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {/* Paper grain + millimeter-grid texture. Purely decorative, static. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #111111 0.5px, transparent 0.5px),
            repeating-linear-gradient(0deg, #111111 0px, #111111 1px, transparent 1px, transparent 24px),
            repeating-linear-gradient(90deg, #111111 0px, #111111 1px, transparent 1px, transparent 24px)
          `,
          backgroundSize: '6px 6px, 24px 24px, 24px 24px',
        }}
      />

      {/* Floating abstract cards — decorative only, no content. */}
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => {
            cardRefs.current[i] = el
          }}
          className={`absolute border border-line bg-paper shadow-[0_20px_40px_-16px_rgba(17,17,17,0.22)] ${card.position}`}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Wire the component into the Hero temporarily to visually verify**

Read `components/home/ChapterHero.tsx` first to confirm the current structure, then apply:

```tsx
// components/home/ChapterHero.tsx — add these two changes
// 1. New import at top, alongside the existing imports:
import HeroBackdrop from './HeroBackdrop'

// 2. Inside the returned JSX, change:
//    <Chapter name="Hero" theme="light" className="flex flex-col justify-center px-[6vw] py-24 pb-20 md:min-h-svh md:py-20">
//      <div className="flex flex-col gap-6 md:grid md:grid-cols-[1.7fr_1fr] md:items-center md:gap-16">
//    to:
//    <Chapter name="Hero" theme="light" className="relative overflow-hidden flex flex-col justify-center px-[6vw] py-24 pb-20 md:min-h-svh md:py-20">
//      <HeroBackdrop />
//      <div className="relative z-10 flex flex-col gap-6 md:grid md:grid-cols-[1.7fr_1fr] md:items-center md:gap-16">
```

Full resulting file:

```tsx
'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import HandDrawn from '@/components/motion/HandDrawn'
import Magnetic from '@/components/motion/Magnetic'
import DistortPortrait from '@/components/motion/DistortPortrait'
import HeroBackdrop from './HeroBackdrop'

export default function ChapterHero() {
  return (
    <Chapter name="Hero" theme="light" className="relative overflow-hidden flex flex-col justify-center px-[6vw] py-24 pb-20 md:min-h-svh md:py-20">
      <HeroBackdrop />
      <div className="relative z-10 flex flex-col gap-6 md:grid md:grid-cols-[1.7fr_1fr] md:items-center md:gap-16">
        <div className="order-first flex items-center gap-3 md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/portrait.jpg" alt="Влад Лямин" className="aspect-square w-16 shrink-0 border border-line object-cover" />
          <p className="mono-label flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-lime" />
            Влад Лямин
          </p>
        </div>
        <div>
          <p className="mono-label mb-6 hidden items-center gap-3 md:flex">
            <span className="inline-block size-2 rounded-full bg-lime" />
            Влад Лямин
          </p>
          <SplitLines as="h1" className="font-display text-[clamp(32px,4.6vw,68px)]">
            Помогаю фаундерам строить и масштабировать{' '}
            <HandDrawn kind="circle">системы</HandDrawn> <em>с помощью AI</em>
          </SplitLines>
          <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-ink-muted md:mt-6">
            Разбираю, где бизнес держится на ручном труде, и собираю вместо этого систему.
            Она работает, пока вы занимаетесь ростом.
          </p>
          <span className="font-hand mt-3 hidden -rotate-2 text-2xl text-ink-muted lg:inline-block">
            строится 2 недели, работает годами →
          </span>
          <div className="mt-6 flex items-center gap-8 md:mt-8">
            <Magnetic>
              <Link href="/audit" className="inline-block text-center bg-ink px-9 py-4 text-[15px] font-medium text-white transition-colors hover:bg-lime hover:text-ink">
                Пройти AI-аудит
              </Link>
            </Magnetic>
            <Link href="https://t.me/lyaminvl" target="_blank" className="link-ul text-[15px]">
              Написать в Telegram
            </Link>
          </div>
        </div>
        <DistortPortrait
          src="/portrait.jpg"
          alt="Влад Лямин"
          className="hidden aspect-[3/4] w-full max-w-[360px] border border-line md:mx-0 md:ml-auto md:block"
        />
      </div>
    </Chapter>
  )
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, open `http://localhost:3000` in a browser.
Expected: 4 white bordered rectangles with soft shadows visible near the corners of the Hero section on desktop widths (≥768px), not overlapping the heading/CTA/portrait. Below 768px width, the backdrop is invisible (`hidden md:block`) and the Hero looks exactly as before.

Run: `npm run lint` and `npm run build`.
Expected: both succeed with no new errors.

- [ ] **Step 4: Commit**

```bash
git add components/home/HeroBackdrop.tsx components/home/ChapterHero.tsx
git commit -m "feat: add static floating cards to Hero backdrop"
```

---

### Task 3: Motion — idle float + cursor parallax, reduced-motion aware

**Files:**
- Modify: `components/home/HeroBackdrop.tsx`

**Interfaces:**
- Consumes: `components/motion/useReducedMotion.ts` → `export function useReducedMotion(): boolean` (existing, verified in `components/motion/useReducedMotion.ts:10`).
- Consumes: `gsap` default export (`gsap.to`, `gsap.quickTo`) — same API already used in `components/motion/useTilt.ts`.
- Produces: no new exports; `HeroBackdrop` behavior only.

- [ ] **Step 1: Add motion via a `useEffect` that idle-floats each card and parallaxes on mouse move**

Replace the full file content with:

```tsx
// components/home/HeroBackdrop.tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/components/motion/useReducedMotion'

type CardSpec = {
  id: string
  /** Tailwind position + size + rotation classes. */
  position: string
  /** Parallax depth in px — how far this card shifts toward the cursor. */
  depth: number
}

const CARDS: CardSpec[] = [
  { id: 'card-1', position: 'left-[2%] top-[10%] h-24 w-32 -rotate-6 md:h-28 md:w-40', depth: 18 },
  { id: 'card-2', position: 'right-[4%] top-[6%] h-20 w-28 rotate-3 md:h-24 md:w-36', depth: 26 },
  { id: 'card-3', position: 'right-[9%] bottom-[12%] h-16 w-24 -rotate-2 md:h-20 md:w-32', depth: 14 },
  { id: 'card-4', position: 'left-[7%] bottom-[8%] h-14 w-20 rotate-6 md:h-16 md:w-24', depth: 22 },
]

export default function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (cards.length === 0) return

    // Slow idle float, offset phase/duration per card so they don't move in sync.
    const idleTweens = cards.map((el, i) =>
      gsap.to(el, {
        y: i % 2 === 0 ? -10 : 10,
        duration: 4 + i * 0.7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    )

    // Cursor parallax: each card shifts toward the cursor by its own depth.
    const parallaxX = cards.map((el) => gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }))
    const parallaxRotate = cards.map((el) => gsap.quickTo(el, 'rotationZ', { duration: 0.8, ease: 'power3.out' }))

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5 // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5 // -0.5..0.5
      CARDS.forEach((card, i) => {
        parallaxX[i](px * card.depth)
        parallaxRotate[i](px * py * 4)
      })
    }
    const onLeave = () => {
      CARDS.forEach((_, i) => {
        parallaxX[i](0)
        parallaxRotate[i](0)
      })
    }

    root.addEventListener('mousemove', onMove)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      root.removeEventListener('mousemove', onMove)
      root.removeEventListener('mouseleave', onLeave)
      idleTweens.forEach((t) => t.kill())
      gsap.killTweensOf(cards)
    }
  }, [prefersReducedMotion])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {/* Paper grain + millimeter-grid texture. Purely decorative, static. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #111111 0.5px, transparent 0.5px),
            repeating-linear-gradient(0deg, #111111 0px, #111111 1px, transparent 1px, transparent 24px),
            repeating-linear-gradient(90deg, #111111 0px, #111111 1px, transparent 1px, transparent 24px)
          `,
          backgroundSize: '6px 6px, 24px 24px, 24px 24px',
        }}
      />

      {/* Floating abstract cards — decorative only, no content. */}
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => {
            cardRefs.current[i] = el
          }}
          className={`absolute border border-line bg-paper shadow-[0_20px_40px_-16px_rgba(17,17,17,0.22)] ${card.position}`}
        />
      ))}
    </div>
  )
}
```

Note: `root.addEventListener('mousemove', ...)` fires only while the pointer is over the (invisible, `pointer-events-none`) backdrop div's bounding box — since `pointer-events-none` is set on the container, the browser does NOT deliver mouse events to it. Attach the listener to `window` instead so parallax responds to cursor movement anywhere over the Hero section:

Replace:
```tsx
    root.addEventListener('mousemove', onMove)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      root.removeEventListener('mousemove', onMove)
      root.removeEventListener('mouseleave', onLeave)
```
With:
```tsx
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
```

And remove the now-unused `onLeave` function entirely (delete its declaration) since there is no reliable "leave the Hero" event without a listener on the Hero's own bounding element — cards simply track the cursor position relative to the backdrop's `getBoundingClientRect()` for as long as the page is open, which is the desired "floating in the room" effect, not a hover-in/hover-out interaction.

Final `onMove` (cursor position is clamped implicitly by `depth`, so no clamping needed for values outside 0..1 — the parallax simply continues past the card's rest position at the same rate, which reads correctly since Hero fills the viewport height on desktop):

```tsx
    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      CARDS.forEach((card, i) => {
        parallaxX[i](px * card.depth)
        parallaxRotate[i](px * py * 4)
      })
    }
```

- [ ] **Step 2: Verify visually with motion**

Run: `npm run dev`, open `http://localhost:3000` at a desktop viewport width (≥768px).
Expected: the 4 cards gently drift up/down independently (idle float) and shift horizontally + tilt slightly as the mouse moves across the page (parallax). No jank, no console errors.

- [ ] **Step 3: Verify reduced-motion is respected**

In Chrome DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload the page.
Expected: cards render in their static rest position (Task 2's layout) with no float and no parallax on mouse move.

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint`
Expected: no errors (in particular, no unused-variable errors from the `onLeave` removal).

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/home/HeroBackdrop.tsx
git commit -m "feat: add idle float + cursor parallax motion to Hero backdrop cards"
```

---

### Task 4: Final responsive check and cleanup pass

**Files:**
- Modify: `components/home/HeroBackdrop.tsx` (only if Step 1 finds an issue)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new — this task is verification-only unless Step 1 surfaces a real bug, in which case fix it in place.

- [ ] **Step 1: Full manual QA pass**

Run: `npm run dev`. In the browser, check each of the following:

1. **Mobile width (< 768px, e.g. 375px):** backdrop is fully hidden (`hidden md:block` on the root div means it doesn't render at all below the `md` breakpoint); Hero content and spacing are identical to before this change.
2. **Tablet/desktop widths (768px, 1024px, 1440px):** cards stay within the Hero section bounds (no visible horizontal scrollbar — `overflow-hidden` on the `Chapter` wrapper from Task 2 clips anything that drifts outside), and never visually overlap the heading text, CTA buttons, or portrait image.
3. **Dark-mode / other Chapters unaffected:** scroll through the rest of the homepage (Cases, Method, Manifesto, etc.) and confirm no visual change outside Hero.
4. **No new console errors or warnings** in the browser devtools console on page load or during mouse movement.

If any of the four checks fail, fix the specific issue in `components/home/HeroBackdrop.tsx` (e.g. adjust a card's `position` Tailwind classes in the `CARDS` array if it overlaps content at a given width) and re-run this step.

- [ ] **Step 2: Final lint + build gate**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds with no new warnings attributable to `HeroBackdrop.tsx` or `ChapterHero.tsx`.

- [ ] **Step 3: Commit (only if Step 1 required fixes)**

```bash
git add components/home/HeroBackdrop.tsx
git commit -m "fix: adjust Hero backdrop card positioning after QA pass"
```

If Step 1 required no fixes, skip this commit — Task 3's commit is already the final state.
