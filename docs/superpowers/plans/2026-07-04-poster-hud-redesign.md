# Poster/HUD Full-Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every page of vladlyamin.ru in the approved «Poster / HUD» design: fixed HUD frame, poster typography (Literata), light/dark chapters, Lenis smooth scroll, GSAP reveals, page-transition curtain.

**Architecture:** A fixed HUD layer (React context) sits above all pages; pages are sequences of full-screen "chapter" sections that register themselves with the HUD. Motion primitives (line-masked headings, hand-drawn SVG accents, count-up, magnetic buttons) are small client components; all page content stays server-rendered HTML with animations as progressive enhancement.

**Tech Stack:** Next.js 16 App Router (existing), Tailwind 4 tokens in `app/globals.css`, `gsap` + `@gsap/react` (already installed), new deps: `lenis`, `split-type`, `ogl`.

**Spec:** `docs/superpowers/specs/2026-07-04-poster-hud-redesign-design.md` — read it first; all copy comes from there verbatim.

## Global Constraints

- Language: UI copy Russian, code/comments English. No emojis anywhere.
- No tech-stack names in visible copy (n8n, Claude, Supabase, RAG, Apify, aiogram, Gemini — none).
- Positioning frame: «Помогаю фаундерам строить и масштабировать системы с помощью AI». Never "второй мозг", never "AI-инженер" as a title, never "агентство/мы".
- Banned copy patterns: «Я не X, я Y», negative parallelisms, marquees, rule-of-three triads (exception: the approved negation triad «Не агентство / Не очередной курс / Не разовый проект»).
- Colors: light `#FFFFFF`/`#F7F6F3`, ink `#111111`, muted `#666666`, line `#E8E8E8`; dark chapters bg `#0C0C0C`, text `#EDEDE8`, muted `#8A8A84`, line `#262626`; lime `#C8F04C` (on light backgrounds hand-drawn strokes use `#A8D030`). Border-radius 0 everywhere, no box-shadows.
- Fonts via next/font, cyrillic subset: Literata (display), Inter Tight + Onest (existing, keep), JetBrains Mono (mono layer), Marck Script (handwriting). Remove Caveat.
- Hand-drawn SVG accents always sit BEHIND text (`isolation:isolate` on span, `z-index:-1` on svg) and lower than optical center (svg `top:14%`, `height:118%`). Lime marker `.hl` covers only lower ~2/3 of the line (`top:0.18em`).
- `prefers-reduced-motion: reduce` → no Lenis, no pinning, reveals become plain fade/none, preloader skipped.
- Do NOT touch: blog pipeline (`lib/pipeline/*`, `app/api/cron/*`), Supabase logic, `lib/products.ts` data/prices, audit funnel question logic, RSS/sitemap/JSON-LD.
- Every task ends with `npm run build` passing. Commit per task from repo root `/Users/lvmn/Desktop/Бизнес/lvmn-site` (own git).

---

### Task 1: Dependencies, fonts, design tokens

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS variables `--color-paper2 #F7F6F3`, `--color-dark #0C0C0C`, `--color-dark-ink #EDEDE8`, `--color-dark-muted #8A8A84`, `--color-dark-line #262626` (existing `--color-paper/ink/ink-muted/line/lime/lime-dark` stay). Font CSS vars: `--font-heading` (Inter Tight, stays), `--font-display` (Literata, NEW), `--font-body` (Onest, stays), `--font-hand` (now Marck Script), `--font-mono-brand` (JetBrains Mono, NEW). Utility classes `.font-display`, `.mono-label`, `.hl`, `.ghost`, `.hw-wrap`.

- [ ] **Step 1: Install new dependencies**

```bash
cd "/Users/lvmn/Desktop/Бизнес/lvmn-site" && npm install lenis split-type ogl
```

Expected: package.json gains `lenis`, `split-type`, `ogl`.

- [ ] **Step 2: Swap fonts in `app/layout.tsx`**

In the existing next/font block: keep `Inter_Tight` and `Onest` imports; replace `Caveat` with `Marck_Script`; add `Literata` and `JetBrains_Mono`. All with `subsets: ['latin', 'cyrillic']`.

```tsx
import { Inter_Tight, Onest, Marck_Script, Literata, JetBrains_Mono } from 'next/font/google'

const literata = Literata({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})
const marck = Marck_Script({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-hand',
})
const jbMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-mono-brand',
})
```

Add `literata.variable`, `marck.variable`, `jbMono.variable` to the `<html>`/`<body>` className list where the current font variables are applied (keep existing ones, drop the Caveat variable).

- [ ] **Step 3: Extend tokens in `app/globals.css`**

In the existing `@theme` block add (keep everything already there):

```css
--color-paper2: #F7F6F3;
--color-dark: #0C0C0C;
--color-dark-ink: #EDEDE8;
--color-dark-muted: #8A8A84;
--color-dark-line: #262626;
--font-display: var(--font-display);
--font-mono-brand: var(--font-mono-brand);
```

Append utility layer at the end of the file:

