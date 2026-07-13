"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger, utils } from "animejs";
import { observeOnce } from "./observeOnce";

/**
 * Draws a 1px ink frame around its child stroke-by-stroke when the block
 * enters the viewport (top → right → bottom → left). Static full frame under
 * prefers-reduced-motion. Purely decorative, no pinned scroll.
 */
export function SketchFrame({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const h = Array.from(el.querySelectorAll<HTMLElement>("[data-sketch-line='h']"));
    const v = Array.from(el.querySelectorAll<HTMLElement>("[data-sketch-line='v']"));
    utils.set(h, { scaleX: 0 });
    utils.set(v, { scaleY: 0 });

    return observeOnce(
      el,
      () => {
        animate([h[0], v[0], h[1], v[1]], {
          scaleX: 1,
          scaleY: 1,
          duration: 350,
          ease: "outCubic",
          delay: stagger(90),
        });
      },
      "0px 0px -15% 0px"
    );
  }, []);

  return (
    <div ref={root} className="relative">
      <span
        data-sketch-line="h"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left bg-ink"
      />
      <span
        data-sketch-line="v"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-px origin-top bg-ink"
      />
      <span
        data-sketch-line="h"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-right bg-ink"
      />
      <span
        data-sketch-line="v"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-px origin-bottom bg-ink"
      />
      {children}
    </div>
  );
}
