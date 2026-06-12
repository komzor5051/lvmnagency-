# Teaching/Expertise Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add named teaching/expertise proof (Web3nity, Дмитрий Румянцев, Никита Корытин · ТИТАНЫ) to the homepage and the /about page.

**Architecture:** A new self-contained presentational component `TeachingStrip` mounts on the homepage right after `ProofStrip`. A new "02 / Экспертиза" section is inserted into the existing `/about` page between "Путь" and "Принципы", with subsequent sections renumbered to 03/04.

**Tech Stack:** Next.js App Router, React, Tailwind. No test framework for presentational components — verification is `npm run build` + visual check.

Spec: `docs/superpowers/specs/2026-06-13-teaching-expertise-proof-design.md`

---

## Facts (source of truth for copy)

| Площадка | Роль | Время | Пруф-ссылка |
|---|---|---|---|
| Web3nity | Куратор AI-курсов | настоящее | https://www.youtube.com/@Web3nity |
| Дмитрий Румянцев | Куратор курсов (маркетинг) | прошедшее | — |
| Никита Корытин · ТИТАНЫ | Экспертный AI-контент для закрытого клуба | настоящее | https://nkorytin.ru/ |

---

### Task 1: TeachingStrip component (homepage)

**Files:**
- Create: `components/home/TeachingStrip.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/TeachingStrip.tsx` with the exact content below. Mirrors the visual language of `ProofStrip`/existing sections (`max-w-6xl`, mono accent label, `border-line`, `Reveal` + `data-reveal`). Three named items; two carry an external proof link.

