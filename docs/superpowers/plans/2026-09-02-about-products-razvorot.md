# /about, /products, /products/[slug] «Разворот» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести /about, /products и /products/[slug] на визуальный язык «Разворот» с текстами под позиционирование «личная система на Claude», подключить баннеры консультации и аудита, починить лайм-маркер.

**Architecture:** Страницы остаются серверными компонентами Next.js; стили — только новые `.rz-*` блоки в `app/razvorot.css` (bento-CSS не трогаем). Общие куски выносятся в `components/rz/RzFaq.tsx`; `BuyAction` и `WaitlistForm` переводятся на `.rz-*` классы. Тексты и структура берутся дословно из макетов в `docs/superpowers/mockups/`, данные продуктов — из `lib/products.ts` и `app/products/content.ts`.

**Tech Stack:** Next.js 16 App Router, React 19, CSS в `app/razvorot.css`, глобальный reveal `[data-studio-reveal]` (BentoReveal), `lib/analytics.track`.

**Spec:** `docs/superpowers/specs/2026-09-02-about-products-razvorot-design.md`

## Global Constraints

- Лайм `--rz-lime` только заливкой. Радиус 0, теней нет, эмодзи нет, восклицательных знаков нет, обращение на «ты». Слова «внедрение/внедряю», «команда», «встраиваю» в новых текстах не используются (отрицание «не внедряю… без команды» на /about — утверждённое исключение).
- Тексты страниц — дословно из макетов `docs/superpowers/mockups/2026-09-02-mock-about.html` и `docs/superpowers/mockups/2026-09-02-mock-products.html` (картинки там заменены на `IMAGE`). CSS блоков переносится из `<style>` макетов с переименованием классов в `.rz-*` и заменой переменных на `--rz-*` (`--paper→--rz-paper`, `--ink→--rz-ink`, `--mute→--rz-mute`, `--line→--rz-line`, `--lime→--rz-lime`, `--serif→--rz-serif`, `--sans→--rz-sans`, `--mono→--rz-mono`, `--e→--rz-ease`, `--eio→--rz-ease-in-out`).
- Появление секций — атрибут `data-studio-reveal` на блоках (как на главной), не свой observer. Ховер-анимации: строки 1a, кнопки 2a (уже в `.rz-btn`), блог 4b. `prefers-reduced-motion` отключает переходы новых блоков.
- Уже существующие классы, которые надо переиспользовать, а не дублировать: `.rz`, `.rz-wrap`, `.rz-mono`, `.rz-h1`, `.rz-h2`, `.rz-lead`, `.rz-link`, `.rz-more`, `.rz-section`, `.rz-sec-head`, `.rz-mark`, `.rz-btn`, `.rz-btn--solid`, `.rz-row*` (строка продукта 1a), `.rz-cta`, `.rz-cta-title`.
- Проверка после каждой задачи: `npx tsc --noEmit`, `npm run lint`, `npm run build` без ошибок. Тестов нет, проверка визуальная у контроллера.
- Коммиты небольшие, трейлер `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

### Task 1: Общие элементы — маркер, RzFaq, BuyAction, WaitlistForm, обложки

**Files:**
- Modify: `app/razvorot.css` (`.rz-mark`, keyframe `rz-mark`, reduced-motion; новые блоки `.rz-faq*`, `.rz-wait*`)
- Create: `components/rz/RzFaq.tsx`
- Modify: `app/products/BuyAction.tsx`, `components/products/WaitlistForm.tsx`
- Modify: `lib/products.ts` (cover у consultation и audit)
- Create: `public/consultation-cover.webp`, `public/audit-cover.webp` (из `output/banners/*.png`)

**Interfaces:**
- Produces: `RzFaq({ items: ProductFaq[]; schemaId?: string; eyebrow?: string })` — рендерит `<div class="rz-faq">` из `<details>`; если `schemaId` задан, добавляет `<script type="application/ld+json">` с FAQPage (`@id` = `${SITE_URL}${schemaId}`), как делал `components/FaqSection.tsx`.
- Produces: `BuyAction` с классами `rz-btn rz-btn--solid` (основная) и `rz-link` (Telegram fallback); `WaitlistForm` с классами `rz-wait` (form), `rz-wait-input`, `rz-wait-btn`, `rz-wait-error`, `rz-wait-ok`.
- Produces: `.rz-faq`, `.rz-wait*` CSS; `products[consultation].cover = { src: "/consultation-cover.webp", width: 1440, height: 810 }`, то же для `audit`.

- [ ] **Step 1: Маркер по буквам**

В `app/razvorot.css` заменить правило `.rz-mark { … }` на:

```css
.rz-mark {
  background-image: linear-gradient(var(--rz-lime), var(--rz-lime));
  background-repeat: no-repeat;
  background-size: 100% .66em;
  background-position: 0 .3em;
  padding: 0 .06em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
```

Правило hero `.rz-hero .rz-mark { background-size: 0 42%; … }` → `background-size: 0 .66em;`, keyframe `@keyframes rz-mark { to { background-size: 100% .66em; } }`, в reduced-motion блоке `.rz-hero .rz-mark { … background-size: 100% .66em; }`.

- [ ] **Step 2: RzFaq**

`components/rz/RzFaq.tsx`:

```tsx
import type { ProductFaq } from "@/lib/products";
import { jsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/site";

/**
 * Вопросы-ответы на <details>: без JS, текст остаётся в DOM для краулеров.
 * schemaId (например "/about#faq") добавляет FAQPage-разметку из того же массива.
 */