```css
/* ===== Poster/HUD design system ===== */
.font-display { font-family: var(--font-display), Georgia, serif; font-weight: 300; letter-spacing: -0.02em; line-height: 0.98; }
.mono-label { font-family: var(--font-mono-brand), monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }

/* lime marker: behind text, lower 2/3 of the line only */
.hl { position: relative; isolation: isolate; white-space: nowrap; }
.hl::before { content: ''; position: absolute; left: -0.08em; right: -0.08em; top: 0.18em; bottom: -0.02em; background: var(--color-lime); z-index: -1; }

/* outlined ("ghost") display text */
.ghost { color: transparent; -webkit-text-stroke: 1px currentColor; }

/* hand-drawn svg accents: behind text, below optical center */
.hw-wrap { position: relative; display: inline-block; isolation: isolate; }
.hw-wrap > svg { position: absolute; left: -6%; top: 14%; width: 112%; height: 118%; overflow: visible; pointer-events: none; z-index: -1; }
.hw-wrap > svg path { fill: none; stroke: var(--color-lime-dark); stroke-width: 3; stroke-linecap: round; }
[data-theme='dark'] .hw-wrap > svg path { stroke: var(--color-lime); }
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success (nothing consumes new tokens yet).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/layout.tsx app/globals.css
git commit -m "feat(ds): poster/HUD tokens, Literata/JetBrains Mono/Marck Script fonts, lenis+split-type+ogl deps"
```

---

### Task 2: Lenis provider and reduced-motion hook

**Files:**
- Create: `components/motion/LenisProvider.tsx`
- Create: `components/motion/useReducedMotion.ts`
- Modify: `app/layout.tsx` (wrap children)

**Interfaces:**
- Produces: `<LenisProvider>{children}</LenisProvider>` (client component, renders children unchanged, starts Lenis + syncs GSAP ScrollTrigger). `useReducedMotion(): boolean`.

- [ ] **Step 1: Write `components/motion/useReducedMotion.ts`**

```ts
'use client'
import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
function subscribe(cb: () => void) {
  const mq = window.matchMedia(query)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
```

- [ ] **Step 2: Write `components/motion/LenisProvider.tsx`**

```tsx
'use client'
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.12 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [reduced])
  return <>{children}</>
}
```

- [ ] **Step 3: Wrap children in `app/layout.tsx`**

```tsx
import LenisProvider from '@/components/motion/LenisProvider'
// inside body, around existing children/providers:
<LenisProvider>{/* existing providers/children */}</LenisProvider>
```

- [ ] **Step 4: Verify**

Run: `npm run build` → success. Then `npm run dev`, open http://localhost:3000 — page scrolls with smoothing (current old design, that's fine).

- [ ] **Step 5: Commit**

```bash
git add components/motion/LenisProvider.tsx components/motion/useReducedMotion.ts app/layout.tsx
git commit -m "feat(motion): global Lenis smooth scroll with reduced-motion opt-out"
```

---

### Task 3: HUD frame + chapter registration

**Files:**
- Create: `components/hud/HudContext.tsx`
- Create: `components/hud/HudFrame.tsx`
- Create: `components/hud/Chapter.tsx`
- Modify: `app/layout.tsx` (mount HudFrame inside LenisProvider)

**Interfaces:**
- Consumes: `useReducedMotion` from Task 2.
- Produces:
  - `<Chapter name="Hero" theme="light" | "dark" className? id?>{content}</Chapter>` — a `<section>` (min-height 100svh by default via className passthrough) that registers with the HUD while mounted and reports visibility.
  - `<HudFrame />` — fixed layer: top-left current chapter name, top-right `NN / MM`, bottom-left «Влад Лямин», bottom-right `@lyaminvl` link (pointer-events auto), top-center progress bars (one per registered chapter, lime when passed), auto light/dark text via `data-theme` of active chapter. Also exposes `setHudExtras({ bl?: string; br?: string })` через context для страниц (аудит: «≈ 4 минуты»).
  - Pages without chapters (e.g. blog article) show HUD with static labels: name from `usePathname()` mapping, no bars.

- [ ] **Step 1: Write `components/hud/HudContext.tsx`**

```tsx
'use client'
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

export type ChapterInfo = { id: string; name: string; theme: 'light' | 'dark' }
type HudState = {
  chapters: ChapterInfo[]
  activeIndex: number
  extras: { bl?: string; br?: string }
}
type HudApi = {
  register: (c: ChapterInfo) => () => void
  setActive: (id: string) => void
  setHudExtras: (e: { bl?: string; br?: string }) => void
}
const StateCtx = createContext<HudState>({ chapters: [], activeIndex: 0, extras: {} })
const ApiCtx = createContext<HudApi | null>(null)

export function HudProvider({ children }: { children: ReactNode }) {
  const [chapters, setChapters] = useState<ChapterInfo[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [extras, setExtras] = useState<{ bl?: string; br?: string }>({})
  const order = useRef<string[]>([])

  const register = useCallback((c: ChapterInfo) => {
    setChapters(prev => {
      if (!order.current.includes(c.id)) order.current.push(c.id)
      const next = [...prev.filter(p => p.id !== c.id), c]
      next.sort((a, b) => order.current.indexOf(a.id) - order.current.indexOf(b.id))
      return next
    })
    return () => {
      order.current = order.current.filter(id => id !== c.id)
      setChapters(prev => prev.filter(p => p.id !== c.id))
    }
  }, [])

  const api = useMemo<HudApi>(() => ({
    register,
    setActive: setActiveId,
    setHudExtras: setExtras,
  }), [register])

  const activeIndex = Math.max(0, chapters.findIndex(c => c.id === activeId))
  return (
    <ApiCtx.Provider value={api}>
      <StateCtx.Provider value={{ chapters, activeIndex, extras }}>{children}</StateCtx.Provider>
    </ApiCtx.Provider>
  )
}
export const useHudState = () => useContext(StateCtx)
export const useHudApi = () => {
  const api = useContext(ApiCtx)
  if (!api) throw new Error('HudProvider missing')
  return api
}
```

