"use client";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export function HeroBadge() {
  return (
    <div className="anim-fade-up" style={{ marginBottom: 28 }}>
      <div
        className="inline-block rounded-full border border-[var(--accent-muted)] bg-[var(--accent-subtle)]"
      >
        <AnimatedShinyText
          className="inline-flex items-center px-4 py-1.5 text-xs font-bold tracking-wide text-[var(--accent-hover)]"
          shimmerWidth={200}
        >
          AI-агентство для малого бизнеса
        </AnimatedShinyText>
      </div>
    </div>
  );
}
