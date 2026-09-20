import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { RzFaq } from "@/components/rz/RzFaq";
import { TrackedLink } from "@/components/bento/TrackedLink";

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

const faq = [
  {
    q: "Чем аудит за 15 000 ₽ отличается от бесплатного на сайте?",
    a: "Бесплатный: анкета из 7 вопросов, 5 минут и общая карта точек роста. Платный: две недели моей работы с твоими процессами и данными, на выходе план с расчётом по каждому пункту.",
  },
  {
    q: "Как проходит оплата?",
    a: "Гайды и консультация оплачиваются картой через lava.top. Гайд про Claude приходит сразу после оплаты, ContentOS выдаёт телеграм-бот. После оплаты консультации пишешь мне в Telegram, согласуем время. По аудиту условия обсуждаем до старта.",
  },
  {
    q: "Что если задача окажется не твоей?",
    a: "Скажу сразу и не возьму. Мне невыгодно браться за то, где эффект не считается: такие проекты не работают и не превращаются в кейс.",
  },
  {
    q: "Нужно отдельно платить за Claude?",
    a: "Да, подписка оформляется на тебя, так система остаётся твоей. Часть систем из гайда работает на бесплатном тарифе, для автоматизаций нужен платный. Оплату из России разбирает отдельное приложение в гайде.",
  },
];

export default function ProductsPage() {
  return (
    <main className="rz">
      <header className="rz-products-hero">
        <div className="rz-wrap">
          <div>
            <p className="rz-mono" style={{ margin: "0 0 26px" }}>Продукты · 6 форматов</p>
            <h1 className="rz-h1">
              Мои <span className="rz-mark">продукты</span>
            </h1>
            <p className="rz-lead">
              Два гайда, час один на один, помесячное сопровождение, аудит и личная программа
              на 6 недель. Форматы независимы: начать можно с любого и остановиться на нём же.
            </p>
          </div>
          <aside className="rz-products-aside">
            <p>
              <b>Не знаешь, с чего начать</b> — бери гайд за 590 ₽, это самый дешёвый способ
              проверить.
            </p>
            <p>
              <b>Есть конкретная задача</b> — час консультации, запускаем её на созвоне.
            </p>
            <p>
              <b>Не хочешь застревать между встречами</b> — сопровождение, 10 000 ₽ в месяц.
            </p>
            <p>
              <b>Хочешь разбор всех процессов</b> — аудит, две недели.
            </p>
            <p>
              <b>Хочешь научиться делать сам</b> — личная программа, 6 недель.
            </p>
          </aside>
        </div>
      </header>

      <section className="rz-section rz-section--list">
        <div className="rz-wrap rz-grid" id="list">
          {spreads.map((cfg, i) => {
            const product = getProduct(cfg.id)!;
            return (
              <TrackedLink
                key={cfg.id}
                href={cfg.href}
                className={`rz-card${product.price === null ? " rz-card--soon" : ""}`}
                event="product_tile_click"
                eventProps={{ product: cfg.id, position: i + 1, section: "products_page" }}
                data-studio-reveal
              >
                {product.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="rz-card-cover"
                    src={product.cover.src}
                    alt={product.title}
                    width={product.cover.width}
                    height={product.cover.height}
                    loading={i < 2 ? undefined : "lazy"}
                  />
                ) : (
                  <div className="rz-card-cover rz-card-cover--typo">скоро</div>
                )}
                <div className="rz-card-body">
                  <span className="rz-mono">{cfg.type}</span>
                  <h3>{product.title}</h3>
                  <p className="rz-card-tag">{product.tagline}</p>
                  <div className="rz-card-meta">
                    <span className="rz-card-price">
                      {product.priceLabel}
                      <small>{product.meta}</small>
                    </span>
                    <span className={`rz-btn${cfg.solid ? " rz-btn--solid" : ""}`}>{cfg.cta}</span>
                  </div>
                </div>
              </TrackedLink>
            );
          })}
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Как выбрать</h2>
            <p>Три ситуации и что брать в каждой.</p>
          </div>
          <div className="rz-pick">
            {pick.map((item) => (
              <div key={item.tag} data-studio-reveal>
                <span className="rz-mono">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link href={item.href} className="rz-link">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-studio-reveal>
            <h2 className="rz-h2">Вопросы</h2>
            <p>Оплата, выдача и что будет, если формат не подойдёт.</p>
          </div>
          <div data-studio-reveal>
            <RzFaq items={faq} schemaId="/products#faq" />
          </div>
        </div>
      </section>


      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(catalogSchema) }}
      />
    </main>
  );
}
