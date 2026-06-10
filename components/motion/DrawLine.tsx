"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type DrawLineProps = {
  className?: string;
  /** Seconds before drawing starts. */
  delay?: number;
  duration?: number;
  strokeWidth?: number;
};

/**
 * Hand-drawn orange underline (quadratic curve) that draws itself on mount
 * via stroke-dashoffset. Position it absolutely under the highlighted word:
 * <span className="relative">окупаются<DrawLine className="absolute -bottom-1 left-0 w-full h-[0.18em]" /></span>
 * prefers-reduced-motion: line renders fully drawn, no animation.
 */
export function DrawLine({
  className,
  delay = 0.4,
  duration = 0.9,
  strokeWidth = 6,
}: DrawLineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const length = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, delay, duration, ease: "power2.inOut" }
    );
  });

  return (
    <svg
      className={className}
      viewBox="0 0 300 24"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M4 18 Q 150 4 296 14"
        stroke="#ff4d00"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
