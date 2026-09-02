# Главная «Разворот» + VSL — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переписать главную vladlyamin.ru под утверждённый макет «Разворот» (серифы + лайм, продукты как оглавление), обновить шапку, снять продукт `ai-os`, добавить VSL-видео в страницы продуктов.

**Architecture:** Новая главная — `app/page.tsx` + scoped-стили `app/razvorot.css` с префиксом `.rz-`; старые `bento-*` стили не трогаем, они нужны /products и /about. Шапка перестраивается в `components/studio/StudioNav.tsx` и стилизуется в `razvorot.css` (применяется глобально). VSL — поле `vsl` в `lib/products.ts` и клиентский компонент-фасад `components/products/Vsl.tsx`. Шрифты самохостятся в `public/fonts` (Google Fonts недоступен при сборке на VPS в России).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (только токены), CSS-переходы + существующий `BentoReveal` (`[data-studio-reveal]` → `.is-visible`), PostHog через `lib/analytics.track`.

**Spec:** `docs/superpowers/specs/2026-09-02-razvorot-home-redesign-design.md`

## Global Constraints

- Лайм `#C8F04C` только как заливка. Никогда как цвет текста.
- Радиус 0, теней нет, эмодзи нет, восклицательных знаков в копирайте нет, обращение на «ты».
- Шрифты: Cormorant Garamond (display), Golos Text (body), JetBrains Mono (подписи; уже есть `@font-face "JetBrains Mono"` в `app/studio.css`).
- Сборка на VPS без доступа к Google Fonts: все шрифты кладутся в `public/fonts` как woff2, никакого `next/font/google`.
- Слова «внедрение», «команда», «встраиваю» в новых текстах не используются. Позиционирование: личная система работы на Claude, гайды, консультации, аудит.
- Выбранные анимации: строки продуктов 1a (сдвиг + лайм-полоса слева), кнопки 2a (перекраска в лайм), ссылки шапки 3b (лайм-плашка снизу вверх), карточки блога 4b (толстая лайм-линия), hero 5c (шторка слева направо, потом маркер), остальные секции — мягко снизу через `[data-studio-reveal]`.
- `prefers-reduced-motion: reduce` отключает все анимации.
- Проверка после каждой задачи: `npm run lint` и `npx tsc --noEmit` без ошибок. Тестового раннера в проекте нет — проверка визуальная в браузере.
- Коммиты небольшие, сообщение по образцу репозитория (`feat(home): …`, `chore: …`), с трейлером `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

### Task 1: Самохостинг шрифтов Cormorant Garamond и Golos Text

**Files:**
- Create: `public/fonts/cormorant-{400,500,400i,500i}-{cyrillic,latin}.woff2`, `public/fonts/golos-{400,500,600}-{cyrillic,latin}.woff2`
- Create: `app/razvorot.css` (пока только `@font-face` и токены)
- Modify: `app/layout.tsx` (импорт css)

**Interfaces:**
- Produces: CSS-переменные `--rz-serif`, `--rz-sans`, `--rz-mono`, `--rz-ink`, `--rz-mute`, `--rz-line`, `--rz-lime`, `--rz-paper`, доступные на `:root`.

- [ ] **Step 1: Скачать woff2 с Google Fonts (с Mac, там доступ есть)**

```bash
cd public/fonts
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
css=$(curl -sA "$UA" 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Golos+Text:wght@400;500;600&display=swap')
echo "$css" > /tmp/rz-fonts.css
# Вытащить url для каждой пары (семейство, начертание, subset) — cyrillic и latin блоки идут с комментарием /* cyrillic */ и /* latin */.
python3 - <<'PY'
import re,subprocess
css=open('/tmp/rz-fonts.css').read()
blocks=re.findall(r'/\* (\w+) \*/\s*@font-face \{(.*?)\}',css,re.S)
for subset,body in blocks:
    if subset not in ('cyrillic','latin'): continue
    fam=re.search(r"font-family: '([^']+)'",body).group(1)
    style=re.search(r'font-style: (\w+)',body).group(1)
    weight=re.search(r'font-weight: (\d+)',body).group(1)
    url=re.search(r'url\((https://[^)]+\.woff2)\)',body).group(1)
    short={'Cormorant Garamond':'cormorant','Golos Text':'golos'}[fam]
    name=f"{short}-{weight}{'i' if style=='italic' else ''}-{subset}.woff2"
    subprocess.run(['curl','-s','-o',name,url],check=True); print(name)
PY
ls -la cormorant-* golos-*
```

Expected: 14 файлов (8 Cormorant, 6 Golos), каждый от 15 до 60 КБ.

- [ ] **Step 2: Создать `app/razvorot.css` с @font-face и токенами**

```css
/* «Разворот» — стили главной и шапки. Префикс .rz-. Спека:
   docs/superpowers/specs/2026-09-02-razvorot-home-redesign-design.md */

@font-face { font-family: "Cormorant Garamond"; font-weight: 400; font-style: normal; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/cormorant-400-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 400; font-style: normal; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/cormorant-400-latin.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 500; font-style: normal; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/cormorant-500-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 500; font-style: normal; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/cormorant-500-latin.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 400; font-style: italic; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/cormorant-400i-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 400; font-style: italic; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/cormorant-400i-latin.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 500; font-style: italic; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/cormorant-500i-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Cormorant Garamond"; font-weight: 500; font-style: italic; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/cormorant-500i-latin.woff2") format("woff2"); }
@font-face { font-family: "Golos Text"; font-weight: 400; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/golos-400-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Golos Text"; font-weight: 400; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/golos-400-latin.woff2") format("woff2"); }
@font-face { font-family: "Golos Text"; font-weight: 500; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/golos-500-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Golos Text"; font-weight: 500; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/golos-500-latin.woff2") format("woff2"); }
@font-face { font-family: "Golos Text"; font-weight: 600; font-display: swap; unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; src: url("/fonts/golos-600-cyrillic.woff2") format("woff2"); }
@font-face { font-family: "Golos Text"; font-weight: 600; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; src: url("/fonts/golos-600-latin.woff2") format("woff2"); }

