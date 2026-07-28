import type { Metadata } from "next";
import Link from "next/link";
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
    <main className="studio-main studio-products">
      <section className="studio-page-hero">
        <div className="studio-frame">
          <p className="studio-eyebrow" data-studio-reveal>ФОРМАТЫ РАБОТЫ / 01—04</p>
          <h1 data-studio-reveal>Четыре точки<br /><em>входа.</em></h1>
          <p data-studio-reveal>
            Один и тот же опыт — в форматах под разный масштаб: от гайда на вечер
            до перестройки рабочего ритма команды.
          </p>
        </div>
      </section>

      <section className="studio-products-list">
        <div className="studio-frame">
          <div className="studio-product-index">
            {items.map((p, i) => (
              <Link key={p.id} href={`/products/${p.id}`} className="studio-product-row" data-studio-reveal>
                <span className="studio-product-num">0{i + 1}</span>
                <div>
                  <span className="studio-mono">{metaLine(p)}</span>
                  <h2>{p.title}</h2>
                  <p>{p.tagline}</p>
                </div>
                <strong>{p.priceLabel}</strong>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
            {course && (
              <Link
                href={`/products/${course.id}`}
                className="studio-course-note"
                data-studio-reveal
              >
                <span className="studio-mono">В РАЗРАБОТКЕ</span>
                <h3>{course.title}</h3>
                <p>Оставьте email — узнаете первым и получите стартовую цену.</p>
                <b>В список ожидания ↗</b>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
