import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { BuyAction } from "../BuyAction";
import { Faq } from "../Faq";
import { productExtras } from "../content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

const typeLabels: Record<Product["type"], string> = {
  consultation: "консультация",
  digital: "цифровой продукт",
  service: "услуга",
  "coming-soon": "скоро",
};

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

  const title = `${product.title} — Влад Лямин`;
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
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-sm leading-relaxed text-ink">
            <span aria-hidden="true" className="mt-[0.65em] h-0.5 w-4 shrink-0 bg-accent" />
            <span>{item}</span>
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
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10 md:pb-32">
        <nav aria-label="Хлебные крошки">
          <Link
            href="/products"
            className="font-mono text-xs tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
          >
            &larr; Продукты
          </Link>
        </nav>

        <Reveal>
          <header data-reveal className="pb-10 pt-14 md:pt-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {typeLabels[product.type]}
            </p>
            <h1 className="font-heading mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-ink md:text-6xl">
              {product.title}
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              {product.meta}
            </p>
            <p className="mt-8 text-3xl font-bold tracking-[-0.02em] text-ink">
              {product.priceLabel}
            </p>
            <div className="mt-6 max-w-xs">
              <BuyAction product={product} />
            </div>
          </header>

          <div className="space-y-12">
            <div data-reveal className="space-y-5">
              {product.description.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-ink md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            {extra && (
              <div data-reveal className="grid gap-10 sm:grid-cols-2 sm:gap-8">
                <BulletList title="Для кого" items={extra.forWhom} />
                <BulletList title="Что внутри" items={extra.inside} />
              </div>
            )}

            {product.faq && product.faq.length > 0 && (
              <div data-reveal>
                <Faq items={product.faq} />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
