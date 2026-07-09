# Hero 3D Backdrop — Design

## Problem

Hero (`components/home/ChapterHero.tsx`) sits on a flat white background
(`bg-paper`, no shadows, sharp corners — the site's "White + Lime" design
system). The ask: give the Hero section a "calque on a drafting table"
feel — a white 3D backdrop with floating elements and soft shadows, as if
elements hover above a paper surface.

This conflicts with the codified DS rule ("Corners stay sharp, no
shadows" — `app/globals.css` line ~675). Resolution below scopes the
break so the rest of the site is untouched.

## Scope

- **Where**: Hero section only (`ChapterHero.tsx`). No other chapter
  (Cases, Method, Manifesto, etc.) is touched.
- **What breaks the "no shadows" rule**: a new decorative backdrop layer
  only. All existing Hero content (heading, CTA buttons, portrait,
  mono-label) stays exactly as styled today — flat, sharp corners, no
  shadow.
- **Design tokens**: no changes to `app/globals.css` `@theme`/`:root`
  variables. Shadow values are scoped locally to the new backdrop
  component (inline style or a component-scoped CSS module/class), not
  added to the global utility set.

## Components

### `components/home/HeroBackdrop.tsx` (new)

Absolutely-positioned decorative layer rendered behind Hero's content,
`pointer-events-none`, negative or low `z-index` relative to content.

Two visual layers, back to front:

1. **Paper/calque texture** — subtle grain or dot-grid SVG pattern over
   `--color-paper`, opacity ~3-5%, plus a faint millimeter-grid hint
   (drafting-table cue). Static, no shadow, no motion.
2. **3-4 floating abstract cards** — plain rectangles/simple shapes, white
   fill, `--color-line` hairline border, no text/content (abstract UI
   placeholders per user choice). Each has its own soft `box-shadow`
   (scoped to this component only). Varied size, slight rotation
   (2-6deg), positioned at the composition edges so they never overlap
   the heading, CTA, or portrait.

### Motion

- Mouse-move parallax: cards shift at different depths using the
  project's existing `useTilt.ts` hook or `motion` (framer-motion,
  already a dependency) — reuse rather than reinvent.
- Idle float: slow Y-axis drift, offset phase/speed per card, via
  `motion` or `gsap` (both already dependencies).
- Respect `useReducedMotion.ts` (already exists in
  `components/motion/`): when reduced motion is preferred, cards render
  static (no parallax, no idle float).

### Mobile

Simplify: either 1-2 static (non-animated) cards, or hide the backdrop
entirely below a breakpoint (e.g. `md:`) to protect performance and
avoid clutter on small screens. Decide at implementation time based on
how it looks — default to hiding below `md:` unless it reads better
simplified.

## Non-goals

- No change to `app/globals.css` global shadow/radius tokens.
- No change to any other Hero content, copy, or existing components
  (`SplitLines`, `HandDrawn`, `Magnetic`, `DistortPortrait`).
- No new content/text on the floating cards — abstract shapes only.
- No changes outside `ChapterHero.tsx` + the new `HeroBackdrop.tsx`.