export function RzFaq({ items, schemaId }: { items: ProductFaq[]; schemaId?: string }) {
  if (items.length === 0) return null;
  const schema = schemaId
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}${schemaId}`,
        inLanguage: "ru",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;
  return (
    <div className="rz-faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      )}
    </div>
  );
}
```

CSS в `app/razvorot.css` (перенос `.faq` из макета):

```css
/* ===== Вопросы ===== */
.rz-faq details { border-bottom: 1px solid var(--rz-line); }
.rz-faq details:first-child { border-top: 1px solid var(--rz-line); }
.rz-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 24px; padding: 22px 0; font-family: var(--rz-serif); font-size: 26px; line-height: 1.15; color: var(--rz-ink); }
.rz-faq summary::-webkit-details-marker { display: none; }
.rz-faq summary::after { content: "+"; font-family: var(--rz-mono); font-size: 22px; color: var(--rz-mute); transition: transform .3s var(--rz-ease); }
.rz-faq details[open] summary::after { transform: rotate(45deg); }
.rz-faq summary:focus-visible { outline: 2px solid var(--rz-lime); outline-offset: 3px; }
.rz-faq details p { margin: 0 0 24px; color: var(--rz-mute); max-width: 640px; }
@media (max-width: 900px) { .rz-faq summary { font-size: 22px; } }
```

- [ ] **Step 3: BuyAction и WaitlistForm на rz-классы**

В `app/products/BuyAction.tsx`: `className="bento-btn"` → `className="rz-btn rz-btn--solid"` (оба места), `className="bento-text-link"` → `className="rz-link"`; обновить комментарий в шапке файла.

В `components/products/WaitlistForm.tsx` заменить Tailwind-классы: `<form … className="rz-wait">`, обёртка полей → `<div className="rz-wait-row">`, `<input … className={"rz-wait-input" + (invalid ? " is-invalid" : "")}>`, кнопка `className="rz-wait-btn"`, сообщение об ошибке валидации `className="rz-wait-error"`, состояние успеха `<p className="rz-wait-ok">`, состояние ошибки API — параграф `rz-wait-error` с существующей ссылкой на Telegram (класс `rz-link`). Тексты не менять, кроме «Вы в списке» → «Ты в списке. Напишу, как только курс будет готов.»

CSS:

