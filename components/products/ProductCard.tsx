import Link from "next/link";
import { TELEGRAM_URL, type Product } from "@/lib/products";
import { TiltCard } from "@/components/motion/TiltCard";
import { WaitlistForm } from "./WaitlistForm";

// Buttons: black fill or black outline only. Orange never fills a button.
const btnBase =
  "inline-flex w-full items-center justify-center px-6 py-3 text-sm font-bold tracking-tight transition-colors";
const btnSolid = `${btnBase} bg-ink text-paper hover:bg-black`;
const btnOutline = `${btnBase} border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper`;

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
  return (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {product.meta}
      </p>
      <h3
        className={`mt-4 text-2xl font-bold leading-tight tracking-[-0.03em] ${
          muted ? "text-ink-muted" : "text-ink"
        }`}
      >
        {product.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{product.tagline}</p>
      <div className="mt-auto pt-8">
        <span
          className={`text-xl font-bold tracking-[-0.02em] ${
            muted ? "font-mono text-base uppercase tracking-[0.12em] text-ink-muted" : "text-ink"
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
 * Product card. Interactive products get 3D tilt + sheen (TiltCard), a slight
 * lift on hover and an orange top line. Coming-soon products render as a
 * muted dashed card with the waitlist form.
 */
export function ProductCard({ product }: { product: Product }) {
  if (product.type === "coming-soon") {
    return (
      <article className="flex h-full flex-col border border-dashed border-ink-muted/40 bg-paper p-7">
        <CardBody product={product} muted />
      </article>
    );
  }

  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden border border-line bg-white p-7 transition-transform duration-300 ease-out hover:-translate-y-1">
        {/* Orange top line — draws in on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
        <CardBody product={product} />
      </article>
    </TiltCard>
  );
}
