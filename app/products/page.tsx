import type { Metadata } from "next";
import Link from "next/link";
import { products, type Product } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { FaqSection } from "@/components/FaqSection";

const siteUrl = SITE_URL;

// One catalogue entry per format, so an assistant asked "what does Влад Лямин
// sell and for how much" can answer from a single page.
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
  title: "Продукты: консультации, AI-аудит и гайды",
  description:
    "Консультация 1:1, гайд по AI в бизнесе, AI-аудит процессов и мини-курс по автоматизации. Четыре формата под разный масштаб задачи — выберите свой.",
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    title: "Продукты — Влад Лямин",
    description:
      "Консультация 1:1, гайд по AI в бизнесе, AI-аудит процессов и мини-курс по автоматизации.",
    type: "website",
    url: `${siteUrl}/products`,
    locale: "ru_RU",
  },
};

// ВНИМАНИЕ: проверить перед публикацией. Помечено «[?]» — то, чего нет ни в
// lib/products.ts, ни на страницах: условия оплаты и порядок возврата.
// Остальные цифры взяты из карточек продуктов и с главной.
const faq = [
  {
    q: "С какого формата начать, если задача ещё не сформулирована?",
    a: "С бесплатного AI-аудита на сайте: 7 вопросов и карта процессов, где автоматизация окупится. Если после него задача ясна, но нужен разбор — берите часовую консультацию за 5 000 ₽.",
  },
  {
    q: "Чем аудит за 15 000 ₽ отличается от бесплатного на сайте?",
    a: "Бесплатный — автоматическая анкета: 5 минут и общая карта точек роста. Платный — две недели моей работы: разбираю ваши реальные процессы и данные и отдаю план внедрения с расчётом экономии.",
  },
  {
    q: "Можно сразу заказать внедрение, без аудита?",
    a: "Можно, но я так не советую. Без аудита нельзя назвать ни срок, ни цену честно, поэтому внедрение AI в работу команды всегда начинается с разбора процессов — он входит в проект.",
  },
  {
    // [?] Способы оплаты для консультации/аудита/внедрения — подтвердить.
    q: "Как проходит оплата?",
    a: "Гайд — картой через lava.top, файл приходит сразу после оплаты. По консультации, аудиту и внедрению условия обсуждаем в Telegram до старта: что входит, в какие сроки и как разбиваются этапы.",
  },
  {
    // [?] Формального порядка возврата на сайте нет — сформулировать и вписать.
    q: "Что если задача окажется не моей?",
    a: "Скажу об этом сразу и не возьму проект. Мне невыгодно браться за то, где эффект не просчитывается: такие внедрения не работают и не превращаются в кейс.",
  },
  {
    q: "Нужно ли отдельно платить за AI-сервисы?",
    a: "Да, подписки и API оформляются на вас — так система остаётся вашей и не зависит от меня. Эти расходы считаю на аудите заранее, чтобы они не всплыли в середине проекта.",
  },
];

// Four points of entry, in the order the offer is meant to be read —
// presentation-only; lib/products.ts stays untouched. The coming-soon course
// is rendered separately as a lime sticky note at the end of the desk.
const ORDER = ["guide", "consultation", "audit", "ai-os"];

const typeLabels: Record<Product["type"], string> = {
  consultation: "консультация",
  digital: "цифровой продукт",
  service: "услуга",
  "coming-soon": "скоро",
};

// p.meta sometimes already leads with the type word ("услуга · 2 недели") —
// prepend the type label only when it adds information.
function metaLine(p: Product): string {
  const label = typeLabels[p.type];
  return p.meta.startsWith(label) ? p.meta : `${label} · ${p.meta}`;
}

function orderedProducts(): Product[] {
  return ORDER.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );
}

export default function ProductsPage() {
  const items = orderedProducts();
  const course = products.find((p) => p.id === "course");

  return (
    <main className="studio-main studio-products">
      <section className="studio-page-hero">
        <div className="studio-frame">
          <p className="studio-eyebrow" data-studio-reveal>ФОРМАТЫ РАБОТЫ / 01—04</p>
          <h1 data-studio-reveal>Что можно<br />заказать и <em>почём?</em></h1>
          <p data-studio-reveal>
            Четыре формата: гайд за 990 ₽, часовая консультация за 5 000 ₽, аудит
            с планом за 15 000 ₽ и внедрение под ключ от 150 000 ₽. Форматы
            независимы — начать можно с любого и остановиться на нём же.
          </p>
        </div>
      </section>

      <section className="studio-products-list">
        <div className="studio-frame">
          <div className="studio-product-index">
            {items.map((p, i) => (
              <Link key={p.id} href={`/products/${p.id}`} className="studio-product-row" data-studio-reveal>
                <span className="studio-product-num">0{i + 1}</span>
                <div>
                  <span className="studio-mono">{metaLine(p)}</span>
                  <h2>{p.title}</h2>
                  <p>{p.tagline}</p>
                </div>
                <strong>{p.priceLabel}</strong>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
            {course && (
              <Link
                href={`/products/${course.id}`}
                className="studio-course-note"
                data-studio-reveal
              >
                <span className="studio-mono">В РАЗРАБОТКЕ</span>
                <h3>{course.title}</h3>
                <p>Оставьте email — узнаете первым и получите стартовую цену.</p>
                <b>В список ожидания →</b>
              </Link>
            )}
          </div>
        </div>
      </section>
      <FaqSection
        items={faq}
        eyebrow="ВОПРОСЫ"
        heading={<>Как выбрать<br /><em>формат.</em></>}
        lead="Что брать под вашу задачу, как проходит оплата и что будет, если формат не подойдёт."
        schemaId="/products#faq"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(catalogSchema) }}
      />
    </main>
  );
}
