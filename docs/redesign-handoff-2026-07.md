# Редизайн vladlyamin.ru — хэндофф (2026-07-15)

Статус: главная страница переведена на новый концепт и работает. Продолжаем с внутренних страниц.

## Утверждённый концепт: «Стол» (Desk DS)

Сайт — вид сверху на чертёжный стол. Фон: белая калька (двойная сетка + крестики,
на body в globals.css, по всему сайту). Элементы — бумаги/полароиды/стикеры,
парящие над столом: мягкие ink-тени, лёгкие повороты, лаймовый скотч. Радиус 0.
Эталонный прототип: `docs/design-concepts/variant-b2-desk.html` (композиция),
живая реализация: главная (`app/page.tsx` + `components/desk/`).

## Типографика (финал, три итерации отбора)

| Роль | Шрифт | Как |
|---|---|---|
| Заголовки, цены, цифры | **Tektur** 700-800 (Google, cyrillic) | sentence case, акцентное слово в лаймовом маркере `.hl`; утилита `font-tektur`, класс `.desk-display` |
| Текст | Onest | как раньше |
| Пометки на бумагах | Playfair Display Italic 600 | класс `.desk-note` (подписи фото, стикеры, маргиналии) |
| Обложки блога | Playfair Display | не трогали |

ОТВЕРГНУТО (не предлагать снова): Martina scriptC / каллиграфия в заголовках
(«свадебно») и в мелких кеглях (нечитаемо), Playfair капс в заголовках,
Inter Tight 900 как дисплей. Martina/Amelia self-hosted лежат в `public/fonts/`
и подключены как `--font-hand`, но НЕ используются на страницах.
Лаборатории для сравнения: `docs/design-concepts/font-lab.html`,
`display-lab.html`, `type-duel.html`, борд: `docs/design-concepts/index.html`.

## Что сделано в коде (не закоммичено!)

- `app/layout.tsx`: шрифты (Tektur, Playfair 800, Martina как --font-hand,
  Marck Script удалён), HudFrame + Preloader заменены на `DeskNav`
  (HudProvider оставлен — его контекст используют старые Chapter-компоненты).
- `app/globals.css`: внизу слой «DESK DS» — калька на body, `.desk-display`,
  `.desk-note`, `.desk-sheet/--high/--low`, `.desk-tape`, `.desk-pin`,
  `.desk-btn/--lime`, `.desk-u`, `.desk-stroke`, reveal-состояния `[data-rv]`,
  sticky-стопка `.desk-stack-card`. Всё в `@layer components`, чтобы
  Tailwind-утилиты побеждали (иначе ломается max-sm:hidden и т.п.).
- `components/desk/`: DeskNav (бумажная полоска, мобильный бургер),
  DeskFx (anime.js-раннтайм: reveals по IO, depth-параллакс `[data-depth]`
  + `data-rot`, SVG-штрихи `.draw-hero`/`.draw-visible`, скраб-пунктир
  `#desk-proc-path`, счётчик `[data-counter]`, tilt `[data-tilt]`; уважает
  prefers-reduced-motion, все анимации отменяются в cleanup),
  DeskHero, DeskAbout, DeskServices (данные из `lib/products.ts`:
  guide 990 ₽ → lava.top, audit 15 000 ₽ тёмная карта → /audit,
  consultation 5 000 ₽, ai-os от 150 000 ₽ → Telegram), DeskProcess,
  DeskProof, DeskCta, DeskFooter.
- `app/page.tsx`: собран из desk-секций. Старые `components/home/` и
  `components/hud/` НЕ удалены (снести после утверждения всего редизайна).
- `public/fonts/`: martina-script.woff2/ttf, amelia-dg.woff2/ttf.
- Production build проходит, мобилка проверена на 375px.

## TODO (по порядку)

1. ~~**/about**~~ СДЕЛАНО (2026-07-15): страница пересобрана на Desk DS —
   `components/desk/DeskAboutHero/Timeline/Principles` + DeskFx + DeskFooter,
   metadata и Person-schema сохранены. Старые `components/about/*` не удалены
   (снести вместе с components/home при чистке, п. 6). Проверено на 1440/375.
2. ~~**/products** и карточки `/products/[slug]`~~ СДЕЛАНО (2026-07-15):
   индекс — сетка приколотых desk-sheet карточек (пин, Tektur-цены, курс —
   лаймовый стикер), карточка товара — один большой лист-документ на скотче
   (BuyAction/Faq/WaitlistForm переиспользованы как есть).
   `app/products/ProductSection.tsx` больше не импортируется — удалить при
   чистке (п. 6). ТАКЖЕ (2026-07-15, запрос Влада «больше 3d»): Desk DS
   прокачан физикой — трёхслойные тени desk-sheet, 3D-пин (шар с бликом +
   контактная тень иглы), глянцевый скотч с фактурой, и scroll-sway в DeskFx
   (листки качаются от скорости скролла; базовый rotate живёт в CSS-свойстве
   rotate и не конфликтует). Nav и [data-depth]-элементы из sway исключены.
   Sway = недодемпфированная пружина (жёсткость 130, демпфер 6, кламп 5°),
   скорость меряется по кадрам — работает поверх Lenis. ВАЖНО: на время
   качания DeskFx ставит transitionProperty:'none' (иначе Tailwind
   transition-transform на hover-карточках сглаживает покадровые записи в
   ноль — уже наступали) и после успокоения возвращает transform/transition
   в CSS, чтобы hover-эффекты жили.
