import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/products";
import DeskFx from "@/components/desk/DeskFx";
import DeskFooter from "@/components/desk/DeskFooter";
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
    <div>
      <h3 className="mono-label text-ink-muted">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-sm leading-relaxed text-ink">
            <span aria-hidden="true" className="mt-[0.55em] size-2.5 shrink-0 bg-lime" />
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
    <main>
      <DeskFx />
      <section className="pt-[130px] pb-[110px] max-md:pt-[110px] max-md:pb-[72px]">
        <div className="mx-auto max-w-[860px] px-8 max-md:px-4">
          <nav aria-label="Хлебные крошки" className="mb-8" data-rv>
            <Link href="/products" className="mono-label text-ink-muted transition-colors hover:text-ink no-underline">
              &larr; Продукты
            </Link>
          </nav>

          {/* The product is one document on the desk: header, write-up, FAQ —
              all on a single taped sheet. */}
          <article
            className="desk-sheet relative -rotate-[0.3deg] px-14 py-14 max-md:rotate-0 max-md:px-6 max-md:py-8"
            data-rv
          >
            <span className="desk-tape" aria-hidden />

            <header className="border-b border-line pb-10">
              <p className="mono-label text-ink-muted">
                {product.meta.startsWith(typeLabels[product.type])
                  ? product.meta
                  : `${typeLabels[product.type]} · ${product.meta}`}
              </p>
              <h1 className="desk-display mt-4 text-[clamp(30px,3.6vw,50px)] text-ink">
                {product.title}
              </h1>
              <p className="font-tektur mt-6 text-[32px] font-bold text-ink">
                {product.priceLabel}
              </p>
              <div className="mt-6 max-w-xs">
                <BuyAction product={product} />
              </div>
            </header>

            <div className="space-y-12 pt-10">
              <div className="space-y-5">
                {product.description.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-ink md:text-[17px]">
                    {paragraph}
                  </p>
                ))}
              </div>

              {extra && (
                <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
                  <BulletList title="Для кого" items={extra.forWhom} />
                  <BulletList title="Что внутри" items={extra.inside} />
                </div>
              )}

              {product.faq && product.faq.length > 0 && <Faq items={product.faq} />}
            </div>
          </article>
        </div>
      </section>
      <DeskFooter />
    </main>
  );
}
