"use client";

import { useEffect, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { telegramHref, type Product } from "@/lib/products";

// Кнопки без движения при наведении (решение Влада 2026-09-24).
function MagnetLink({
  children,
  href,
  className,
  onClick,
}: {
  children: ReactNode;
  href: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {children}
    </a>
  );
}

export function ProgramView({ product }: { product: Product }) {
  useEffect(() => {
    track("program_view", { product: product.id });
  }, [product.id]);
  return null;
}

// Две кнопки: оплата на lava.top и личка в Telegram с готовым сообщением.
// Пока чекаут не создан (buy.url пустой), оплата тоже ведёт в Telegram.
export function ProgramButtons({ product, position }: { product: Product; position: string }) {
  const payUrl = product.buy.kind === "lava" && product.buy.url ? product.buy.url : "";
  const telegram = telegramHref(product);
  return (
    <div className="program-cta-row">
      <MagnetLink
        className="rz-btn rz-btn--solid"
        href={payUrl || telegram}
        onClick={() =>
          track(payUrl ? "checkout_redirect" : "telegram_click", { product: product.id, position, target: payUrl ? "lava" : "telegram-pay" })
        }
      >
        Оплатить {product.priceLabel}
      </MagnetLink>
      <MagnetLink
        className="rz-btn"
        href={telegram}
        onClick={() => track("telegram_click", { product: product.id, position, target: "telegram" })}
      >
        Написать мне в Telegram
      </MagnetLink>
    </div>
  );
}
