# LVMN landing conversion redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять конверсию главной в заявки: hero с понятным оффером и CTA на бесплатный AI-аудит, честная секция кейсов без выдуманных метрик, sticky-mobile-CTA, мини-форма заявки на созвон, аналитика (PostHog + Я.Метрика).

**Architecture:** Сохраняем визуальный язык `app/page.tsx` (журнал, Fraunces/Inter, токены `S`). Добавляем конверсионный слой инлайн в `page.tsx`. Новый API-роут `/api/lead` (паттерн `/api/audit`). Единый хелпер `lib/analytics.ts` пишет события и в PostHog, и в Я.Метрику. PostHog инициализируется через клиентский провайдер в `app/layout.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, `posthog-js`, Yandex Metrika (уже стоит, id `106695724`), Telegram Bot API через `fetch`, `tsx` для прогона ad-hoc проверок.

Spec: `docs/superpowers/specs/2026-05-12-lvmn-landing-conversion-design.md`.

Тестов в проекте нет (`package.json` только `dev/build/lint`). Вводить тест-фреймворк ради этого фичефлоу — out of scope. Верификация: `npm run build`, `npm run lint`, `curl` для API-роута, ручной браузерный smoke по чек-листу в Task 10.

---

## File map

| Файл | Создаём / правим | Ответственность |
|---|---|---|
| `lib/analytics.ts` | create | Единый `track(event, props)` → PostHog + `ym('reachGoal', ...)`. Безопасен при отсутствии env. |
| `components/PostHogProvider.tsx` | create | Клиентский провайдер: инициализирует `posthog-js` один раз, оборачивает children. |
| `app/layout.tsx` | modify | Подключить `PostHogProvider`. |
| `app/api/lead/route.ts` | create | POST: валидация трёх полей → уведомление в Telegram → `{ ok: true }`. |
| `scripts/test-lead-route.ts` | create | Ad-hoc проверка `/api/lead` через `tsx` (валид/невалид). |
| `components/landing/LeadForm.tsx` | create | Клиентская мини-форма заявки на созвон. Состояния: idle/loading/success/error. |
| `components/landing/StickyMobileCTA.tsx` | create | Клиентский фикс-бар снизу, скрыт на десктопе. |
| `app/page.tsx` | modify | Hero (подзаголовок, CTA, бейдж, proof-bar), CASES без метрик и без штриховки, middle CTA после SERVICES, замена контактной секции на `LeadForm`, инжект `StickyMobileCTA`. |
| `app/audit/page.tsx` | modify | События `audit_started` / `audit_completed`. |
| `.env.example` | modify (или create) | Документация новых env-переменных. |

---

## Task 1: Analytics helper

**Files:**
- Create: `lib/analytics.ts`

- [ ] **Step 1: Создать хелпер**

```ts
// lib/analytics.ts
"use client";

import posthog from "posthog-js";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    ym?: (id: number, action: string, target?: string, params?: Props) => void;
  }
}

const YM_ID = 106695724;

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    if (posthog && posthog.__loaded) posthog.capture(event, props);
  } catch {}
  try {
    window.ym?.(YM_ID, "reachGoal", event, props);
  } catch {}
}
```

- [ ] **Step 2: Лёгкая проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок. Если ругается на `posthog-js` — пропускаем шаг до Task 2 (там ставим зависимость) и проверяем повторно в конце Task 2.

- [ ] **Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat(analytics): add unified track() helper for PostHog + Yandex Metrika"
```

---

## Task 2: PostHog provider + env

**Files:**
- Create: `components/PostHogProvider.tsx`
- Modify: `app/layout.tsx`
- Modify: `.env.example` (создать, если нет)

- [ ] **Step 1: Установить зависимость**

```bash
npm install posthog-js
```

Expected: `posthog-js` появляется в `package.json` (`dependencies`).

- [ ] **Step 2: Создать провайдер**

```tsx
// components/PostHogProvider.tsx
"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
    if (!key) return;
    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        session_recording: { maskAllInputs: false },
        autocapture: false,
      });
    }
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 3: Подключить в `app/layout.tsx`**

Найти `<body>...{children}<YandexMetrika /></body>` и обернуть `children` в `PostHogProvider`:

```tsx
import { PostHogProvider } from "@/components/PostHogProvider";
// ...
<body className={...}>
  <PostHogProvider>{children}</PostHogProvider>
  <YandexMetrika />