:root {
  --rz-paper: #ffffff;
  --rz-ink: #15161a;
  --rz-mute: #6b6e78;
  --rz-line: #e6e7ea;
  --rz-lime: #c8f04c;
  --rz-serif: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --rz-sans: "Golos Text", "Helvetica Neue", Arial, sans-serif;
  --rz-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  --rz-ease: cubic-bezier(.2, .8, .2, 1);
  --rz-ease-in-out: cubic-bezier(.7, 0, .2, 1);
}
```

- [ ] **Step 3: Подключить css в layout**

В `app/layout.tsx` после `import "./personal.css";` добавить `import "./razvorot.css";`.

- [ ] **Step 4: Проверить, что шрифты отдаются**

Run: `npm run dev` (через preview_start) и `curl -sI http://localhost:3000/fonts/golos-400-cyrillic.woff2 | head -1`
Expected: `HTTP/1.1 200 OK`. `npm run lint` — без ошибок.

- [ ] **Step 5: Commit**

```bash
git add public/fonts/cormorant-* public/fonts/golos-* app/razvorot.css app/layout.tsx
git commit -m "feat(design): самохостинг Cormorant Garamond и Golos Text, токены «Разворот»"
```

---

### Task 2: Снять продукт `ai-os` (AI в работе команды)

**Files:**
- Modify: `lib/products.ts` (удалить объект `id: "ai-os"`, строки ~248-290; поменять `nextStep` аудита, строки ~215-219)
- Modify: `components/bento/ProductShowcase.tsx` (убрать `aiOs`, плитку 5 и запись `"ai-os"` в `bridges`, тексты «шаг N из 4» → «из 3»)
- Modify: `components/desk/DeskServices.tsx:10` (убрать `{ id: "ai-os" }`)
- Modify: `next.config.ts` (redirect)
- Modify: `app/page.tsx` — не трогать здесь, главная целиком переписывается в Task 5

**Interfaces:**
- Produces: `products` без `ai-os`; `getProduct("ai-os")` возвращает `undefined`.

- [ ] **Step 1: Удалить объект продукта и переключить nextStep аудита**

В `lib/products.ts` удалить весь элемент массива с `id: "ai-os"`. У продукта `audit` заменить `nextStep` на:

```ts
    nextStep: {
      slug: "consultation",
      label: "Дальше — консультация 1:1",
      text: "План из аудита разбираем вместе: час на то, чтобы решить, что настраивать первым и как это сделать без разработчика.",
    },
```

- [ ] **Step 2: Вычистить витрину и desk**

В `components/bento/ProductShowcase.tsx`: удалить строку `const aiOs = getProduct("ai-os");`, удалить JSX-блок `{aiOs && (<ProductTile product={aiOs} …/>)}` целиком, удалить ключ `"ai-os"` из `bridges`, заменить в `bridges` тексты: `guide: "шаг 1 из 3 · широкий вход"`, `"codex-content-os": "шаг 1 из 3 · узкая задача: контент"`, `consultation: "шаг 2 из 3 · дальше — AI-аудит"`, `audit: "шаг 3 из 3 · план на руках"`.
В `components/desk/DeskServices.tsx` удалить строку `{ id: "ai-os" },`.

- [ ] **Step 3: Редирект старого адреса**

В `next.config.ts` в массив `redirects()` первым элементом добавить:

```ts
      { source: "/products/ai-os", destination: "/products/audit", permanent: true },
```

- [ ] **Step 4: Проверить**

Run: `grep -rn "ai-os" app components lib --include='*.ts' --include='*.tsx'`
Expected: только строка в `next.config.ts`.
Run: `npx tsc --noEmit && npm run lint`
Expected: без ошибок. В браузере `http://localhost:3000/products/ai-os` → 308 на `/products/audit`, `/products` без карточки за 150 000 ₽.

- [ ] **Step 5: Commit**

```bash
git add lib/products.ts components/bento/ProductShowcase.tsx components/desk/DeskServices.tsx next.config.ts
git commit -m "feat(products): снять «AI в работе команды», редирект на аудит"
```

---

