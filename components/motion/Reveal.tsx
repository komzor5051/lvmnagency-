"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger between items entering in the same batch. */
  stagger?: number;
  /** Initial Y offset in px. */
  y?: number;
  /** Entrance duration in seconds. */
  duration?: number;
};

/**
 * Staggered entrance for descendants marked with [data-reveal].
 * Items that enter the viewport in the same frame animate as one cascade
 * (ScrollTrigger.batch), not as independent fades. Runs once per item.
 * prefers-reduced-motion: content stays fully visible, no motion.
 */
export function Reveal({
  children,
  className,
  stagger = 0.12,
  y = 40,
  duration = 0.7,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root.current);
      if (items.length === 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Hide before first paint of the animation so there's no flash.
      gsap.set(items, { opacity: 0, y });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration,
            ease: "power3.out",
            stagger,
            overwrite: true,
          }),
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