```tsx
import { Reveal } from "@/components/motion/Reveal";

type Item = {
  name: string;
  role: string[];
  href?: string;
  hrefLabel?: string;
};

const items: Item[] = [
  {
    name: "Web3nity",
    role: ["куратор AI-курсов", "сейчас"],
    href: "https://www.youtube.com/@Web3nity",
    hrefLabel: "youtube",
  },
  {
    name: "Дмитрий Румянцев",
    role: ["куратор курсов", "маркетолога"],
  },
  {
    name: "Никита Корытин · ТИТАНЫ",
    role: ["экспертный AI-контент", "для закрытого клуба"],
    href: "https://nkorytin.ru/",
    hrefLabel: "nkorytin.ru",
  },
];

/** Named teaching/expertise proof: where I'm trusted to lead AI. */
export function TeachingStrip() {
  return (
    <section className="border-b border-line">
      <Reveal className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Преподаю и консультирую
        </p>
        <h2
          data-reveal
          className="mt-4 max-w-2xl font-heading text-2xl font-bold tracking-[-0.03em] sm:text-3xl"
        >
          Меня зовут вести AI там, где за результат отвечают репутацией.
        </h2>

        <ul className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.name} data-reveal className="border-t border-line pt-5">
              <div className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                {item.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.role.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-mono text-xs underline-accent transition-opacity hover:opacity-70"
                >
                  {item.hrefLabel} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles in isolation**

Run: `npx tsc --noEmit`
Expected: no new errors referencing `TeachingStrip.tsx`. (If the project has no standalone tsc script, this is covered by the build in Task 3.)

- [ ] **Step 3: Commit**

```bash
git add components/home/TeachingStrip.tsx
git commit -m "feat: TeachingStrip component for named teaching proof"
```

---

### Task 2: Mount TeachingStrip on homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Inspect current homepage section order**

Run: `grep -n "ProofStrip\|import" app/page.tsx`
Expected: find the `ProofStrip` import and its `<ProofStrip />` usage in the JSX.

- [ ] **Step 2: Add the import**

Add alongside the existing home-component imports in `app/page.tsx` (match the existing import style, e.g. next to the `ProofStrip` import):

```tsx
import { TeachingStrip } from "@/components/home/TeachingStrip";
```

- [ ] **Step 3: Mount it directly after `<ProofStrip />`**

Find the `<ProofStrip />` element in the JSX and insert `<TeachingStrip />` immediately after it:

```tsx
<ProofStrip />
<TeachingStrip />
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount TeachingStrip under ProofStrip on homepage"
```

---

### Task 3: Add "Экспертиза" section to /about + renumber

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Add the EXPERTISE data constant**

In `app/about/page.tsx`, after the existing `TIMELINE` constant (ends at line ~37) and before `PRINCIPLES`, add:

```tsx
const EXPERTISE: { label: string; name: string; text: string; href?: string; hrefLabel?: string }[] = [
  {
    label: "сейчас",
    name: "Web3nity",
    text: "Курирую AI-курсы: разбираю работы учеников, помогаю довести автоматизации до рабочего состояния, а не до демо.",
    href: "https://www.youtube.com/@Web3nity",
    hrefLabel: "youtube",
  },
  {
    label: "курсы",
    name: "Дмитрий Румянцев",
    text: "Был куратором на курсах — у одного из самых известных в рунете преподавателей маркетинга.",
  },
  {
    label: "клуб",
    name: "Никита Корытин · ТИТАНЫ",
    text: "Пишу экспертный AI-контент для закрытого клуба ТИТАНЫ — для аудитории, которая принимает решения и платит за конкретику.",
    href: "https://nkorytin.ru/",
    hrefLabel: "nkorytin.ru",
  },
];
```

- [ ] **Step 2: Insert the section JSX between "Путь" and "Принципы"**

In the JSX, the "Путь" section ends with `</section>\n        </Reveal>` (the block whose label is `01 / Путь`). Immediately after that closing `</Reveal>`, and before the `{/* Принципы скучного AI */}` comment, insert:

```tsx
        {/* Экспертиза */}
        <Reveal>
          <section className="border-t border-line">
            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
              <p data-reveal className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                02 / Экспертиза
              </p>
              <h2
                data-reveal
                className="mt-4 max-w-2xl font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
              >
                Меня зовут вести AI там, где за результат отвечают репутацией
              </h2>
              <p data-reveal className="mt-5 max-w-xl leading-relaxed text-ink-muted">
                «Обучил 50+» из таймлайна — это не абстракция. Вот площадки, где я
                курирую обучение и пишу экспертный контент.
              </p>

              <div className="mt-12">
                {EXPERTISE.map((item) => (
                  <div
                    key={item.name}
                    data-reveal
                    className="grid gap-3 border-t border-line py-7 last:border-b sm:grid-cols-[140px_48px_1fr] sm:items-baseline sm:gap-6"
                  >
                    <div className="font-mono text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </div>
                    <div aria-hidden="true" className="hidden h-0.5 w-8 self-center bg-accent sm:block" />
                    <div className="max-w-2xl">
                      <div className="font-heading text-lg font-bold tracking-[-0.02em] text-ink">
                        {item.name}
                      </div>
                      <p className="mt-2 leading-relaxed text-ink-muted">{item.text}</p>
                      {item.href && (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block font-mono text-xs underline-accent transition-opacity hover:opacity-70"
                        >
                          {item.hrefLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
```

- [ ] **Step 3: Renumber the following sections**

Update the mono labels so numbering stays sequential:
- `02 / Принципы` → `03 / Принципы`
- `03 / Стек` → `04 / Стек`

Run to confirm exactly which labels exist before editing:
Run: `grep -n "/ Принципы\|/ Стек\|/ Путь\|/ Экспертиза" app/about/page.tsx`
Expected after edits: `01 / Путь`, `02 / Экспертиза`, `03 / Принципы`, `04 / Стек` — each appearing once.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add named Экспертиза section to /about, renumber sections"
```

---

### Task 4: Visual verification

**Files:** none (manual check)

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

- [ ] **Step 2: Check homepage**

Open `http://localhost:3000`. Confirm:
- `TeachingStrip` renders directly under the count-up stats (`ProofStrip`).
- Three named items; Web3nity and Корытин links open in a new tab.
- On a narrow viewport the three items stack without overflow.

- [ ] **Step 3: Check /about**

Open `http://localhost:3000/about`. Confirm:
- Section "02 / Экспертиза" appears between "Путь" and "Принципы".
- Section numbering reads 01 → 02 → 03 → 04 top to bottom.
- Proof links work.

---

## Self-Review

- **Spec coverage:** Block 1 (homepage TeachingStrip) → Tasks 1–2. Block 2 (/about section + renumber) → Task 3. Named facts with correct tenses → data constants in Tasks 1 and 3. No logos, no `/teaching` page, no shared abstraction, ProofStrip/AboutTeaser untouched → respected (YAGNI section). Verification → Task 4 + builds in Tasks 2–3.
- **Placeholder scan:** none — all code is concrete; copy is final.
- **Type consistency:** `TeachingStrip` item shape (`name`, `role: string[]`, `href?`, `hrefLabel?`) is local to Task 1; `EXPERTISE` shape (`label`, `name`, `text`, `href?`, `hrefLabel?`) is local to Task 3. Distinct constants, no cross-task name collisions.
