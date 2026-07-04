"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed full-viewport canvas behind the page content. Boots the particle
 * engine lazily (after load + idle) and only when the device qualifies:
 * no reduced-motion, viewport >= 768px. The engine itself bails out and
 * restores the static page if FPS is too low.
 */
export function CanvasStage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    let cancelled = false;
    let cleanup: (() => void) | null | undefined;

    const boot = async () => {
      try {
        const [{ initEngine }, res] = await Promise.all([
          import("./scroll"),
          fetch("/portrait-map.json"),
        ]);
        const json = await res.json();
        if (cancelled || !ref.current) return;
        cleanup = initEngine(ref.current, json);
      } catch {
        // Engine is an enhancement — the static page stays intact.
      }
    };

    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? requestIdleCallback(cb, { timeout: 1500 })
        : setTimeout(cb, 300);

    const onLoad = () => idle(boot);
    if (document.readyState === "complete") {
      idle(boot);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
    />
  );
}
