# Единая система анимаций — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Один движок анимаций (GSAP) с декларативным API `data-m`, выразительное движение на всех страницах «Разворота», без потерь производительности на мобильном.

**Architecture:** Серверные страницы размечают элементы атрибутами `data-m="…"`. Один клиентский `MotionLayer` в `app/layout.tsx` на каждое изменение пути находит их и создаёт твины через `useGSAP` (с `revertOnUpdate`). Чистая логика (уровни, разбор чисел, задержки сетки, магнит, шапка) вынесена в `logic.ts` и покрыта тестами `node:test`. DOM-код — в `runners.ts`, `interactions.ts`, `scenes/`.

**Tech Stack:** Next.js 16 (app router), React 19, GSAP 3.15 (ScrollTrigger, SplitText), `@gsap/react`, Lenis, TypeScript, `tsx --test`.

**Spec:** `docs/superpowers/specs/2026-09-23-motion-system-design.md`

## Global Constraints

- Анимируются только `transform`, `opacity`, `visibility`, `clip-path` и CSS-переменная `--mark-w` / `--row-bar`. Никаких `width`, `height`, `padding`, `margin`, `top`, `left`.
- CLS = 0 на всех страницах.
- Контент есть в серверном HTML. Скрытие — только `gsap.set`/`gsap.from` после гидратации либо CSS под `html.js` со страховкой `animation: rz-safety 0s 4s forwards`.
- `prefers-reduced-motion: reduce` — ничего не скрыто, ничего не двигается.
- Тач (`pointer: coarse`): `pin` → `stagger`, `parallax` → нет движения, `draw` → нет движения. Магнит и наклон только при `pointer: fine`.
- Токены: `fast 0.35`, `base 0.7`, `slow 1.1`, `count 1.6`; кривые `power3.out`, `power4.inOut`, `power4.out`; шаг каскада `0.08`, строк `0.12`; подъём `32` px (тач `20`); старт триггера `top 85%`.
- Никаких эмодзи в коде, комментариях и коммитах. Комментарии в коде — по-русски, как в соседних файлах.
- Имена `lvmn` в инфраструктуре не переименовывать.
- Коммиты заканчиваются строкой `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Работаем в worktree `/Users/lvmn/Desktop/Бизнес/lvmn-site/.claude/worktrees/sales-report-analysis-b81bcc`, ветка `claude/site-animations-ux-improvements-389503`. Не `cd` в основной checkout.

## Conventions (используются в задачах 3–6)

**Шаблон заголовка секции.** Везде, где встречается

```tsx
<div className="rz-sec-head" data-m="reveal">
  <h2 className="rz-h2">Текст</h2>
  <p>Подпись</p>
</div>
```

заменить на

```tsx
<div className="rz-sec-head">
  <h2 className="rz-h2" data-m="lines">Текст</h2>
  <p data-m="reveal" data-m-delay="0.15">Подпись</p>
