// FAQ accordion on plain <details>/<summary> — no JS, no external libs.
// Marker: small plus that rotates to a cross when the item is open.

import type { ProductFaq } from "@/lib/products";

export function Faq({ items }: { items: ProductFaq[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        Вопросы
      </h3>
      <div className="mt-4 border-t border-line">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
              <span className="text-base font-bold leading-snug tracking-[-0.01em] text-ink">
                {item.q}
              </span>
              <span
                aria-hidden="true"
                className="relative top-0.5 shrink-0 font-mono text-lg leading-none text-accent transition-transform duration-200 ease-out group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-5 pr-10 text-sm leading-relaxed text-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
