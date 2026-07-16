import type { Metadata } from "next";
import Link from "next/link";
import DeskFx from "@/components/desk/DeskFx";
import DeskFooter from "@/components/desk/DeskFooter";
import { products, type Product } from "@/lib/products";

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
// presentation-only; lib/products.ts stays untouched. The coming-soon course
// is rendered separately as a lime sticky note at the end of the desk.
const ORDER = ["guide", "consultation", "audit", "ai-os"];

const typeLabels: Record<Product["type"], string> = {
  consultation: "консультация",
  digital: "цифровой продукт",
  service: "услуга",
  "coming-soon": "скоро",
};

// p.meta sometimes already leads with the type word ("услуга · 2 недели") —
// prepend the type label only when it adds information.
function metaLine(p: Product): string {
  const label = typeLabels[p.type];
  return p.meta.startsWith(label) ? p.meta : `${label} · ${p.meta}`;
}

function orderedProducts(): Product[] {
  return ORDER.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );
}

export default function ProductsPage() {
  const items = orderedProducts();
  const course = products.find((p) => p.id === "course");

  return (
    <main>
      <DeskFx />
      <section className="pt-[130px] pb-[110px] max-md:pt-[110px] max-md:pb-[72px]">
        <div className="mx-auto max-w-[1240px] px-8 max-md:px-4">
          <header className="relative mb-16 max-w-[760px]" data-rv>
            <h1 className="desk-display text-[clamp(34px,4vw,58px)] text-ink">
              Четыре <span className="hl">точки входа</span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.62] text-ink-muted">
              Один и тот же опыт — в форматах под разный масштаб: от гайда на вечер до разбора
              всего бизнеса. Начните с того, что уместно сейчас, — дальше видно будет.
            </p>
            <span className="desk-note absolute -top-2 right-[-140px] rotate-2 text-[19px] text-ink max-lg:static max-lg:mt-4 max-lg:inline-block max-lg:-rotate-1">
              начните с малого
            </span>
          </header>

          <div className="grid grid-cols-2 gap-x-10 gap-y-14 max-md:grid-cols-1 max-md:gap-y-10">
            {items.map((p, i) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className={`desk-sheet group relative flex min-h-[300px] flex-col px-[34px] py-[36px] no-underline transition-transform duration-200 hover:-translate-y-1 max-md:min-h-0 ${
                  i % 2 ? "rotate-[0.7deg]" : "-rotate-[0.6deg]"
                }`}
                data-rv
              >
                <span className="desk-pin" aria-hidden />
                <span className="mono-label text-ink-muted">{metaLine(p)}</span>
                <h2 className="font-tektur mt-3 text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.1] text-ink">
                  {p.title}
                </h2>
                <p className="mt-3 max-w-[52ch] text-[15.5px] leading-[1.6] text-ink-muted">
                  {p.tagline}
                </p>
                <div className="mt-auto flex items-baseline justify-between gap-6 border-t border-line pt-5 max-md:mt-6">
                  <span className="font-tektur text-[26px] font-bold text-ink">{p.priceLabel}</span>
                  <span className="link-ul text-[15px] text-ink group-hover:bg-lime">
                    Подробнее
                  </span>
                </div>
              </Link>
            ))}

            {course && (
              <Link
                href={`/products/${course.id}`}
                className="desk-sheet--low relative flex min-h-[220px] max-w-[420px] flex-col border-0 bg-lime px-7 py-6 no-underline rotate-[1.4deg] transition-transform duration-200 hover:-translate-y-1"
                data-rv
              >
                <span className="desk-note text-[21px] leading-[1.35] text-ink">
                  {course.title} — скоро
                </span>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-ink/75">
                  Оставьте email — узнаете первым и получите стартовую цену.
                </p>
                <span className="mt-auto text-[14px] font-semibold text-ink">
                  В список ожидания &rarr;
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
      <DeskFooter />
    </main>
  );
}