</div>
```

Если `<p>` нет — только `data-m="lines"` на `h2`. Если у `div` есть `style` — сохранить его.

**Первый экран.** `h1` страницы получает `data-m="lines" data-m-hero`. `data-m-hero` включает CSS-скрытие до старта сцены, чтобы не было вспышки.

## File Structure

| Файл | Ответственность |
|---|---|
| `components/motion/tokens.ts` (new) | длительности, кривые, шаги, константы магнита/наклона/шапки |
| `components/motion/logic.ts` (new) | чистые функции: уровень, тип анимации, разбор/формат чисел, задержка сетки, магнит, шапка, `num` |
| `components/motion/logic.test.ts` (new) | тесты `node:test` для `logic.ts` |
| `components/motion/runners.ts` (new) | DOM-раннеры для каждого `data-m` |
| `components/motion/interactions.ts` (new) | магнитные кнопки и наклон обложек |
| `components/motion/scenes/index.ts`, `scenes/productsIndex.ts` (new) | реестр пин-сцен и сцена каталога главной |
| `components/motion/MotionLayer.tsx` (new) | точка входа: находит `[data-m]`, запускает раннеры |
| `components/motion/ReadingProgress.tsx` (new) | полоса прогресса чтения статьи |
| `components/motion/gsap.ts` | реэкспорт кривых из `tokens.ts` |
| `components/motion/HomeMotion.tsx` | остаётся только hero |
| `app/layout.tsx`, `app/template.tsx`, `components/studio/StudioNav.tsx` | монтирование, шторка, шапка |
| `app/razvorot.css`, `app/studio.css`, `app/personal.css`, `app/globals.css` | CSS-страховка, шапка, hover без раскладки, чистка |
| страницы `app/**` | разметка `data-m` |

---

### Task 1: Замер «до», токены и чистая логика

**Files:**
- Create: `components/motion/tokens.ts`
- Create: `components/motion/logic.ts`
- Create: `components/motion/logic.test.ts`
- Create: `docs/superpowers/plans/2026-09-23-motion-perf.md`
- Modify: `components/motion/gsap.ts:11-14`
- Modify: `package.json` (скрипт `test`)

**Interfaces:**
- Produces (`tokens.ts`): `DUR`, `EASE`, `STAGGER`, `RISE`, `TRIGGER_START`, `TILT_MAX`, `MAGNET`, `NAV_HIDE_AFTER`.
- Produces (`logic.ts`):
  - `type Tier = "full" | "touch" | "off"`
  - `type MotionKind = "lines" | "reveal" | "stagger" | "mark" | "count" | "parallax" | "pin" | "draw"`
  - `isMotionKind(v: string | undefined): v is MotionKind`
  - `resolveTier(env: { reduced: boolean; finePointer: boolean }): Tier`
  - `effectiveKind(kind: MotionKind, tier: Tier): MotionKind | null`
  - `type CountParts = { prefix: string; value: number; suffix: string; sep: string | null }`
  - `parseCount(text: string): CountParts | null`
  - `countFrom(value: number): number`
  - `formatCount(n: number, parts: CountParts): string`
  - `gridDelay(index: number, columns: number, step: number): number`
  - `magnetOffset(dx: number, dy: number, halfW: number, halfH: number, radius: number, pull: number): { x: number; y: number }`
  - `navShouldHide(s: { y: number; direction: number; menuOpen: boolean; threshold: number }): boolean`
  - `num(v: string | undefined, fallback: number): number`

- [ ] **Step 1: Установить зависимости и env**

В worktree нет `node_modules`.

```bash
npm install
test -f .env.local || cp /Users/lvmn/Desktop/Бизнес/lvmn-site/.env.local .env.local 2>/dev/null || true
```

`.env.local` в `.gitignore`, не коммитить. Без него сборка берёт статьи из `data/posts-snapshot.json`.

- [ ] **Step 2: Замер Lighthouse «до»**

```bash
npm run build
npm start -- -p 3100 &
sleep 6
mkdir -p "$TMPDIR/lh"
npx -y lighthouse http://localhost:3100/ --only-categories=performance --output=json --output-path="$TMPDIR/lh/before-home.json" --chrome-flags="--headless=new" --quiet
npx -y lighthouse http://localhost:3100/products/guide --only-categories=performance --output=json --output-path="$TMPDIR/lh/before-guide.json" --chrome-flags="--headless=new" --quiet
node -e 'for (const f of ["home","guide"]) { const r = require(process.env.TMPDIR + "/lh/before-" + f + ".json"); const a = r.audits; console.log(f, "score", r.categories.performance.score, "LCP", a["largest-contentful-paint"].numericValue|0, "TBT", a["total-blocking-time"].numericValue|0, "CLS", a["cumulative-layout-shift"].numericValue) }'
kill %1
```

Lighthouse по умолчанию эмулирует мобильный. Если Chrome не найден — записать в файл «Lighthouse недоступен» и сообщить контроллеру, он снимет LCP/CLS в браузере.

Записать вывод в `docs/superpowers/plans/2026-09-23-motion-perf.md`:

```markdown
# Замеры производительности — система анимаций

Lighthouse mobile, локальная прод-сборка, порт 3100.

| Страница | Когда | Score | LCP, мс | TBT, мс | CLS |
|---|---|---|---|---|---|
| / | до | … | … | … | … |
| /products/guide | до | … | … | … | … |
```

(Многоточия заменить реальными числами из вывода.)

- [ ] **Step 3: Написать `tokens.ts`**

```ts
// Единственный источник таймингов движения. CSS-зеркало — переменные
// --rz-ease, --rz-ease-in-out, --rz-dur-fast, --rz-dur-base в razvorot.css.
export const DUR = { fast: 0.35, base: 0.7, slow: 1.1, count: 1.6 } as const;
export const EASE = { out: "power3.out", inOut: "power4.inOut", lines: "power4.out" } as const;
export const STAGGER = { items: 0.08, lines: 0.12 } as const;
// Подъём при входе. На телефоне короче: длинный путь на маленьком экране читается как рывок.
export const RISE = { full: 32, touch: 20 } as const;
export const TRIGGER_START = "top 85%";
export const TILT_MAX = 6; // градусов, наклон обложки за курсором
export const MAGNET = { radius: 110, pull: 12 } as const;
export const NAV_HIDE_AFTER = 120; // px, раньше шапку не прячем
```

- [ ] **Step 4: Написать падающие тесты `logic.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isMotionKind, resolveTier, effectiveKind, parseCount, countFrom, formatCount,
  gridDelay, magnetOffset, navShouldHide, num,
} from "./logic";

test("isMotionKind знает все типы и отсекает мусор", () => {
  for (const k of ["lines", "reveal", "stagger", "mark", "count", "parallax", "pin", "draw"]) {
    assert.equal(isMotionKind(k), true, k);
  }
  assert.equal(isMotionKind("fade"), false);
  assert.equal(isMotionKind(undefined), false);
});

test("resolveTier: reduced-motion важнее указателя", () => {
  assert.equal(resolveTier({ reduced: true, finePointer: true }), "off");
  assert.equal(resolveTier({ reduced: false, finePointer: true }), "full");
  assert.equal(resolveTier({ reduced: false, finePointer: false }), "touch");
});

test("effectiveKind: на таче тяжёлые сцены упрощаются", () => {
  assert.equal(effectiveKind("pin", "touch"), "stagger");
  assert.equal(effectiveKind("parallax", "touch"), null);
  assert.equal(effectiveKind("draw", "touch"), null);
  assert.equal(effectiveKind("lines", "touch"), "lines");
  assert.equal(effectiveKind("pin", "full"), "pin");
  assert.equal(effectiveKind("reveal", "off"), null);
});

test("parseCount: простое число, суффикс, группировка разрядов", () => {
  assert.deepEqual(parseCount("590 ₽"), { prefix: "", value: 590, suffix: " ₽", sep: null });
  assert.deepEqual(parseCount("50+"), { prefix: "", value: 50, suffix: "+", sep: null });
  assert.deepEqual(parseCount("10 000 ₽/мес"), { prefix: "", value: 10000, suffix: " ₽/мес", sep: " " });
  assert.deepEqual(parseCount("25 000 ₽"), { prefix: "", value: 25000, suffix: " ₽", sep: " " });
  assert.deepEqual(parseCount("от 3 850 ₽"), { prefix: "от ", value: 3850, suffix: " ₽", sep: " " });
  assert.deepEqual(parseCount("2023–24"), { prefix: "", value: 2023, suffix: "–24", sep: null });
  assert.equal(parseCount("Сейчас"), null);
  assert.equal(parseCount(""), null);
});

test("countFrom: годы бегут от близкого значения, остальное от нуля", () => {
  assert.equal(countFrom(2022), 1998);
  assert.equal(countFrom(590), 0);
  assert.equal(countFrom(10000), 0);
});

test("formatCount восстанавливает исходный вид", () => {
  const p = parseCount("10 000 ₽/мес")!;
  assert.equal(formatCount(10000, p), "10 000 ₽/мес");
  assert.equal(formatCount(999.6, p), "1 000 ₽/мес");
  assert.equal(formatCount(0, p), "0 ₽/мес");
  const y = parseCount("2022")!;
  assert.equal(formatCount(2022, y), "2022");
  const nb = parseCount("25 000 ₽")!;
  assert.equal(formatCount(25000, nb), "25 000 ₽");
});

test("gridDelay: диагональ по строке и колонке", () => {
  assert.equal(gridDelay(0, 2, 0.1), 0);
  assert.equal(gridDelay(1, 2, 0.1), 0.1);
  assert.equal(gridDelay(2, 2, 0.1), 0.1);
  assert.ok(Math.abs(gridDelay(3, 2, 0.1) - 0.2) < 1e-9);
  assert.ok(Math.abs(gridDelay(3, 1, 0.1) - 0.3) < 1e-9);
  assert.equal(gridDelay(5, 0, 0.1), gridDelay(5, 1, 0.1));
});

test("magnetOffset: тянет внутри зоны, отпускает снаружи", () => {
  assert.deepEqual(magnetOffset(500, 0, 50, 20, 110, 12), { x: 0, y: 0 });
  const o = magnetOffset(80, 65, 50, 20, 110, 12);
  assert.ok(Math.abs(o.x - 6) < 1e-9);
  assert.ok(Math.abs(o.y - 6) < 1e-9);
});

test("navShouldHide: только вниз, только после порога, не при открытом меню", () => {
  const base = { threshold: 120, menuOpen: false };
  assert.equal(navShouldHide({ ...base, y: 400, direction: 1 }), true);
  assert.equal(navShouldHide({ ...base, y: 400, direction: -1 }), false);
  assert.equal(navShouldHide({ ...base, y: 80, direction: 1 }), false);
  assert.equal(navShouldHide({ ...base, y: 400, direction: 1, menuOpen: true }), false);
});

test("num: читает data-атрибут с запасным значением", () => {
  assert.equal(num("0.15", 0), 0.15);
  assert.equal(num(undefined, 12), 12);
  assert.equal(num("abc", 3), 3);
});
```

- [ ] **Step 5: Добавить скрипт и убедиться, что тесты падают**

В `package.json` в `"scripts"` добавить после `"lint"`:

```json
"test": "tsx --test components/motion/logic.test.ts"
```

Run: `npm test`
Expected: FAIL — `Cannot find module './logic'`.

- [ ] **Step 6: Написать `logic.ts`**

```ts
// Чистая логика движения: без DOM и GSAP, поэтому покрыта тестами.

export type Tier = "full" | "touch" | "off";
export type MotionKind = "lines" | "reveal" | "stagger" | "mark" | "count" | "parallax" | "pin" | "draw";

const KINDS: readonly MotionKind[] = ["lines", "reveal", "stagger", "mark", "count", "parallax", "pin", "draw"];

export function isMotionKind(v: string | undefined): v is MotionKind {
  return v !== undefined && (KINDS as readonly string[]).includes(v);
}

export function resolveTier(env: { reduced: boolean; finePointer: boolean }): Tier {
  if (env.reduced) return "off";
  return env.finePointer ? "full" : "touch";
}

// Пин и скраб во встроенном браузере Instagram дёргают скролл.
// На таче пин-сцена становится каскадом, параллакс и линия стоят на месте.
const TOUCH_FALLBACK: Partial<Record<MotionKind, MotionKind | null>> = {
  pin: "stagger",
  parallax: null,
  draw: null,
};

export function effectiveKind(kind: MotionKind, tier: Tier): MotionKind | null {
  if (tier === "off") return null;
  if (tier === "touch" && kind in TOUCH_FALLBACK) return TOUCH_FALLBACK[kind] ?? null;
  return kind;
}

export type CountParts = { prefix: string; value: number; suffix: string; sep: string | null };

// Разделитель разрядов: пробел, неразрывный или узкий неразрывный.
const COUNT_RE = /^([^\d]*?)(\d{1,3}(?:[   ]\d{3})+|\d+)([\s\S]*)$/;

export function parseCount(text: string): CountParts | null {
  const m = text.match(COUNT_RE);
  if (!m) return null;
  const raw = m[2];
  const digits = raw.replace(/[   ]/g, "");
  const sep = digits.length === raw.length ? null : raw.charAt(raw.search(/[   ]/));
  return { prefix: m[1], value: Number(digits), suffix: m[3], sep };
}

// Год считаем от близкого значения, иначе 2022 бежит от нуля две секунды.
export function countFrom(value: number): number {
  return value >= 1900 && value <= 2100 ? value - 24 : 0;
}

export function formatCount(n: number, parts: CountParts): string {
  let body = String(Math.round(n));
  if (parts.sep) body = body.replace(/\B(?=(\d{3})+(?!\d))/g, parts.sep);
  return `${parts.prefix}${body}${parts.suffix}`;
}

// Диагональный каскад: элемент (строка r, колонка c) стартует через (r + c) шагов.
export function gridDelay(index: number, columns: number, step: number): number {
  const cols = Math.max(1, columns);
  return (Math.floor(index / cols) + (index % cols)) * step;
}

export function magnetOffset(
  dx: number, dy: number, halfW: number, halfH: number, radius: number, pull: number,
): { x: number; y: number } {
  const reachX = radius + halfW;
  const reachY = radius + halfH;
  if (Math.hypot(dx, dy) > reachX) return { x: 0, y: 0 };
  return { x: (dx / reachX) * pull, y: (dy / reachY) * pull };
}

export function navShouldHide(s: { y: number; direction: number; menuOpen: boolean; threshold: number }): boolean {
  return !s.menuOpen && s.y > s.threshold && s.direction === 1;
}

export function num(v: string | undefined, fallback: number): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
```

- [ ] **Step 7: Тесты проходят**

Run: `npm test`
Expected: PASS, 10 тестов, 0 fail.

- [ ] **Step 8: `gsap.ts` берёт кривые из токенов**

В `components/motion/gsap.ts` заменить строки 11-14:

```ts
// Кастомные кривые совпадают с --rz-ease и --rz-ease-in-out из razvorot.css,
// чтобы hover на CSS и вход на GSAP двигались одинаково.
export const EASE_OUT = "power3.out";
export const EASE_IN_OUT = "power4.inOut";
```

на

```ts
// Кривые живут в tokens.ts. Эти имена оставлены для HomeMotion и heroChoreography.
import { EASE } from "./tokens";
export const EASE_OUT = EASE.out;
export const EASE_IN_OUT = EASE.inOut;
```

(Импорт перенести наверх файла к остальным импортам.)

- [ ] **Step 9: Проверка и коммит**

Run: `npm test && npx tsc --noEmit -p . && npm run lint`
Expected: всё без ошибок.

```bash
git add components/motion/tokens.ts components/motion/logic.ts components/motion/logic.test.ts components/motion/gsap.ts package.json package-lock.json docs/superpowers/plans/2026-09-23-motion-perf.md
git commit -m "feat(motion): токены и чистая логика системы анимаций

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: MotionLayer и замена BentoReveal

После задачи весь сайт анимирует входы блоков через GSAP вместо CSS-классов. Визуально почти то же, что сейчас, но на одном движке.

**Files:**
- Create: `components/motion/runners.ts`
- Create: `components/motion/interactions.ts`
- Create: `components/motion/scenes/index.ts`
- Create: `components/motion/scenes/productsIndex.ts`
- Create: `components/motion/MotionLayer.tsx`
- Modify: `app/layout.tsx:9,162` (убрать `BentoReveal`, добавить `MotionLayer`)
- Modify: `components/bento/TrackedLink.tsx:19,26,33`
- Modify: все файлы с атрибутом `data-studio-reveal` (переименование)
- Modify: `app/studio.css:111-124,853`, `app/personal.css:1663`
- Modify: `app/razvorot.css` (CSS-страховка первого экрана, токены)
- Delete: `components/bento/BentoReveal.tsx`

**Interfaces:**
- Consumes: всё из Task 1.
- Produces:
  - `runners.ts`: `type RunCtx = { tier: "full" | "touch"; safe: (fn: () => void) => () => void; onCleanup: (fn: () => void) => void }`, `markIn(el: Element): void`, `runners: Record<MotionKind, (el: HTMLElement, ctx: RunCtx) => void>`
  - `interactions.ts`: `bindMagnets(): () => void`, `bindTilts(): () => void`
  - `scenes/index.ts`: `scenes: Record<string, (el: HTMLElement) => void>`
  - Атрибуты разметки: `data-m`, `data-m-delay`, `data-m-step`, `data-m-item`, `data-m-depth`, `data-m-scene`, `data-m-hero`, `data-m-tilt`, `data-m-tilt-target`, `data-magnet="own"`.

- [ ] **Step 1: `scenes/productsIndex.ts`**

```ts
import { gsap } from "../gsap";

// Каталог главной на десктопе: блок закреплён, скролл по очереди делает
// строку активной — лаймовая полоса слева (--row-bar) и полная яркость.
// Последняя строка остаётся активной, после неё пин отпускается.
export function productsIndex(el: HTMLElement): void {
  const rows = Array.from(el.querySelectorAll<HTMLElement>(".rz-row"));
  if (rows.length < 2) return;
  gsap.set(rows, { opacity: 0.45, "--row-bar": 0 });
  const tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "none" },
    scrollTrigger: { trigger: el, start: "top 20%", end: `+=${rows.length * 45}%`, pin: true, scrub: 0.4 },
  });
  rows.forEach((row, i) => {
    tl.to(row, { opacity: 1, "--row-bar": 1 }, i);
    if (i < rows.length - 1) tl.to(row, { opacity: 0.45, "--row-bar": 0 }, i + 0.75);
  });
}
```

- [ ] **Step 2: `scenes/index.ts`**

```ts
import { productsIndex } from "./productsIndex";

// Реестр пин-сцен: data-m="pin" data-m-scene="<имя>". Сцены — единственное
// место со вкусовой хореографией, остальное делают общие раннеры.
export const scenes: Record<string, (el: HTMLElement) => void> = {
  "products-index": productsIndex,
};
```

- [ ] **Step 3: `runners.ts`**

```ts
import { gsap, SplitText } from "./gsap";
import { DUR, EASE, STAGGER, RISE, TRIGGER_START } from "./tokens";
import { parseCount, formatCount, countFrom, gridDelay, num, type MotionKind } from "./logic";
import { scenes } from "./scenes";

export type RunCtx = {
  tier: "full" | "touch";
  // Оборачивает отложенный колбэк (например, после загрузки шрифтов),
  // чтобы созданные в нём твины откатились вместе с контекстом useGSAP.
  safe: (fn: () => void) => () => void;
  onCleanup: (fn: () => void) => void;
};

// .is-in снимает CSS-страховку первого экрана (razvorot.css, data-m-hero).
export function markIn(el: Element): void {
  el.classList.add("is-in");
}

const CLEAR = "transform,opacity,visibility";
const enter = (trigger: Element) => ({ trigger, start: TRIGGER_START, once: true });

function reveal(el: HTMLElement, ctx: RunCtx): void {
  gsap.from(el, {
    autoAlpha: 0, y: RISE[ctx.tier], duration: DUR.base, ease: EASE.out,
    delay: num(el.dataset.mDelay, 0), clearProps: CLEAR,
    scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

function columnsOf(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  if (!cs.display.includes("grid")) return 1;
  return cs.gridTemplateColumns.split(" ").filter(Boolean).length || 1;
}

// Элементы каскада: явно помеченные [data-m-item] или прямые потомки.
function stagger(el: HTMLElement, ctx: RunCtx): void {
  const marked = el.querySelectorAll<HTMLElement>("[data-m-item]");
  const items = marked.length ? Array.from(marked) : (Array.from(el.children) as HTMLElement[]);
  if (!items.length) return markIn(el);
  const cols = columnsOf(el);
  const step = num(el.dataset.mStep, STAGGER.items);
  gsap.from(items, {
    autoAlpha: 0, y: RISE[ctx.tier], duration: DUR.base, ease: EASE.out,
    delay: num(el.dataset.mDelay, 0), stagger: (i: number) => gridDelay(i, cols, step),
    clearProps: CLEAR, scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

// Строки заголовка выезжают из масок. Лаймовый маркер внутри дорисовывается
// после строк: SplitText пересобирает разметку, поэтому маркер ищем уже в ней.
function lines(el: HTMLElement, ctx: RunCtx): void {
  gsap.set(el, { autoAlpha: 0 });
  document.fonts.ready.then(ctx.safe(() => {
    const split = SplitText.create(el, { type: "lines", mask: "lines", autoSplit: false });
    ctx.onCleanup(() => split.revert());
    const liveMark = el.querySelector<HTMLElement>(".rz-mark");
    gsap.set(el, { autoAlpha: 1 });
    if (liveMark) gsap.set(liveMark, { "--mark-w": "0%" });
    const tl = gsap.timeline({
      scrollTrigger: enter(el),
      onComplete: () => { split.revert(); markIn(el); },
    });
    tl.from(split.lines, { yPercent: 110, duration: DUR.slow, ease: EASE.lines, stagger: STAGGER.lines });
    if (liveMark) tl.to(liveMark, { "--mark-w": "100%", duration: 0.75, ease: "power2.inOut" }, "-=0.45");
  }));
}

function mark(el: HTMLElement): void {
  const target = el.classList.contains("rz-mark") ? el : el.querySelector<HTMLElement>(".rz-mark");
  if (!target) return markIn(el);
  gsap.fromTo(target, { "--mark-w": "0%" }, {
    "--mark-w": "100%", duration: 0.9, ease: EASE.inOut,
    scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

// Только для листовых элементов с текстом: textContent затирает детей.
function count(el: HTMLElement, ctx: RunCtx): void {
  const original = el.textContent ?? "";
  const parts = parseCount(original);
  if (!parts) return markIn(el);
  const state = { v: countFrom(parts.value) };
  const paint = () => { el.textContent = formatCount(state.v, parts); };
  paint();
  ctx.onCleanup(() => { el.textContent = original; });
  gsap.to(state, {
    v: parts.value, duration: DUR.count, ease: EASE.out, onUpdate: paint,
    scrollTrigger: enter(el), onComplete: () => markIn(el),
  });
}

// Картинка движется внутри родителя с overflow: hidden. Масштаб прячет края.
function parallax(el: HTMLElement): void {
  const depth = num(el.dataset.mDepth, 12);
  const scale = 1 + depth / 50;
  gsap.fromTo(el, { yPercent: -depth, scale }, {
    yPercent: depth, scale, ease: "none",
    scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
  });
}

function draw(el: HTMLElement): void {
  gsap.fromTo(el, { scaleY: 0 }, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: el.parentElement ?? el, start: "top 75%", end: "bottom 60%", scrub: true },
  });
}

function pin(el: HTMLElement): void {
  const scene = scenes[el.dataset.mScene ?? ""];
  if (!scene) {
    console.warn(`[motion] неизвестная сцена "${el.dataset.mScene}"`);
    return;
  }
  scene(el);
}

export const runners: Record<MotionKind, (el: HTMLElement, ctx: RunCtx) => void> = {
  lines, reveal, stagger, mark, count, parallax, draw, pin,
};
```

- [ ] **Step 4: `interactions.ts`**

```ts
import { gsap } from "./gsap";
import { DUR, EASE, MAGNET, TILT_MAX } from "./tokens";
import { magnetOffset } from "./logic";

// Магнит для сплошных кнопок. Кнопки со своим магнитом (программа) помечены data-magnet="own".
export function bindMagnets(): () => void {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>(".rz-btn--solid:not([data-magnet='own'])").forEach((btn) => {
    const toX = gsap.quickTo(btn, "x", { duration: 0.4, ease: EASE.out });
    const toY = gsap.quickTo(btn, "y", { duration: 0.4, ease: EASE.out });
    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const o = magnetOffset(
        e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2),
        r.width / 2, r.height / 2, MAGNET.radius, MAGNET.pull,
      );
      toX(o.x);
      toY(o.y);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    offs.push(() => {
      window.removeEventListener("pointermove", onMove);
      gsap.set(btn, { x: 0, y: 0 });
    });
  });
  return () => offs.forEach((fn) => fn());
}

// Наклон обложки за курсором: data-m-tilt на карточке, data-m-tilt-target на обложке.
export function bindTilts(): () => void {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>("[data-m-tilt]").forEach((card) => {
    const target = card.querySelector<HTMLElement>("[data-m-tilt-target]");
    if (!target) return;
    gsap.set(target, { transformPerspective: 800 });
    const rx = gsap.quickTo(target, "rotationX", { duration: DUR.base, ease: EASE.out });
    const ry = gsap.quickTo(target, "rotationY", { duration: DUR.base, ease: EASE.out });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 2 * TILT_MAX);
      rx(-py * 2 * TILT_MAX);
    };
    const leave = () => { rx(0); ry(0); };
    card.addEventListener("pointermove", move, { passive: true });
    card.addEventListener("pointerleave", leave);
    offs.push(() => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      gsap.set(target, { rotationX: 0, rotationY: 0 });
    });
  });
  return () => offs.forEach((fn) => fn());
}
```

- [ ] **Step 5: `MotionLayer.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useGSAP, ScrollTrigger, prefersReducedMotion, hasFinePointer } from "./gsap";
import { resolveTier, effectiveKind, isMotionKind } from "./logic";
import { runners, markIn, type RunCtx } from "./runners";
import { bindMagnets, bindTilts } from "./interactions";

// Оживляет разметку data-m на любой странице. Страницы остаются серверными:
// атрибуты стоят в HTML, скрытие делает GSAP после гидратации.
// На смену пути контекст откатывается целиком и собирается заново.
export default function MotionLayer() {
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      const tier = resolveTier({ reduced: prefersReducedMotion(), finePointer: hasFinePointer() });
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-m]"));
      if (tier === "off") {
        nodes.forEach(markIn);
        return;
      }
      const cleanups: Array<() => void> = [];
      const ctx: RunCtx = {
        tier,
        safe: (fn) => contextSafe!(fn),
        onCleanup: (fn) => { cleanups.push(fn); },
      };
      for (const el of nodes) {
        const raw = el.dataset.m;
        if (!isMotionKind(raw)) {
          console.warn(`[motion] неизвестный data-m="${raw}"`);
          markIn(el);
          continue;
        }
        const kind = effectiveKind(raw, tier);
        if (!kind) {
          markIn(el);
          continue;
        }
        runners[kind](el, ctx);
      }
      if (tier === "full") cleanups.push(bindMagnets(), bindTilts());
      ScrollTrigger.refresh();
      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
```

- [ ] **Step 6: Смонтировать в layout, убрать BentoReveal**

В `app/layout.tsx`:
- удалить строку `import BentoReveal from "@/components/bento/BentoReveal";`
- добавить `import MotionLayer from "@/components/motion/MotionLayer";`
- удалить `<BentoReveal />`
- после `<PostHogProvider>{children}</PostHogProvider>` добавить `<MotionLayer />` (после страницы, чтобы его эффект шёл после эффектов страницы).

Удалить файл:

```bash
git rm components/bento/BentoReveal.tsx
```

- [ ] **Step 7: `TrackedLink` пробрасывает атрибуты движения**

Сейчас он пробрасывает только `data-studio-reveal`, остальные `data-*` теряются. Заменить сигнатуру и `<Link>` в `components/bento/TrackedLink.tsx`:

```tsx
export function TrackedLink({
  href,
  event,
  eventProps,
  className,
  children,
  "data-m": dataM,
  "data-m-tilt": dataMTilt,
}: {
  href: string;
  event: string;
  eventProps?: EventProps;
  className?: string;
  children: React.ReactNode;
  // Атрибуты MotionLayer (components/motion): вход блока и наклон обложки.
  "data-m"?: string;
  "data-m-tilt"?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, eventProps)}
      data-m={dataM}
      data-m-tilt={dataMTilt}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 8: Переименовать атрибут по всему коду**

```bash
grep -rl 'data-studio-reveal' app components | grep -v -e 'TrackedLink.tsx' -e '\.css$' | while read f; do sed -i '' 's/data-studio-reveal/data-m="reveal"/g' "$f"; done
grep -rn 'data-studio-reveal' app components
```

Expected после второй команды: остались только строки в `app/studio.css` и `app/personal.css`.

- [ ] **Step 9: Убрать CSS старого reveal**

В `app/studio.css` удалить блок строк 111-124 (комментарий «Scroll reveal: fade + 12px lift…», правила `[data-studio-reveal]` и `[data-studio-reveal].is-visible`) и строку `[data-studio-reveal] { opacity: 1; transform: none; }` внутри reduced-motion около строки 853.
В `app/personal.css` удалить строку `[data-studio-reveal] { opacity: 1; transform: none; }` около строки 1663.

- [ ] **Step 10: CSS-страховка первого экрана и токены**

В `app/razvorot.css` в `:root` после `--rz-ease-in-out` добавить:

```css
  --rz-dur-fast: .35s;
  --rz-dur-base: .7s;
```

После правила `@keyframes rz-safety` добавить:

```css
/* Заголовки первого экрана с data-m-hero ждут MotionLayer, как hero главной.
   Страховка та же: через 4 с проявятся сами. */
