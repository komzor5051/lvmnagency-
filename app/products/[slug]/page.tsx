import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import { BuyAction } from "../BuyAction";
import { productExtras } from "../content";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { Vsl } from "@/components/products/Vsl";
import { SystemMap } from "@/components/products/SystemMap";
import { Accordion, Crosshair } from "@/components/kalka/Interactive";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import "../products-kalka.css";

const siteUrl = SITE_URL;

const typeLabels: Record<Product["type"], string> = {
  consultation: "консультация",
  digital: "цифровой продукт",
  service: "услуга",
  "coming-soon": "скоро",
};

// A downloadable guide is a Product; everything delivered as work with a person
// is a Service. Both hang an Offer with the real price so answer engines can
// state what this costs instead of guessing from page copy.
function productSchema(product: Product) {
  const url = `${siteUrl}/products/${product.id}`;
  const isGoods = product.type === "digital";

  const offer =
    product.price === null
      ? {
          "@type": "Offer",
          url,
          availability: "https://schema.org/PreOrder",
          priceCurrency: "RUB",
        }
      : {
          "@type": "Offer",
          url,
          price: product.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          seller: { "@id": `${siteUrl}/#business` },
        };

  return {
    "@context": "https://schema.org",
    "@type": isGoods ? "Product" : "Service",
    "@id": `${url}#offer`,
    name: product.title,
    description: product.tagline,
    url,
    inLanguage: "ru",
    ...(isGoods
      ? { brand: { "@id": `${siteUrl}/#business` } }
      : {
          provider: { "@id": `${siteUrl}/#business` },
          serviceType: typeLabels[product.type],
          areaServed: "Worldwide",
        }),
    ...(product.vsl
      ? {
          video: {
            "@type": "VideoObject",
            name: product.vsl.title,
            thumbnailUrl: `${siteUrl}${product.vsl.poster}`,
            embedUrl: product.vsl.embedUrl,
            uploadDate: "2026-09-02",
          },
        }
      : {}),
    offers: offer,
  };
}

function faqSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/products/${product.id}#faq`,
    mainEntity: (product.faq ?? []).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function generateStaticParams() {
  // personal-program рендерит своя папка app/products/personal-program.
  return products.filter((p) => p.id !== "personal-program").map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = product.title;
  const description = product.tagline;
  const url = `${siteUrl}/products/${product.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      locale: "ru_RU",
    },
  };
}

function metaLine(product: Product): string {
  const label = typeLabels[product.type];
  return product.meta.startsWith(label) ? product.meta : `${label} · ${product.meta}`;
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { locked } = await searchParams;
  const product = getProduct(slug);
  if (!product) notFound();

  const extra = productExtras[product.id];
  const faqItems = (product.faq ?? []).map((f) => ({ title: f.q, body: f.a }));

  return (
    <div className="k-page">
      <Crosshair />
      <main>
        <section className="k-section">
          <div className="k-wrap">
            <nav aria-label="Хлебные крошки">
              <Link href="/products" className="k-mono -my-3 inline-block bg-white py-3 pr-2 hover:!text-[#15161a]">
                &larr; Все форматы
              </Link>
            </nav>

            {locked && (
              <p className="pk-locked">
                Похоже, ты перешёл по неполной ссылке. Оформи покупку — доступ придёт на
                почту, либо напиши в Telegram, если уже оплатил.
              </p>
            )}

            <div className="pk-hero-grid mt-10">
              <header>
                <p className="k-mono !text-[#15161a]">{metaLine(product)}</p>
                <h1 data-m="lines" data-m-hero className="k-h1 mt-5">
                  {product.title}
                </h1>
                <p data-m="reveal" data-m-delay="0.4" className="k-lead mt-6 bg-white/85 py-1">
                  {product.tagline}
                </p>
              </header>
              <aside data-m="reveal" data-m-delay="0.55" className="k-sheet pk-buy-sheet p-8">
                <span className="k-sheet-index">цена</span>
                <span className="k-mono !text-[#15161a]">Стоимость</span>
                <p className="pk-price">{product.priceLabel}</p>
                <BuyAction product={product} />
                <small>Без скрытых условий. Детали формата ниже.</small>
              </aside>
            </div>

            {product.vsl ? (
              <div className="pk-vsl">
                <Vsl product={product} />
              </div>
            ) : (
              product.cover && (
                <div className="pk-cover-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.cover.src}
                    width={product.cover.width}
                    height={product.cover.height}
                    alt=""
                    data-m="parallax"
                    data-m-depth="6"
                  />
                </div>
              )
            )}
          </div>
        </section>

        {extra?.outcomes?.length ? (
          <section className="k-section">
            <div className="k-wrap">
              <p className="k-mono inline-block bg-white pr-2">Чему научишься</p>
              <h2 data-m="lines" className="k-h2 mt-5">
                {product.title}: результат на языке дела
              </h2>
              <ul data-m="stagger" className="pk-list pk-list--cols mt-12">
                {extra.outcomes.map((t) => (
                  <li key={t} data-m-item>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {extra?.map && (
          <section className="k-section">
            <div className="k-wrap">
              <p className="k-mono inline-block bg-white pr-2">Карта системы</p>
              <h2 data-m="lines" className="k-h2 mt-5">
                {extra.map.center}
              </h2>
              <p data-m="reveal" data-m-delay="0.15" className="mt-4 max-w-xl bg-white/85 text-[15px] leading-relaxed text-[#6b6e78]">
                {extra.map.caption}
              </p>
              <div data-m="reveal" className="pk-map mt-12">
                <SystemMap map={extra.map} />
              </div>
            </div>
          </section>
        )}

        {extra && (
          <section className="k-section">
            <div className="k-wrap grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 data-m="lines" className="k-h3">
                  Для кого
                </h2>
                <ul data-m="stagger" className="pk-list mt-6">
                  {extra.forWhom.map((t) => (
                    <li key={t} data-m-item>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 data-m="lines" className="k-h3">
                  Что внутри
                </h2>
                <ul data-m="stagger" className="pk-list mt-6">
                  {extra.inside.map((t) => (
                    <li key={t} data-m-item>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="k-section">
          <div className="k-wrap grid gap-10 md:grid-cols-[1fr_1.5fr]">
            <h2 data-m="lines" className="k-h2">
              Подробно
            </h2>
            <div data-m="reveal" className="space-y-4 text-[16px] leading-relaxed text-[#6b6e78]">
              {product.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {product.faq?.length ? (
          <section className="k-section">
            <div className="k-wrap">
              <p className="k-mono inline-block bg-white pr-2">Вопросы</p>
              <h2 data-m="lines" className="k-h2 mt-5">
                Что обычно спрашивают
              </h2>
              <div data-m="stagger" className="mt-12">
                <Accordion items={faqItems} />
              </div>
            </div>
          </section>
        ) : null}

        <section className="pk-final">
          <div className="k-wrap py-20 md:py-24">
            <div data-m="reveal" className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
              <div>
                <p className="k-mono !text-[#15161a]">{metaLine(product)}</p>
                <h2 className="k-h2 mt-4">{product.title}</h2>
              </div>
              <div className="pk-buy-sheet">
                <p data-m="count" className="pk-price">
                  {product.priceLabel}
                </p>
                <BuyAction product={product} />
              </div>
            </div>
          </div>
        </section>

        {product.nextStep && (
          <section className="k-section">
            <div className="k-wrap">
              <p className="k-mono !text-[#15161a]" data-m="reveal">
                Что дальше
              </p>
              <div className="mt-6">
                <TrackedLink
                  href={`/products/${product.nextStep.slug}`}
                  event="funnel_bridge_click"
                  eventProps={{ from: product.id, to: product.nextStep.slug }}
                  className="pk-next"
                >
                  <span className="k-mono !text-[#15161a]">Дальше</span>
                  <h3>{product.nextStep.label}</h3>
                  <p>{product.nextStep.text}</p>
                  <span className="pk-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </TrackedLink>
              </div>
            </div>
          </section>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(productSchema(product)) }}
      />
      {product.faq && product.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(product)) }}
        />
      )}
    </div>
  );
}
