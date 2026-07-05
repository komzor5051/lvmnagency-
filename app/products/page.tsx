import type { Metadata } from "next";
import Link from "next/link";
import Chapter from "@/components/hud/Chapter";
import SplitLines from "@/components/motion/SplitLines";
import { products, type Product } from "@/lib/products";
import { ProductSection } from "./ProductSection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vladlyamin.ru";

export const metadata: Metadata = {
  title: "Продукты",
  description:
    "Консультация 1:1, гайд по AI в бизнесе, AI-аудит процессов и мини-курс по автоматизации. Форматы под разный масштаб задачи — выберите свой.",
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

// Four points of entry, in the order the offer is meant to be read —
// presentation-only; lib/products.ts stays untouched. Products outside this
// list (e.g. the coming-soon course) still have a live page, just not a row
// here.
const ORDER = ["guide", "consultation", "audit", "ai-os"];

function orderedProducts(): Product[] {
  return ORDER.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );
}

export default function ProductsPage() {
  const items = orderedProducts();

  return (
    <main>
      <Chapter name="Products" theme="light" className="px-[6vw] pb-24 pt-10 md:pb-32">
        <nav aria-label="Хлебные крошки">
          <Link
            href="/"
            className="mono-label text-ink-muted transition-colors hover:text-ink"
          >
            &larr; На главную
          </Link>
        </nav>

        <header className="pb-14 pt-14 md:pb-20 md:pt-20">
          <p className="mono-label text-ink-muted">Форматы работы со мной</p>
          <SplitLines as="h1" className="font-display mt-6 text-[clamp(40px,7vw,96px)]">
            Четыре <em>точки входа</em>
          </SplitLines>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Один и тот же опыт — в форматах под разный масштаб: от гайда на
            вечер до разбора всего бизнеса. Начните с того, что уместно
            сейчас, — дальше видно будет.
          </p>
        </header>

        <div className="border-t border-line">
          {items.map((product, index) => (
            <ProductSection key={product.id} product={product} index={index} />
          ))}
        </div>
      </Chapter>
    </main>
  );
}