@media (prefers-reduced-motion: no-preference) {
  html.js [data-m][data-m-hero]:not(.is-in) { opacity: 0; animation: rz-safety 0s 4s forwards; }
  html.js [data-m-hero]:not(.is-in) .rz-mark { --mark-w: 0%; }
}
```

- [ ] **Step 11: Сборка и тесты**

Run: `npm test && npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 12: Проверка в браузере (контроллер)**

`npm start -- -p 3100` в фоне. В браузере на 1440 и 375 px открыть `/`, `/products`, `/products/guide`, `/about`, `/blog`:
- блоки при скролле входят снизу, после входа видны;
- консоль без ошибок и без `[motion]`-предупреждений;
- в консоли `document.querySelectorAll('[data-m]:not(.is-in)').length` после прокрутки страницы до конца и 2 с ожидания равно `0`.

- [ ] **Step 13: Коммит**

```bash
git add -A components/motion components/bento app
git commit -m "feat(motion): MotionLayer на GSAP вместо BentoReveal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Главная — перенос HomeMotion на data-m и пин-сцена каталога

**Files:**
- Modify: `components/motion/HomeMotion.tsx:78-155` (оставить только hero)
- Modify: `app/page.tsx` (разметка)
- Modify: `app/razvorot.css:148-155` (строки каталога)

**Interfaces:**
- Consumes: `data-m` API, сцена `products-index`, `--row-bar`.

- [ ] **Step 1: HomeMotion — только hero**

В `components/motion/HomeMotion.tsx` удалить блоки «Продукты: строки входят каскадом», «Обо мне: портрет с параллаксом», «Финальный CTA: маркер…» и «Магнитные кнопки» (строки от комментария `// --- Продукты` до `return () => cleanups.forEach((fn) => fn());` включительно). На их место поставить:

