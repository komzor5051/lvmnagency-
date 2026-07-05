"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places, e.g. 1 for "1.7". */
  decimals?: number;
  duration?: number;
  className?: string;
};

/**
 * Number counts up from 0 when it enters the viewport (once).
 * Tween runs on a proxy object and writes to the DOM onUpdate —
 * IntersectionObserver can fade, it can't tween a number.
 * prefers-reduced-motion: renders the final value immediately.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = format(value);
        return;
      }

      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(proxy.v);
        },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref, dependencies: [value, prefix, suffix, decimals, duration] }
  );

  return (
    // The invisible final value owns the layout, the animating copy sits on
    // top of it — intermediate values ("1 ч/мес" vs "60 ч/мес") wrap
    // differently and would otherwise make the block jump mid-count.
    <span className={`relative ${className ?? ""}`}>
      <span aria-hidden className="invisible">
        {format(value)}
      </span>
      <span ref={ref} className="absolute inset-0" style={{ fontVariantNumeric: "tabular-nums" }}>
        {format(0)}
      </span>
    </span>
  );
}
