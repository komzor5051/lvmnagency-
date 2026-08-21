import type { Metadata } from "next";
import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { ProductShowcase } from "@/components/bento/ProductShowcase";
import "./products.css";

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
    a: "С бесплатного AI-аудита на сайте: 7 вопросов и карта процессов, где автоматизация окупится. Если после него задача ясна, но нужен разбор — берите часовую консультацию за 3 850 ₽.",
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
    // [?] Способы оплаты для аудита/внедрения — подтвердить.
    q: "Как проходит оплата?",
    a: "Гайд и консультация оплачиваются картой через lava.top. Гайд приходит сразу после оплаты; после оплаты консультации пишете мне в Telegram — согласуем время. По аудиту и внедрению условия обсуждаем в Telegram до старта.",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl}/products#faq`,
  inLanguage: "ru",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

// FAQ accordion body — same <details> pattern as app/products/Faq.tsx, split
// across two tiles for bento rhythm (no duplicated inner "Вопросы" label).
function FaqTile({ items, delay }: { items: typeof faq; delay?: number }) {
  return (
    <div
      className="bento-tile bento-col-6"
      data-studio-reveal
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <div className="border-t border-line" style={{ marginTop: ".4rem" }}>
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
              <span className="text-base font-bold leading-snug tracking-[-0.01em] text-ink">
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className="relative top-0.5 shrink-0 font-mono text-lg leading-none text-ink-muted transition-transform duration-200 ease-out group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-5 pr-10 text-sm leading-relaxed text-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const half = Math.ceil(faq.length / 2);

  return (
    <main className="studio-main bento-page">
      {/* 1. Head + the shared bento showcase (same grid as the home page). */}
      <section className="bento-section bento-section--hero" id="products">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Форматы работы / 01—04</p>
            <h1>Что можно заказать и почём</h1>
            <p>
              Четыре формата: гайд за 990 ₽, часовая консультация за 3 850 ₽,
              аудит с планом за 15 000 ₽ и внедрение под ключ от 150 000 ₽.
              Форматы независимы — начать можно с любого и остановиться на нём же.
            </p>
          </header>
          <ProductShowcase section="products_page" />
        </div>
      </section>

      {/* 2. FAQ: how to pick a format — restyled as bento tiles. */}
      <section className="bento-section bento-section--last" id="faq">
        <div className="studio-frame">
          <header className="bento-head" data-studio-reveal>
            <p className="bento-mono">Вопросы</p>
            <h2>Как выбрать формат</h2>
            <p>
              Что брать под вашу задачу, как проходит оплата и что будет, если
              формат не подойдёт.
            </p>
          </header>
          <div className="bento-grid">
            <FaqTile items={faq.slice(0, half)} />
            <FaqTile items={faq.slice(half)} delay={60} />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(catalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />
    </main>
  );
}