```css
/* ===== Лист ожидания ===== */
.rz-wait { display: flex; flex-direction: column; gap: 8px; }
.rz-wait-row { display: flex; border: 1px solid var(--rz-ink); }
.rz-wait-input { flex: 1; min-width: 0; border: 0; padding: 14px 16px; font: inherit; font-size: 15px; background: var(--rz-paper); color: var(--rz-ink); outline: none; }
.rz-wait-input.is-invalid { background: #fff3f0; }
.rz-wait-btn { border: 0; background: var(--rz-ink); color: #fff; padding: 14px 22px; font: inherit; font-size: 15px; font-weight: 500; cursor: pointer; transition: background .3s, color .3s; }
.rz-wait-btn:hover { background: var(--rz-lime); color: var(--rz-ink); }
.rz-wait-btn:disabled { opacity: .6; cursor: default; }
.rz-wait-error { margin: 0; font-size: 14px; color: #b3261e; }
.rz-wait-ok { margin: 0; font-weight: 500; color: var(--rz-ink); }
```

- [ ] **Step 4: Обложки консультации и аудита**

```bash
sips -z 810 1440 output/banners/consultation-cover.png --out /tmp/consultation-1440.png
sips -z 810 1440 output/banners/audit-cover.png --out /tmp/audit-1440.png
cwebp -q 82 /tmp/consultation-1440.png -o public/consultation-cover.webp
cwebp -q 82 /tmp/audit-1440.png -o public/audit-cover.webp
```

Если `cwebp` нет: `npx --yes sharp-cli -i /tmp/consultation-1440.png -o public/consultation-cover.webp -f webp -q 82` (и для audit), либо `python3 -c` с Pillow. Итог: два webp ≤ 200 КБ, 1440×810 (проверить `sips -g pixelWidth -g pixelHeight`). Исходные PNG в `output/banners` в git не добавлять (`output/` в `.gitignore`? если нет — добавить строку `output/`).

В `lib/products.ts` у `consultation` после `meta:` добавить `cover: { src: "/consultation-cover.webp", width: 1440, height: 810 },`, у `audit` — `cover: { src: "/audit-cover.webp", width: 1440, height: 810 },`.

- [ ] **Step 5: Проверить и закоммитить**

`npx tsc --noEmit && npm run lint && npm run build`. `grep -rn "bento-btn\|bento-text-link" app/products/BuyAction.tsx` пусто.

```bash
git add app/razvorot.css components/rz/RzFaq.tsx app/products/BuyAction.tsx components/products/WaitlistForm.tsx lib/products.ts public/consultation-cover.webp public/audit-cover.webp .gitignore
git commit -m "feat(rz): маркер по буквам, RzFaq, кнопки покупки и лист ожидания в стиле «Разворот», обложки консультации и аудита"
```

---

### Task 2: /about

**Files:**
- Modify: `app/about/page.tsx` (полная замена)
- Modify: `app/razvorot.css` (блоки `.rz-about-hero`, `.rz-facts`, `.rz-story`, `.rz-tl`, `.rz-pr`, `.rz-stack`)
- Delete: `components/FaqSection.tsx` (после проверки `grep -rn FaqSection app components` — единственный потребитель был /about)

**Interfaces:**
- Consumes: `RzFaq` из Task 1, классы `.rz-*` главной.

- [ ] **Step 1: Страница**