### Task 3: VSL-видео в продуктах

**Files:**
- Modify: `lib/products.ts` (тип `Product`)
- Create: `components/products/Vsl.tsx`
- Modify: `app/products/products.css` (стили `.bento-vsl`)
- Modify: `app/products/[slug]/page.tsx` (рендер + VideoObject в schema)

**Interfaces:**
- Produces: `type ProductVsl = { embedUrl: string; poster: string; title: string; ratio?: "16/9" | "9/16" }`, поле `Product.vsl?: ProductVsl`, компонент `<Vsl product={product} />`.

- [ ] **Step 1: Тип в каталоге**

В `lib/products.ts` после `ProductNextStep` добавить:

```ts
// VSL-видео над описанием продукта. Хостинг любой — Kinescope, VK Video,
// YouTube: embedUrl это src для iframe. poster лежит в /public.
export type ProductVsl = {
  embedUrl: string;
  poster: string;
  title: string;
  ratio?: "16/9" | "9/16";
};
```

и в тип `Product` после `cover?:` добавить `vsl?: ProductVsl;`.

- [ ] **Step 2: Компонент-фасад**

Создать `components/products/Vsl.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { track } from "@/lib/analytics";

/**
 * VSL над описанием продукта. Постер и кнопка «Смотреть»; iframe грузится
 * только по клику, чтобы тяжёлый плеер не попадал в first paint.
 */
export function Vsl({ product }: { product: Product }) {
  const [playing, setPlaying] = useState(false);
  const vsl = product.vsl;
  if (!vsl) return null;

  const ratio = vsl.ratio ?? "16/9";
  const src = vsl.embedUrl.includes("?")
    ? `${vsl.embedUrl}&autoplay=1`
    : `${vsl.embedUrl}?autoplay=1`;

  return (
    <div className="bento-vsl" style={{ aspectRatio: ratio }} data-studio-reveal>
      {playing ? (
        <iframe
          src={src}
          title={vsl.title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="bento-vsl-poster"
          onClick={() => {
            track("vsl_play", { product: product.id });
            setPlaying(true);
          }}
          aria-label={`Смотреть: ${vsl.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vsl.poster} alt="" loading="eager" />
          <span className="bento-vsl-play">
            <span className="bento-mono">Смотреть</span>
            <strong>{vsl.title}</strong>
          </span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Стили**

В конец `app/products/products.css`:

```css
/* VSL над описанием продукта */
.bento-vsl { position: relative; width: 100%; background: #111; overflow: hidden; }
.bento-vsl iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.bento-vsl-poster { position: absolute; inset: 0; width: 100%; padding: 0; border: 0; background: none; cursor: pointer; text-align: left; }
.bento-vsl-poster img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .8s cubic-bezier(.2,.8,.2,1); }
.bento-vsl-poster:hover img { transform: scale(1.03); }
.bento-vsl-play { position: absolute; left: 24px; bottom: 24px; display: flex; flex-direction: column; gap: 6px; padding: 16px 20px; background: #fff; color: #111; max-width: min(70%, 420px); }
.bento-vsl-play .bento-mono { color: #111; }
.bento-vsl-play .bento-mono::before { content: ""; display: inline-block; width: 0; height: 0; border-left: 9px solid #111; border-top: 6px solid transparent; border-bottom: 6px solid transparent; margin-right: 10px; vertical-align: -1px; }
.bento-vsl-play strong { font-weight: 500; font-size: 1.05rem; line-height: 1.25; }
.bento-vsl-poster:focus-visible { outline: 2px solid var(--color-lime); outline-offset: -2px; }
@media (max-width: 760px) { .bento-vsl-play { left: 12px; bottom: 12px; right: 12px; max-width: none; } }
```

- [ ] **Step 4: Рендер на странице продукта и schema**

В `app/products/[slug]/page.tsx`:
1. Импорт: `import { Vsl } from "@/components/products/Vsl";`
2. В hero-секции заменить блок `{product.cover && (<img … />)}` на:

```tsx
            {product.vsl ? (
              <div className="bento-col-12" style={{ transitionDelay: "120ms" }}>
                <Vsl product={product} />
              </div>
            ) : (
              product.cover && (
                <img
                  className="bento-tile bento-col-12 bento-product-cover"
                  src={product.cover.src}
                  width={product.cover.width}
                  height={product.cover.height}
                  alt=""
                  data-studio-reveal
                  style={{
                    transitionDelay: "120ms",
                    aspectRatio: `${product.cover.width} / ${product.cover.height}`,
                  }}
                />
              )
            )}
```

3. В `productSchema` в возвращаемый объект перед `offers: offer,` добавить:

```ts
    ...(product.vsl
      ? {
          video: {
            "@type": "VideoObject",
            name: product.vsl.title,
            thumbnailUrl: `${siteUrl}${product.vsl.poster}`,
            embedUrl: product.vsl.embedUrl,
            uploadDate: "2026-09-02",
          },
        }
      : {}),
```

- [ ] **Step 5: Проверить на временных данных**