3. ~~**/audit**~~ СДЕЛАНО (2026-07-15): тёмная стадия перекрашена в кальку
   через те же var-overrides в `.audit-page` (логика шагов не тронута).
   Вопрос теперь на белом листе со скотчем (`.audit-step`), заголовки Tektur,
   собственная `.audit-nav` удалена — шапка теперь глобальный DeskNav
   (padding-top: 92px), Chapter/useHudApi из page.tsx выпилены. Лайм как цвет
   текста заменён на ink (step-num, stat-value, priority, first-step h3,
   label); карточки результата получили desk-тени.
4. ~~**Блог**~~ СДЕЛАНО (2026-07-16): индекс — один длинный лист со скотчем
   (Chapter/bg-paper2/SplitLines убраны, h1 и заголовки строк → Tektur,
   обложки-миниатюры не тронуты); статья — весь контент (шапка + текст + TOC
   на полях + CTA) на одном большом desk-sheet со скотчем, h1 → Tektur,
   хлебная крошка больше не прячется за DeskNav (pt-[110px]), DeskFooter на
   обеих страницах. DeskFx на блог НЕ подключён сознательно: sway высоченного
   листа статьи вокруг верхней точки крепления давал бы огромный сдвиг низа.
   JSON-LD и prose-стили blog.css не тронуты.
5. ~~**Хром**~~ СДЕЛАНО (2026-07-16): favicon.png (256) + apple-icon.png (180)
   перерисованы в Desk DS — белый лист на кальке, лаймовый скотч, «ВЛ» в
   Tektur (рендер через Playwright из scratchpad-HTML; исходник одноразовый).
   Неиспользуемый favicon.svg (старый «LV») удалён. opengraph-image главной
   переписан под Desk DS: калька + лист со скотчем + Tektur-заголовок «Я Влад.
   Строю системы с AI» с лайм-маркером; шрифты для satori лежат в
   public/fonts/tektur-800.ttf и onest-500.ttf (полные TTF с кириллицей).
   Preloader: решение — НЕ нужен (DeskNav и калька рендерятся мгновенно).
6. ~~**Чистка**~~ СДЕЛАНО (2026-07-16): удалены components/home/*,
   components/hud/* (HudProvider выпилен из layout), components/about/*,
   app/products/ProductSection.tsx, 11 неиспользуемых файлов из
   components/motion (остались LenisProvider, Reveal, observeOnce,
   useReducedMotion). /vibecoding и /guide/vtoroy-mozg переведены с
   home/Footer на DeskFooter. Amelia-шрифты удалены; Martina осталась —
   font-hand используют /vibecoding и desk-script классы. Lenis оставлен.
7. **Копирайтинг-ревизия**: тексты главной черновые (мои), прогнать через
   Влада/скилл content: цитата клиента — placeholder, цифра 50-70% из CLAUDE.md.
   ПОЗИЦИОНИРОВАНИЕ (Влад, 2026-07-15): это ЛИЧНЫЙ сайт + продукты, не
   сервисный лендинг. «Второй мозг» убран с витрины полностью (hero →
   «Я Влад. Строю системы с AI», DeskNav → «AI на практике»); термин легален
   только в гайде /guide/vtoroy-mozg и как тема статей блога. Metadata в
   layout.tsx («помогаю фаундерам...») пересмотреть на этом же этапе.
8. **Фото**: portrait.jpg / portrait-editorial.jpg / founder.jpg — селфи в ч/б;
   для прод-версии снять нормальный портрет (желательно на белом, вид «объект
   на столе»).
9. **Коммит и деплой**: Влад коммит не просил — перед деплоем на VPS
   (rsync + build + pm2 restart, см. CLAUDE.md) закоммитить всё вместе.
10. Лицензия Martina/Amelia — вопрос снят с повестки (шрифты не используются),
    но файлы в repo; если останутся неиспользуемыми — удалить.

## Мобильная адаптация Desk DS (2026-07-16)

Артефакты стола больше НЕ прячутся на мобилке (`max-md:hidden` заменён на
`max-md:static` + наклоны): стикеры и чипы hero главной и /about встают в поток
коллажем, пометка DeskCta и «начните с малого» на /products видимы, полароиды
получили статичный `max-md:rotate-2` (депс-параллакс на ≤768px отключён в
DeskFx — он таскал элементы в статичном потоке). `.desk-stack-card` на ≤900px
сохраняет наклоны (sticky-стопка по-прежнему выключена). Тач-таргеты аудита
подняты до min-height 44px. Горизонтального скролла на 375px нет. Scroll-sway
работает и на тач-скролле (скорость меряется по кадрам).

## Как проверять локально

- Дев-сервер: `npm run dev -- -p 3002` (на 3000 может висеть что-то ещё).
- Прототипы/лаборатории: `python3 -m http.server 8765` из корня репо →
  `http://localhost:8765/docs/design-concepts/` (file:// в playwright заблокирован).
- Если правки globals.css «не применяются» — это кэш Turbopack: `rm -rf .next`
  и перезапустить dev.
