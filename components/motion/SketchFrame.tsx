"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Draws a 1px ink frame around its child stroke-by-stroke when the block
 * enters the viewport (top → right → bottom → left). Static full frame under
 * prefers-reduced-motion. Purely decorative, no pinned scroll.
 */
export function SketchFrame({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const h = gsap.utils.toArray<HTMLElement>("[data-sketch-line='h']", root.current);
      const v = gsap.utils.toArray<HTMLElement>("[data-sketch-line='v']", root.current);
      gsap.set(h, { scaleX: 0 });
      gsap.set(v, { scaleY: 0 });
      gsap.to([h[0], v[0], h[1], v[1]], {
        scaleX: 1,
        scaleY: 1,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: root }
  );

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