```ts
      // Каталог, портрет, финальный CTA и магнит кнопок живут в MotionLayer (data-m).
      ScrollTrigger.refresh();
```

Из импорта убрать `hasFinePointer`, удалить строку `const fine = hasFinePointer();`.

- [ ] **Step 2: Разметка главной**

В `app/page.tsx`:

1. Заголовок секции «Продукты» — применить шаблон заголовка секции (Conventions).
2. `<div className="rz-index">` → `<div className="rz-index" data-m="pin" data-m-scene="products-index">`.
3. Портрет: у `<img src="/portrait-editorial.jpg" …>` добавить `data-m="parallax"`. У `div.rz-portrait` оставить `data-m="reveal"`.
4. Блок «Обо мне»: у `<h2 className="rz-h2" data-m="reveal">Четвёртый год…` заменить `data-m="reveal"` на `data-m="lines"`.
5. Заголовок секции «Блог» — шаблон заголовка секции.
6. `<div className="rz-posts">` → `<div className="rz-posts" data-m="stagger">`; у каждого `<Link … className="rz-post">` удалить `data-m="reveal"` и `style={{ transitionDelay: … }}`.
7. Финальный CTA: у `<h2 className="rz-h2 rz-cta-title" data-m="reveal">` заменить на `data-m="lines"`.

