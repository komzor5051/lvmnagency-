"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { createDrawable } from "animejs/svg";

type DrawLineProps = {
  className?: string;
  /** Ms before drawing starts. */
  delay?: number;
  duration?: number;
  strokeWidth?: number;
};

/**
 * Hand-drawn orange underline (quadratic curve) that draws itself on mount
 * via anime.js's SVG `draw` property. Position it absolutely under the
 * highlighted word:
 * <span className="relative">окупаются<DrawLine className="absolute -bottom-1 left-0 w-full h-[0.18em]" /></span>
 * prefers-reduced-motion: line renders fully drawn, no animation.
 */
export function DrawLine({
  className,
  delay = 400,
  duration = 900,
  strokeWidth = 6,
}: DrawLineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [drawable] = createDrawable(path);
    animate(drawable, {
      draw: ["0 0", "0 1"],
      delay,
      duration,
      ease: "inOutCubic",
    });
  }, [delay, duration]);

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