- [ ] **Step 2: Write `components/hud/Chapter.tsx`**

```tsx
'use client'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useHudApi } from './HudContext'

type Props = { name: string; theme: 'light' | 'dark'; className?: string; id?: string; children: ReactNode }

export default function Chapter({ name, theme, className = '', id, children }: Props) {
  const autoId = useId()
  const chapterId = id ?? autoId
  const ref = useRef<HTMLElement>(null)
  const { register, setActive } = useHudApi()

  useEffect(() => register({ id: chapterId, name, theme }), [register, chapterId, name, theme])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(chapterId) }),
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [chapterId, setActive])

  return (
    <section ref={ref} data-theme={theme} id={id}
      className={`${theme === 'dark' ? 'bg-dark text-dark-ink' : 'bg-paper text-ink'} ${className}`}>
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Write `components/hud/HudFrame.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useHudState } from './HudContext'

const PATH_NAMES: [string, string][] = [
  ['/products', 'Продукты'], ['/audit', 'AI-аудит'], ['/blog', 'Блог'],
  ['/about', 'Обо мне'], ['/vibecoding', 'Вайбкодинг'], ['/', 'Главная'],
]

export default function HudFrame() {
  const { chapters, activeIndex, extras } = useHudState()
  const pathname = usePathname()
  const active = chapters[activeIndex]
  const dark = active?.theme === 'dark'
  const fallback = PATH_NAMES.find(([p]) => pathname === p || (p !== '/' && pathname.startsWith(p)))?.[1] ?? ''
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 transition-colors duration-500 ${dark ? 'text-dark-ink' : 'text-ink'}`} aria-hidden>
      <span className="mono-label absolute top-5 left-6">{active?.name ?? fallback}</span>
      {chapters.length > 0 && (
        <span className="mono-label absolute top-5 right-6">{pad(activeIndex + 1)} / {pad(chapters.length)}</span>
      )}
      {chapters.length > 1 && (
        <div className="absolute top-6 left-1/2 flex -translate-x-1/2 gap-1.5">
          {chapters.map((c, i) => (
            <span key={c.id} className="h-[3px] w-8 transition-colors duration-300"
              style={{ background: i <= activeIndex ? 'var(--color-lime)' : 'currentColor', opacity: i <= activeIndex ? 1 : 0.18 }} />
          ))}
        </div>
      )}
      <span className="mono-label absolute bottom-5 left-6">{extras.bl ?? 'Влад Лямин'}</span>
      <Link href="https://t.me/lyaminvl" target="_blank"
        className="mono-label pointer-events-auto absolute right-6 bottom-5 hover:text-lime-dark">
        {extras.br ?? '@lyaminvl'}
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Mount in `app/layout.tsx`**

Inside `<LenisProvider>`: wrap with `<HudProvider>`, render `<HudFrame />` once before children.

```tsx
<LenisProvider>
  <HudProvider>
    <HudFrame />
    {children}
  </HudProvider>
</LenisProvider>
```

- [ ] **Step 5: Verify in dev**

`npm run dev` → on every page corners show (name falls back to path mapping). No bars yet (no Chapters mounted). Build passes.

- [ ] **Step 6: Commit**

```bash
git add components/hud app/layout.tsx
git commit -m "feat(hud): fixed HUD frame with chapter registration, progress bars, theme switching"
```

---

### Task 4: Motion primitives (SplitLines, HandDrawn, Magnetic)

**Files:**
- Create: `components/motion/SplitLines.tsx`
- Create: `components/motion/HandDrawn.tsx`
- Create: `components/motion/Magnetic.tsx`
- Keep/reuse existing: `components/motion/CountUp.tsx` (verify it accepts `to` number; adapt usage later)

**Interfaces:**
- Produces:
  - `<SplitLines as?="h1" className?>{text or JSX}</SplitLines>` — splits into lines (split-type), each line wrapped in overflow-hidden mask, lines translateY(110%)→0 with stagger 0.08 on scroll into view. Reduced motion → renders children directly.
  - `<HandDrawn kind="circle" | "underline" className?>{word}</HandDrawn>` — `.hw-wrap` span + svg path, path stroke draws (dashoffset) when in view.
  - `<Magnetic strength?=0.3>{button/link}</Magnetic>` — wrapper div translating child toward cursor, springs back on leave.

- [ ] **Step 1: Write `components/motion/SplitLines.tsx`**

```tsx
'use client'
import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = { as?: ElementType; className?: string; children: ReactNode }

export default function SplitLines({ as: Tag = 'div', className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const el = ref.current
    if (!el || reduced) return
    const split = new SplitType(el as HTMLElement, { types: 'lines' })
    split.lines?.forEach(line => {
      const mask = document.createElement('div')
      mask.style.overflow = 'hidden'
      line.parentNode?.insertBefore(mask, line)
      mask.appendChild(line)
    })
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
    return () => split.revert()
  }, { dependencies: [reduced] })

  return <Tag ref={ref} className={className}>{children}</Tag>
}
```

- [ ] **Step 2: Write `components/motion/HandDrawn.tsx`**

```tsx
'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PATHS = {
  circle: { viewBox: '0 0 200 80', d: 'M12,42 C8,18 60,6 104,8 C160,10 194,22 192,42 C190,64 140,74 96,72 C50,70 14,62 14,44' },
  underline: { viewBox: '0 0 300 12', d: 'M2,8 C60,4 120,10 180,6 C230,3 270,8 298,5' },
} as const

