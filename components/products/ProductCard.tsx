import Link from "next/link";
import { TELEGRAM_URL, type Product } from "@/lib/products";
import { WaitlistForm } from "./WaitlistForm";

// Buttons: ink fill or ink outline only, sharp corners. Lime never fills a CTA.
const btnBase =
  "inline-flex w-full items-center justify-center px-6 py-3 text-sm font-bold tracking-tight transition-colors";
const btnSolid = `${btnBase} bg-ink text-paper hover:bg-black`;
const btnOutline = `${btnBase} border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper`;

// Tags: lime fill ("start here") or ink outline ("coming soon").
const tagBase =
  "inline-flex items-center text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-1";
const tagLime = `${tagBase} bg-lime text-ink`;
const tagOutline = `${tagBase} border-2 border-ink text-ink`;

function BuyAction({ product }: { product: Product }) {
  const { buy } = product;

  if (buy.kind === "lava") {
    if (buy.url) {
      return (
        <a href={buy.url} target="_blank" rel="noopener noreferrer" className={btnSolid}>
          {product.cta?.buy ?? "Оформить"}
        </a>
      );
    }
    // Checkout not configured yet — degrade to the manual Telegram channel.
    return (
      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className={btnOutline}>
        {product.cta?.fallback ?? "Написать в Telegram"}
      </a>
    );
  }

  if (buy.kind === "form") {
    return (
      <Link href={buy.url} className={btnOutline}>
        Оставить заявку
      </Link>
    );
  }

  return <WaitlistForm />;
}

function CardBody({ product, muted }: { product: Product; muted?: boolean }) {
  const tag =
    product.type === "consultation" ? (
      <span className={tagLime}>Начните здесь</span>
    ) : product.type === "coming-soon" ? (
      <span className={tagOutline}>в разработке</span>
    ) : null;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          {product.meta}
        </p>
        {tag}
      </div>
      <h3
        className={`mt-4 font-heading text-2xl font-extrabold leading-tight tracking-[-0.03em] ${
          muted ? "text-ink-muted" : "text-ink"
        }`}
      >
        {product.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{product.tagline}</p>
      <div className="mt-auto pt-8">
        <span
          className={`font-heading text-xl font-extrabold tracking-[-0.02em] ${
            muted ? "font-mono text-base font-medium uppercase tracking-[0.12em] text-ink-muted" : "text-ink"
          }`}
        >
          {product.priceLabel}
        </span>
      </div>
      <div className="mt-5">
        <BuyAction product={product} />
      </div>
    </>
  );
}

/**
 * Product card (Brand DS): flat hairline card, sharp corners, no shadow. Border
 * darkens to ink on hover. Coming-soon products render muted with the waitlist
 * form.
 */
export function ProductCard({ product }: { product: Product }) {
  if (product.type === "coming-soon") {
    return (
      <article className="flex h-full flex-col border border-line bg-paper p-7">
        <CardBody product={product} muted />
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col border border-line bg-white p-7 transition-colors duration-200 hover:border-ink">
      <CardBody product={product} />
    </article>
  );
}
