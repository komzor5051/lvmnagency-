"use client";

// Buy action for /products — «Разворот» restyle: solid rz-btn for the primary
// checkout, ink-underline rz-link for the Telegram fallback.
// Clicks that lead to lava.top fire checkout_redirect {product}.
// Продукты с product.contact получают второй путь рядом с оплатой —
// личный диалог в Telegram (contact_click {product}).

import Link from "next/link";
import { TELEGRAM_URL, type Product } from "@/lib/products";
import { WaitlistForm } from "@/components/products/WaitlistForm";
import { track } from "@/lib/analytics";

// t.me/<user>?text= открывает чат с заготовленным первым сообщением —
// человеку не надо придумывать, с чего начать.
function contactHref(text?: string) {
  return text ? `${TELEGRAM_URL}?text=${encodeURIComponent(text)}` : TELEGRAM_URL;
}

function ContactAction({ product }: { product: Product }) {
  const { contact } = product;
  if (!contact) return null;

  return (
    <>
      <a
        href={contactHref(contact.text)}
        target="_blank"
        rel="noopener noreferrer"
        className="rz-btn"
        onClick={() => track("contact_click", { product: product.id })}
      >
        {contact.label}
      </a>
      {contact.note && <small>{contact.note}</small>}
    </>
  );
}

export function BuyAction({ product }: { product: Product }) {
  const { buy } = product;

  if (buy.kind === "lava-widget") {
    // lava.top embedded pay button — buyer pays without leaving the site.
    return (
      <>
        <iframe
          title="Оплата — Lava.top"
          src={buy.src}
          className="block w-full"
          style={{ border: "none", height: 54 }}
        />
        <ContactAction product={product} />
      </>
    );
  }

  if (buy.kind === "lava") {
    if (buy.url) {
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
          <ContactAction product={product} />
        </>
      );
    }
    // Checkout not configured yet — degrade to the manual Telegram channel.
    return (
      <a
        href={contactHref(product.contact?.text)}
        target="_blank"
        rel="noopener noreferrer"
        className="rz-link"
        onClick={() => track("contact_click", { product: product.id })}
      >
        {product.cta?.fallback ?? "Написать в Telegram"}
      </a>
    );
  }

  if (buy.kind === "form") {
    return (
      <>
        <Link href={buy.url} className="rz-btn rz-btn--solid">
          Оставить заявку
        </Link>
        <ContactAction product={product} />
      </>
    );
  }

  return <WaitlistForm />;
}
