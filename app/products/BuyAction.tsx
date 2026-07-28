// Local buy action for /products — mirrors the action logic of
// components/products/ProductCard.tsx (shared file, not editable from here).
// Buttons: ink fill (hover lime) or ink outline only — matches the White +
// Lime CTA pattern used on the homepage and /about.

import Link from "next/link";
import { TELEGRAM_URL, type Product } from "@/lib/products";
import { WaitlistForm } from "@/components/products/WaitlistForm";

const btnBase = "studio-buy-action";
const btnSolid = `${btnBase} studio-buy-action--solid`;
const btnOutline = `${btnBase} studio-buy-action--outline`;

export function BuyAction({ product }: { product: Product }) {
  const { buy } = product;

  if (buy.kind === "lava-widget") {
    // lava.top embedded pay button — buyer pays without leaving the site.
    return (
      <iframe
        title="Оплата — Lava.top"
        src={buy.src}
        className="block w-full"
        style={{ border: "none", height: 54 }}
      />
    );
  }

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
