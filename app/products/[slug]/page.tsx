import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import { BuyAction } from "../BuyAction";
import { Faq } from "../Faq";
import { productExtras } from "../content";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import "../products.css";

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
  return products.map((p) => ({ slug: p.id }));
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const extra = productExtras[product.id];
  const isWaitlist = product.buy.kind === "waitlist";

  return (
    <main className="studio-main bento-page">
      {/* 1. Hero: product tile (meta, title, tagline) + buy tile (price, CTA). */}
      <section className="bento-section bento-section--hero">
        <div className="studio-frame">
          <nav aria-label="Хлебные крошки" data-studio-reveal>
            <Link href="/products" className="bento-crumb">
              ← Все форматы
            </Link>
          </nav>
          <div className="bento-grid">
            <header className="bento-tile bento-col-8" data-studio-reveal>
              <p className="bento-mono">{metaLine(product)}</p>
              <h1 className="bento-product-title">{product.title}</h1>
              <p className="bento-lead">{product.tagline}</p>
            </header>
            <aside
              className="bento-tile bento-col-4 bento-buy"
              data-studio-reveal
              style={{ transitionDelay: "60ms" }}
            >
              <span className="bento-mono">Стоимость</span>
              <p className="bento-price">{product.priceLabel}</p>
              <BuyAction product={product} />
              <small>Без скрытых условий. Детали формата — ниже.</small>
            </aside>
          </div>
        </div>
      </section>

      {/* 2. Body: description + "для кого" / "что внутри" + FAQ + purchase. */}
      <section className="bento-section bento-section--last">
        <div className="studio-frame">
          <div className="bento-grid">
            <div className="bento-tile bento-col-8 bento-copy" data-studio-reveal>
              <p className="bento-mono">Что это и что вы получите</p>
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {extra && (
              <div
                className="bento-tile bento-col-4"
                data-studio-reveal
                style={{ transitionDelay: "60ms" }}
              >
                <p className="bento-mono">Для кого</p>
                <ul className="bento-list">
                  {extra.forWhom.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {extra && (
              <div className="bento-tile bento-col-6" data-studio-reveal>
                <p className="bento-mono">Что внутри</p>
                <ul className="bento-list">
                  {extra.inside.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.faq && product.faq.length > 0 && (
              <div
                className={`bento-tile ${extra ? "bento-col-6" : "bento-col-12"}`}
                data-studio-reveal
                style={{ transitionDelay: "60ms" }}
              >
                <Faq items={product.faq} />
              </div>
            )}

            {/* Purchase block. Carbon accent, except the waitlist form (dark
                inputs on dark ground). */}
            <div
              className={`bento-tile bento-col-12 bento-buy ${
                isWaitlist ? "" : "bento-tile--carbon"
              }`}
              data-studio-reveal
            >
              <p className="bento-mono">{metaLine(product)}</p>
              <h2 className="bento-product-title">{product.title}</h2>
              <p className="bento-price">{product.priceLabel}</p>
              <BuyAction product={product} />
            </div>

            {/* Funnel bridge: "что дальше" — the next ladder step. */}
            {product.nextStep && (
              <TrackedLink
                href={`/products/${product.nextStep.slug}`}
                event="funnel_bridge_click"
                eventProps={{ from: product.id, to: product.nextStep.slug }}
                className="bento-tile bento-tile--link bento-col-12"
              >
                <p className="bento-mono bento-bridge" style={{ marginTop: 0 }}>
                  Что дальше
                </p>
                <h3>{product.nextStep.label}</h3>
                <p className="bento-lead">{product.nextStep.text}</p>
                <span className="bento-text-link" style={{ marginTop: "1.1rem" }}>
                  Смотреть
                </span>
              </TrackedLink>
            )}
          </div>
        </div>
      </section>

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
    </main>
  );
}
