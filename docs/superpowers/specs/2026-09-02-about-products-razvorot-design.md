# /about, /products и страницы продуктов в стиле «Разворот» — дизайн

Дата: 2026-09-02. Статус: утверждено Владом (макеты, тексты, баннеры).
Продолжение спеки `2026-09-02-razvorot-home-redesign-design.md`: тот же визуальный
язык (Cormorant Garamond, Golos Text, JetBrains Mono, белый фон, лайм только заливкой,
радиус 0, теней нет, анимации 1a/2a/3b/4b/5c), те же токены `--rz-*` и `app/razvorot.css`.

Макеты (визуальная истина, картинки заменены на `IMAGE`):
`docs/superpowers/mockups/2026-09-02-mock-about.html`, `docs/superpowers/mockups/2026-09-02-mock-products.html`.

## Зачем
Страницы /about, /products и /products/[slug] остались в старом bento-стиле и продают
внедрение. Переводим их на «Разворот» и позиционирование «личная система на Claude».

## /about
Структура и тексты — из макета `mock-about`: hero (h1 «Четвёртый год работаю с Claude
каждый день», лид, кнопки «Смотреть продукты» → /products и «Написать в Telegram»,
портрет ч/б `/portrait-editorial.jpg`), четыре факта, «Как я к этому пришёл» (две
колонки, курсивный тезис), «Траектория» (4 строки, анимация 1a, «Сейчас» с лайм-маркером),
«По каким правилам работаю» (4 правила в две колонки), «Чем работаю» (теги стека),
«Вопросы» (5 вопросов), финальный CTA гайда. Person-schema: description/knowsAbout
как в layout.tsx. Метаданные: title «Обо мне: личная система работы на Claude»,
description «Влад Лямин. Четвёртый год работаю с Claude каждый день: гайды,
консультации и аудит для тех, кто собирает личную систему работы вместо команды.»

## /products
Из макета `mock-products`: hero с подсказкой справа (3 ситуации), пять «разворотов»
(эйрбоу-тип, обложка 16:9, h3, описание, цена + мета, кнопка), «Как выбрать» (3 колонки),
«Вопросы» (4), лист ожидания курса с существующей `WaitlistForm`. Обложки: гайды —
существующие webp; консультация и аудит — новые баннеры `public/consultation-cover.webp`
и `public/audit-cover.webp` (из `output/banners/*.png`, 1440×810 webp, как у гайдов),
прописать в `lib/products.ts` полем `cover`. Курс — типографская плашка «скоро».
OfferCatalog-schema остаётся. Компонент `ProductShowcase` больше нигде не нужен — удалить.

## /products/[slug]
Тот же язык. Крошка «← Все форматы». Hero две колонки: слева эйрбоу (тип · мета),
h1 serif, тэглайн; справа блок цены (serif цена, мета, `BuyAction`, подпись). Ниже —
`Vsl`, если задан, иначе обложка на всю ширину с hairline-рамкой. Дальше: «Чему
научишься» (outcomes, если есть), «Для кого» и «Что внутри» в две колонки, «Подробно»
(description), «Вопросы» (product.faq), блок покупки (h2, цена, BuyAction), строка
«Что дальше» (nextStep) в стиле строки продуктов 1a. Все данные — из `lib/products.ts`
и `app/products/content.ts`, схемы не меняются. `BuyAction` и `WaitlistForm`
переводятся на классы `rz-*`.

## Общие элементы
- `.rz-mark` исправляется: заливка по буквам — `background: linear-gradient(lime, lime)
  no-repeat 0 .3em / 100% .66em; padding: 0 .06em; box-decoration-break: clone`; в hero
  главной анимация `rz-mark` идёт от `0 .66em` к `100% .66em`.
- Новый компонент `components/rz/RzFaq.tsx`: `<details>` в стиле макета (serif-вопрос,
  плюс справа), с опциональным FAQPage JSON-LD (`schemaId`). Используется на /about,
  /products, /products/[slug]. `FaqSection` и `app/products/Faq.tsx` удаляются, если
  больше не используются.
- CSS всех новых блоков — в `app/razvorot.css`, префикс `.rz-`; bento-правила не трогаем.
  `app/products/products.css` оставляет только `.bento-vsl*`.

## Не в этом объёме
/blog, /audit, /guide и /vibecoding (desk-компоненты), удаление старого bento-CSS.