- [ ] **Step 3: Hover строк без свойств раскладки**

В `app/razvorot.css` заменить:

```css
  transition: padding-left .45s var(--rz-ease);
}
.rz-row::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--rz-lime); transform: scaleY(0); transition: transform .45s var(--rz-ease); }
.rz-row:hover { padding-left: 24px; }
.rz-row:hover::before { transform: scaleY(1); }
```

на

```css
}
/* Полоса читает --row-bar: её тянет пин-сцена каталога (scenes/productsIndex.ts). */
.rz-row::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--rz-lime); transform: scaleY(var(--row-bar, 0)); transition: transform .45s var(--rz-ease); }
.rz-row > * { transition: transform .45s var(--rz-ease); }
.rz-row:hover > :not(.rz-row-price) { transform: translateX(24px); }
.rz-row:hover::before { transform: scaleY(1); }
```

И в `@media (prefers-reduced-motion: reduce)` внизу секции главной (строка с `.rz-row, .rz-row::before, …`) добавить `.rz-row > *` в список селекторов.

- [ ] **Step 4: Сборка**

Run: `npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 5: Проверка в браузере (контроллер)**

1440 px, `/`:
- hero играет как раньше;
- каталог закрепляется, при скролле строки по очереди подсвечиваются лаймом, после последней пин отпускается;
- портрет двигается параллаксом, «Начни с гайда за 590 ₽» — строки выезжают, маркер рисуется;
- магнит на «Смотреть продукты» работает.

375 px, `/`: каталог без пина, строки входят каскадом; портрет не двигается; скролл ровный.

- [ ] **Step 6: Коммит**

```bash
git add components/motion/HomeMotion.tsx app/page.tsx app/razvorot.css
git commit -m "feat(motion): главная на data-m, пин-сцена каталога

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Шапка прячется при скролле, шторка не играет на первой загрузке

