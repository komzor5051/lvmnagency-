import { products } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

/** Product showcase: 2x2 grid of cards cascading in on scroll. */
export function ProductsSection() {
  return (
    <section id="products" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          01 — ПРОДУКТЫ
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-ink md:text-[42px] md:leading-tight">
          Что можно купить прямо сейчас
        </h2>

        <Reveal className="mt-10 grid gap-4 md:grid-cols-2">
          {products.map((p) => (
            <div key={p.id} data-reveal className="h-full">
              <ProductCard product={p} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