Временно добавить гайду `vsl: { embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", poster: "/claude-guide-cover.webp", title: "Как устроен гайд за 4 минуты" }`, открыть `/products/guide`: постер с кнопкой, по клику iframe, в консоли нет ошибок, в PostHog-дебаге событие `vsl_play`. Затем временный `vsl` **убрать** (реальную ссылку даёт Влад).
Run: `npx tsc --noEmit && npm run lint` — без ошибок.

- [ ] **Step 6: Commit**

```bash
git add lib/products.ts components/products/Vsl.tsx app/products/products.css "app/products/[slug]/page.tsx"
git commit -m "feat(products): VSL-видео над описанием продукта, iframe по клику"
```

---

### Task 4: Шапка «Разворот»

**Files:**
- Modify: `components/studio/StudioNav.tsx`
- Modify: `app/razvorot.css` (стили `.rz-nav*`)

**Interfaces:**
- Produces: `StudioNav` с классами `rz-nav-shell`, `rz-nav`, `rz-nav-links`, `rz-btn`, мобильное меню `rz-menu`.

- [ ] **Step 1: Переписать компонент**

Заменить содержимое `components/studio/StudioNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#products", label: "Продукты" },
  { href: "/about", label: "Обо мне" },
  { href: "/blog", label: "Блог" },
  { href: "/audit", label: "Аудит" },
];

export default function StudioNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("rz-menu-open", open);
    return () => document.body.classList.remove("rz-menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="rz-nav-shell">
        <nav className="rz-nav" aria-label="Основная навигация">
          <Link className="rz-brand" href="/" aria-label="Влад Лямин — на главную" onClick={close}>
            Влад Лямин
          </Link>

          <div className="rz-nav-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={close}>
                {link.label}
              </Link>
            ))}
          </div>

          <Link className="rz-btn rz-btn--solid rz-nav-cta" href="/products/guide" onClick={close}>
            Начать с гайда
          </Link>

          <button
            className={`rz-menu-toggle ${open ? "is-open" : ""}`}
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div className={`rz-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={close}>
            {link.label}
          </Link>
        ))}
        <Link className="rz-btn rz-btn--solid" href="/products/guide" onClick={close}>
          Начать с гайда
        </Link>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Стили шапки, кнопок и мобильного меню**

В `app/razvorot.css` добавить:

```css
/* ===== Кнопки (2a: перекраска в лайм) ===== */
.rz-btn {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 13px 24px; border: 1px solid var(--rz-ink);
  font-family: var(--rz-sans); font-size: 15px; font-weight: 500; line-height: 1;
  color: var(--rz-ink); background: var(--rz-paper); text-decoration: none;
  transition: background .3s, color .3s, border-color .3s;
}
.rz-btn:hover { background: var(--rz-ink); color: #fff; }
.rz-btn--solid { background: var(--rz-ink); color: #fff; }
.rz-btn--solid:hover { background: var(--rz-lime); border-color: var(--rz-lime); color: var(--rz-ink); }
.rz-btn:focus-visible { outline: 2px solid var(--rz-lime); outline-offset: 3px; }

/* ===== Шапка ===== */
.rz-nav-shell {
  position: sticky; top: 0; z-index: 60;
  background: rgba(255,255,255,.9); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--rz-line);
}
.rz-nav {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  max-width: 1240px; height: 72px; margin: 0 auto; padding: 0 40px;
}
.rz-brand { font-family: var(--rz-serif); font-style: italic; font-size: 24px; color: var(--rz-ink); text-decoration: none; }
.rz-nav-links { display: flex; gap: 8px; }
.rz-nav-links a {
  position: relative; z-index: 0; padding: 6px 10px;
  font-family: var(--rz-sans); font-size: 15px; color: var(--rz-ink); text-decoration: none;
}
/* 3b: лайм-плашка поднимается снизу */
.rz-nav-links a::before {
  content: ""; position: absolute; inset: 0; z-index: -1; background: var(--rz-lime);
  transform: scaleY(0); transform-origin: bottom; transition: transform .3s var(--rz-ease);
}
.rz-nav-links a:hover::before, .rz-nav-links a:focus-visible::before { transform: scaleY(1); }
.rz-menu-toggle { display: none; }

.rz-menu {
  position: fixed; inset: 72px 0 0 0; z-index: 55; background: var(--rz-paper);
  display: flex; flex-direction: column; gap: 4px; padding: 32px 22px;
  transform: translateY(-8px); opacity: 0; pointer-events: none; transition: opacity .3s, transform .3s var(--rz-ease);
}
.rz-menu.is-open { opacity: 1; transform: none; pointer-events: auto; }
.rz-menu > a:not(.rz-btn) { font-family: var(--rz-serif); font-size: 40px; line-height: 1.1; padding: 12px 0; border-bottom: 1px solid var(--rz-line); color: var(--rz-ink); text-decoration: none; }
.rz-menu > .rz-btn { margin-top: 24px; align-self: flex-start; }
body.rz-menu-open { overflow: hidden; }

@media (max-width: 900px) {
  .rz-nav { padding: 0 22px; height: 64px; }
  .rz-nav-links, .rz-nav-cta { display: none; }
  .rz-menu { top: 64px; }
  .rz-menu-toggle {
    display: grid; place-items: center; gap: 6px; width: 44px; height: 44px;
    border: 0; background: none; padding: 0; cursor: pointer;
  }
  .rz-menu-toggle span { display: block; width: 22px; height: 1.5px; background: var(--rz-ink); transition: transform .3s var(--rz-ease); }
  .rz-menu-toggle.is-open span:first-child { transform: translateY(3.75px) rotate(45deg); }
  .rz-menu-toggle.is-open span:last-child { transform: translateY(-3.75px) rotate(-45deg); }
}
@media (prefers-reduced-motion: reduce) {
  .rz-btn, .rz-nav-links a::before, .rz-menu, .rz-menu-toggle span { transition: none; }
}
```

