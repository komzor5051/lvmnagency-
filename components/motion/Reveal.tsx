"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger as animeStagger } from "animejs";
import { observeOnce } from "./observeOnce";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger between items entering in the same batch, in ms. */
  stagger?: number;
  /** Initial Y offset in px. */
  y?: number;
  /** Entrance duration in ms. */
  duration?: number;
};

/**
 * Staggered entrance for descendants marked with [data-reveal]. All items
 * reveal together, cascaded, the first time the wrapper enters the
 * viewport. Runs once. prefers-reduced-motion: content stays fully
 * visible, no motion.
 */
export function Reveal({
  children,
  className,
  stagger = 120,
  y = 40,
  duration = 700,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (items.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hide before first paint of the animation so there's no flash.
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = `translateY(${y}px)`;
    });

    return observeOnce(
      el,
      () => {
        animate(items, {
          opacity: [0, 1],
          translateY: [`${y}px`, "0px"],
          duration,
          ease: "outQuart",
          delay: animeStagger(stagger),
        });
      },
      "0px 0px -12% 0px"
    );
  }, [stagger, y, duration]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