export default function HandDrawn({ kind, className = '', children }: { kind: keyof typeof PATHS; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const { viewBox, d } = PATHS[kind]

  useGSAP(() => {
    const path = ref.current?.querySelector('path')
    if (!path || reduced) return
    const len = path.getTotalLength()
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    })
  }, { dependencies: [reduced] })

  const underlineStyle = kind === 'underline'
    ? { left: '-2%', top: 'auto' as const, bottom: '-0.18em', width: '104%', height: '0.28em' }
    : undefined
  return (
    <span ref={ref} className={`hw-wrap ${className}`}>
      {children}
      <svg viewBox={viewBox} preserveAspectRatio="none" style={underlineStyle}><path d={d} /></svg>
    </span>
  )
}
```

- [ ] **Step 3: Write `components/motion/Magnetic.tsx`**

```tsx
'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from './useReducedMotion'

export default function Magnetic({ strength = 0.3, children }: { strength?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
      duration: 0.4, ease: 'power3.out',
    })
  }
  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">{children}</div>
}
```

- [ ] **Step 4: Build + commit**

Run: `npm run build` → success.

```bash
git add components/motion/SplitLines.tsx components/motion/HandDrawn.tsx components/motion/Magnetic.tsx
git commit -m "feat(motion): SplitLines masked reveals, HandDrawn svg accents, Magnetic hover"
```

---

### Task 5: Preloader and page-transition curtain

**Files:**
- Create: `components/motion/Preloader.tsx`
- Create: `app/template.tsx`
- Modify: `app/layout.tsx` (mount Preloader)

**Interfaces:**
- Produces: `<Preloader />` — first visit per session (`sessionStorage.lvmn_seen`): dark `#0C0C0C` fullscreen, counter 0→100 (mono-label, bottom-right, large Literata number center «Влад Лямин» label), total ≤1.5s, slides up and unmounts. `app/template.tsx` — on every route change: dark curtain wipes up over 0.6s revealing new page; children rendered inside.

- [ ] **Step 1: Write `components/motion/Preloader.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from './useReducedMotion'

export default function Preloader() {
  const [show, setShow] = useState(false)
  const [n, setN] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || sessionStorage.getItem('lvmn_seen')) return
    sessionStorage.setItem('lvmn_seen', '1')
    setShow(true)
    const counter = { v: 0 }
    const tl = gsap.timeline({ onComplete: () => setShow(false) })
    tl.to(counter, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => setN(Math.round(counter.v)) })
      .to(ref.current, { yPercent: -100, duration: 0.5, ease: 'power4.inOut' }, '+=0.1')
  }, [reduced])

  if (!show) return null
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex items-center justify-center bg-dark text-dark-ink">
      <span className="font-display text-[clamp(48px,8vw,110px)]">Влад Лямин</span>
      <span className="mono-label absolute right-8 bottom-8 text-2xl">{n}</span>
    </div>
  )
}
```

- [ ] **Step 2: Write `app/template.tsx`**

```tsx
'use client'
import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Template({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(curtain.current, { display: 'none' })
      return
    }
    gsap.to(curtain.current, {
      yPercent: -100, duration: 0.6, ease: 'power4.inOut', delay: 0.05,
      onComplete: () => gsap.set(curtain.current, { display: 'none' }),
    })
  })
  return (
    <>
      <div ref={curtain} className="fixed inset-0 z-[90] bg-dark" />
      {children}
    </>
  )
}
```

- [ ] **Step 3: Mount `<Preloader />` in `app/layout.tsx`** next to `<HudFrame />`.

- [ ] **Step 4: Verify in dev**

Fresh tab → preloader counts and slides away; navigating between pages shows curtain wipe. Build passes.

- [ ] **Step 5: Commit**

