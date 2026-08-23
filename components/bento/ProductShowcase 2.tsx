"use client";

import Link from "next/link";
import { getProduct, type Product } from "@/lib/products";
import { productExtras } from "@/app/products/content";
import { WaitlistForm } from "@/components/products/WaitlistForm";
import { track } from "@/lib/analytics";

/**
 * Bento product showcase — the product ladder as one grid, shared between the
 * home page (section="showcase") and /products (section="products_page").
 *
 * Tile size = funnel priority (spec, section 2):
 *   guide 8 cols (with a typographic CSS cover) · consultation 4 · audit 6 ·
 *   ai-os 6 (carbon) · course waitlist strip 12.
 *
 * All copy and prices come from lib/products.ts / app/products/content.ts —
 * nothing product-related is hardcoded here except the funnel bridges.
 * Every tile is a full link to /products/[slug]; clicks fire
 * product_tile_click {product, position, section}.
 */

type ShowcaseSection = "showcase" | "products_page";

// Funnel bridges: mono captions that point to the next ladder step.
const bridges: Record<string, string> = {
  guide: "шаг 1 из 4 · дальше — консультация",
  consultation: "шаг 2 из 4 · дальше — AI-аудит",
  audit: "шаг 3 из 4 · дальше — внедрение",
  "ai-os": "шаг 4 из 4 · работа со мной лично",
};

function ctaLabel(p: Product): string {
  if (p.cta) return p.cta.buy;
  if (p.buy.kind === "form") return "Оставить заявку";
  return "Подробнее";
}

function ProductTile({
  product,
  position,
  section,
  className,
  children,
}: {
  product: Product;
  position: number;
  section: ShowcaseSection;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={`bento-tile bento-tile--link ${className}`}
      data-studio-reveal
      style={{ transitionDelay: `${(position - 1) * 60}ms` }}
      onClick={() =>
        track("product_tile_click", { product: product.id, position, section })
      }
    >
      {children}
    </Link>
  );
}

export function ProductShowcase({ section }: { section: ShowcaseSection }) {
  const guide = getProduct("guide");
  const consultation = getProduct("consultation");
  const audit = getProduct("audit");
  const aiOs = getProduct("ai-os");
  const course = getProduct("course");

  return (
    <div className="bento-grid">
      {/* 1. Guide — the low-friction entry, biggest tile. */}
      {guide && (
        <ProductTile product={guide} position={1} section={section} className="bento-col-8">
          <div className="bento-cover" aria-hidden="true">
            <span className="bento-mono">{guide.meta}</span>
            <strong>{guide.title}</strong>
            <i />
          </div>
          <span className="bento-mono">Гайд</span>
          <h3>{guide.title}</h3>
          <ul className="bento-list">
            {(productExtras.guide?.inside ?? []).slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="bento-price">{guide.priceLabel}</p>
          <span className="bento-btn">{ctaLabel(guide)}</span>
          <p className="bento-mono bento-bridge">{bridges.guide}</p>
        </ProductTile>
      )}

      {/* 2. Consultation. */}
      {consultation && (
        <ProductTile
          product={consultation}
          position={2}
          section={section}
          className="bento-col-4"
        >
          <span className="bento-mono">{consultation.meta}</span>
          <h3>{consultation.title}</h3>
          <p className="bento-lead">{consultation.tagline}</p>
          <p className="bento-price">{consultation.priceLabel}</p>
          <span className="bento-text-link">{ctaLabel(consultation)}</span>
          <p className="bento-mono bento-bridge">{bridges.consultation}</p>
        </ProductTile>
      )}

      {/* 3. Paid audit. */}
      {audit && (
        <ProductTile product={audit} position={3} section={section} className="bento-col-6">
          <span className="bento-badge">Рекомендую</span>
          <span className="bento-mono" style={{ marginTop: ".9rem" }}>
            {audit.meta}
          </span>
          <h3>{audit.title}</h3>
          <p className="bento-lead">{audit.tagline}</p>
          <p className="bento-price">{audit.priceLabel}</p>
          <span className="bento-text-link">{ctaLabel(audit)}</span>
          <p className="bento-mono bento-bridge">{bridges.audit}</p>
        </ProductTile>
      )}

      {/* 4. Implementation — carbon accent tile. */}
      {aiOs && (
        <ProductTile
          product={aiOs}
          position={4}
          section={section}
          className="bento-col-6 bento-tile--carbon"
        >
          <span className="bento-mono">{aiOs.meta}</span>
          <h3>{aiOs.title}</h3>
          <p className="bento-lead">{aiOs.tagline}</p>
          <p className="bento-price">{aiOs.priceLabel}</p>
          <span className="bento-text-link">{ctaLabel(aiOs)}</span>
          <p className="bento-mono bento-bridge">{bridges["ai-os"]}</p>
        </ProductTile>
      )}

      {/* 5. Course waitlist — full-width strip with the existing form. */}
      {course && (
        <div
          className="bento-tile bento-col-12 bento-waitlist"
          data-studio-reveal
          style={{ transitionDelay: "240ms" }}
        >
          <div>
            <span className="bento-mono">{course.meta}</span>
            <h3>{course.title}</h3>
            <p className="bento-lead">{course.tagline}</p>
          </div>
          <div>
            <WaitlistForm />
          </div>
        </div>
      )}
    </div>
  );
}
