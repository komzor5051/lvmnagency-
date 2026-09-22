# Единая система анимаций сайта

Дата: 2026-09-23. Статус: дизайн утверждён Владом, ждёт план реализации.

## Зачем

На сайте три движка анимаций одновременно: GSAP (главная, шторка в `app/template.tsx`),
animejs (`components/motion/Reveal.tsx`, `app/audit/page.tsx`,
`app/products/personal-program/ProgramMotion.tsx`, мёртвый `components/desk/DeskFx.tsx`)
и CSS-классы (`components/bento/BentoReveal.tsx` + `[data-studio-reveal]`).
Хореография есть только на главной. Страницы продуктов, `/about`, `/products` почти статичны.
Шторка между страницами закрывает и первую загрузку: человек из рилса видит тёмный лист 0,55 с.

Цель: один движок, один декларативный API, выразительное движение на всех страницах
на дизайне «Разворот» (`rz-*`) без потерь в производительности на мобильном.

Выбранный характер — выразительный. Трафик приходит с рилсов во встроенный браузер
Instagram на телефоне, поэтому на таче движение облегчено (см. «Уровни»).

Вне задачи: воронка гайда (липкая кнопка, CTA после блоков, страница после оплаты,
замер скролла) — следующая задача. Перевод `/blog`, статьи, футера, `/vibecoding`,
`/guide/vtoroy-mozg` на `rz-*` и большая чистка CSS — отдельная задача.

## Архитектура

### Один движок — GSAP

Точка регистрации остаётся `components/motion/gsap.ts` (ScrollTrigger, SplitText, useGSAP,
`prefersReducedMotion`, `hasFinePointer`). animejs удаляется из кода и из `package.json`.
`split-type` и `ogl` удаляются из `package.json` (импортов нет).

### Токены

Новый файл `components/motion/tokens.ts`:

- длительности: `fast 0.35`, `base 0.7`, `slow 1.1`
- кривые: `EASE_OUT = power3.out`, `EASE_IN_OUT = power4.inOut`, `EASE_LINES = power4.out`
- шаг каскада: `STAGGER = 0.08`, для строк заголовка `0.12`
- смещение входа: `RISE = 32` px (на таче `20`)

CSS-зеркало в `app/razvorot.css`: существующие `--rz-ease`, `--rz-ease-in-out`
плюс `--rz-dur-fast`, `--rz-dur-base`. CSS-hover и GSAP-вход используют одни значения.
`EASE_OUT`/`EASE_IN_OUT` переезжают из `gsap.ts` в `tokens.ts`, `gsap.ts` их реэкспортирует.

### Декларативный API: `data-m`

Серверные страницы размечают элементы атрибутами. Клиентский `components/motion/MotionLayer.tsx`
монтируется один раз в `app/layout.tsx`, на каждое изменение `usePathname()` находит элементы
и создаёт твины. При смене страницы все его ScrollTrigger-ы и SplitText-ы откатываются
(`ctx.revert()` из `gsap.context` / `useGSAP`).

| Атрибут | Поведение | Доп. атрибуты |
|---|---|---|
| `data-m="lines"` | SplitText по строкам с маской, строки выезжают `yPercent 110 → 0`. После окончания `split.revert()` | — |
| `data-m="reveal"` | блок входит: `autoAlpha 0, y RISE → 0` | `data-m-delay` |
| `data-m="stagger"` | прямые потомки входят каскадом | `data-m-step` |
| `data-m="mark"` | `--mark-w 0% → 100%` на `.rz-mark` внутри | — |
| `data-m="count"` | число в элементе набегает от 0 (год — от значения −24) | — |
| `data-m="parallax"` | `yPercent` со скрабом | `data-m-depth` (по умолчанию 12) |
| `data-m="pin"` | закреплённая сцена, хореография по `data-m-scene` | `data-m-scene` |
| `data-m="draw"` | линия рисуется по скроллу (`scaleY 0 → 1`, скраб) | — |

Триггер входа по умолчанию: `start: "top 85%"`, `once: true`.

`data-m-scene` — имя функции из реестра `components/motion/scenes/*.ts`
(как `heroChoreography.ts`): `products-index` для главной. Сцены — единственные места
со «вкусовой» хореографией, остальное общее.

Hero главной остаётся в `HomeMotion.tsx` + `heroChoreography.ts`. Остальные куски
`HomeMotion` (каскад `.rz-row`, параллакс портрета, маркер финального CTA, магнит кнопок)
переезжают на `data-m` и общий магнит в `MotionLayer`.

### Контент не прячется без JS

Скрытие только после гидратации через `gsap.set`, как сейчас в `HomeMotion`.
Для элементов в первом экране (где вспышка заметна) используется существующий приём
`html.js` + страховка `animation: rz-safety 0s 4s forwards` из `app/razvorot.css:133-142`,
обобщённый на `html.js [data-m="lines"]:not(.is-in)` и `html.js [data-m="mark"]:not(.is-in)`
внутри первого экрана. `MotionLayer` ставит `.is-in` по окончании.

### Уровни

1. Десктоп, `pointer: fine`, без reduced-motion — всё: `pin`, `parallax`, `draw` со скрабом,
   магнитные кнопки, наклон обложек за курсором.