Переписать `app/about/page.tsx` по макету `docs/superpowers/mockups/2026-09-02-mock-about.html`: `<main className="rz">`, секции в порядке макета, тексты дословно. Соответствие классов: `.hero`→`rz-about-hero` (сетка 1.2fr/.8fr, портрет `rz-portrait` — класс уже есть на главной, картинка `/portrait-editorial.jpg` через `<img>` c `eslint-disable-next-line @next/next/no-img-element`), `.facts`→`rz-facts`, `.story`→`rz-story` (+ `rz-thesis` уже есть), `.tl .row`→`rz-tl-row` со структурой `<span class="rz-tl-year">`, `<h3>`, `<p>`; строка «Сейчас» получает класс `is-now`; `.pr`→`rz-pr`; `.stack`→`rz-stack`; вопросы — `<RzFaq items={faq} schemaId="/about#faq" />`; финальный CTA — те же классы, что на главной (`rz-section rz-cta`, `rz-cta-title`, `rz-mark`). Кнопки hero: «Смотреть продукты» → `/products` (`rz-btn rz-btn--solid`), «Написать в Telegram» → `TELEGRAM_URL` из `lib/products` (`rz-btn`, `target="_blank" rel="noreferrer"`). Все секции с `data-studio-reveal` на заголовке/строках, как на главной.

Метаданные: `title: "Обо мне: личная система работы на Claude"`, `description: "Влад Лямин. Четвёртый год работаю с Claude каждый день: гайды, консультации и аудит для тех, кто собирает личную систему работы вместо команды."`, openGraph title «Обо мне — Влад Лямин», та же description, image `/portrait.jpg` как сейчас. `aboutSchema.description` = `"Помогаю собрать личную систему работы на Claude: гайды, консультации, аудит. 50+ человек обучил, 40+ систем собрал с 2022 года."`, `knowsAbout` = `["Claude", "Claude Code", "Личная AI-система", "Обучение работе с AI", "AI-автоматизация для одного человека"]`.

`faq` массив — пять пар из макета (вопросы и ответы дословно). `timeline`, `principles`, `stack` — данные из макета.

- [ ] **Step 2: CSS**

В `app/razvorot.css` добавить блок `/* ===== Обо мне ===== */` с правилами из макета (`.hero .wrap`→`.rz-about-hero`, `.facts`→`.rz-facts`, `.story`→`.rz-story`, `.tl`→`.rz-tl`, `.pr`→`.rz-pr`, `.stack`→`.rz-stack`), с заменой переменных по Global Constraints и мобильными правилами макета в `@media (max-width: 900px)`. Ховер строк траектории — как `.rz-row` (полоса + сдвиг); `.rz-tl-row.is-now .rz-tl-year` использует `rz-mark`-стиль заливки (тот же gradient no-repeat 0 .3em / 100% .66em).

- [ ] **Step 3: Удалить FaqSection, проверить, закоммитить**

`grep -rn "FaqSection" app components` → только `components/FaqSection.tsx` → `git rm components/FaqSection.tsx`. `npx tsc --noEmit && npm run lint && npm run build`. `grep -n "внедрени\|команд" app/about/page.tsx` → только утверждённые отрицания («Не внедряю AI в чужие команды», «без команды», «1 человек в команде»).

```bash
git add app/about/page.tsx app/razvorot.css components/FaqSection.tsx
git commit -m "feat(about): страница «Обо мне» в стиле «Разворот»"
```

---

### Task 3: /products

**Files:**
- Modify: `app/products/page.tsx` (полная замена)
- Modify: `app/razvorot.css` (блоки `.rz-products-hero`, `.rz-spread*`, `.rz-pick*`, `.rz-wait-block`)
- Delete: `components/bento/ProductShowcase.tsx` (после `grep -rn ProductShowcase app components` — потребитель только /products)

**Interfaces:**
- Consumes: `products`/`getProduct` из `lib/products` (у consultation и audit теперь есть `cover`), `RzFaq`, `WaitlistForm`, `TrackedLink` (`event="product_tile_click"`, `eventProps={{ product, position, section: "products_page" }}`).

- [ ] **Step 1: Страница**

