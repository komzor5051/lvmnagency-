"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct } from "@/lib/products";
import { track } from "@/lib/analytics";

/**
 * Mobile-only sticky bottom bar for the home page: "Гайд — 990 ₽ → /products/guide".
 * Appears once the product showcase (#products) has scrolled up out of the
 * viewport, hides again when the user scrolls back to it. Desktop (>=45rem)
 * never shows it (CSS), reduced motion drops the slide-in transition (CSS).
 */
export function StickyGuideCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("products");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Visible only after the showcase has left the viewport upwards.
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const guide = getProduct("guide");
  if (!guide) return null;

  return (
    <div className={`bento-sticky-cta ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <Link
        href="/products/guide"
        tabIndex={visible ? 0 : -1}
        onClick={() => track("product_tile_click", { product: "guide", position: 0, section: "sticky" })}
      >
        <span>Гайд — {guide.priceLabel}</span>
        <b aria-hidden="true">→</b>
      </Link>
    </div>
  );
}
