"use client";

// Buy action for /products — «Разворот» restyle: solid rz-btn for the primary
// checkout, ink-underline rz-link for the Telegram fallback.
// Clicks that lead to lava.top fire checkout_redirect {product}.

import Link from "next/link";
import { TELEGRAM_URL, telegramHref, type Product } from "@/lib/products";
import { WaitlistForm } from "@/components/products/WaitlistForm";
import { track } from "@/lib/analytics";

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
      // Оплата + прямой контакт: часть людей хочет сначала спросить, а не платить вслепую.
      return (
        <>
          <a
            href={buy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rz-btn rz-btn--solid"
            onClick={() => track("checkout_redirect", { product: product.id })}
          >
            {product.cta?.buy ?? "Оформить"}
          </a>
          <a
            href={telegramHref(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="rz-btn"
            onClick={() => track("telegram_click", { product: product.id })}
          >
            Написать мне в Telegram
          </a>
        </>
      );
    }
    // Checkout not configured yet — degrade to the manual Telegram channel.
    return (
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rz-link"
      >
        {product.cta?.fallback ?? "Написать в Telegram"}
      </a>
    );
  }

  if (buy.kind === "form") {
    return (
      <Link href={buy.url} className="rz-btn rz-btn--solid">
        Оставить заявку
      </Link>
    );
  }

  return <WaitlistForm />;
}