По макету `2026-09-02-mock-products.html`: `<main className="rz">`; hero `rz-products-hero` (эйрбоу «Продукты · 5 форматов», h1 «Что можно взять и почём» с `rz-mark` на «и почём», лид, справа `rz-products-aside` с тремя подсказками); список `rz-spreads` из пяти `TrackedLink className="rz-spread"` в порядке `guide, codex-content-os, consultation, audit, course`: `<span class="rz-mono">` тип (Гайд / Гайд / 1:1 / Аудит / Курс), обложка `<img class="rz-spread-cover">` из `product.cover` (у курса — `<div class="rz-spread-cover rz-spread-cover--typo">скоро</div>`), `<div>` с `<h3>{product.title}</h3>`, `<p class="rz-spread-tag">{product.tagline}</p>`, `<div class="rz-spread-meta"><span class="rz-spread-price">{priceLabel}<small>{meta}</small></span><span class="rz-btn rz-btn--solid">{cta}</span></div>`; тексты кнопок: гайды «Получить гайд», консультация «Забронировать час», аудит «Обсудить в Telegram» (класс `rz-btn` без solid), курс «В лист ожидания» (`rz-btn`, ведёт на `#waitlist`). Курс получает класс `rz-spread--soon`. Затем секция «Как выбрать» (`rz-pick`, три колонки из макета, ссылки `rz-link` на `/products/guide`, `/products/consultation`, `/products/audit`), «Вопросы» (`<RzFaq items={faq} schemaId="/products#faq" />`, четыре пары из макета), лист ожидания `id="waitlist"` (`rz-wait-block`: слева эйрбоу «Скоро», h2 «Мини-курс по личной AI-системе», текст; справа `<WaitlistForm />`).

Метаданные без изменений, кроме `description` (уже «Пять форматов…»). `catalogSchema` оставить, `faqSchema` из page.tsx удалить (его теперь даёт `RzFaq`). Старый `FaqTile` удалить.

- [ ] **Step 2: CSS**

Блок `/* ===== Продукты ===== */`: перенос `.hero-aside`→`.rz-products-aside`, `.spread`→`.rz-spread` (ховер 1a как у `.rz-row`: `::before` лайм-полоса + `padding-left`), `.spread .cover`→`.rz-spread-cover` (`aspect-ratio: 16/9; object-fit: cover; border: 1px solid var(--rz-line); width: 100%; display: block`), `.cover.typo`→`.rz-spread-cover--typo`, `.spread .tag`→`.rz-spread-tag`, `.meta`→`.rz-spread-meta`, `.price`→`.rz-spread-price`, `.soon`→`.rz-spread--soon`, `.pick`→`.rz-pick`, `.wait`→`.rz-wait-block`; мобильные правила из макета; reduced-motion для `.rz-spread`.

- [ ] **Step 3: Удалить ProductShowcase, проверить, закоммитить**

`grep -rn "ProductShowcase" app components` → только сам файл → `git rm components/bento/ProductShowcase.tsx`. `npx tsc --noEmit && npm run lint && npm run build`.

```bash
git add app/products/page.tsx app/razvorot.css components/bento/ProductShowcase.tsx
git commit -m "feat(products): каталог в стиле «Разворот» с обложками и блоком «Как выбрать»"
```

---

### Task 4: /products/[slug]

**Files:**
- Modify: `app/products/[slug]/page.tsx` (разметка; схемы, `generateMetadata`, `generateStaticParams`, `locked` не трогать)
- Modify: `app/razvorot.css` (блок `.rz-product*`)
- Modify: `app/products/products.css` (оставить только `.bento-vsl*` правила и reduced-motion к ним)
- Delete: `app/products/Faq.tsx`

**Interfaces:**
- Consumes: `Vsl`, `BuyAction` (rz-классы), `RzFaq`, `productExtras`, `TrackedLink`.

- [ ] **Step 1: Разметка**

