# Landing Page Redesign — Design Spec
**Date:** 2026-04-14
**Status:** Approved

---

## Overview

Replace the current chat-only homepage with a full landing page. Two audience directions — "Бизнесу" and "Сотрудникам" — controlled by an animated pill switcher. Chat stays as a section at the bottom. New `/employees` page for the employee direction.

**Positioning:** AI-first solo specialist (not an agency). Vlad works directly — no subcontractors, no bureaucracy.

---

## Architecture

### Routes

| Route | Change | Description |
|-------|--------|-------------|
| `/` | Redesign | Full landing page (replaces chat-only page) |
| `/audit` | No change | Existing AI audit form |
| `/blog` | No change | Existing blog |
| `/employees` | New | Separate landing for employees direction |

### Current chat
The AI chat (`app/page.tsx`) moves to a section at the bottom of the landing page. The chat API (`/api/chat`) stays unchanged.

---

## Main Landing Page (`/`)

### Navigation
- Left: Блог, AI-аудит
- Center: LVMN logo
- Right: Swipely, Vsolo, "Написать в Telegram" button (accent)
- Sticky, `z-index: 100`

### Hero Section
- **Badge:** animated pulsing dot + "2 слота в мае · Написать в Telegram" — clickable, links to `https://t.me/lyaminvl` (update slot count monthly)
- **H1:** "AI-first специалист для бизнеса и карьеры" — `em` on "бизнеса и карьеры" in accent color
- **Subtitle (first person):** "Без агентства, без субподрядчиков — работаю напрямую. Помогаю бизнесу автоматизировать процессы и сотрудникам опережать коллег с правильными инструментами."
- **Pill switcher:** shadcn `ToggleGroup`-style animated component, centered. Two options: "Бизнесу" / "Сотрудникам". White pill slides with CSS cubic-bezier transition. Controls all tab-panel content below.

### Proof Bar
Four stats separated by dividers:
- 15+ автоматизаций запущено
- Соло — без агентства и субподрядчиков
- 40 ч/мес — экономия у клиентов
- 3-5× ускорение рутинных задач

### Tab Panel: Бизнесу (default active)

**Pitch section** (two-column grid):
- Left: eyebrow + title "Не ChatGPT. Не консалтинг ради консалтинга. Автоматизация, которая окупается." + description + explainer box "Подход: анализ → приоритеты → результат"
- Right: 2×2 service cards — AI-аудит, Стратегия, Внедрение, Сопровождение

**Process section** (white bg, border top/bottom):
- 3 steps with terracotta numbered circles and connector line: AI-аудит → Внедрение → Система работает

**Cases section:**
- 3 case cards: Ресторанная сеть (40 ч/мес), Онлайн-образование (80% задач), Сервисный бизнес (-70% обращений)
- No time-to-implement claims

**CTAs:** "Пройти бесплатный AI-аудит" → `/audit` + "Написать в Telegram"

### Tab Panel: Сотрудникам

**Pitch section** (two-column grid):
- Left: eyebrow + title "Коллега с AI делает за день то, что вы — за неделю." + description + explainer box "Формат 'под вашу профессию'"
- Right: 2 full-width cards — Консультация 1:1, Программа обучения (3-5 сессий)

**Process section:** 3 steps: Диагностика задач → Практика на реальных задачах → Система в работе

**For-whom section:** 3 cards — Маркетинг и контент, Юристы и финансисты, Менеджеры

**CTAs:** "Записаться в Telegram" + "Узнать подробнее" → `/employees`

### CTA Section (dark, shared)
Background `#1c1917`. Content updates dynamically when tab switches:
- Бизнесу: "Узнайте, где AI поможет вашему бизнесу" + audit CTA
- Сотрудникам: "Начните опережать коллег уже на этой неделе" + Telegram CTA

### Chat Section
- Label "Или спросите напрямую"
- Greeting bubble from assistant
- Input field: on submit, expands inline into full chat UI (messages list + input area)
- Uses existing `/api/chat` streaming API — no changes to API
- Initial greeting message same as current: `GREETING` constant in `app/page.tsx`
- Quick question buttons shown before first user message (same as current)

### Footer
Logo left · nav links center · "Влад Лямин · Новосибирск · 2026" right

---

## `/employees` Page

Standalone landing for the employee direction. Built after the main landing.

**Sections:**
- Hero: headline + subtitle specific to employees
- Full program breakdown: consultation 1:1 (60 min) + training program (3-5 sessions) with details
- Who it's for: professions list
- CTA: Telegram signup form or direct link

---

## Design System

| Token | Value |
|-------|-------|
| Accent | `#c2410c` (terracotta) |
| Accent light bg | `#fff7ed` |
| Accent border | `#fed7aa` |
| Background | `#fafaf9` |
| Surface | `#ffffff` |
| Text primary | `#1c1917` |
| Text secondary | `#57534e` |
| Text muted | `#78716c` |
| Border | `#e7e5e4` |
| Dark bg (CTA) | `#1c1917` |

**Typography:** Inter (system fallback: -apple-system, sans-serif)

**Components:** shadcn/ui — ToggleGroup for pill switcher, Button, Card. Animations via CSS cubic-bezier transitions (no heavy libraries).

**Rules:**
- No emojis anywhere
- No purple/violet gradients
- No AI slop aesthetics
- No specific time claims ("1-3 days", "48 hours", etc.)

---

## Copywriting Principles (from RE analysis)

- First-person throughout — not "Влад Лямин помогает", but "Помогаю"
- Badge with specific availability signal — update slot count manually each month
- Terminology ownership: "Метод работы" with own language, not generic consulting buzzwords
- Named proof: specific numbers (40 ч/мес, 15+ автоматизаций, -70% обращений) — no vague claims
- Layered CTAs: high intent (audit form) / medium (Telegram) / low (chat)
- No false time promises

---

## Out of Scope

- `/audit` page changes
- `/blog` page changes
- API changes (`/api/chat`, `/api/audit`)
- Content pipeline (Vercel Cron, Supabase)