2. Тач (`pointer: coarse`) — входы (`lines`, `reveal`, `stagger`, `mark`, `count`).
   `pin` превращается в `stagger` (строки каталога входят каскадом), `parallax` и `draw`
   не двигаются (картинка и линия стоят на месте, их обёртки входят обычным `reveal`).
   Магнита на таче нет.
3. `prefers-reduced-motion: reduce` — `MotionLayer` ничего не скрывает и не запускает,
   CSS-страховка снимается медиазапросом.

### Переходы между страницами

`app/template.tsx`: шторка не играет на первой загрузке (флаг в `sessionStorage`
или модульная переменная «уже была навигация»). На внутренних переходах — 0,35 с вместо 0,55
(`delay 0.05` сохраняется).

### Шапка

`.rz-nav-shell` прячется при скролле вниз (`yPercent -100`) после 120 px и возвращается
при скролле вверх. Через один ScrollTrigger с `onUpdate` и `self.direction`.
При открытом мобильном меню не прячется.

## Хореография по страницам

Общее для всех `rz-*` страниц: `h1` — `lines` + `mark`, `h2` секций — `lines`,
списки и сетки — `stagger`, кнопки `.rz-btn--solid` — магнит (десктоп) / сжатие (тач).

| Страница | Файл | Главный момент |
|---|---|---|
| `/` | `app/page.tsx`, `HomeMotion.tsx` | hero без изменений; блок продуктов на десктопе — `pin` сцена `products-index`: `.rz-index` закреплён, скролл по очереди делает строку `.rz-row` активной (лаймовая полоса `::before` `scaleY 1`, как hover, остальные строки `opacity .45`); после последней строки пин отпускается. Картинок-превью в строках нет, сцена их не добавляет |
| `/products` | `app/products/page.tsx` | блоки каталога `stagger` по диагонали (задержка = строка + колонка); обложки наклоняются за курсором (десктоп, ≤ 6°) |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | обложка `parallax`; «Чему научишься» — `stagger` (номеров у пунктов нет, новых не добавляем); цена в `.rz-product-final` — `count`; цена в hero не анимируется, чтобы была видна сразу |
| `/about` | `app/about/page.tsx` | таймлайн: вертикальная линия `draw` со скрабом, годы `count` |
| `/products/personal-program` | `ProgramMotion.tsx` | перенос с animejs на GSAP один в один: вход hero, 3D-наклон карточки, магнит |
| `/audit` | `app/audit/page.tsx` | шторка между шагами на GSAP (clip-path, 0,5 с, `EASE_IN_OUT`); полоса прогресса шагов `scaleX` |
| `/blog`, `/blog/[slug]`, футер, `/vibecoding`, `/guide/vtoroy-mozg` | — | только `reveal`/`stagger` вместо `BentoReveal`/animejs `Reveal`; у статьи — полоса прогресса чтения сверху (`scaleX` со скрабом, 2 px, лайм) |

## Чистка

- Удалить: `components/desk/*` кроме `DeskFooter.tsx`; `components/motion/Reveal.tsx`;
  `components/bento/BentoReveal.tsx` (и его монтирование в `app/layout.tsx`).
  Перед удалением каждого файла — проверка импортов (`grep`).
- `[data-studio-reveal]` в разметке заменить на `data-m="reveal"`; CSS `.is-visible`
  для него удалить из `app/studio.css`.
- Правило скрытия `.js-desk` в `app/globals.css` (около строки 1012) удалить.
- `app/studio.css`: `studio-ping` и `studio-ticker` — мёртвые правила (классы `studio-status`,
  `studio-ticker` нигде не используются), удалить.
- `app/razvorot.css`: hover `.rz-row` и `.rz-tl-row` анимирует `padding-left` (свойство раскладки).
  Перевести на `transform: translateX()` содержимого.
- `package.json`: удалить `animejs`, `split-type`, `ogl`.

## Бюджет производительности

- Анимируются только `transform`, `opacity`, `clip-path`, CSS-переменная `--mark-w`.
- CLS = 0 на всех страницах.
- JS страницы не растёт: GSAP уже в бандле, animejs уходит.
- Lighthouse mobile (локальная прод-сборка, `npm run build && npm start`) для `/`
  и `/products/guide`: LCP и TBT не хуже замера до изменений. Замер «до» — первым шагом плана.
- При переходах между страницами число живых ScrollTrigger-ов
  (`ScrollTrigger.getAll().length`) не растёт.

## Проверка

1. `npm run build` и `npm run lint` без ошибок.
2. Каждая страница из таблицы в браузере на 375 px и 1440 px: скриншот, консоль без ошибок.
3. reduced-motion (подмена `matchMedia` в консоли или эмуляция): весь текст виден сразу.
4. Пять переходов туда-обратно `/ → /products → /products/guide → /about → /blog`:
   анимации не дублируются, `ScrollTrigger.getAll().length` стабилен.
5. Lighthouse до/после по бюджету выше.

## Порядок работ

1. Замер Lighthouse «до». `tokens.ts`, `MotionLayer.tsx`, уровни, CSS-страховка.
2. Перенос `HomeMotion` на `data-m`, шапка, шторка.
3. Страницы: `/products/[slug]`, `/products`, `/about`, программа, аудит.
4. Старые страницы на `reveal`, прогресс чтения.
5. Чистка, зависимости, замер «после», проверка.