- [ ] **Step 3: Убрать отступ под старую плавающую шапку**

Старая шапка была `position: fixed`, и страницы компенсировали её верхним отступом. Найти: `grep -n "padding-top\|margin-top" app/studio.css | sed -n 1,20p` и в `.studio-main` (строка ~98-104 `app/studio.css`) убрать верхний отступ, если он там задан под 74px шапки. Проверить визуально /products, /about, /blog, /audit: контент не должен ни прятаться под шапку, ни оставлять лишнюю дыру.

- [ ] **Step 4: Проверить**

Run: `npx tsc --noEmit && npm run lint`. В браузере на 1440: ссылки с лайм-плашкой на ховере, кнопка «Начать с гайда» становится лаймовой. На 375: бургер открывает меню, body не скроллится, ссылки закрывают меню.

- [ ] **Step 5: Commit**

```bash
git add components/studio/StudioNav.tsx app/razvorot.css app/studio.css
git commit -m "feat(nav): шапка «Разворот» — Продукты, Обо мне, Блог, Аудит"
```

---

### Task 5: Главная страница «Разворот»

**Files:**
- Modify: `app/page.tsx` (полная замена)
- Modify: `app/razvorot.css` (секции главной)
- Modify: `components/bento/StickyGuideCta.tsx` — не трогать, переиспользуется

**Interfaces:**
- Consumes: `getPublishedPosts()` из `lib/posts` (поля `slug, title, published_at, tags`), `getProduct(id)` из `lib/products`, `TrackedLink` из `components/bento/TrackedLink`, `StickyGuideCta`, классы `.rz-btn`.

- [ ] **Step 1: Переписать `app/page.tsx`**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getProduct, products } from "@/lib/products";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { StickyGuideCta } from "@/components/bento/StickyGuideCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// Порядок витрины на главной. Тип и подпись под ценой — здесь, а не в
// каталоге: это подача главной, у /products своя.
const showcase: { id: string; kind: string; note: string }[] = [
  { id: "guide", kind: "Гайд", note: "PDF · мгновенно" },
  { id: "codex-content-os", kind: "Гайд", note: "PDF + код" },
  { id: "consultation", kind: "1:1", note: "60 минут · онлайн" },
  { id: "audit", kind: "Аудит", note: "2 недели" },
  { id: "course", kind: "Курс", note: "лист ожидания" },
];

