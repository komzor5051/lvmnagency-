"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

// Полоса сверху показывает, сколько статьи прочитано. Это индикатор,
// а не украшение, поэтому работает и при reduced-motion: скраб без сглаживания.
export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = bar.current;
    const article = document.querySelector(target);
    if (!el || !article) return;
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: article, start: "top top", end: "bottom bottom", scrub: true },
    });
  });
  return <div ref={bar} className="rz-read-progress" aria-hidden="true" />;
}
