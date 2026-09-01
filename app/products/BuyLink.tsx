"use client";

import { track } from "@/lib/analytics";

// Autocapture в PostHog уже пишет клики, но именованное событие надёжнее для
// воронки: не зависит от вёрстки кнопки и не путается с другими ссылками.
// track() шлёт его и в Метрику через reachGoal — PostHog на проде может
// быть выключен (ключ не задан), Метрика работает всегда.
export function BuyLink({
  url,
  label,
  productId,
  position,
  className,
}: {
  url: string;
  label: string;
  productId: string;
  position: "hero" | "close";
  className: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        track("checkout_click", { product: productId, position });
      }}
    >
      {label}
    </a>
  );
}
