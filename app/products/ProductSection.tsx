// Poster row for the /products index — mono index, Literata product name,
// mono price on the right. Hover: whole row shifts right and the name goes
// italic. Links straight to the detail page; the full write-up (description,
// "Для кого" / "Что внутри", FAQ, buy action) lives on
// app/products/[slug]/page.tsx.

import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductSection({ product, index }: { product: Product; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex items-center gap-6 border-b border-line px-2 py-8 transition-transform duration-200 hover:translate-x-3 md:gap-10 md:px-4"
    >
      <span className="mono-label text-ink-muted">{num}</span>
      <span className="font-display flex-1 text-[clamp(28px,4.5vw,52px)] transition-[font-style] group-hover:italic">
        {product.title}
      </span>
      <span className="mono-label text-right text-ink-muted">{product.priceLabel}</span>
    </Link>
  );
}
