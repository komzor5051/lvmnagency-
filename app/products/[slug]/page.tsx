import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import { BuyAction } from "../BuyAction";
import { Faq } from "../Faq";
import { productExtras } from "../content";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";

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

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="studio-product-bullets">
      <h3 className="studio-mono">{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
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

  return (
    <main className="studio-main studio-product-detail">
      <section className="studio-product-detail-hero">
        <div className="studio-frame">
          <nav aria-label="Хлебные крошки" data-studio-reveal>
            <Link href="/products">← Все форматы</Link>
          </nav>
          <div className="studio-product-hero-grid">
            <header data-studio-reveal>
              <p className="studio-eyebrow">
                {product.meta.startsWith(typeLabels[product.type])
                  ? product.meta
                  : `${typeLabels[product.type]} · ${product.meta}`}
              </p>
              <h1>{product.title}</h1>
              <p>{product.tagline}</p>
            </header>
            <aside data-studio-reveal>
              <span className="studio-mono">СТОИМОСТЬ</span>
              <strong>{product.priceLabel}</strong>
              <BuyAction product={product} />
              <small>Без скрытых условий. Детали формата — ниже.</small>
            </aside>
          </div>
        </div>
      </section>

      <section className="studio-product-body">
        <div className="studio-frame studio-product-body-grid">
          <div className="studio-product-copy" data-studio-reveal>
            <p className="studio-mono">ЧТО ЭТО И ЧТО ВЫ ПОЛУЧИТЕ</p>
            {product.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {extra && (
            <div className="studio-product-extra" data-studio-reveal>
              <BulletList title="Для кого" items={extra.forWhom} />
              <BulletList title="Что внутри" items={extra.inside} />
            </div>
          )}

          {product.faq && product.faq.length > 0 && (
            <div className="studio-product-faq" data-studio-reveal>
              <Faq items={product.faq} />
            </div>
          )}
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