```tsx
<main className="rz rz-product">
  <section className="rz-product-hero">
    <div className="rz-wrap">
      <nav aria-label="Хлебные крошки" className="rz-crumb"><Link href="/products" className="rz-link">← Все форматы</Link></nav>
      {locked && (<p className="rz-locked">Похоже, ты перешёл по неполной ссылке. Оформи покупку — доступ придёт на почту, либо напиши в Telegram, если уже оплатил.</p>)}
      <div className="rz-product-grid">
        <header>
          <p className="rz-mono">{metaLine(product)}</p>
          <h1 className="rz-h1 rz-product-title">{product.title}</h1>
          <p className="rz-lead">{product.tagline}</p>
        </header>
        <aside className="rz-product-buy">
          <span className="rz-mono">Стоимость</span>
          <p className="rz-product-price">{product.priceLabel}</p>
          <BuyAction product={product} />
          <small>Без скрытых условий. Детали формата ниже.</small>
        </aside>
      </div>
      {product.vsl ? <Vsl product={product} /> : product.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="rz-product-cover" src={product.cover.src} width={product.cover.width} height={product.cover.height} alt="" />
      )}
    </div>
  </section>
  {extra?.outcomes?.length ? (
    <section className="rz-section"><div className="rz-wrap">
      <div className="rz-sec-head" data-studio-reveal><h2 className="rz-h2">Чему научишься</h2></div>
      <ul className="rz-list rz-list--cols" data-studio-reveal>{extra.outcomes.map((t) => <li key={t}>{t}</li>)}</ul>
    </div></section>
  ) : null}
  {extra && (
    <section className="rz-section"><div className="rz-wrap rz-two">
      <div data-studio-reveal><h2 className="rz-h2 rz-h2--sm">Для кого</h2><ul className="rz-list">{extra.forWhom.map((t) => <li key={t}>{t}</li>)}</ul></div>
      <div data-studio-reveal><h2 className="rz-h2 rz-h2--sm">Что внутри</h2><ul className="rz-list">{extra.inside.map((t) => <li key={t}>{t}</li>)}</ul></div>
    </div></section>
  )}
  <section className="rz-section"><div className="rz-wrap rz-two">
    <div className="rz-sec-head" data-studio-reveal style={{ marginBottom: 0 }}><h2 className="rz-h2">Подробно</h2></div>
    <div className="rz-copy" data-studio-reveal>{product.description.map((p) => <p key={p}>{p}</p>)}</div>
  </div></section>
  {product.faq?.length ? (
    <section className="rz-section"><div className="rz-wrap">
      <div className="rz-sec-head" data-studio-reveal><h2 className="rz-h2">Вопросы</h2></div>
      <RzFaq items={product.faq} />
    </div></section>
  ) : null}
  <section className="rz-section rz-product-final"><div className="rz-wrap rz-two" data-studio-reveal>
    <div><p className="rz-mono">{metaLine(product)}</p><h2 className="rz-h2">{product.title}</h2></div>
    <div className="rz-product-buy"><p className="rz-product-price">{product.priceLabel}</p><BuyAction product={product} /></div>
  </div></section>
  {product.nextStep && (
    <section className="rz-section"><div className="rz-wrap">
      <p className="rz-mono" data-studio-reveal>Что дальше</p>
      <TrackedLink href={`/products/${product.nextStep.slug}`} event="funnel_bridge_click" eventProps={{ from: product.id, to: product.nextStep.slug }} className="rz-row rz-row--next">
        <span className="rz-mono">Дальше</span><h3>{product.nextStep.label}</h3><span className="rz-row-desc">{product.nextStep.text}</span><span className="rz-row-price rz-row-arrow">→</span>
      </TrackedLink>
    </div></section>
  )}
  {/* JSON-LD скрипты как сейчас */}
</main>
```

FAQ-схема продукта (`faqSchema`) остаётся в page.tsx как сейчас (RzFaq здесь без `schemaId`, чтобы не дублировать разметку). Импорт `Faq` из `../Faq` удалить, файл `app/products/Faq.tsx` удалить. Импорт `../products.css` оставить (там `Vsl`).

- [ ] **Step 2: CSS**

