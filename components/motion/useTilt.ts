"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * 3D tilt that follows the cursor (rotateX/rotateY, max ~9deg by default)
 * and springs back on leave. Also drives a glare overlay: a subtle white
 * radial highlight that follows the cursor (set on glareRef's background).
 *
 * Disabled entirely on touch devices and when prefers-reduced-motion is set.
 *
 * Usage:
 *   const { ref, glareRef } = useTilt();
 *   <div ref={ref}>...<div ref={glareRef} className="pointer-events-none absolute inset-0 opacity-0" /></div>
 */
export function useTilt(maxTilt = 9) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    gsap.set(el, { transformPerspective: 900 });
    const toRotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const toRotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      toRotX((0.5 - py) * maxTilt * 2);
      toRotY((px - 0.5) * maxTilt * 2);

      const glare = glareRef.current;
      if (glare) {
        glare.style.opacity = "1";
        // White highlight, low opacity — a moving sheen, not a glow.
        glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.2), transparent 55%)`;
      }
    };

    const onLeave = () => {
      toRotX(0);
      toRotY(0);
      const glare = glareRef.current;
      if (glare) glare.style.opacity = "0";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [maxTilt]);

  return { ref, glareRef };
}
