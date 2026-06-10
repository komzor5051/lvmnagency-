// One expanded product block: sticky left column (title, meta, price, buy
// action), right column (description, "Для кого" / "Что внутри", FAQ).
// Server component; entrance animation comes from the Reveal wrapper on the
// page via [data-reveal] marks.

import type { Product } from "@/lib/products";
import { BuyAction } from "./BuyAction";
import { Faq } from "./Faq";
import { productExtras } from "./content";

const typeLabels: Record<Product["type"], string> = {
  consultation: "консультация",
  digital: "цифровой продукт",
  service: "услуга",
  "coming-soon": "скоро",
};

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-sm leading-relaxed text-ink">
            {/* Orange dash — small indicator, the sanctioned accent use */}
            <span aria-hidden="true" className="mt-[0.65em] h-0.5 w-4 shrink-0 bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductSection({ product, index }: { product: Product; index: number }) {
  const extra = productExtras[product.id];
  const num = String(index + 1).padStart(2, "0");

  return (
    <section
      id={product.id}
      className="grid scroll-mt-24 gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      {/* Left: sticky summary + buy action */}
      <div data-reveal className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          <span className="text-accent">{num}</span> · {typeLabels[product.type]}
        </p>
        <h2 className="font-heading mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-ink md:text-4xl">
          {product.title}
        </h2>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
          {product.meta}
        </p>
        <p className="mt-8 text-3xl font-bold tracking-[-0.02em] text-ink">
          {product.priceLabel}
        </p>
        <div className="mt-6 max-w-xs">
          <BuyAction product={product} />
        </div>
      </div>

      {/* Right: description, lists, FAQ */}
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
    </section>
  );
}