```css
/* ===== Страница продукта ===== */
.rz-product-hero { padding: 48px 0 80px; }
.rz-crumb { margin-bottom: 40px; font-family: var(--rz-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
.rz-locked { margin: 0 0 32px; padding: 16px 20px; border: 1px solid var(--rz-ink); color: var(--rz-ink); max-width: 640px; }
.rz-product-grid { display: grid; grid-template-columns: 1fr 340px; gap: 64px; align-items: end; margin-bottom: 56px; }
.rz-product-title { font-size: clamp(44px, 5.6vw, 84px); margin-bottom: 28px; }
.rz-product-buy { display: flex; flex-direction: column; gap: 14px; border-left: 1px solid var(--rz-line); padding-left: 32px; }
.rz-product-buy small { color: var(--rz-mute); font-size: 13px; }
.rz-product-price { font-family: var(--rz-serif); font-size: 44px; font-weight: 500; line-height: 1; margin: 0; font-variant-numeric: tabular-nums; }
.rz-product-cover { display: block; width: 100%; height: auto; border: 1px solid var(--rz-line); }
.rz-product .bento-vsl { border: 1px solid var(--rz-line); }
.rz-h2--sm { font-size: clamp(30px, 3.4vw, 42px); margin-bottom: 24px; }
.rz-two { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.rz-list { list-style: none; margin: 0; padding: 0; }
.rz-list li { position: relative; padding: 14px 0 14px 28px; border-bottom: 1px solid var(--rz-line); color: var(--rz-ink); font-size: 17px; }
.rz-list li::before { content: ""; position: absolute; left: 0; top: 24px; width: 12px; height: 6px; background: var(--rz-lime); }
.rz-list--cols { columns: 2; column-gap: 64px; }
.rz-list--cols li { break-inside: avoid; }
.rz-copy p { margin: 0 0 20px; color: var(--rz-mute); font-size: 18px; max-width: 640px; }
.rz-copy p:first-child { color: var(--rz-ink); font-family: var(--rz-serif); font-size: 26px; line-height: 1.3; }
.rz-product-final .rz-product-buy { border-left: 0; padding-left: 0; align-items: flex-start; }
.rz-row--next { grid-template-columns: 90px 1fr 1fr 80px; margin-top: 24px; border-top: 1px solid var(--rz-line); }
.rz-row-arrow { font-family: var(--rz-serif); font-size: 36px; }
@media (max-width: 900px) {
  .rz-product-grid, .rz-two { grid-template-columns: 1fr; gap: 32px; }
  .rz-product-buy { border-left: 0; padding-left: 0; }
  .rz-list--cols { columns: 1; }
  .rz-row--next { grid-template-columns: 1fr; }
}
```

В `app/products/products.css` удалить все `.bento-*` правила, кроме `.bento-vsl*` и их reduced-motion блока; обновить комментарий в шапке файла.

- [ ] **Step 3: Проверить, закоммитить**

`grep -rn "app/products/Faq\|from \"../Faq\"" app` пусто → `git rm app/products/Faq.tsx`. `npx tsc --noEmit && npm run lint && npm run build`. Все 5 страниц продуктов собираются (в выводе build `/products/[slug]` с 5 путями).

```bash
git add "app/products/[slug]/page.tsx" app/razvorot.css app/products/products.css app/products/Faq.tsx
git commit -m "feat(products): страница продукта в стиле «Разворот»"
```

---

### Task 5: Финальная проверка

- [ ] `npm run lint && npx tsc --noEmit && NODE_OPTIONS="--max-old-space-size=2048" npm run build`.
- [ ] `grep -rn "внедрени\|под ключ" app/about app/products components/rz components/products` → пусто (кроме утверждённых отрицаний на /about и «план внедрения» в описаниях lib/products.ts, которые вне объёма).
- [ ] Контроллер: браузерный обход `/about`, `/products`, `/products/guide`, `/products/consultation`, `/products/audit`, `/products/course` на 1440 и 375; маркер на главной по буквам; лист ожидания отправляет форму (проверить в консоли запрос к `/api/waitlist`).
