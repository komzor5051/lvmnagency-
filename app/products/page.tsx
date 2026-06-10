import type { Metadata } from "next";
import Link from "next/link";
import { products, type Product } from "@/lib/products";
import { Reveal } from "@/components/motion/Reveal";
import { ProductSection } from "./ProductSection";

export const metadata: Metadata = {
  title: "Продукты — Влад Лямин",
  description:
    "Консультация 1:1, гайд по AI в бизнесе, AI-аудит процессов и мини-курс по автоматизации. Дешёвое покупается онлайн, крупное начинается с заявки.",
};

// Display order on the page; products outside this list are appended as-is.
const ORDER = ["consultation", "guide", "audit", "course"];

function orderedProducts(): Product[] {
  const byOrder = ORDER.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );
  const rest = products.filter((p) => !ORDER.includes(p.id));
  return [...byOrder, ...rest];
}

export default function ProductsPage() {
  const items = orderedProducts();

  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pb-32">
        <nav aria-label="Хлебные крошки">
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
          >
            &larr; На главную
          </Link>
        </nav>

        <Reveal>
          <header className="pb-14 pt-14 md:pb-20 md:pt-20">
            <p
              data-reveal
              className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
            >
              Что можно купить прямо сейчас
            </p>
            <h1
              data-reveal
              className="font-heading mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-ink md:text-7xl"
            >
              Продукты
            </h1>
            <p
              data-reveal
              className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
            >
              Я упаковал свой опыт внедрения AI в форматы под разный бюджет: от
              гайда за вечер до аудита всего бизнеса. Дешёвое оплачивается
              онлайн, крупное начинается с заявки.
            </p>
          </header>
        </Reveal>

        <Reveal>
          {items.map((product, index) => (
            <ProductSection key={product.id} product={product} index={index} />
          ))}
        </Reveal>
      </div>
    </main>
  );
}