**Files:**
- Modify: `components/studio/StudioNav.tsx`
- Modify: `app/template.tsx`
- Modify: `app/razvorot.css` (блок шапки)

**Interfaces:**
- Consumes: `navShouldHide`, `NAV_HIDE_AFTER`, `DUR.fast`, `EASE.inOut`.

- [ ] **Step 1: Шапка**

В `components/studio/StudioNav.tsx`:

импорты:

```tsx
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP, prefersReducedMotion } from "@/components/motion/gsap";
import { navShouldHide } from "@/components/motion/logic";
import { NAV_HIDE_AFTER } from "@/components/motion/tokens";
```

внутри компонента после `const [open, setOpen] = useState(false);`:

```tsx
  const shell = useRef<HTMLElement>(null);

  // Шапка уходит вверх при скролле вниз и возвращается при скролле вверх.
  // Класс, а не твин: переход задан в CSS и отключается reduced-motion.
  useGSAP(() => {
    const el = shell.current;
    if (!el || prefersReducedMotion()) return;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        el.classList.toggle("is-hidden", navShouldHide({
          y: self.scroll(),
          direction: self.direction,
          menuOpen: document.body.classList.contains("rz-menu-open"),
          threshold: NAV_HIDE_AFTER,
        }));
      },
    });
  });
```

`<header className="rz-nav-shell">` → `<header className="rz-nav-shell" ref={shell}>`.

- [ ] **Step 2: CSS шапки**

В `app/razvorot.css` после правила `.rz-nav-shell { … }` добавить:

```css
.rz-nav-shell { transition: transform var(--rz-dur-fast) var(--rz-ease); }
.rz-nav-shell.is-hidden { transform: translateY(-100%); }
/* Фокус с клавиатуры всегда возвращает шапку. */
.rz-nav-shell:focus-within { transform: none; }
```

В reduced-motion блоке шапки (`.rz-btn, .rz-nav-links a::before, .rz-menu, .rz-menu-toggle span { transition: none; }`) добавить `.rz-nav-shell` в список.

- [ ] **Step 3: Шторка**

Заменить содержимое `app/template.tsx`:

```tsx
'use client'
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/components/motion/gsap'
import { DUR, EASE } from '@/components/motion/tokens'

// Шторка между страницами: тёмный лист уходит вверх. Template перемонтируется
// на каждый переход, модуль — нет, поэтому флаг живёт на уровне модуля.
// На первой загрузке шторки нет: человек из рилса не должен видеть чёрный экран.
// В dev StrictMode эффект вызывается дважды, и шторка может сыграть на первой загрузке. В проде этого нет.
let hasNavigated = false

export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = curtain.current
    if (!el) return
    if (!hasNavigated) { hasNavigated = true; return }
    if (prefersReducedMotion()) return
    // useGSAP — layout effect: лист показывается до первой отрисовки новой страницы.
    el.style.display = 'block'
    gsap.set(el, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' })
    gsap.to(el, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: DUR.fast,
      delay: 0.05,
      ease: EASE.inOut,
      onComplete: () => { el.style.display = 'none' },
    })
  }, [])
  return (
    <>
      <div ref={curtain} className="fixed inset-0 z-[90] bg-dark" style={{ display: 'none' }} aria-hidden="true" />
      {children}
    </>
  )
}
```

- [ ] **Step 4: Сборка**

Run: `npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 5: Проверка в браузере (контроллер, прод-сборка)**

- Прямой заход на `/products/guide`: тёмного листа нет.
- Клик «Все форматы» → шторка 0,35 с.
- Скролл вниз на 400 px — шапка уходит; вверх — возвращается. Открытое мобильное меню (375 px) — шапка не уходит.

- [ ] **Step 6: Коммит**

```bash
git add components/studio/StudioNav.tsx app/template.tsx app/razvorot.css
git commit -m "feat(motion): шапка прячется при скролле, шторка без первой загрузки

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Каталог, страница продукта, «Обо мне»

**Files:**
- Modify: `app/products/page.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/razvorot.css` (обёртка обложки, линия таймлайна, hover таймлайна)

- [ ] **Step 1: `/products`**

1. `<h1 className="rz-h1">` → `<h1 className="rz-h1" data-m="lines" data-m-hero>`.
2. `<div className="rz-wrap rz-grid" id="list">` → `<div className="rz-wrap rz-grid" id="list" data-m="stagger">`.
3. У `TrackedLink` карточки заменить `data-m="reveal"` на `data-m-tilt=""`.
4. У `<img className="rz-card-cover" …>` добавить `data-m-tilt-target=""`; у `<div className="rz-card-cover rz-card-cover--typo">` тоже.
5. Заголовки секций «Как выбрать» и «Вопросы» — шаблон заголовка секции.
6. `<div className="rz-pick">` → `<div className="rz-pick" data-m="stagger">`; у его детей `<div key={item.tag} data-m="reveal">` удалить `data-m="reveal"`.

- [ ] **Step 2: `/products/[slug]`**

1. `<h1 className="rz-h1 rz-product-title">` → добавить `data-m="lines" data-m-hero`.
2. Цену в hero (`.rz-product-grid .rz-product-price`) не трогать: первый экран показывает реальную цену сразу.
3. Обложку обернуть:

```tsx
<div className="rz-product-cover-wrap">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    className="rz-product-cover"
    src={product.cover.src}
    width={product.cover.width}
    height={product.cover.height}
    alt=""
    data-m="parallax"
    data-m-depth="6"
  />
</div>
```

(комментарий `// eslint-disable-next-line` над `<img>` перенести внутрь обёртки, как выше).
4. «Чему научишься»: шаблон заголовка секции; `<ul className="rz-list rz-list--cols" data-m="reveal">` → `data-m="stagger"`.
5. «Карта системы»: шаблон заголовка секции.
6. «Для кого» / «Что внутри»: у двух `<div data-m="reveal">` удалить атрибут; у их `<h2 className="rz-h2 rz-h2--sm">` добавить `data-m="lines"`; у `<ul className="rz-list">` добавить `data-m="stagger"`.
7. «Подробно»: у `<div className="rz-sec-head" data-m="reveal" style={{ marginBottom: 0 }}>` убрать `data-m`, у `h2` добавить `data-m="lines"`.
8. «Вопросы»: шаблон заголовка секции.
9. Финальный блок: у `<p className="rz-product-price">` внутри `.rz-product-final` добавить `data-m="count"`.