const facts = [
  { n: "50+", text: "человек научил работать с Claude" },
  { n: "40+", text: "систем собрал руками" },
  { n: "2022", text: "с этого года работаю с AI каждый день" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function HomePage() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  const guide = getProduct("guide");

  return (
    <main className="rz">
      {/* 1. Hero — 5c: шторка слева направо, потом лайм-маркер под «личную». */}
      <header className="rz-hero" id="top">
        <div className="rz-wrap rz-hero-grid">
          <div>
            <p className="rz-mono rz-hero-eyebrow">Личная AI-система · обучение · консультации</p>
            <h1 className="rz-h1">
              Помогаю собрать <span className="rz-mark">личную</span> систему работы на&nbsp;Claude
            </h1>
            <p className="rz-lead rz-hero-lead">
              Гайды, консультации и аудит для тех, кто хочет закрывать одному задачи,
              под которые обычно нанимают команду.
            </p>
            <div className="rz-hero-acts">
              <TrackedLink href="#products" event="hero_cta_click" className="rz-btn rz-btn--solid">
                Смотреть продукты
              </TrackedLink>
              <Link href="/about" className="rz-btn">Кто я</Link>
            </div>
          </div>
          <aside className="rz-hero-aside">
            {facts.map((f) => (
              <p key={f.n}><strong>{f.n}</strong>{f.text}</p>
            ))}
          </aside>
        </div>
      </header>

      {/* 2. Продукты — оглавление. 1a: сдвиг вправо + лайм-полоса слева. */}
      <section className="rz-section" id="products">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Продукты</h2>
            <p>Четыре формата. Начать можно с любого, дальше идти необязательно.</p>
          </div>
          <div className="rz-index">
            {showcase.map((item, i) => {
              const p = getProduct(item.id);
              if (!p) return null;
              const soon = p.price === null;
              return (
                <TrackedLink
                  key={p.id}
                  href={`/products/${p.id}`}
                  event="product_tile_click"
                  eventProps={{ product: p.id, position: i + 1, section: "home_index" }}
                  className={`rz-row ${soon ? "rz-row--soon" : ""}`}
                >
                  <span className="rz-mono">{item.kind}</span>
                  <h3>{p.title}</h3>
                  <span className="rz-row-desc">{p.tagline}</span>
                  <span className="rz-row-price">
                    {p.priceLabel}
                    <small>{item.note}</small>
                  </span>
                </TrackedLink>
              );
            })}
          </div>
          <p className="rz-more" data-studio-reveal>
            <Link href="/products" className="rz-link">Все форматы подробно</Link>
          </p>
        </div>
      </section>

      {/* 3. Обо мне */}
      <section className="rz-section rz-about" id="about">
        <div className="rz-wrap rz-about-grid">
          <div className="rz-portrait" data-studio-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portrait-editorial.jpg" alt="Влад Лямин" width="1012" height="1350" loading="lazy" />
          </div>
          <div>
            <p className="rz-mono" data-studio-reveal>Обо мне</p>
            <h2 className="rz-h2" data-studio-reveal>Четвёртый год работаю с Claude каждый день</h2>
            <p className="rz-thesis" data-studio-reveal>
              Не внедряю AI в чужие команды. Показываю одному человеку, как собрать
              систему, которая работает без команды.
            </p>
            <p className="rz-lead" data-studio-reveal>
              Пишу гайды, провожу консультации и аудиты. Всё, что советую, сначала
              проверяю на себе: этот сайт, блог и контент к нему собирает система,
              о которой я рассказываю.
            </p>
            <p data-studio-reveal>
              <Link href="/about" className="rz-btn">Подробнее обо мне</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 4. Блог — 4b: толстая лайм-линия под карточкой. */}
      {posts.length > 0 && (
        <section className="rz-section" id="blog">
          <div className="rz-wrap">
            <div className="rz-sec-head" data-studio-reveal>
              <h2 className="rz-h2">Блог</h2>
              <p>Заметки о Claude и Claude Code. Что сработало, что нет и сколько стоило.</p>
            </div>
            <div className="rz-posts">
              {posts.map((post, i) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="rz-post"
                  data-studio-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="rz-mono">
                    {formatDate(post.published_at)} · {(post.tags ?? [])[0] ?? "Claude"}
                  </span>
                  <h3>{post.title}</h3>
                  <span className="rz-post-line" />
                </Link>
              ))}
            </div>
            <p className="rz-more" data-studio-reveal>
              <Link href="/blog" className="rz-link">Все статьи</Link>
            </p>
          </div>
        </section>
      )}

      {/* 5. Финальный CTA */}
      <section className="rz-section rz-cta">
        <div className="rz-wrap">
          <p className="rz-mono" data-studio-reveal>Первый шаг</p>
          <h2 className="rz-h2 rz-cta-title" data-studio-reveal>
            Начни с гайда <span className="rz-mark">за {guide?.priceLabel ?? "990 ₽"}</span>
          </h2>
          <p className="rz-lead" data-studio-reveal>
            Самый дешёвый способ проверить, встроится ли Claude в твою работу.
            Файл приходит сразу после оплаты.
          </p>
          <p data-studio-reveal>
            <TrackedLink
              href="/products/guide"
              event="product_tile_click"
              eventProps={{ product: "guide", position: 1, section: "final" }}
              className="rz-btn rz-btn--solid"
            >
              Получить гайд
            </TrackedLink>
          </p>
        </div>
      </section>

      <StickyGuideCta />
    </main>
  );
}
```

Если `products` не используется — убрать из импорта (lint упадёт на неиспользуемом импорте).

- [ ] **Step 2: Стили секций в `app/razvorot.css`**

```css
/* ===== Главная ===== */
.rz { font-family: var(--rz-sans); color: var(--rz-ink); background: var(--rz-paper); font-size: 17px; line-height: 1.55; }
.rz-wrap { max-width: 1240px; margin: 0 auto; padding: 0 40px; }
.rz-mono { font-family: var(--rz-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--rz-mute); }
.rz-h1 { font-family: var(--rz-serif); font-weight: 400; font-size: clamp(56px, 7.4vw, 108px); line-height: .98; letter-spacing: -.015em; margin: 0 0 40px; text-wrap: balance; }
.rz-h2 { font-family: var(--rz-serif); font-weight: 400; font-size: clamp(40px, 4.6vw, 64px); line-height: 1.02; letter-spacing: -.01em; margin: 0; text-wrap: balance; }
.rz-lead { font-size: 20px; color: var(--rz-mute); max-width: 560px; margin: 0; }
.rz-link { color: var(--rz-ink); text-decoration: none; background-image: linear-gradient(var(--rz-ink), var(--rz-ink)); background-size: 100% 1px; background-repeat: no-repeat; background-position: 0 100%; transition: background-size .35s var(--rz-ease-in-out); }
.rz-link:hover { background-size: 0 1px; }
.rz-more { margin: 40px 0 0; }
.rz-section { padding: 120px 0; border-top: 1px solid var(--rz-line); }
.rz-sec-head { display: grid; grid-template-columns: 260px 1fr; gap: 40px; margin-bottom: 64px; align-items: baseline; }
.rz-sec-head p { margin: 0; max-width: 560px; color: var(--rz-mute); }

