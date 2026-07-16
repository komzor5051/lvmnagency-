import Link from "next/link";
import { getProduct, TELEGRAM_URL, type Product } from "@/lib/products";

// Home stack order mirrors the funnel: cheap entry on top, flagship at the
// bottom of the pile. The audit card is the dark "point of entry" sheet.
const STACK: Array<{ id: string; dark?: boolean; note?: string }> = [
  { id: "guide", note: "для самостоятельных" },
  { id: "audit", dark: true },
  { id: "consultation" },
  { id: "ai-os" },
];

function buyHref(p: Product): string {
  if (p.buy.kind === "lava" && p.buy.url.length > 0) return p.buy.url;
  if (p.buy.kind === "form") return p.buy.url;
  return TELEGRAM_URL;
}

function ctaLabel(p: Product): string {
  if (p.buy.kind === "form") return "Пройти аудит";
  return p.cta?.buy ?? "Обсудить проект";
}

export default function DeskServices() {
  const items = STACK.map((s) => ({ ...s, product: getProduct(s.id) })).filter(
    (s): s is typeof s & { product: Product } => Boolean(s.product),
  );

  return (
    <section id="products" className="py-[130px] max-md:py-[84px]">
      <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
        <div className="mb-16 max-w-[720px]">
          <h2 className="desk-display text-[clamp(32px,3.6vw,52px)] text-ink" data-rv>
            Бумаги <span className="hl">на подпись</span>
          </h2>
          <p className="mt-[18px] text-[17px] leading-[1.6] text-ink-muted" data-rv>
            Четыре формата работы. Листайте: карточки лягут стопкой.
          </p>
        </div>

        <div className="relative">
          {items.map(({ product: p, dark, note }) => {
            const href = buyHref(p);
            const external = href.startsWith("http");
            return (
              <article
                key={p.id}
                className={`desk-stack-card mb-9 grid min-h-[380px] grid-cols-[1.2fr_0.8fr] items-center gap-12 border p-14 max-md:grid-cols-1 max-md:gap-6 max-md:p-7 ${
                  dark
                    ? "border-ink bg-ink shadow-[0_18px_40px_-16px_rgba(19,19,19,0.35)]"
                    : "desk-sheet border-line"
                }`}
              >
                <div>
                  <span className={`mono-label ${dark ? "text-dark-muted" : "text-ink-muted"}`}>
                    {p.meta}
                  </span>
                  <h3
                    className={`mt-3 mb-4 font-tektur text-[clamp(26px,2.6vw,38px)] font-bold leading-[1.08] ${
                      dark ? "text-white" : "text-ink"
                    }`}
                  >
                    {p.title}
                  </h3>
                  <p className={`max-w-[46ch] text-[16px] leading-[1.62] ${dark ? "text-dark-muted" : "text-ink-muted"}`}>
                    {p.tagline}
                  </p>
                </div>
                <div
                  className={`flex flex-col items-start gap-[18px] border-l pl-11 max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-5 ${
                    dark ? "border-[#3a3a3a]" : "border-line"
                  }`}
                >
                  <span className={`font-tektur text-[32px] font-bold ${dark ? "text-lime" : "text-ink"}`}>
                    {p.priceLabel}
                  </span>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`desk-btn no-underline ${dark ? "desk-btn--lime border-lime" : ""}`}
                    >
                      {ctaLabel(p)}
                    </a>
                  ) : (
                    <Link href={href} className={`desk-btn no-underline ${dark ? "desk-btn--lime border-lime" : ""}`}>
                      {ctaLabel(p)}
                    </Link>
                  )}
                  {note && <span className={`desk-note text-[17px] ${dark ? "text-dark-ink" : "text-ink"}`}>{note}</span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