- [ ] **Step 3: `/about`**

1. `<h1 className="rz-h1">` → `data-m="lines" data-m-hero`.
2. Факты: `<div className="rz-wrap rz-facts">` → добавить `data-m="stagger"`; у детей удалить `data-m="reveal"`; у `<strong>{f.n}</strong>` добавить `data-m="count"`.
3. Все `.rz-sec-head` на странице — шаблон заголовка секции.
4. Таймлайн: первым ребёнком `<div className="rz-tl">` вставить `<span className="rz-tl-line" data-m="draw" aria-hidden="true" />`; у `<span className="rz-tl-year">` добавить `data-m="count"`.
5. `<div className="rz-pr">` → добавить `data-m="stagger"`, у `<article … data-m="reveal">` удалить атрибут.
6. Финальный CTA: у `h2.rz-cta-title` заменить `data-m="reveal"` на `data-m="lines"`.

- [ ] **Step 4: CSS**

В `app/razvorot.css`:

после `.rz-product-cover { … }`:

```css
/* Обложка двигается параллаксом внутри рамки, края прячет масштаб. */
.rz-product-cover-wrap { overflow: hidden; border: 1px solid var(--rz-line); }
.rz-product-cover-wrap .rz-product-cover { border: 0; }
```

заменить hover таймлайна:

```css
.rz-tl-row { display: grid; grid-template-columns: 140px 320px 1fr; gap: 32px; padding: 30px 0; border-bottom: 1px solid var(--rz-line); position: relative; transition: padding-left .45s var(--rz-ease); }
```

на

```css
.rz-tl-row { display: grid; grid-template-columns: 140px 320px 1fr; gap: 32px; padding: 30px 0; border-bottom: 1px solid var(--rz-line); position: relative; }
.rz-tl-row > * { transition: transform .45s var(--rz-ease); }
.rz-tl-row:hover > * { transform: translateX(24px); }
```

и удалить строку `.rz-tl-row:hover { padding-left: 24px; }`.

после `.rz-tl { … }`:

```css
.rz-tl { position: relative; }
/* Линия таймлайна рисуется скроллом (data-m="draw"); без мыши стоит целиком. */
.rz-tl-line { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--rz-ink); transform-origin: top; pointer-events: none; z-index: 1; }
```

в reduced-motion блоке «Обо мне» (`.rz-tl-row, .rz-tl-row::before, .rz-stack span { transition: none; }`) добавить `.rz-tl-row > *`.

То же для `.rz-spread` (строки `transition: padding-left …` и `.rz-spread:hover { padding-left: 24px; }`): заменить на

```css
.rz-spread > * { transition: transform .45s var(--rz-ease); }
.rz-spread:hover > * { transform: translateX(24px); }
```

убрав `transition: padding-left .45s var(--rz-ease);` из `.rz-spread` и правило `.rz-spread:hover { padding-left: 24px; }`.

- [ ] **Step 5: Проверка отсутствия padding-анимаций**

Run: `grep -n "padding-left \.\|:hover { padding" app/razvorot.css`
Expected: пусто.

- [ ] **Step 6: Сборка**

Run: `npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 7: Проверка в браузере (контроллер)**

1440 px:
- `/products`: заголовок выезжает строками, карточки входят по диагонали, обложки наклоняются за курсором не больше 6°;
- `/products/guide`: цена в hero видна сразу, обложка с параллаксом, в финальном блоке «590 ₽» набегает;
- `/about`: годы и факты набегают, «Сейчас» остаётся текстом, линия таймлайна рисуется скроллом.

375 px: наклона и параллакса нет, линия таймлайна стоит целиком, горизонтального скролла нет (`document.documentElement.scrollWidth === innerWidth`).

- [ ] **Step 8: Коммит**

```bash
git add app/products/page.tsx "app/products/[slug]/page.tsx" app/about/page.tsx app/razvorot.css
git commit -m "feat(motion): хореография каталога, продукта и страницы обо мне

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Программа, аудит и старые страницы без animejs

**Files:**
- Modify: `app/products/personal-program/ProgramMotion.tsx`
- Modify: `app/products/personal-program/ProgramClient.tsx:19` (атрибут `data-magnet="own"`)
- Modify: `app/audit/page.tsx:4,97-108,352-355`
- Modify: `app/globals.css:220-224`
- Modify: `app/vibecoding/page.tsx`, `app/guide/vtoroy-mozg/page.tsx`
- Delete: `components/motion/Reveal.tsx`

- [ ] **Step 1: ProgramMotion на GSAP**

В `ProgramMotion.tsx`:

импорты:

```ts
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/components/motion/gsap";
import { EASE } from "@/components/motion/tokens";
```

удалить `import { animate, createTimeline, stagger } from "animejs";` и `const EASE = "cubicBezier(.2,.7,.2,1)";`.

блок `if (quickMount) { … }` — заменить тело таймлайна:

```ts
    let tl: gsap.core.Timeline | null = null;
    if (quickMount) {
      page.classList.add("program-hero-armed");
      tl = gsap.timeline({ defaults: { ease: EASE.out, duration: 0.95 } });
      tl.fromTo(hero, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, stagger: 0.085 }, 0);
      if (card) {
        tl.fromTo(card,
          { autoAlpha: 0, y: 46, rotationY: -18, rotationX: 9 },
          { autoAlpha: 1, y: 0, rotationY: 0, rotationX: 0, duration: 1.3, ease: "expo.out" },
          0.22);
      }
      tl.fromTo(page.querySelectorAll(".program-facts > div"),
        { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.7 }, 0.5);
      window.setTimeout(() => page.classList.add("program-mark-in"), 650);
    } else {
      page.classList.add("program-mark-in");
    }
```

и в конце эффекта `return () => io.disconnect();` → `return () => { io.disconnect(); tl?.kill(); };`.

`useMagnet` — заменить обработчики:

```ts
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: dx * 0.18, y: dy * 0.28, duration: 0.35, ease: "power1.out", overwrite: "auto" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
```

`TiltCard` не трогать (на requestAnimationFrame, без animejs).

- [ ] **Step 2: Свой магнит программы не дублируется**

В `ProgramClient.tsx` строка 21:

```tsx
    <a ref={ref} className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
```

→

```tsx
    <a ref={ref} className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} data-magnet="own">
```

- [ ] **Step 3: Аудит**

В `app/audit/page.tsx`:
- `import { animate } from "animejs";` → `import { gsap } from "@/components/motion/gsap";` и `import { EASE } from "@/components/motion/tokens";`
- эффект шторки шагов (строки 97-108):

```ts
  // Смена шага: вертикальная шторка clip-path. Reduced motion — мгновенная смена.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) return;
    const tween = gsap.fromTo(el,
      { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 },
      { clipPath: "inset(0 0 0% 0)", autoAlpha: 1, duration: 0.5, ease: EASE.inOut });
    return () => { tween.kill(); };
  }, [step, reduced]);
```

- полоса прогресса: `style={{ width: \`${progress}%\` }}` → `style={{ transform: \`scaleX(${progress / 100})\` }}`.

В `app/globals.css` правило `.audit-progress-fill` (строки 220-224) заменить на:

```css
.audit-progress-fill {
  width: 100%;
  height: 100%;
  background: var(--color-lime-dark);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(.2, .8, .2, 1);
}
```

- [ ] **Step 4: Старые страницы на data-m**