/* лайм-маркер за словом; на hero он рисуется после шторки (5c) */
.rz-mark { background-image: linear-gradient(var(--rz-lime), var(--rz-lime)); background-repeat: no-repeat; background-size: 100% 42%; background-position: 0 82%; padding: 0 .06em; }

/* ===== Hero (5c) ===== */
.rz-hero { padding: 140px 0 120px; }
.rz-hero-grid { display: grid; grid-template-columns: 1fr 360px; gap: 80px; align-items: end; }
.rz-hero-eyebrow { margin: 0 0 28px; opacity: 0; animation: rz-fade 1s .2s forwards; }
.rz-hero .rz-h1 { clip-path: inset(0 100% 0 0); animation: rz-clip 1.1s .1s var(--rz-ease-in-out) forwards; }
.rz-hero .rz-mark { background-size: 0 42%; animation: rz-mark 1s 1s var(--rz-ease-in-out) forwards; }
.rz-hero-lead { margin-bottom: 44px; opacity: 0; animation: rz-fade 1s .9s forwards; }
.rz-hero-acts { display: flex; gap: 18px; align-items: center; opacity: 0; animation: rz-fade 1s 1.1s forwards; }
.rz-hero-aside { border-left: 1px solid var(--rz-line); padding-left: 36px; opacity: 0; animation: rz-fade 1s 1.3s forwards; }
.rz-hero-aside p { margin: 0 0 22px; font-size: 15px; color: var(--rz-mute); }
.rz-hero-aside strong { display: block; font-family: var(--rz-serif); font-size: 44px; font-weight: 500; line-height: 1; color: var(--rz-ink); margin-bottom: 6px; }
@keyframes rz-fade { to { opacity: 1; } }
@keyframes rz-clip { to { clip-path: inset(0 0 0 0); } }
@keyframes rz-mark { to { background-size: 100% 42%; } }

