import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import { BuyAction } from "../BuyAction";
import { productExtras } from "../content";
import { TrackedLink } from "@/components/bento/TrackedLink";
import { Vsl } from "@/components/products/Vsl";
import { RzFaq } from "@/components/rz/RzFaq";
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

  return (
    <main className="rz rz-product">
      <section className="rz-product-hero">
        <div className="rz-wrap">
          <nav aria-label="Хлебные крошки" className="rz-crumb">
            <Link href="/products" className="rz-link">
              ← Все форматы
            </Link>
          </nav>
          {locked && (
            <p className="rz-locked">
              Похоже, ты перешёл по неполной ссылке. Оформи покупку — доступ придёт на
              почту, либо напиши в Telegram, если уже оплатил.
            </p>
          )}
          <div className="rz-product-grid">
            <header>
              <p className="rz-mono">{metaLine(product)}</p>
              <h1 className="rz-h1 rz-product-title">{product.title}</h1>
              <p className="rz-lead">{product.tagline}</p>
            </header>
            <aside className="rz-product-buy">
              <span className="rz-mono">Стоимость</span>
              <p className="rz-product-price">{product.priceLabel}</p>
              <BuyAction product={product} />
              <small>Без скрытых условий. Детали формата ниже.</small>
            </aside>
          </div>
          {product.vsl ? (
            <Vsl product={product} />
          ) : (
            product.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="rz-product-cover"
                src={product.cover.src}
                width={product.cover.width}
                height={product.cover.height}
                alt=""
              />
            )
          )}
        </div>
      </section>

      {extra?.outcomes?.length ? (
        <section className="rz-section">
          <div className="rz-wrap">
            <div className="rz-sec-head" data-studio-reveal>
              <h2 className="rz-h2">Чему научишься</h2>
            </div>
            <ul className="rz-list rz-list--cols" data-studio-reveal>
              {extra.outcomes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {extra && (
        <section className="rz-section">
          <div className="rz-wrap rz-two">
            <div data-studio-reveal>
              <h2 className="rz-h2 rz-h2--sm">Для кого</h2>
              <ul className="rz-list">
                {extra.forWhom.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div data-studio-reveal>
              <h2 className="rz-h2 rz-h2--sm">Что внутри</h2>
              <ul className="rz-list">
                {extra.inside.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="rz-section">
        <div className="rz-wrap rz-two">
          <div className="rz-sec-head" data-studio-reveal style={{ marginBottom: 0 }}>
            <h2 className="rz-h2">Подробно</h2>
          </div>
          <div className="rz-copy" data-studio-reveal>
            {product.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {product.faq?.length ? (
        <section className="rz-section">
          <div className="rz-wrap">
            <div className="rz-sec-head" data-studio-reveal>
              <h2 className="rz-h2">Вопросы</h2>
            </div>
            <RzFaq items={product.faq} />
          </div>
        </section>
      ) : null}

      <section className="rz-section rz-product-final">
        <div className="rz-wrap rz-two" data-studio-reveal>
          <div>
            <p className="rz-mono">{metaLine(product)}</p>
            <h2 className="rz-h2">{product.title}</h2>
          </div>
          <div className="rz-product-buy">
            <p className="rz-product-price">{product.priceLabel}</p>
            <BuyAction product={product} />
          </div>
        </div>
      </section>

      {product.nextStep && (
        <section className="rz-section">
          <div className="rz-wrap">
            <p className="rz-mono" data-studio-reveal>
              Что дальше
            </p>
            <TrackedLink
              href={`/products/${product.nextStep.slug}`}
              event="funnel_bridge_click"
              eventProps={{ from: product.id, to: product.nextStep.slug }}
              className="rz-row rz-row--next"
            >
              <span className="rz-mono">Дальше</span>
              <h3>{product.nextStep.label}</h3>
              <span className="rz-row-desc">{product.nextStep.text}</span>
              <span className="rz-row-price rz-row-arrow">→</span>
            </TrackedLink>
          </div>
        </section>
      )}

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