```bash
git add components/motion/Preloader.tsx app/template.tsx app/layout.tsx
git commit -m "feat(motion): session preloader and route-change curtain"
```

---

### Task 6: Remove signal-from-noise, build homepage chapters 1–4

**Files:**
- Delete: `components/home/SystemSection.tsx`, `components/home/SignalSection.tsx`, `components/home/engine/` (whole dir), `components/home/ProofStrip.tsx`, `components/home/NotStrip.tsx`, `components/home/CourseBanner.tsx`, `scripts/generate-portrait-map.ts`, `public/landing.html`
- Delete stray root artifacts: `ch1-hero-1440.jpeg`, `current-full.jpeg`, `fullpage.png`, `grid-*.png`, `verify-*.png`, `swipe-file.md` stays (notes), `.playwright-mcp/` stays untracked
- Create: `components/home/ChapterHero.tsx`, `components/home/ChapterNumbers.tsx`, `components/home/ChapterManifesto.tsx`, `components/home/ChapterMethod.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Chapter`, `SplitLines`, `HandDrawn`, `Magnetic`, existing `CountUp` (`components/motion/CountUp.tsx` — check its props signature before use; if incompatible, inline a small count-up with gsap like Preloader's counter).
- Produces: four server-importable client components, each renders one `<Chapter>`; `app/page.tsx` composes chapters in order.

Copy (verbatim from spec):
- Hero H1: `Помогаю фаундерам строить и масштабировать системы с помощью AI` — «системы» wrapped in `HandDrawn kind="circle"`, «с помощью AI» italic. Sub: `Разбираю, где бизнес держится на ручном труде, и собираю вместо этого систему. Она работает, пока вы занимаетесь ростом.` CTAs: primary link `/audit` «Пройти AI-аудит» (Magnetic, ink bg → lime on hover), secondary `https://t.me/lyaminvl` «Написать в Telegram» (underline link). Handwritten note: `строится 2 недели, работает годами →` (font-hand, rotate -2.5deg).
- Numbers (dark): `17 / систем построено и передано`, `60 ч/мес / освобождает одна система в среднем`, `2 недели / от созвона до работающей версии`. Literata clamp(56px,9vw,120px), mono captions, count-up on enter.
- Manifesto (dark): SplitLines `Бизнес растёт до точки, где всё завязано на основателе. Дальше либо нанимать, либо строить систему.` («систему» HandDrawn circle) + numbered triad rows (mono index + Literata 18–20px, hairline dark-line separators): 01 Не агентство / 02 Не очередной курс / 03 Не разовый проект.
- Method (light): poster words `Аудит.` `Сборка.` `Масштаб.` stacked, clamp(48px,9vw,130px); ScrollTrigger toggles active word (solid ink, others `.ghost`); under active word a mono stage label + one paragraph swaps: Аудит → `ЭТАП 01` «Смотрю, как устроены процессы и где утекают часы. На выходе карта: что автоматизировать первым.»; Сборка → `ЭТАП 02 — 1–3 НЕДЕЛИ` «Собираю систему под ваш бизнес. Инструменты подбираю под задачу, а не наоборот.»; Масштаб → `ЭТАП 03` «Система забирает рутину на себя. Расширяем её вместе с ростом бизнеса.» Reduced motion / mobile: render all three words solid with their paragraphs stacked statically.

- [ ] **Step 1: Delete old files** (`git rm -r` tracked ones, plain `rm` for untracked artifacts). Remove their imports from `app/page.tsx`.

- [ ] **Step 2: Write the four chapter components** per the copy/behavior above. Example skeleton for `ChapterHero.tsx` (others follow the same pattern):

```tsx
'use client'
import Link from 'next/link'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'
import HandDrawn from '@/components/motion/HandDrawn'
import Magnetic from '@/components/motion/Magnetic'

export default function ChapterHero() {
  return (
    <Chapter name="Hero" theme="light" className="flex min-h-svh flex-col justify-center px-[6vw] py-28">
      <p className="mono-label mb-8 flex items-center gap-3">
        <span className="inline-block size-2 rounded-full bg-lime" />Влад Лямин
      </p>
      <SplitLines as="h1" className="font-display text-[clamp(44px,7.5vw,120px)]">
        Помогаю фаундерам строить и{' '}
        <HandDrawn kind="underline">масштабировать</HandDrawn>{' '}
        <HandDrawn kind="circle">системы</HandDrawn> <em>с помощью AI</em>
      </SplitLines>
      <p className="mt-10 max-w-[520px] text-[17px] leading-relaxed text-ink-muted">
        Разбираю, где бизнес держится на ручном труде, и собираю вместо этого систему.
        Она работает, пока вы занимаетесь ростом.
      </p>
      <span className="font-hand mt-4 inline-block -rotate-2 text-2xl text-ink-muted">
        строится 2 недели, работает годами →
      </span>
      <div className="mt-12 flex items-center gap-8">
        <Magnetic>
          <Link href="/audit" className="bg-ink px-9 py-4 text-[15px] font-medium text-white transition-colors hover:bg-lime hover:text-ink">
            Пройти AI-аудит
          </Link>
        </Magnetic>
        <Link href="https://t.me/lyaminvl" target="_blank" className="link-ul text-[15px]">Написать в Telegram</Link>
      </div>
    </Chapter>
  )
}
```

- [ ] **Step 3: Compose `app/page.tsx`**

```tsx
import ChapterHero from '@/components/home/ChapterHero'
import ChapterNumbers from '@/components/home/ChapterNumbers'
import ChapterManifesto from '@/components/home/ChapterManifesto'
import ChapterMethod from '@/components/home/ChapterMethod'
// (chapters 5–8 added in Task 7)
export default function Home() {
  return (
    <main>
      <ChapterHero />
      <ChapterNumbers />
      <ChapterManifesto />
      <ChapterMethod />
    </main>
  )
}
```

Keep existing page `metadata` export.

- [ ] **Step 4: Verify visually**

`npm run dev` → homepage: HUD counts 4 chapters, bars fill on scroll, hero lines reveal, circle draws behind «системы», numbers count up, method words toggle. `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
git add -A components/home app/page.tsx scripts public
git commit -m "feat(home): poster chapters 1-4 (hero, numbers, manifesto, method); remove signal-from-noise engine"
```

---

### Task 7: Homepage chapters 5–8 + footer + portrait distortion

**Files:**
- Create: `components/home/ChapterCases.tsx`, `components/home/ChapterEntries.tsx`, `components/home/ChapterAbout.tsx`, `components/home/ChapterFinal.tsx`, `components/motion/DistortPortrait.tsx`
- Modify: `app/page.tsx` (append), `components/home/Footer.tsx` (restyle), delete `components/home/Hero.tsx`, `components/home/CasesSection.tsx`, `components/home/ProductsSection.tsx` after replacement
- Asset: `public/portrait.jpg` — use existing `public/portrait-candidate.jpg` renamed/optimized for now; final AI portraits arrive later (placeholder acceptable)

**Interfaces:**
- Consumes: Chapter/SplitLines/HandDrawn/Magnetic; `lib/products.ts` exports (read file first — use its actual product array for ChapterEntries links/names order: гайд, консультация, аудит, внедрение; override display order in component, do not edit data file).
- Produces: `<DistortPortrait src alt className?>` — ogl-канвас поверх `<img>`: hover displaces UVs (simple shader), fallback = plain img (reduced motion, mobile, WebGL fail).

Copy:
- Cases (dark), rows `[mono index] [Literata title] [mono result]`, hover row → lime bg + ink text: 01 «Контент-завод для онлайн-школы» / 60 Ч/МЕС; 02 «Поддержка, которая отвечает сама» / 80% БЕЗ ЛЮДЕЙ; 03 «Цены конкурентов каждое утро» / БЕЗ РУЧНОГО СБОРА; 04 «Приём заявок в закрытый клуб» / КРУГЛОСУТОЧНО.
- Entries (light, `#F7F6F3`), heading «С чего начать», poster rows linking: 01 Гайд по AI-системам → `/products/guide`-style slug from lib/products.ts; 02 Консультация; 03 AI-аудит бизнеса → `/audit`; 04 Внедрение под ключ. Row hover: italic + translate-x + cursor label «Открыть».
- About teaser (dark): portrait (DistortPortrait) + SplitLines «Каждую систему собираю сам.» + sub «От первого созвона до передачи. Вы общаетесь со мной, а не с менеджером.» + link `/about` + font-hand signature «Влад Лямин».
- Final (light): huge «Готовы строить <span class="ghost">систему?</span>», sub «Начните с гайда или напишите мне в Telegram — отвечаю сам.», Magnetic CTA to `/products` + tg link. Footer below inside same chapter: big nav links (Главная/Продукты/Аудит/Блог/Обо мне) in Literata 28px+, mono bottom row (© 2026, ссылки на телеграм/RSS).

- [ ] **Step 1: Write `components/motion/DistortPortrait.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export default function DistortPortrait({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [glOk, setGlOk] = useState(false)

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    let cleanup = () => {}
    let alive = true
    ;(async () => {
      try {
        const { Renderer, Program, Mesh, Triangle, Texture } = await import('ogl')
        const el = wrap.current
        if (!el || !alive) return
        const renderer = new Renderer({ dpr: Math.min(2, devicePixelRatio), alpha: true })
        const gl = renderer.gl
        el.appendChild(gl.canvas)
        gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
        const texture = new Texture(gl)
        const img = new Image()
        img.src = src
        img.onload = () => { texture.image = img; setGlOk(true) }
        const program = new Program(gl, {
          vertex: `attribute vec2 uv, position; varying vec2 vUv;
            void main(){ vUv = uv; gl_Position = vec4(position,0.,1.); }`,
          fragment: `precision highp float; uniform sampler2D tMap; uniform vec2 uMouse; uniform float uHover;
            varying vec2 vUv;
            void main(){
              float d = distance(vUv, uMouse);
              vec2 off = normalize(vUv - uMouse) * uHover * 0.04 * smoothstep(0.35, 0.0, d);
              gl_FragColor = texture2D(tMap, vUv + off);
            }`,
          uniforms: { tMap: { value: texture }, uMouse: { value: [0.5, 0.5] }, uHover: { value: 0 } },
        })
        const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
        const resize = () => renderer.setSize(el.clientWidth, el.clientHeight)
        resize()
        addEventListener('resize', resize)
        let hover = 0, target = 0, raf = 0
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect()
          program.uniforms.uMouse.value = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]
        }
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseenter', () => { target = 1 })
        el.addEventListener('mouseleave', () => { target = 0 })
        const loop = () => {
          hover += (target - hover) * 0.08
          program.uniforms.uHover.value = hover
          renderer.render({ scene: mesh })
          raf = requestAnimationFrame(loop)
        }
        loop()
        cleanup = () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); gl.canvas.remove() }
      } catch { /* fallback: plain img */ }
    })()
    return () => { alive = false; cleanup() }
  }, [src, reduced])

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`h-full w-full object-cover ${glOk ? 'opacity-0' : ''}`} />
    </div>
  )
}
```

- [ ] **Step 2: Write chapters 5–8** following ChapterHero pattern and the copy above; read `lib/products.ts` first for real slugs/names.

- [ ] **Step 3: Restyle `components/home/Footer.tsx`** into ChapterFinal's footer block (or keep Footer separate and render inside ChapterFinal). Delete now-unused `Hero.tsx`, `CasesSection.tsx`, `ProductsSection.tsx`, `AboutTeaser`-equivalents; keep `cta.ts` if referenced.

- [ ] **Step 4: Append chapters in `app/page.tsx`**, verify homepage full scroll: 8 chapters, HUD `01/08`→`08/08`. Build passes.

- [ ] **Step 5: Commit**

```bash
git add -A components app/page.tsx public
git commit -m "feat(home): chapters 5-8, ogl portrait distortion, poster footer"
```

---

### Task 8: Fullscreen chapter menu (HUD nav)

**Files:**
- Create: `components/hud/HudMenu.tsx`
- Modify: `components/hud/HudFrame.tsx` (progress bars / index become a button opening menu; add burger button top-right of bl label zone)
- Delete: `components/home/Nav.tsx` (replaced), remove its usages

**Interfaces:**
- Consumes: HudContext state (chapter list for current page), `usePathname`.
- Produces: fullscreen dark overlay (`z-[80]`), poster rows: page links (Главная 01, Продукты 02, AI-аудит 03, Блог 04, Обо мне 05) Literata clamp(40px,8vw,96px), hover italic+lime index; below — mono row with tg/email. Open/close animated with gsap (clip-path inset wipe 0.5s). Trigger: clicking the HUD index `NN / MM` or bars; ESC and click-outside close. Body scroll locks while open (`lenis.stop()` via a `data-lenis-prevent` or direct class toggle `overflow-hidden`).

- [ ] **Step 1: Write HudMenu with the five links + state lifted into HudFrame (`useState(open)`).**
- [ ] **Step 2: Wire triggers in HudFrame (pointer-events-auto on index/bars button, aria-label «Открыть меню»).**
- [ ] **Step 3: Delete `components/home/Nav.tsx`; check all pages still render (blog layout may import it — replace with nothing, HUD is global).**
- [ ] **Step 4: Verify: menu opens on every page, links navigate with curtain, ESC closes. Build passes.**
- [ ] **Step 5: Commit**

```bash
git add -A components app
git commit -m "feat(hud): fullscreen poster menu replaces old nav"
```

---

### Task 9: /about rebuild

**Files:**
- Rewrite: `app/about/page.tsx` (keep `metadata` export, rewrite JSX)

**Interfaces:**
- Consumes: Chapter, SplitLines, HandDrawn, DistortPortrait, existing about content (read old page first — reuse timeline facts/principles text, rewrites must pass humanizer rules from Global Constraints).

Structure (spec §6): dark chapter 1 «Строю системы. <em>Своими руками.</em>» + portrait + first-person manifesto para; dark chapter 2 «Как я к этому <span class=ghost>пришёл</span>» + timeline (lime square markers, mono years, Literata titles — reuse real milestones from current page); light chapter 3 «Скучный AI, который <span class=hl>работает</span>» + principles list + tg CTA.

- [ ] **Step 1: Read current `app/about/page.tsx`, extract real timeline/principles facts.**
- [ ] **Step 2: Rewrite page as three Chapters with the structure above; strip any stack mentions and «второй мозг» phrasing from carried-over text.**
- [ ] **Step 3: Verify in dev (HUD shows 3 chapters), build passes.**
- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat(about): poster/HUD rebuild with timeline and principles chapters"
```

---

### Task 10: /products index + detail restyle

**Files:**
- Rewrite: `app/products/page.tsx` presentation (keep `lib/products.ts` and `app/products/content.ts` data, keep `BuyAction.tsx` logic, keep FAQ content)
- Modify: `app/products/[slug]/page.tsx` presentation, `app/products/ProductSection.tsx`, `app/products/Faq.tsx` (restyle to tokens)

Structure: light page; heading «Четыре <em>точки входа</em>»; product poster rows (mono idx / Literata clamp(28px,4.5vw,52px) name / mono price-meta right), hover italic + padding-left shift; rows link to detail pages. Detail page: poster H1, mono meta corners handled by HUD, body copy in current structure restyled (Literata headings, mono labels), BuyAction button restyled ink→lime hover, FAQ as hairline accordion (no shadows, radius 0).

- [ ] **Step 1: Restyle index page rows per above (order: гайд, консультация, аудит, внедрение — display order only).**
- [ ] **Step 2: Restyle detail page + Faq + BuyAction classNames to new tokens; no logic changes.**
- [ ] **Step 3: Verify all product pages render, buy links work, build passes.**
- [ ] **Step 4: Commit**

```bash
git add app/products
git commit -m "feat(products): poster rows index and token restyle of detail pages"
```

---

### Task 11: /audit restyle

**Files:**
- Modify: `app/audit/page.tsx` and its CSS (keep the 7-step form logic and lead submission intact — presentation only)
- Modify: `app/audit/layout.tsx` if theme overrides live there

Structure: dark full-screen stage; one question per screen (Literata clamp(26px,4vw,48px), centered), answers as large bordered buttons (dark-line border, hover lime bg + ink text); progress bars top-center are the HUD's (page calls `setHudExtras({ br: '≈ 4 минуты' })` and passes step chapters OR sets HUD manually: simplest — wrap each step screen in the same `Chapter name={'Шаг N'}` mounted conditionally so HUD shows N/7). Step transition: vertical curtain (gsap clip-path) on answer select.

- [ ] **Step 1: Read current audit page; map its step state to Chapter mounting (one Chapter at a time, name=`Шаг ${n}`, theme dark).**
- [ ] **Step 2: Restyle question/answers/inputs to dark poster tokens; add gsap step transition; reduced-motion = instant swap.**
- [ ] **Step 3: Verify: full funnel completes end-to-end in dev (submit test lead), HUD shows step count, build passes.**
- [ ] **Step 4: Commit**

```bash
git add app/audit
git commit -m "feat(audit): dark poster stage restyle, HUD step counter, presentation only"
```

---

### Task 12: /blog restyle + copy sweep + final verification

**Files:**
- Modify: `app/blog/page.tsx` (index list), `app/blog/[slug]/page.tsx` (header area only), `app/blog/blog.css` (tokens: Literata headings, mono meta; body styles keep structure), `components/post-card.tsx` if used by index
- Modify: `lib/lvmn-features.ts` (systems frame), `app/vibecoding/page.tsx` (tokens only)
- Modify: `app/layout.tsx` metadata description if it mentions old frame

Blog index: light `#F7F6F3`; heading «Заметки о <em>системах</em>»; rows `[mono date] [Literata title, hover italic] [small cover]`, hairline separators. Article page: poster H1 (SplitLines), cover, mono side TOC (existing `table-of-contents.tsx` restyled); body via blog.css with new tokens.

- [ ] **Step 1: Restyle blog index + article header + blog.css tokens (do not touch content pipeline or ISR).**
- [ ] **Step 2: Rewrite `lib/lvmn-features.ts` persona paragraph to the systems frame** («Помогаю фаундерам строить и масштабировать системы с помощью AI...» — first person, no stack names in reader-visible descriptions; keep `LVMN_*` export names).
- [ ] **Step 3: Site-wide copy sweep:** grep visible copy for banned tokens; fix hits in copy (code identifiers stay):

```bash
grep -rn --include='*.tsx' --include='*.ts' -i -E 'второй мозг|второго мозга|n8n|Supabase|Claude|Gemini|Apify|aiogram|RAG' app components lib/products.ts lib/lvmn-features.ts | grep -v -E 'import|from|supabase\.|createClient|//'
```

Expected: no matches in user-visible strings.

- [ ] **Step 4: Final verification pass:**
  - `npm run build` — success
  - Dev walkthrough: home (8 chapters), about, products (+1 detail), audit end-to-end, blog index + article; menu + curtain everywhere; preloader once per session
  - Enable «Reduce motion» in macOS → reload: no Lenis, content readable, no broken layouts
  - Mobile viewport (390px): HUD corners don't collide, poster type scales via clamp, distortion disabled
- [ ] **Step 5: Commit**

```bash
git add -A app components lib
git commit -m "feat(blog): poster restyle; systems positioning in lvmn-features; site-wide copy sweep"
```

---

## Deploy (after Влад approves visuals locally)

Per project CLAUDE.md (Timeweb VPS, not Vercel):

```bash
rsync -az --exclude node_modules --exclude .next --exclude .git ./ root@5.42.111.39:/var/www/lvmn-site/
ssh root@5.42.111.39 'cd /var/www/lvmn-site && npm install --omit=dev=false && NODE_OPTIONS="--max-old-space-size=2048" npm run build && pm2 restart lvmn --update-env'
```

## Open items (need Влад)

- Real numbers for ChapterNumbers (17 / 60 / 2 are placeholders).
- Face references for AI portrait generation; until then `public/portrait-candidate.jpg` is the stand-in.
