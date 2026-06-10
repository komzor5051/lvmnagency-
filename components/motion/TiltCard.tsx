"use client";

import type { ReactNode } from "react";
import { useTilt } from "./useTilt";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/**
 * Wrapper that tilts in 3D toward the cursor with a subtle moving white
 * sheen (low opacity, not a glow). Inert on touch + reduced-motion.
 */
export function TiltCard({ children, className, maxTilt = 9 }: TiltCardProps) {
  const { ref, glareRef } = useTilt(maxTilt);

  return (
    <div
      ref={ref}
      className={`relative will-change-transform [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
