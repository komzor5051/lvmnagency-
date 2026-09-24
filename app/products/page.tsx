import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { Accordion, Crosshair } from "@/components/kalka/Interactive";
import { TrackedLink } from "@/components/bento/TrackedLink";
import "./products-kalka.css";

const siteUrl = SITE_URL;

// One catalogue entry per format, so an assistant asked "what does Влад Лямин
// sell and for how much" can answer from a single page.
const products = [
  getProduct("guide")!,
  getProduct("codex-content-os")!,
  getProduct("consultation")!,
  getProduct("support")!,
  getProduct("audit")!,
  getProduct("personal-program")!,
];

const catalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${siteUrl}/products#catalog`,
  name: "Форматы работы с Владом Ляминым",
  url: `${siteUrl}/products`,
  inLanguage: "ru",
  provider: { "@id": `${siteUrl}/#business` },
  itemListElement: products.map((product, i) => ({
    "@type": "Offer",
    position: i + 1,
    url: `${siteUrl}/products/${product.id}`,
    name: product.title,
    description: product.tagline.split(".")[0].trim(),
    priceCurrency: "RUB",
    ...(product.price === null
      ? { availability: "https://schema.org/PreOrder" }
      : { price: product.price, availability: "https://schema.org/InStock" }),
  })),
};

export const metadata: Metadata = {
  title: "Продукты: гайды, консультация, сопровождение, AI-аудит и личная программа",
  description:
    "Шесть форматов: два гайда, консультация 1:1, помесячное сопровождение, AI-аудит процессов и личная программа по Claude и Codex на 6 недель. Начать можно с любого и остановиться на нём же.",
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    title: "Продукты — Влад Лямин",
    description:
      "Два гайда, консультация 1:1, сопровождение по 10 000 ₽ в месяц, AI-аудит процессов и личная программа на 6 недель.",
    type: "website",
    url: `${siteUrl}/products`,
    locale: "ru_RU",
  },
};

// Тип спреда, текст CTA и форма кнопки — не в lib/products.ts (у audit/course
// нет поля cta), поэтому заданы здесь по макету.
const spreads = [
  { id: "guide", type: "Гайд", href: "/products/guide", cta: "Получить гайд", solid: true },
  {
    id: "codex-content-os",
    type: "Гайд",
    href: "/products/codex-content-os",
    cta: "Получить гайд",
    solid: true,
  },
  {
    id: "consultation",
    type: "1:1",
    href: "/products/consultation",
    cta: "Забронировать час",
    solid: true,
  },
  {
    id: "support",
    type: "1:1",
    href: "/products/support",
    cta: "Подробнее",
    solid: true,
  },
  {
    id: "audit",
    type: "Аудит",
    href: "/products/audit",
    cta: "Обсудить в Telegram",
    solid: false,
  },
  {
    id: "personal-program",
    type: "Личная работа",
    href: "/products/personal-program",
    cta: "Подробнее",
    solid: true,
  },
] as const;

const pick = [
  {
    tag: "Задача не сформулирована",
    title: "Гайд за 590 ₽",
    text: "Одиннадцать систем и план на сегодня, неделю и месяц. Если после него всё встало на место, дальше можно не идти.",
    href: "/products/guide",
    label: "К гайду",
  },
  {
    tag: "Есть конкретная задача",
    title: "Консультация",
    text: "Час на твою задачу, а не на теорию. Запускаем её в Claude прямо на созвоне: встреча заканчивается работающей вещью.",
    href: "/products/consultation",
    label: "Забронировать",
  },
  {
    tag: "Нужен план по всем процессам",
    title: "AI-аудит",
    text: "Две недели и отчёт с расчётом по каждому пункту. С ним можно настраивать самому или со мной.",
    href: "/products/audit",
    label: "Подробнее",
  },
];

const start = [
  { title: "Не знаешь, с чего начать", text: "бери гайд за 590 ₽, это самый дешёвый способ проверить." },
  { title: "Есть конкретная задача", text: "час консультации, запускаем её на созвоне." },
  { title: "Не хочешь застревать между встречами", text: "сопровождение, 10 000 ₽ в месяц." },
  { title: "Хочешь разбор всех процессов", text: "аудит, две недели." },
  { title: "Хочешь научиться делать сам", text: "личная программа, 6 недель." },
];

