// Local buy action for /products — mirrors the action logic of
// components/products/ProductCard.tsx (shared file, not editable from here).
// Buttons: black fill or black outline only. Orange never fills a button.

import Link from "next/link";
import { TELEGRAM_URL, type Product } from "@/lib/products";
import { WaitlistForm } from "@/components/products/WaitlistForm";

const btnBase =
  "inline-flex w-full items-center justify-center px-6 py-3.5 text-sm font-bold tracking-tight transition-colors";
const btnSolid = `${btnBase} bg-ink text-paper hover:bg-black`;
const btnOutline = `${btnBase} border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper`;

export function BuyAction({ product }: { product: Product }) {
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