```bash
for f in app/vibecoding/page.tsx app/guide/vtoroy-mozg/page.tsx; do
  sed -i '' -e '/import { Reveal } from "@\/components\/motion\/Reveal";/d' \
            -e 's/<Reveal>/<div data-m="stagger">/g' \
            -e 's/<Reveal /<div data-m="stagger" /g' \
            -e 's/<\/Reveal>/<\/div>/g' \
            -e 's/data-reveal/data-m-item/g' "$f"
done
grep -n "Reveal\|data-reveal" app/vibecoding/page.tsx app/guide/vtoroy-mozg/page.tsx
git rm components/motion/Reveal.tsx
```

Expected после `grep`: пусто.

- [ ] **Step 5: animejs больше не используется**

Run: `grep -rn "animejs" app components lib`
Expected: только `components/desk/DeskFx.tsx` (удаляется в Task 8).

- [ ] **Step 6: Сборка**

Run: `npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 7: Проверка в браузере (контроллер)**

- `/products/personal-program`: hero, карточка с наклоном и магнит кнопки как раньше.
- `/audit`: пройти 3 шага — шторка между шагами, полоса прогресса растёт плавно.
- `/vibecoding`, `/guide/vtoroy-mozg`: блоки входят каскадом, после прокрутки всё видно.

- [ ] **Step 8: Коммит**

```bash
git add -A app components/motion
git commit -m "refactor(motion): программа, аудит и старые страницы на GSAP

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Прогресс чтения статьи

**Files:**
- Create: `components/motion/ReadingProgress.tsx`
- Modify: `app/blog/[slug]/page.tsx` (монтирование)
- Modify: `app/razvorot.css` (стиль полосы)

- [ ] **Step 1: Компонент**

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

// Полоса сверху показывает, сколько статьи прочитано. Это индикатор,
// а не украшение, поэтому работает и при reduced-motion: скраб без сглаживания.
export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = bar.current;
    const article = document.querySelector(target);
    if (!el || !article) return;
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: article, start: "top top", end: "bottom bottom", scrub: true },
    });
  });
  return <div ref={bar} className="rz-read-progress" aria-hidden="true" />;
}
```

- [ ] **Step 2: CSS**

В конец `app/razvorot.css`:

```css
/* ===== Прогресс чтения статьи ===== */
.rz-read-progress {
  position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 70;
  background: var(--rz-lime); transform: scaleX(0); transform-origin: left; pointer-events: none;
}
```

- [ ] **Step 3: Монтирование**

В `app/blog/[slug]/page.tsx` добавить импорт `import ReadingProgress from "@/components/motion/ReadingProgress";` и первым элементом внутри возвращаемого фрагмента `<>` поставить `<ReadingProgress target=".studio-article" />`.

- [ ] **Step 4: Сборка**

Run: `npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 5: Проверка (контроллер)**

Открыть любую статью `/blog/<slug>`: при скролле полоса сверху растёт, в конце статьи заполнена целиком.

- [ ] **Step 6: Коммит**

```bash
git add components/motion/ReadingProgress.tsx "app/blog/[slug]/page.tsx" app/razvorot.css
git commit -m "feat(motion): полоса прогресса чтения в статье

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Чистка, зависимости, замер «после»

**Files:**
- Delete: `components/desk/*` кроме `DeskFooter.tsx`
- Delete: `components/motion/observeOnce.ts` (если импортов не осталось)
- Modify: `app/globals.css:1010-1014` (правило `.js-desk`)
- Modify: `app/studio.css` (мёртвые `studio-ping`, `studio-ticker`)
- Modify: `package.json`
- Modify: `docs/superpowers/plans/2026-09-23-motion-perf.md`

- [ ] **Step 1: Удалить мёртвые компоненты desk**

```bash
for f in components/desk/*.tsx; do
  n=$(basename "$f" .tsx)
  [ "$n" = "DeskFooter" ] && continue
  if grep -rq "desk/$n\b" app components lib --exclude-dir=desk; then echo "ИСПОЛЬЗУЕТСЯ: $n"; else git rm -q "$f"; fi
done
grep -rq "observeOnce" app components lib || git rm -q components/motion/observeOnce.ts
ls components/desk
```

Expected: в `components/desk` остался `DeskFooter.tsx`, строк «ИСПОЛЬЗУЕТСЯ» нет. Если есть — остановиться и сообщить контроллеру.

- [ ] **Step 2: Мёртвый CSS**

- `app/globals.css`: удалить блок с комментарием «Scroll-reveal initial state; DeskFx animates to visible…» и медиазапросом с `.js-desk [data-rv] { opacity: 0; }` (около строк 1010-1014), а также строку-комментарий `/* Hand-drawn SVG strokes (drawn in by anime.js). */` заменить на `/* Hand-drawn SVG strokes. */`.
- `app/studio.css`: проверить, что классы не используются, и удалить правила:

```bash
grep -rn "studio-status\|studio-ticker" app components --include='*.tsx'
```

Expected: пусто. Тогда удалить из `app/studio.css` правила `.studio-status::after` (с `animation: studio-ping`), `@keyframes studio-ping`, все правила `.studio-ticker…` и `@keyframes studio-ticker`.

- [ ] **Step 3: Зависимости**

```bash
npm uninstall animejs split-type ogl
grep -rn "from \"animejs\"\|from 'animejs'\|split-type\|from \"ogl\"" app components lib
```

Expected: пусто.

- [ ] **Step 4: Полная сборка**

Run: `npm test && npx tsc --noEmit -p . && npm run lint && npm run build`
Expected: без ошибок.

- [ ] **Step 5: Замер «после»**

Повторить команды Task 1 Step 2 с именами файлов `after-home.json`, `after-guide.json`. Дописать строки «после» в `docs/superpowers/plans/2026-09-23-motion-perf.md`.
Критерий: CLS = 0; LCP и TBT на обеих страницах не хуже «до» более чем на 10% (разброс Lighthouse между прогонами). Если хуже — сообщить контроллеру с цифрами, не коммитить.

- [ ] **Step 6: Коммит**

```bash
git add -A
git commit -m "chore(motion): удалить animejs, мёртвые desk-компоненты и CSS

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Финальная проверка (контроллер)**

Прод-сборка на порту 3100.
1. Каждая страница — `/`, `/products`, `/products/guide`, `/products/personal-program`, `/about`, `/audit`, `/blog`, одна статья, `/vibecoding`, `/guide/vtoroy-mozg` — на 375 и 1440 px: скриншот, консоль без ошибок.
2. reduced-motion. MotionLayer перечитывает `matchMedia` на каждый переход, поэтому достаточно подменить его и перейти по внутренней ссылке. На `/` в консоли:

   ```js
   const real = window.matchMedia.bind(window);
   window.matchMedia = (q) => q.includes("prefers-reduced-motion") ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : real(q);
   ```

   Кликнуть «Кто я» (переход на `/about`) и сразу выполнить:

   ```js
   [...document.querySelectorAll("[data-m]")].filter((e) => !e.classList.contains("is-in") || getComputedStyle(e).opacity !== "1").length
   ```

   Expected: `0`.
3. Утечка триггеров — на `npm run dev` (в проде `window.__gsap` нет). Пройти круг `/ → /products → /products/guide → /about → /blog → /` ссылками три раза, после каждого круга на `/` выполнить `window.__gsap.core.globals().ScrollTrigger.getAll().length`. Expected: одно и то же число после каждого круга.
4. Горизонтального скролла на 375 px нет ни на одной странице: `document.documentElement.scrollWidth === innerWidth`.
