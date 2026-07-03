# Дизайн: отдельные подстраницы продуктов `/products/[slug]`

Дата: 2026-07-03

## Проблема

Сейчас все продукты живут на одной странице `/products` с якорями (`#audit`,
`#guide` и т.д.). Нет прямой ссылки на конкретный продукт, которую удобно
давать в переписке, посте или чате — приходится отправлять якорь на длинную
страницу.

## Решение

Добавить `app/products/[slug]/page.tsx` — отдельную страницу на каждый
продукт из `lib/products.ts`, с собственным URL, метаданными и OG-превью.
`/products` (общий список) остаётся как есть, без изменений в контенте —
только тихий permalink рядом с заголовком каждого продукта.

### Роутинг и данные

- `slug` = существующий `Product.id` (`guide`, `consultation`, `audit`,
  `ai-os`, `course`). Отдельное поле slug не заводим.
- `generateStaticParams()` строит все страницы статически из `products`.
- Неизвестный `slug` → `notFound()`.

### Контент подстраницы

Полный контент — тот же набор блоков, что сейчас на `/products` в
`ProductSection`, но в одну колонку (продукт на странице один, sticky-грид
не нужен):

1. Хлебная крошка `← Продукты` → `/products`
2. Заголовок, `meta`, цена, кнопка покупки (переиспользуется `BuyAction` из
   `app/products/BuyAction.tsx`)
3. Абзацы `product.description`
4. «Для кого» / «Что внутри» из `app/products/content.ts` — если для
   продукта нет записи (как сейчас у `ai-os`), секция просто не рендерится
5. FAQ (переиспользуется `app/products/Faq.tsx`)

Никакой новой общей абстракции над `ProductSection` не вводим — берём те же
готовые куски (`BuyAction`, `Faq`, `productExtras`) и собираем новую разметку
под одну колонку, чтобы не трогать уже рабочий `/products`.

Без картинок — только типографика, в стиле остального сайта (White + Lime,
`font-heading`/`font-mono`, без теней и скруглений).

### Permalink на `/products`

Рядом с `<h2>` в `ProductSection` — маленькая тихая ссылка на
`/products/[id]` (обычный `<Link>`, без JS copy-to-clipboard), стиль
`font-mono text-ink-muted`, с `aria-label="Постоянная ссылка на <title>"`.

### OG-превью

`app/products/[slug]/opengraph-image.tsx` — переиспользует
`public/og-products-bg.png` и вёрстку существующего
`app/products/opengraph-image.tsx`, с изменениями:
- заголовок = `product.title` вместо «Продукты»
- вместо списка тегов всех продуктов — один бейдж с `product.meta`

Новых картинок/ассетов не создаём.

### Метаданные

- `title`: `"${product.title} — Влад Лямин"`
- `description`: `product.tagline`
- `alternates.canonical`: `${siteUrl}/products/${product.id}`
- `openGraph`: title/description/url аналогично

## Вне скоупа

- JSON-LD / структурированные данные для продукта — не запрошено.
- Изменение контента или вёрстки `/products` (кроме permalink-ссылки).
- Новые изображения/иллюстрации на продукт.
