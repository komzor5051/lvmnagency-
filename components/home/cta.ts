// Local CTA helpers for the homepage (do not edit shared lib/products.ts).
import { getProduct } from "@/lib/products";

/**
 * Where the "Консультация" CTA leads: the lava.top checkout when it is
 * configured, otherwise the products section anchor (absolute path so the
 * link also works if the nav is reused outside the homepage).
 */
export function consultationHref(): string {
  const p = getProduct("consultation");
  if (p && p.buy.kind === "lava" && p.buy.url.length > 0) return p.buy.url;
  return "/#products";
}

export function isExternal(href: string): boolean {
  return href.startsWith("http");
}
