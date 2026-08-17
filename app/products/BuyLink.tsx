"use client";

import posthog from "posthog-js";

// Autocapture в PostHog уже пишет клики, но именованное событие надёжнее для
// воронки: не зависит от вёрстки кнопки и не путается с другими ссылками.
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
        if (posthog.__loaded) posthog.capture("checkout_click", { product: productId, position });
      }}
    >
      {label}
    </a>
  );
}