</body>
```

- [ ] **Step 4: Дописать `.env.example`**

Добавить (создать файл, если отсутствует):

```
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
LEAD_BOT_TOKEN=
LEAD_NOTIFY_CHAT_ID=
```

Локально прописать `NEXT_PUBLIC_POSTHOG_KEY` и `NEXT_PUBLIC_POSTHOG_HOST` в `.env.local`, если ключ под рукой. Без ключа провайдер просто не инициализируется — это ок.

- [ ] **Step 5: Проверка сборки**

Run: `npm run build`
Expected: build проходит. Никаких runtime-обращений к PostHog при отсутствии ключа.

- [ ] **Step 6: Commit**

```bash
git add components/PostHogProvider.tsx app/layout.tsx .env.example package.json package-lock.json
git commit -m "feat(analytics): wire PostHog provider into root layout"
```

---

## Task 3: `/api/lead` route

**Files:**
- Create: `app/api/lead/route.ts`
- Create: `scripts/test-lead-route.ts`

- [ ] **Step 1: Создать роут**

```ts
// app/api/lead/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

interface LeadRequest {
  name: string;
  business: string;
  contact: string;
}

export async function POST(req: NextRequest) {
  let body: LeadRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const business = body.business?.trim();
  const contact = body.contact?.trim();

  if (!name || !business || !contact) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (name.length > 200 || business.length > 500 || contact.length > 200) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  const botToken = process.env.LEAD_BOT_TOKEN || process.env.AUDIT_BOT_TOKEN;
  const chatId = process.env.LEAD_NOTIFY_CHAT_ID || process.env.AUDIT_NOTIFY_CHAT_ID;

  if (botToken && chatId) {
    const text = [
      "Новая заявка на созвон с сайта",
      "",
      `Имя: ${name}`,
      `Бизнес: ${business}`,
      `Контакт: ${contact}`,
    ].join("\n");

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Создать ad-hoc тест-скрипт**

```ts
// scripts/test-lead-route.ts
const base = process.env.BASE_URL || "http://localhost:3000";

async function call(body: unknown, expectStatus: number) {
  const res = await fetch(`${base}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const ok = res.status === expectStatus;
  console.log(`${ok ? "PASS" : "FAIL"} ${res.status} (expected ${expectStatus}) ${text}`);
  if (!ok) process.exitCode = 1;
}

(async () => {
  await call({ name: "Тест", business: "Кофейня в Новосибирске", contact: "@test" }, 200);
  await call({ name: "Тест" }, 400);
  await call({ name: "", business: "x", contact: "y" }, 400);
  await call("not json", 400);
})();
```

- [ ] **Step 3: Запустить дев-сервер и прогнать**

В одном терминале:

```bash
npm run dev
```

В другом, дождавшись `Ready in ...`:

```bash
npx tsx scripts/test-lead-route.ts
```

Expected: четыре строки `PASS ...`, exit code 0. Если на роуте задано `LEAD_BOT_TOKEN` + `LEAD_NOTIFY_CHAT_ID` (или fallback на `AUDIT_*`) — в Telegram прилетит одно тестовое сообщение «Новая заявка на созвон с сайта».

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: без ошибок в новых файлах.

- [ ] **Step 5: Commit**

```bash
git add app/api/lead/route.ts scripts/test-lead-route.ts
git commit -m "feat(api): add /api/lead route for call-booking form"
```

---

## Task 4: LeadForm component + интеграция в контактную секцию

**Files:**
- Create: `components/landing/LeadForm.tsx`
- Modify: `app/page.tsx` (секция `id="Контакт"`, строки ~750-810)

- [ ] **Step 1: Создать компонент**

```tsx
// components/landing/LeadForm.tsx
"use client";

import { useState, type CSSProperties } from "react";
import { track } from "@/lib/analytics";

const S = {
  bg: "#f6f2ea",
  fg: "#1a1815",
  muted: "#7a756c",
  line: "#cfc8bb",
  card: "#eeeadf",
  accent: "oklch(0.55 0.12 30)",
  mono: "var(--font-mono), ui-monospace, monospace",
  serif: "var(--font-fraunces), 'Cormorant Garamond', Georgia, serif",
};

const labelStyle: CSSProperties = {
  fontFamily: S.mono,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: S.muted,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: `1px solid ${S.line}`,
  background: S.bg,
  fontSize: 16,
  fontFamily: "inherit",
  color: S.fg,
  boxSizing: "border-box",
};

export function LeadForm() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, contact }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      track("lead_form_submit");
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (state === "success") {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: 24,
          border: `1px solid ${S.line}`,
          background: S.card,
          textAlign: "center",
        }}
      >
        <div style={{ ...labelStyle, color: S.accent, marginBottom: 8 }}>отправлено</div>
        <p style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 300, margin: 0, lineHeight: 1.4 }}>
          Получил. Отвечу в течение суток в указанном контакте.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 520,
        margin: "0 auto",
        display: "grid",
        gap: 12,
        textAlign: "left",
      }}
    >
      <label style={labelStyle}>Имя</label>
      <input
        style={inputStyle}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={200}
        autoComplete="name"
      />
      <label style={labelStyle}>Чем занимается бизнес</label>
      <input
        style={inputStyle}
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
        required
        maxLength={500}
        placeholder="Кофейня · 12 человек · Новосибирск"
      />
      <label style={labelStyle}>Telegram или телефон</label>
      <input
        style={inputStyle}
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        maxLength={200}
        placeholder="@username или +7 ..."
      />
      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          marginTop: 8,
          padding: "14px 28px",
          background: S.fg,
          color: S.bg,
          fontFamily: S.mono,
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "none",
          cursor: state === "loading" ? "default" : "pointer",
          opacity: state === "loading" ? 0.6 : 1,
        }}
      >
        {state === "loading" ? "Отправляем..." : "Записаться на бесплатный созвон →"}
      </button>
      {state === "error" && (
        <p style={{ color: S.accent, fontSize: 14, margin: "4px 0 0" }}>
          Не отправилось ({errorMsg}). Напишите в Telegram напрямую — @lyaminvl.
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Интегрировать в `app/page.tsx`**

В секции `id="Контакт"` (строки ~750-810) над блоком с кнопками socials вставить `<LeadForm />` и подзаголовок «или напрямую». В импортах добавить:

```tsx
import { LeadForm } from "@/components/landing/LeadForm";
import { track } from "@/lib/analytics";
```

В JSX контактной секции, после `<p>` с текстом «Расскажите задачу...», заменить блок с кнопками на:

```tsx
<LeadForm />
<div style={{ ...label, marginTop: 32, marginBottom: 14 }}>или напрямую</div>
<div
  data-reveal
  style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}
>
  {SOCIALS.map((s) => (
    <a
      key={s.label}
      href={s.href}
      onClick={() => track("tg_click", { channel: s.label.toLowerCase() })}
      style={{
        padding: "12px 22px",
        border: `1px solid ${S.fg}`,
        fontFamily: S.mono,
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {s.label} — {s.handle}
    </a>
  ))}
</div>
```

- [ ] **Step 3: Сборка и smoke**

```bash
npm run build
npm run dev
```

Открыть `http://localhost:3000`, прокрутить до секции «Контакт»: видна форма из трёх полей, кнопки socials под ней. Отправка пустой формы блокируется браузерным `required`. Отправка корректной — показывает блок «Получил...».

- [ ] **Step 4: Commit**

```bash
git add components/landing/LeadForm.tsx app/page.tsx
git commit -m "feat(landing): add lead form to contact section"
```

---

## Task 5: Hero conversion changes

**Files:**
- Modify: `app/page.tsx` (секция HERO, строки ~319-395; константа `STATUS` строка 20)

- [ ] **Step 1: Подкорректировать копи и константы**

В начале файла, после `STATUS`, добавить:

```ts
const HERO_SUB =
  "Для среднего бизнеса в РФ: за 30 минут разбора показываю, где ИИ реально экономит деньги, и считаю сколько именно. 40+ внедрений, ни одного пилота, оставшегося пилотом.";
```

- [ ] **Step 2: Заменить hero JSX**

В секции HERO заменить блок с `<p className="drop-cap">` и блоком CTA на:

```tsx
<p
  className="drop-cap"
  style={{
    fontSize: 19,
    lineHeight: 1.7,
    marginTop: 36,
    maxWidth: 540,
    fontFamily: S.sans,
    margin: "36px 0 0",
  }}
>
  {HERO_SUB}
</p>

<div
  style={{
    marginTop: 28,
    display: "inline-block",
    padding: "6px 12px",
    background: S.fg,
    color: S.bg,
    fontFamily: S.mono,
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  }}
>
  {STATUS}
</div>

<div style={{ marginTop: 20, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
  <a
    href="/audit"
    onClick={() => track("hero_cta_click")}
    style={{
      padding: "14px 28px",
      background: S.fg,
      color: S.bg,
      fontFamily: S.mono,
      fontSize: 12,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      display: "inline-block",
    }}
  >
    Пройти бесплатный AI-аудит →
  </a>
  <a
    href="#Работы"
    onClick={() => track("cases_cta_click", { source: "hero" })}
    style={{
      fontFamily: S.serif,
      fontSize: 19,
      fontStyle: "italic",
      borderBottom: `1px solid ${S.fg}`,
      paddingBottom: 2,
    }}
  >
    посмотреть кейсы
  </a>
</div>

<div
  style={{
    marginTop: 32,
    paddingTop: 18,
    borderTop: `1px solid ${S.line}`,
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
    ...label,
  }}
>
  <span>40+ внедрений</span>
  <span>·</span>
  <span>200+ обучено</span>
  <span>·</span>
  <span>в AI с 2023</span>
  <span>·</span>
  <a
    href="https://t.me/lvmn_ai"
    onClick={() => track("tg_click", { channel: "hero_proofbar" })}
    style={{ borderBottom: `1px solid ${S.muted}` }}
  >
    канал
  </a>
</div>
```

Сразу импортировать наверху (если ещё не):

```tsx
import { track } from "@/lib/analytics";
```

- [ ] **Step 3: Сборка и smoke**

Run: `npm run dev`
Открыть `/`. Проверить:
- подзаголовок hero — про клиента, не про автора;
- бейдж «Беру 2 проекта в мае» виден рядом с CTA;
- первичный CTA «Пройти бесплатный AI-аудит →» ведёт на `/audit`;
- вторичный — на якорь `#Работы`;
- proof-bar под линией с реальными данными.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(landing): rework hero — subhead, audit CTA, scarcity badge, proof bar"
```

---

## Task 6: «Работы» → «Типы задач»

**Files:**
- Modify: `app/page.tsx` (массив `CASES` строки ~74-125; секция WORKS строки ~567-643; `Placeholder` строки ~160-180)

- [ ] **Step 1: Переписать данные**

Заменить массив `CASES` на:

```ts
const CASES = [
  {
    client: "Retail-сеть",
    year: "2025",
    title: "Агент для закупок",
    tag: "Агент",
    span: "span 4",
    ratio: "4/3",
  },
  {
    client: "Медицинская клиника",
    year: "2025",
    title: "AI-скоринг входящих заявок",
    tag: "Classification",
    span: "span 2",
    ratio: "4/3",
  },
  {
    client: "EdTech-стартап",
    year: "2024",
    title: "Генерация учебного контента",
    tag: "Pipeline",
    span: "span 2",
    ratio: "4/3",
  },
  {
    client: "B2B-сервис",
    year: "2024",
    title: "Персональный ассистент для саппорта",
    tag: "RAG",
    span: "span 4",
    ratio: "4/3",
  },
  {
    client: "Банк (пилот)",
    year: "2024",
    title: "Автоматизация комплаенс-проверок",
    tag: "Enterprise",
    span: "span 6",
    ratio: "21/8",
  },
];
```

- [ ] **Step 2: Заменить рендер секции WORKS**

Подзаголовок-абзац (`«Подробности по запросу...»`) заменить текстом:

```tsx
Реальные цифры и контекст — голосом, под NDA. Здесь — типы задач, которые я закрывал.
```

Карточку кейса (внутри `.map`) заменить на:

```tsx
<a
  key={i}
  href="/audit"
  data-reveal
  onClick={() => track("cases_cta_click", { source: "cases", title: c.title })}
  style={{
    gridColumn: c.span,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>
  <div
    style={{
      aspectRatio: c.ratio,
      width: "100%",
      background: S.card,
      display: "flex",
      alignItems: "flex-end",
      padding: 20,
      borderTop: `1px solid ${S.line}`,
      borderBottom: `1px solid ${S.line}`,
    }}
  >
    <div
      style={{
        fontFamily: S.serif,
        fontWeight: 300,
        fontStyle: "italic",
        fontSize: "clamp(22px, 2.6vw, 40px)",
        lineHeight: 1.1,
        color: S.fg,
      }}
    >
      {c.title}
    </div>
  </div>
  <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
    <span>
      {c.client} · {c.year}
    </span>
    <span>{c.tag}</span>
  </div>
</a>
```

(Удаляем рендер метрики и `<Placeholder>` внутри карточки. Компонент `Placeholder` оставляем — он используется в hero для портрета.)

- [ ] **Step 3: Сборка и smoke**

`npm run build && npm run dev`. Открыть `/#Работы`: в карточках нет процентов/метрик, нет диагональной штриховки; есть тип задачи + ниша + тег; клик ведёт на `/audit`.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "refactor(landing): rebrand cases as “task types”, remove unverified metrics"
```

---

## Task 7: Middle CTA после Services

**Files:**
- Modify: `app/page.tsx` (после секции SERVICES, строки ~565)

- [ ] **Step 1: Вставить CTA-блок**

После закрывающего `</section>` секции SERVICES (и перед секцией WORKS) добавить:

```tsx
<section
  className="section-pad"
  style={{
    padding: "56px 48px",
    borderBottom: `1px solid ${S.line}`,
    background: S.card,
    textAlign: "center",
  }}
>
  <p
    style={{
      fontFamily: S.serif,
      fontWeight: 300,
      fontSize: "clamp(22px, 2.4vw, 32px)",
      lineHeight: 1.35,
      margin: "0 auto 20px",
      maxWidth: 720,
    }}
  >
    Не уверены, какой формат подойдёт? <em>Начнём с 30 минут</em> — разберу процессы и
    скажу честно, есть ли смысл идти дальше.
  </p>
  <a
    href="/audit"
    onClick={() => track("middle_cta_click")}
    style={{
      display: "inline-block",
      padding: "14px 28px",
      background: S.fg,
      color: S.bg,
      fontFamily: S.mono,
      fontSize: 12,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    }}
  >
    Пройти бесплатный AI-аудит →
  </a>
</section>
```

- [ ] **Step 2: Smoke**

`npm run dev` → `/`: между «Услугами» и «Работами» появился блок с CTA на `/audit`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(landing): add middle CTA between services and works"
```

---

## Task 8: Sticky mobile CTA

**Files:**
- Create: `components/landing/StickyMobileCTA.tsx`
- Modify: `app/page.tsx` (импорт + рендер внутри `.studio`)

- [ ] **Step 1: Создать компонент**

```tsx
// components/landing/StickyMobileCTA.tsx
"use client";

import { track } from "@/lib/analytics";

export function StickyMobileCTA() {
  return (
    <>
      <style>{`
        .sticky-cta { display: none; }
        @media (max-width: 768px) {
          .sticky-cta {
            display: block;
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: 12px;
            z-index: 50;
            background: #1a1815;
            color: #f6f2ea;
            text-align: center;
            padding: 14px 16px;
            font-family: var(--font-mono), ui-monospace, monospace;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            box-shadow: 0 6px 20px rgba(0,0,0,0.18);
          }
          body { padding-bottom: 76px; }
        }
      `}</style>
      <a
        className="sticky-cta"
        href="/audit"
        onClick={() => track("sticky_cta_click")}
      >
        Бесплатный AI-аудит →
      </a>
    </>
  );
}
```

- [ ] **Step 2: Подключить в `app/page.tsx`**

В импорты:

```tsx
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA";
```

Внутри `<div className="studio">`, после `<footer>` (последний дочерний элемент `.studio`), добавить:

```tsx
<StickyMobileCTA />
```

- [ ] **Step 3: Smoke**

`npm run dev` → открыть `/` в DevTools-эмуляции iPhone: внизу появилась полоса «Бесплатный AI-аудит →»; футер не перекрывается (padding-bottom есть). На десктопе — не видна.

- [ ] **Step 4: Commit**

```bash
git add components/landing/StickyMobileCTA.tsx app/page.tsx
git commit -m "feat(landing): add sticky mobile CTA bar"
```

---

## Task 9: События на `/audit`

**Files:**
- Modify: `app/audit/page.tsx`

- [ ] **Step 1: Импорт хелпера**

В начало файла:

```tsx
import { track } from "@/lib/analytics";
```

- [ ] **Step 2: Событие `audit_started`**

Найти `handleNext` (рядом со строкой 165, переход `if (step < 6) setStep(step + 1)`). Обернуть так, чтобы при переходе с шага 0 на шаг 1 трекался запуск:

```tsx
const handleNext = () => {
  if (!canProceed) return;
  if (step === 0) track("audit_started", { niche });
  if (step < 6) {
    setStep(step + 1);
  } else {
    handleSubmit();
  }
};
```

(если структура отличается — встроить `if (step === 0) track(...)` в первое место, где увеличивается step с 0 на 1.)

- [ ] **Step 3: Событие `audit_completed`**

В `handleSubmit`, в `try`-блоке после `const data = await res.json();` и перед/после `setResult(data)` добавить:

```tsx
track("audit_completed", {
  niche,
  team_size: teamSize,
  routines_count: routines.length,
});
setResult(data);
```

- [ ] **Step 4: Smoke**

`npm run dev` → пройти аудит на `/audit` от первого шага до результата. В PostHog (live events) и в Я.Метрике (отчёт «Цели») увидеть `audit_started` и `audit_completed`.

- [ ] **Step 5: Commit**

```bash
git add app/audit/page.tsx
git commit -m "feat(analytics): track audit_started and audit_completed on /audit"
```

---

## Task 10: Финальная регрессия и настройка целей

**Files:** —

- [ ] **Step 1: Build и lint**

```bash
npm run build
npm run lint
```

Expected: оба зелёные.

- [ ] **Step 2: Браузерный smoke (десктоп)**

Открыть `http://localhost:3000` (или прод-превью):
- hero: новый подзаголовок, бейдж дефицита, primary CTA → `/audit`, secondary → `#Работы`, proof-bar внизу;
- секция «Работы»: пять карточек без метрик и без штриховки, клик → `/audit`;
- между «Услугами» и «Работами» — middle CTA → `/audit`;
- контактная секция: форма с тремя полями, ниже — кнопки socials;
- отправка формы с валидными данными → состояние «Получил...», сообщение в Telegram-чате (если env заданы);
- sticky-mobile-cta на десктопе не виден.

- [ ] **Step 3: Браузерный smoke (мобайл)**

DevTools → эмуляция iPhone 14 Pro:
- sticky-cta снизу, не перекрывает футер;
- hero перестроен в одну колонку, читается;
- форма заявки удобно нажимается.

- [ ] **Step 4: Регрессии других страниц**

Открыть `/blog`, `/blog/[любой пост]`, `/audit`, `/ai-audit`, `/employees` — страницы открываются без ошибок в консоли.

- [ ] **Step 5: Настройка целей в Я.Метрике (счётчик 106695724)**

В UI Метрики (вне кода) создать JS-цели с идентификаторами, равными именам событий:
`hero_cta_click`, `cases_cta_click`, `middle_cta_click`, `sticky_cta_click`, `audit_started`, `audit_completed`, `lead_form_submit`, `tg_click`. Сохранить.

- [ ] **Step 6: Проверка событий в PostHog**

В PostHog → Activity / Live events: после пары кликов на сайте видны события с указанными именами. Включить session recordings в проекте, если ещё не включены.

- [ ] **Step 7: Деплой**

```bash
npx vercel --prod
```

После деплоя — повторить шаги 2-4 на проде.

- [ ] **Step 8: Финальный коммит (если остались правки)**

```bash
git add -A
git commit -m "chore: post-rollout adjustments"
```

---

## Self-review

**Spec coverage:**
- Hero (подзаг, CTA, бейдж, proof-bar) → Task 5 ✓
- Cases без метрик, типографические обложки → Task 6 ✓
- Middle CTA → Task 7 ✓
- Sticky mobile CTA → Task 8 ✓
- LeadForm + `/api/lead` + Telegram-уведомление → Tasks 3-4 ✓
- PostHog + Я.Метрика + события → Tasks 1, 2, 9, 10 ✓
- Env-переменные документированы → Task 2 ✓
- Out-of-scope (отзывы, переверстка, A/B) — не запланированы ✓

**Placeholders:** искал «TBD/TODO/similar to» — нет. Все code-блоки конкретны.

**Type consistency:** `track(event, props?)` используется везде с одной сигнатурой. `LeadRequest` поля (`name`, `business`, `contact`) совпадают между роутом и формой. ID Я.Метрики `106695724` — один и тот же в `YandexMetrika.tsx` и `lib/analytics.ts`.