/* ===== Продукты (1a) ===== */
.rz-index { border-top: 1px solid var(--rz-line); }
.rz-row {
  position: relative; display: grid; grid-template-columns: 70px 1fr 1fr 160px; gap: 32px; align-items: center;
  padding: 34px 0; border-bottom: 1px solid var(--rz-line); color: var(--rz-ink); text-decoration: none;
  transition: padding-left .45s var(--rz-ease);
}
.rz-row::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--rz-lime); transform: scaleY(0); transition: transform .45s var(--rz-ease); }
.rz-row:hover { padding-left: 24px; }
.rz-row:hover::before { transform: scaleY(1); }
.rz-row h3 { font-family: var(--rz-serif); font-size: 34px; font-weight: 400; line-height: 1.05; margin: 0; }
.rz-row-desc { color: var(--rz-mute); font-size: 15px; max-width: 420px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.rz-row-price { text-align: right; font-family: var(--rz-serif); font-size: 28px; font-weight: 500; font-variant-numeric: tabular-nums; }
.rz-row-price small { display: block; font-family: var(--rz-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--rz-mute); font-weight: 400; margin-top: 4px; }
.rz-row--soon h3, .rz-row--soon .rz-row-price { color: var(--rz-mute); }
.rz-row:focus-visible { outline: 2px solid var(--rz-lime); outline-offset: -2px; }

/* ===== Обо мне ===== */
.rz-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.rz-portrait { aspect-ratio: 4 / 5; overflow: hidden; background: #ececef; }
.rz-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(1) contrast(1.05); }
.rz-about .rz-h2 { margin: 24px 0 28px; }
.rz-thesis { font-family: var(--rz-serif); font-style: italic; font-size: 28px; line-height: 1.25; margin: 0 0 18px; max-width: 520px; }
.rz-about .rz-lead { font-size: 17px; margin-bottom: 28px; }

/* ===== Блог (4b) ===== */
.rz-posts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
.rz-post { display: flex; flex-direction: column; color: var(--rz-ink); text-decoration: none; }
.rz-post h3 { font-family: var(--rz-serif); font-size: 28px; font-weight: 400; line-height: 1.1; margin: 14px 0 auto; text-wrap: balance; }
.rz-post-line { position: relative; display: block; height: 6px; background: var(--rz-line); margin-top: 22px; overflow: hidden; }
.rz-post-line::after { content: ""; position: absolute; inset: 0; background: var(--rz-lime); transform: scaleX(0); transform-origin: left; transition: transform .5s var(--rz-ease-in-out); }
.rz-post:hover .rz-post-line::after { transform: scaleX(1); }

/* ===== CTA ===== */
.rz-cta { text-align: center; padding: 140px 0; }
.rz-cta .rz-mono { margin: 0 0 20px; }
.rz-cta-title { font-size: clamp(44px, 6vw, 84px); margin-bottom: 36px; }
.rz-cta .rz-lead { margin: 0 auto 40px; }

@media (max-width: 900px) {
  .rz-wrap { padding: 0 22px; }
  .rz-hero { padding: 80px 0 70px; }
  .rz-hero-grid, .rz-about-grid, .rz-sec-head { grid-template-columns: 1fr; gap: 36px; }
  .rz-hero-aside { border-left: 0; padding-left: 0; display: flex; gap: 28px; }
  .rz-hero-aside p { flex: 1; }
  .rz-row { grid-template-columns: 1fr; gap: 10px; }
  .rz-row-price { text-align: left; }
  .rz-posts { grid-template-columns: 1fr; gap: 36px; }
  .rz-section { padding: 80px 0; }
  .rz-cta { padding: 100px 0; }
}
@media (prefers-reduced-motion: reduce) {
  .rz-hero-eyebrow, .rz-hero-lead, .rz-hero-acts, .rz-hero-aside { animation: none; opacity: 1; }
  .rz-hero .rz-h1 { animation: none; clip-path: none; }
  .rz-hero .rz-mark { animation: none; background-size: 100% 42%; }
  .rz-row, .rz-row::before, .rz-post-line::after, .rz-link { transition: none; }
}
```

- [ ] **Step 3: Проверить**

Run: `npx tsc --noEmit && npm run lint`.
В браузере на 1440: заголовок раскрывается шторкой, потом лайм под «личную»; строки продуктов сдвигаются и показывают полосу; линии под карточками блога заливаются лаймом; 5 строк продуктов, среди них нет «AI в работе команды». На 375: одна колонка, цены слева, ничего не вылезает за экран (`document.documentElement.scrollWidth === innerWidth`). Консоль без ошибок. Скриншоты обоих размеров сохранить в scratchpad и показать Владу.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/razvorot.css
git commit -m "feat(home): главная «Разворот» — hero, оглавление продуктов, обо мне, блог, CTA"
```

---

### Task 6: Футер, метаданные и schema под новое позиционирование

**Files:**
- Modify: `components/studio/StudioFooter.tsx`
- Modify: `app/layout.tsx` (metadata.title.default, description, personSchema, organizationSchema)

- [ ] **Step 1: Футер**

В `StudioFooter.tsx` заменить заголовок и кнопку:

```tsx
            <p className="bento-footer-title">Собери личную систему работы на Claude</p>
            <div className="bento-footer-cta">
              <Link className="bento-btn" href="/products/guide">
                Начать с гайда <span aria-hidden="true">→</span>
              </Link>
            </div>
```

и в `bento-footer-meta` строку `Влад Лямин / AI для бизнеса` → `Влад Лямин / личная AI-система`, `Работаю лично` оставить. В навигацию футера после «Блог» добавить `<Link href="/audit">Аудит</Link>`.

- [ ] **Step 2: Метаданные и schema в layout**

- `title.default`: `"Влад Лямин — личная система работы на Claude"` (52 символа).
- `description`: `"Гайды, консультации и аудит для тех, кто хочет собрать личную систему работы на Claude и закрывать одному задачи, под которые обычно нанимают команду."`
- `personSchema.description`: `"Помогаю собрать личную систему работы на Claude: гайды, консультации, аудит. 50+ человек обучил, 40+ систем собрал с 2022 года."`
- `personSchema.jobTitle`: `"AI-консультант, автор гайдов по Claude"`.
- `personSchema.knowsAbout` и `organizationSchema.knowsAbout`: `["Claude", "Claude Code", "Личная AI-система", "Обучение работе с AI", "AI-автоматизация для одного человека"]`.
- `organizationSchema.description`: `"Личная практика Влада Лямина: гайды по Claude, консультации один на один и аудит процессов."`
- `openGraph.images[0].alt`: `"Влад Лямин — личная система работы на Claude"`.

- [ ] **Step 3: Проверить**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: сборка проходит. `curl -s http://localhost:3000 | grep -o '<title>[^<]*'` показывает новый заголовок. `grep -rn "внедрени" app/page.tsx app/layout.tsx components/studio` — пусто.

- [ ] **Step 4: Commit**

```bash
git add components/studio/StudioFooter.tsx app/layout.tsx
git commit -m "feat(site): футер, метаданные и schema под личную систему на Claude"
```

---

### Task 7: Финальная проверка и хэндофф

- [ ] **Step 1: Полный прогон**

```bash
npm run lint && npx tsc --noEmit && NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

Expected: без ошибок и предупреждений о неиспользуемых импортах.

- [ ] **Step 2: Визуальный обход**

Открыть в браузере `/`, `/products`, `/products/guide`, `/products/audit`, `/about`, `/blog`, `/audit` на 1440 и 375. Проверить: шапка одинаковая везде, контент не под шапкой, `/products/ai-os` редиректит, консоль чистая. Сделать скриншоты главной (hero, продукты) и отправить Владу через SendUserFile.

- [ ] **Step 3: Сообщить, что осталось на Владе**

Не деплоить без команды. В отчёте перечислить: (1) ссылка и постер для VSL гайда, (2) переписать копирайт /products и /about под обучение (следующий этап, вне плана), (3) деплой по `scripts/deploy.sh` после проверки.