const faq = [
  {
    title: "Чем аудит за 15 000 ₽ отличается от бесплатного на сайте?",
    body: "Бесплатный: анкета из 7 вопросов, 5 минут и общая карта точек роста. Платный: две недели моей работы с твоими процессами и данными, на выходе план с расчётом по каждому пункту.",
  },
  {
    title: "Как проходит оплата?",
    body: "Гайды и консультация оплачиваются картой через lava.top. Гайд про Claude приходит сразу после оплаты, ContentOS выдаёт телеграм-бот. После оплаты консультации пишешь мне в Telegram, согласуем время. По аудиту условия обсуждаем до старта.",
  },
  {
    title: "Что если задача окажется не твоей?",
    body: "Скажу сразу и не возьму. Мне невыгодно браться за то, где эффект не считается: такие проекты не работают и не превращаются в кейс.",
  },
  {
    title: "Нужно отдельно платить за Claude?",
    body: "Да, подписка оформляется на тебя, так система остаётся твоей. Часть систем из гайда работает на бесплатном тарифе, для автоматизаций нужен платный. Оплату из России разбирает отдельное приложение в гайде.",
  },
];

export default function ProductsPage() {
  return (
    <div className="k-page">
      <Crosshair />
      <main>
        <section className="k-section">
          <div className="k-wrap">
            <p className="k-mono inline-block bg-white pr-2">Продукты · 6 форматов</p>
            <h1
              data-m="lines"
              data-m-hero
              className="k-h1 mt-6"
            >
              Мои <span className="rz-mark">продукты</span>
            </h1>
            <p data-m="reveal" data-m-delay="0.5" className="k-lead mt-8 bg-white/85 py-1">
              Два гайда, час один на один, помесячное сопровождение, аудит и личная программа
              на 6 недель. Форматы независимы: начать можно с любого и остановиться на нём же.
            </p>

            <div data-m="stagger" className="pk-rows-note k-rows mt-14 max-w-3xl">
              {start.map((s) => (
                <div key={s.title} data-m-item className="k-row">
                  <p>
                    <b>{s.title}</b> — {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="k-section">
          <div className="k-wrap">
            <div data-m="stagger" className="pk-grid">
              {spreads.map((cfg, i) => {
                const product = getProduct(cfg.id)!;
                return (
                  <div key={cfg.id} data-m-item>
                    <TrackedLink
                      href={cfg.href}
                      className={`pk-card${product.price === null ? " pk-card-soon" : ""}`}
                      event="product_tile_click"
                      eventProps={{ product: cfg.id, position: i + 1, section: "products_page" }}
                    >
                      <span className="pk-card-index">{String(i + 1).padStart(2, "0")}</span>
                      <div className="pk-card-body">
                        <span className="k-mono !text-[#15161a]">{cfg.type}</span>
                        <h3 className="pk-card-title font-heading text-2xl font-bold tracking-[-0.02em]">
                          {product.title}
                        </h3>
                        <p className="pk-card-tag">{product.tagline}</p>
                        <div className="pk-card-meta">
                          <span className="pk-card-price">
                            {product.priceLabel}
                            <small>{product.meta}</small>
                          </span>
                          <span className={`k-btn${cfg.solid ? " k-btn--solid" : ""}`}>{cfg.cta}</span>
                        </div>
                      </div>
                    </TrackedLink>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="k-section">
          <div className="k-wrap">
            <p className="k-mono inline-block bg-white pr-2">Как выбрать</p>
            <h2 data-m="lines" className="k-h2 mt-5">
              Три ситуации и что брать в каждой
            </h2>
            <div data-m="stagger" className="pk-pick mt-14">
              {pick.map((item) => (
                <div key={item.tag} data-m-item>
                  <span className="k-mono !text-[#15161a]">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={item.href} className="k-mono !text-[#15161a] underline underline-offset-4">
                    {item.label} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="k-section">
          <div className="k-wrap">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Вопросы</p>
                <h2 data-m="lines" className="k-h2 mt-5">
                  Оплата, выдача и что будет, если формат не подойдёт
                </h2>
              </div>
              <div data-m="stagger">
                <Accordion items={faq} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(catalogSchema) }}
      />
    </div>
  );
}
